'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Checkbox,
  Select,
  IconButton,
} from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import { Grid } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Services
import GetCountry from "@/services/location/country.services";
import GetState from "@/services/location/state.services";
import GetCity from "@/services/location/city.service";
import GetArea from "@/services/location/area.services";
import Keyword from "@/services/premium-listing/fixedPackage.service";

const LocationSelection = ({ handleNextClick, handlePreviousClick, data, keywords, GetLocution }) => {
  const [keywordNames, setKeywordNames] = useState([]);


 
  

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [allCities, setCities] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    areas: [], // Store area _ids
    keywords: []
  });

  useEffect(() => {
    if (Array.isArray(keywords)) {
      const names = keywords.map(item => item.kw);
      setKeywordNames(names);
    }
  }, [keywords]);




  // Track if initial data has been processed
  const [isInitialDataProcessed, setIsInitialDataProcessed] = useState(false);

  // Initialize formData from data prop (run once)
  useEffect(() => {
    if (data && !isInitialDataProcessed) {
      const locationAreas = Array.isArray(data.areas)
        ? data.location.areas.map(area =>
          typeof area.areaId === 'object' ? area.areaId._id : area.areaId
        )
        : [];

      const keywordAreaIds = Array.isArray(data.keywords)
        ? data.keywords.flatMap(kw =>
          kw.areas.map(area =>
            typeof area.areaId === 'object' ? area.areaId._id : area.areaId
          )
        )
        : [];

      const allAreas = [...new Set([...locationAreas, ...keywordAreaIds])];


      setFormData({
        country: data.country?._id || '',
        state: data.state?._id || '',
        city: data.city?._id || '',
        areas: allAreas, // ✅ includes both location.areas and keywords.areas
        keywords: Array.isArray(data.keywords)
          ? data.keywords.map(kw => ({
            keyName: kw.keyName,
            areas: kw.areas.map(area => ({
              areas: area.areaId,
              areaId: area.areaId,
              position: area.position,
              budget: area.budget
            }))
          }))
          : []
      });

      setIsInitialDataProcessed(true);
    }
  }, [data, isInitialDataProcessed]);


  const [keywordState, setKeywordState] = useState({ keywords: [] });
  const [keywordDetails, setKeywordDetails] = useState([]);
  const [keywordAreaData, setKeywordAreaData] = useState({});
  const [expandedKeys, setExpandedKeys] = useState({});
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;


 




  // Fetch Countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await GetCountry.getCountries();
        setCountry(result.data || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch States when country changes
  const fetchStates = async (countryId, initialLoad = false) => {
    try {
      const result = await GetState.getStateById(countryId);
      setState(result.data || []);
      if (!initialLoad) {
        setCities([]);
        setAllAreas([]);
        setFormData(prev => ({ ...prev, city: '', areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  // Fetch Cities when state changes
  const fetchCities = async (stateId, initialLoad = false) => {
    try {
      const result = await GetCity.getCityById(stateId);
      setCities(result.data || []);
      if (!initialLoad) {
        setAllAreas([]);
        setFormData(prev => ({ ...prev, areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  // Fetch Areas when city changes
  const fetchAreas = async (cityId) => {
    try {
      const result = await GetArea.getAreaById(cityId);
      setAllAreas(result.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

  // Handle form field changes for country, state, city
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      fetchStates(value);
      setFormData(prev => ({ ...prev, state: '', city: '', areas: [] }));
    }
    if (name === 'state') {
      fetchCities(value);
      setFormData(prev => ({ ...prev, city: '', areas: [] }));
    }
    if (name === 'city') {
      fetchAreas(value);
      setFormData(prev => ({ ...prev, areas: [] }));
    }
  };

  // Trigger dependent fetches based on formData and initial data processed
  useEffect(() => {
    if (isInitialDataProcessed && formData.country) {
      fetchStates(formData.country, true);
    }
  }, [formData.country, isInitialDataProcessed]);

  useEffect(() => {
    if (isInitialDataProcessed && formData.state) {
      fetchCities(formData.state, true);
    }
  }, [formData.state, isInitialDataProcessed]);

  useEffect(() => {
    if (isInitialDataProcessed && formData.city) {
      fetchAreas(formData.city);
    }
  }, [formData.city, isInitialDataProcessed]);

  // Update keywordState when keywords prop changes
  useEffect(() => {
    if (keywordNames?.length) {
      setKeywordState(prev => ({ ...prev, keywordNames }));
    }
  }, [keywordNames]);

  // Fetch detailed info for each keyword
  useEffect(() => {
    const fetchKeywordDetails = async () => {
      if (!keywordState?.keywordNames?.length) return;

      try {
        const results = await Promise.all(
          keywordState.keywordNames.map(name => Keyword.getKeyWordDetails(name))
        );

        const keywordData = results.flatMap(res =>
          res?.data?.map(item => ({
            id: item._id,
            name: item.name,
            prices: item.prices || []
          })) || []
        );





        setKeywordDetails(keywordData);
      } catch (error) {
        console.error("Error fetching keyword details", error);
      }

    };
    fetchKeywordDetails();
  }, [keywordState]);



  useEffect(() => {
    

    if (keywordDetails.length > 0 && isInitialDataProcessed) {
      const newKeywordAreaData = {};

      keywordDetails.forEach(keyword => {
        const keyName = keyword?.name;
        if (!keyName) return;

        const keywordSpecificAreas = keyword.prices.map(item => {
          const matchingAreaInFormData = (formData.keywords || [])
            .find(kw => kw.keyName === keyName)?.areas
            ?.find(a => {
              const areaId = typeof a.areaId === 'object' ? a.areaId._id : a.areaId;
              return areaId === item?.area?._id;
            });

          return {
            area: item?.area?.name || '',
            areaId: item?.area?._id || '',
            position1: item?.positionPrices?.[0] || 0,
            position2: item?.positionPrices?.[1] || 0,
            position3: item?.positionPrices?.[2] || 0,
            position4: item?.positionPrices?.[3] || 0,
            position5: item?.positionPrices?.[4] || 0,
            allPositionPrices: item?.positionPrices || [],
            position: matchingAreaInFormData?.position || 'position1',
            budget: (matchingAreaInFormData?.budget ?? item?.positionPrices?.[0]) || 0,
            isSelected: !!matchingAreaInFormData
          };
        });

        newKeywordAreaData[keyName] = keywordSpecificAreas;
      });

      setKeywordAreaData(newKeywordAreaData);
    }
  }, [keywordDetails, isInitialDataProcessed, formData.keywords]);

  const renderSelectedValue = (selectedId, dataList, placeholder) => {
    if (!selectedId || dataList.length === 0) return <span>{placeholder}</span>;
    const selectedItem = dataList.find(item => item._id === selectedId);
    return selectedItem ? selectedItem.name : `Loading ${placeholder.toLowerCase()}...`;
  };

  const toggleKeyExpansion = (keyName) => {
    setExpandedKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handlePositionChange = (keyName, index, newPosition) => {
    setKeywordAreaData(prev => {
      const updatedData = [...prev[keyName]];
      const selectedArea = updatedData[index]?.area;

      const keywordSpecificPriceData = keywordDetails
        .find(kw => kw.name === keyName)?.prices
        .find(p => p.area?.name === selectedArea);

      const positionIndex = parseInt(newPosition.replace('position', '')) - 1;
      const newBudget = keywordSpecificPriceData?.positionPrices?.[positionIndex] || 0;

      updatedData[index] = {
        ...updatedData[index],
        position: newPosition,
        budget: newBudget
      };

      return { ...prev, [keyName]: updatedData };
    });
  };

  const toggleAreaSelection = (keyName, area) => {
    setKeywordAreaData(prev => {
      const updatedData = prev[keyName].map(item =>
        item.area === area
          ? { ...item, isSelected: !item.isSelected }
          : item
      );
      return { ...prev, [keyName]: updatedData };
    });
  };

  const handleCheckChange = (keyName) => (e) => {
    e.stopPropagation();
    const currentData = keywordAreaData[keyName] || [];
    const areasToShow = currentData.filter(item => formData.areas.includes(item.areaId));
    const isChecked = !areasToShow.every(item => item.isSelected);

    const updatedData = currentData.map(item => {
      if (formData.areas.includes(item.areaId)) {
        return { ...item, isSelected: isChecked };
      }
      return item;
    });

    setKeywordAreaData(prev => ({ ...prev, [keyName]: updatedData }));
  };

  const calculateTotals = (keyName) => {
    const currentData = keywordAreaData[keyName] || [];
    const areasToShow = currentData.filter(item =>
      formData.areas.includes(item.areaId)
    );
    return areasToShow.reduce(
      (sum, item) => item.isSelected ? sum + parseInt(item.budget || 0, 10) : sum, 0
    );
  };

  const calculateOverallTotalPrice = () => {
    let overallTotal = 0;
    for (const keyName in keywordAreaData) {
      if (Object.hasOwnProperty.call(keywordAreaData, keyName)) {
        const areasForKeywordInSelectedAreas = keywordAreaData[keyName].filter(item =>
          formData.areas.includes(item.areaId)
        );

        overallTotal += areasForKeywordInSelectedAreas.reduce(
          (sum, item) => item.isSelected ? sum + parseInt(item.budget || 0, 10) : sum, 0
        );
      }
    }
    return overallTotal;
  };

  const handleNextClickSave = async () => {
    const selectedLocationData = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      totalPrice: calculateOverallTotalPrice(),
      keywords: []
    };




    for (const keyName in keywordAreaData) {
      if (Object.hasOwnProperty.call(keywordAreaData, keyName)) {
        const keywordAreas = keywordAreaData[keyName];
        const selectedAreasForKeyword = keywordAreas.filter(item =>
          item.isSelected && formData.areas.includes(item.areaId)
        );

        if (selectedAreasForKeyword.length > 0) {
          selectedLocationData.keywords.push({
            keyName: keyName,
            areas: selectedAreasForKeyword.map(item => ({
              area: item.area,
              areaId: item.areaId,
              position: item.position,
              budget: item.budget
            }))
          });
        }
      }
    }
    GetLocution(selectedLocationData);
    handleNextClick();
  };



  return (
    <Card className="max-w-4xl mx-auto my-6 shadow-none">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Business Location
        </Typography>
        <Grid container spacing={3}>
          {[
            { label: 'Country', name: 'country', list: country, disabled: false },
            { label: 'State', name: 'state', list: state, disabled: !formData.country },
            { label: 'City', name: 'city', list: allCities, disabled: !formData.state },
          ].map(({ label, name, list, disabled }) => (
            <Grid size={{ xs: 12, md: 6 }} key={name}>
              <CustomTextField
                select
                fullWidth
                label={label}
                name={name}
                value={list.some(item => item._id === formData[name]) ? formData[name] : ""}
                onChange={handleChange}
                disabled={disabled}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => renderSelectedValue(selected, list, `Select ${label}`)
                }}
              >
                <MenuItem value="" disabled>{`Select ${label}`}</MenuItem>
                {list.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          ))}

          {/* Multi-select Area field */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              options={allAreas}
              disableCloseOnSelect
              disabled={!formData.city}
              getOptionLabel={(option) => option.name}
              size="small"
              value={allAreas.filter(area => formData.areas.includes(area._id))}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  areas: newValue.map(item => item._id) // Store only IDs in formData
                }));
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                    style={{ marginRight: 8 }}
                  />
                  {option.name}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span key={option._id} {...getTagProps({ index })}>
                    {option.name}
                  </span>
                ))
              }
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Area"
                  variant="outlined"
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              PaperProps={{
                style: {
                  maxHeight: '200px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                },
              }}
            />
          </Grid>

          {formData?.areas.length > 0 && (
            <Grid size={{ xs: 12, md: 12 }}>
              <CardContent className="p-2">
                <div className="flex flex-col gap-2 w-full">
                  {keywordDetails.map((keyword, idx) => {
                    const keyName = keyword?.name;
                    if (!keyName) return null;

                    const isKeyExpanded = expandedKeys[keyName];
                    const currentData = keywordAreaData[keyName] || [];
                    const areasToShow = currentData.filter(item =>
                      formData.areas.includes(item.areaId)
                    );

                    if (areasToShow.length === 0) return null;

                    const displayTotal = calculateTotals(keyName);

                    return (
                      <div key={`${keyName}-${idx}`} className="w-full">
                        <div
                          className="flex items-center justify-between w-full gap-2 bg-gray-100 cursor-pointer"
                          onClick={() => toggleKeyExpansion(keyName)}
                        >
                          <div className='flex w-full justify-between p-2 items-center'>
                            <div className='flex gap-5'>
                              <Checkbox
                                checked={areasToShow.every(item => item.isSelected)}
                                indeterminate={areasToShow.some(item => item.isSelected) && !areasToShow.every(item => item.isSelected)}
                                onChange={handleCheckChange(keyName)}
                                className="p-0"
                              />
                              <Typography variant="h6" className="text-red-600 font-semibold mt-1">
                                {keyName}
                              </Typography>
                            </div>
                            <div className='flex gap-5 items-center'>
                              <span className="text-sm mt-1">
                                Total Price = ₹{displayTotal.toLocaleString()}
                              </span>
                              <IconButton size="small" className={`transition-transform duration-300 ${isKeyExpanded ? 'rotate-180' : ''}`}>
                                <ExpandMoreIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>

                        {isKeyExpanded && (
                          <Grid container className="mt-2">
                            <Grid item size={{ xs: 12, md: 12 }} className=" text-sm">
                              <div className="flex items-center border-b text-sm font-bold">
                                <div className="w-1/12 p-2"></div>
                                <div className="w-4/12 p-2 text-start">Area</div>
                                <div className="w-4/12 p-2 text-start">Position</div>
                                <div className="w-3/12 p-2 text-start">Budget</div>
                              </div>

                              {areasToShow.map((row, index) => {
                                const positionPricesForArea = keywordDetails
                                  .find(kw => kw.name === keyName)
                                  ?.prices.find(p => p.area?.name === row.area)?.positionPrices || [];

                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center border-b text-sm font-semibold`}
                                  >
                                    <div className="w-1/12 p-2">
                                      <Checkbox
                                        checked={row.isSelected}
                                        onChange={() => toggleAreaSelection(keyName, row.area)}
                                      />
                                    </div>
                                    <div className="w-4/12 p-2">{row.area}</div>
                                    <div className="w-4/12 p-2 ">
                                      <Select
                                        fullWidth
                                        value={row.position}
                                        size="small"
                                        onChange={(e) => handlePositionChange(keyName, index, e.target.value)}
                                        disabled={!row.isSelected}
                                      >
                                        {['position1', 'position2', 'position3', 'position4', 'position5'].map(pos => (
                                          <MenuItem
                                            key={pos}
                                            value={pos}
                                          // disabled={!positionPricesForArea[parseInt(pos.replace('position', '')) - 1]}
                                          >
                                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </div>
                                    <div className="w-3/12 p-2">₹{row.budget?.toLocaleString() || '0'}</div>
                                  </div>
                                );
                              })}
                            </Grid>
                          </Grid>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Grid>
          )}
        </Grid>

        <div className="flex justify-between mt-8">
          <Button
            // color="secondary"
            variant="outlined"
            onClick={handlePreviousClick}
            disabled={false}
          >
            Previous
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleNextClickSave}
            disabled={false}
          >
            Save & Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelection;
