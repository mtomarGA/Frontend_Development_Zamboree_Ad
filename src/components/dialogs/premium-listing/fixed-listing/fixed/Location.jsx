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
import AvilPosition from '@/services/premium-listing/fixedListing.service';
// Services
import GetCountry from "@/services/location/country.services";
import GetState from "@/services/location/state.services";
import GetCity from "@/services/location/city.service";
import GetArea from "@/services/location/area.services";
import Keyword from "@/services/premium-listing/fixedPackage.service";

const LocationSelection = ({ handleNextClick, handlePreviousClick, data, keywords, GetLocution }) => {
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [allCities, setCities] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [findPosition, setFindPosition] = useState([]);

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    areas: [], // This will store area objects with _id, name, lat, long
    keywords: []
  });

  console.log(findPosition, "findPositionfindPositionfindPosition");






  const [isInitialDataProcessed, setIsInitialDataProcessed] = useState(false);

  useEffect(() => {
    if (data && !isInitialDataProcessed) {
      setFormData({
        country: data?.country || '',
        state: data?.state || '',
        city: data?.city || '',
        areas: data?.keywords?.flatMap(keyword => keyword.areas.map(area => ({
          _id: area.areaId,
          name: area.area,
          latitude: area.latitude,
          longitude: area.longitude
        }))) || [],
        keywords: data?.keywords || []
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

  // Fetch Countries
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

  const fetchStates = async (countryId, initialLoad = false) => {
    try {
      const result = await GetState.getStateById(countryId);
      setState(result.data || []);
      if (!initialLoad) setFormData(prev => ({ ...prev, state: '', city: '', areas: [] }));
      if (!initialLoad) setCities([]);
      if (!initialLoad) setAllAreas([]);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchCities = async (stateId, initialLoad = false) => {
    try {
      const result = await GetCity.getCityById(stateId);
      setCities(result.data || []);
      if (!initialLoad) setFormData(prev => ({ ...prev, city: '', areas: [] }));
      if (!initialLoad) setAllAreas([]);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const result = await GetArea.getAreaById(cityId);
      setAllAreas(result.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'country') fetchStates(value);
    if (name === 'state') fetchCities(value);
    if (name === 'city') fetchAreas(value);
  };

  useEffect(() => { if (isInitialDataProcessed && formData.country) fetchStates(formData.country, true); }, [formData.country, isInitialDataProcessed]);
  useEffect(() => { if (isInitialDataProcessed && formData.state) fetchCities(formData.state, true); }, [formData.state, isInitialDataProcessed]);
  useEffect(() => { if (isInitialDataProcessed && formData.city) fetchAreas(formData.city); }, [formData.city, isInitialDataProcessed]);

  useEffect(() => { if (keywords?.length) setKeywordState({ keywords }); }, [keywords]);

  useEffect(() => {
    const fetchKeywordDetails = async () => {
      if (!keywordState?.keywords?.length) return;
      try {
        const results = await Promise.all(keywordState.keywords.map(key => Keyword.getKeyWordDetails(key)));
        const keywordData = results.flatMap(res => res?.data?.map(item => ({
          id: item._id,
          name: item.name,
          prices: item.prices || []
        })) || []);
        setKeywordDetails(keywordData);
      } catch (error) {
        console.error("Error fetching keyword details", error);
      }
    };
    fetchKeywordDetails();
  }, [keywordState?.keywords]);

  // Initialize keywordAreaData
  useEffect(() => {
    if (keywordDetails.length > 0 && isInitialDataProcessed) {
      const newKeywordAreaData = {};
      keywordDetails.forEach(keyword => {
        const keyName = keyword.name;
        if (!keyName) return;
        const keywordSpecificAreas = keyword.prices.map(item => {
          console.log(findPosition, 'Item in keywordAreaData');
          findPosition.forEach(pos => {
            if (pos.keyName === keyName && item.area?._id === pos.areaId
              && item.latitude === pos.latitude && item.longitude === pos.longitude) {
              console.log(pos.position, 'Position matched and disabled');
            }
          });

          const matchingAreaInFormData = formData.keywords?.find(kw => kw.keyName === keyName)?.areas?.find(a => a.areaId === item?.area?._id);
          return {
            area: item?.area?.name || '',
            latitude: item?.latitude || '',
            longitude: item?.longitude || '',
            areaId: item?.area?._id || '',
            position: matchingAreaInFormData?.position || 'position1',
            budget: matchingAreaInFormData?.budget || item?.positionPrices?.[0] || 0,
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

  const toggleKeyExpansion = (keyName) => setExpandedKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));

  const handlePositionChange = (keyName, index, newPosition) => {
    setKeywordAreaData(prev => {
      const updatedData = [...prev[keyName]];
      const areaId = updatedData[index].areaId;
      const priceData = keywordDetails.find(kw => kw.name === keyName)?.prices.find(p => p.area?._id === areaId);
      const positionIndex = parseInt(newPosition.replace('position', '')) - 1;
      const newBudget = priceData?.positionPrices?.[positionIndex] || 0;
      updatedData[index] = { ...updatedData[index], position: newPosition, budget: newBudget };
      return { ...prev, [keyName]: updatedData };
    });
  };

  const toggleAreaSelection = (keyName, areaId) => {
    setKeywordAreaData(prev => {
      const updatedData = prev[keyName].map(item => item.areaId === areaId ? { ...item, isSelected: !item.isSelected } : item);
      return { ...prev, [keyName]: updatedData };
    });
  };

  const handleCheckChange = (keyName) => (e) => {
    e.stopPropagation();
    const currentData = keywordAreaData[keyName] || [];
    const areasToShow = currentData.filter(item => formData.areas.some(a => a._id === item.areaId));
    const isChecked = !areasToShow.every(item => item.isSelected);
    const updatedData = currentData.map(item => formData.areas.some(a => a._id === item.areaId) ? { ...item, isSelected: isChecked } : item);
    setKeywordAreaData(prev => ({ ...prev, [keyName]: updatedData }));
  };

  const calculateTotals = (keyName) => {
    const currentData = keywordAreaData[keyName] || [];
    return currentData.reduce((sum, item) => item.isSelected ? sum + parseInt(item.budget || 0, 10) : sum, 0);
  };

  const calculateOverallTotalPrice = () => {
    let overallTotal = 0;
    for (const keyName in keywordAreaData) {
      if (Object.hasOwnProperty.call(keywordAreaData, keyName)) {
        overallTotal += keywordAreaData[keyName].reduce((sum, item) => item.isSelected ? sum + parseInt(item.budget || 0, 10) : sum, 0);
      }
    }
    return overallTotal;
  };

  useEffect(() => {
    const data = {
      lat: formData?.areas?.map(item => item.latitude) || [],
      log: formData?.areas?.map(item => item.longitude) || [],
      keyName: []
    };
    for (const keyName in keywordAreaData) {
      if (Object.hasOwnProperty.call(keywordAreaData, keyName)) {
        const keywordAreas = keywordAreaData[keyName];
        const selectedAreasForKeyword = keywordAreas.filter(item => item.isSelected);

        if (selectedAreasForKeyword.length > 0) {
          data.keyName.push(keyName); // ✅ push instead of overwrite
        }
      }
    }
    if (data.lat.length > 0 && data.log.length > 0 && data.keyName.length > 0) {
      (async () => {
        try {
          const result = await AvilPosition.checkAvilablePosition(data);
          console.log(result?.takenPositions, 'Available Positions Result');
          setFindPosition(result?.takenPositions || []);
        } catch (error) {
          console.error('Error checking available positions:', error);
        }
      })();
    }


  }, [formData?.areas, keywordAreaData]);

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
        // console.log(`Processing keyword: ${keyName}`, keywordAreas);
        const selectedAreasForKeyword = keywordAreas.filter(item => item.isSelected);
        if (selectedAreasForKeyword.length > 0) {
          selectedLocationData.keywords.push({
            keyName,
            areas: selectedAreasForKeyword.map(item => {
              return {
                area: item.area,
                areaId: item.areaId,
                position: item.position,
                latitude: item.latitude,
                longitude: item.longitude,
                budget: item.budget
              };
            })

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
        <Typography variant="h6" gutterBottom>Business Location</Typography>
        <Grid container spacing={3}>
          {[{ label: 'Country', name: 'country', list: country, disabled: false },
          { label: 'State', name: 'state', list: state, disabled: !formData.country },
          { label: 'City', name: 'city', list: allCities, disabled: !formData.state }].map(({ label, name, list, disabled }) => (
            <Grid size={{ xs: 12, md: 6 }} key={name}>
              <CustomTextField
                select
                fullWidth
                label={label}
                className="text-start"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={disabled}
                SelectProps={{
                  renderValue: (selected) => renderSelectedValue(selected, list, `Select ${label}`),
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

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              options={allAreas}
              disableCloseOnSelect
              disabled={!formData.city}
              getOptionLabel={(option) => option.name}
              size="small"
              value={formData.areas}
              onChange={(event, newValue) => {
                const filteredValues = newValue.map(area => {
                  // log each selected area
                  return {
                    _id: area._id,
                    name: area.name,
                    latitude: area.latitude,
                    longitude: area.longitude,
                  };
                });

                setFormData(prev => ({ ...prev, areas: filteredValues }));
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} style={{ marginRight: 8 }} />
                  {option.name}
                </li>
              )}
              renderTags={(value, getTagProps) => value.map((option, index) => <span key={option._id} {...getTagProps({ index })}>{option.name}</span>)}
              renderInput={(params) => <CustomTextField {...params} label="Area" variant="outlined" size="small" placeholder={formData.areas.length === 0 ? 'Select Area' : ''} />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              PaperProps={{ style: { maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' } }}
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
                    const areasToShow = currentData.filter(item => formData.areas.some(a => a._id === item.areaId));
                    if (areasToShow.length === 0) return null;
                    const displayTotal = calculateTotals(keyName);

                    return (
                      <div key={`${keyName}-${idx}`} className="w-full">
                        <div className="flex items-center justify-between w-full gap-2 bg-gray-100 cursor-pointer" onClick={() => toggleKeyExpansion(keyName)}>
                          <div className='flex w-full justify-between p-2 items-center'>
                            <div className='flex gap-5'>
                              <Checkbox checked={areasToShow.every(item => item.isSelected)} indeterminate={areasToShow.some(item => item.isSelected) && !areasToShow.every(item => item.isSelected)} onChange={handleCheckChange(keyName)} className="p-0" />
                              <Typography variant="h6" className="text-red-600 font-semibold mt-1">{keyName}</Typography>
                            </div>
                            <div className='flex gap-5 items-center'>
                              <span className="text-sm mt-1">Total Price = ₹{displayTotal.toLocaleString()}</span>
                              <IconButton size="small" className={`transition-transform duration-300 ${isKeyExpanded ? 'rotate-180' : ''}`}><ExpandMoreIcon /></IconButton>
                            </div>
                          </div>
                        </div>

                        {isKeyExpanded && (
                          <Grid container className="mt-2">
                            <Grid item size={{ xs: 12, md: 12 }} className="border text-sm">
                              <div className="flex items-center border-b text-sm font-bold">
                                <div className="w-1/12 p-2"></div>
                                <div className="w-4/12 p-2 text-start">Area</div>
                                <div className="w-4/12 p-2 text-start">Position</div>
                                <div className="w-3/12 p-2 text-start">Budget</div>
                              </div>

                              {areasToShow.map((row, index) => {
                                const positionPricesForArea = keywordDetails.find(kw => kw.name === keyName)?.prices.find(p => p.area?._id === row.areaId)?.positionPrices || [];
                                return (
                                  <div key={`${row.area}-${index}`} className="flex items-center border-b border-gray-200">
                                    <div className="w-1/12 p-2">
                                      <Checkbox checked={row.isSelected} onChange={() => toggleAreaSelection(keyName, row.areaId)} />
                                    </div>
                                    <div className="w-4/12 p-2 text-start">{row.area}</div>
                                    <div className="w-4/12 p-2 text-start">
                                      <Select
                                        value={row.position || ""} // ✅ agar row.position empty hai to blank
                                        onChange={(e) => handlePositionChange(keyName, index, e.target.value)}
                                        variant="standard"
                                        className="w-full"
                                        disableUnderline
                                        displayEmpty
                                      >
                                        {positionPricesForArea.map((_, idx) => {
                                          const positionName = `position${idx + 1}`;

                                          const isTaken =
                                            findPosition.some(
                                              (pos) =>
                                                pos.keyName === keyName &&
                                                pos.latitude === row.latitude &&
                                                pos.longitude === row.longitude &&
                                                pos.position === positionName
                                            ) && row.position !== positionName; 

                                          return (
                                            <MenuItem
                                              key={positionName}
                                              value={positionName}
                                              disabled={isTaken}
                                            >
                                              {positionName}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>

                                    </div>
                                    <div className="w-3/12 p-2 text-start">₹{row.budget}</div>
                                  </div>
                                );
                              })}
                            </Grid>
                          </Grid>
                        )}
                      </div>
                    );
                  })}
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6" className="font-bold">Total Price for All Keywords = ₹{calculateOverallTotalPrice().toLocaleString()}</Typography>
                  </Grid>
                </div>
              </CardContent>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 12 }} className="flex justify-between mt-4">
            <Button variant="outlined" onClick={handlePreviousClick}>Previous</Button>
            <Button variant="contained" color="primary" onClick={handleNextClickSave} disabled={formData.areas.length === 0 || !Object.values(keywordAreaData).some(arr => arr.some(item => item.isSelected))}>Save & Next</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationSelection;
