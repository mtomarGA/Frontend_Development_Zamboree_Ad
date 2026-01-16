'use client';

import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Checkbox,
  // Select, // Not directly used for select dropdowns for country/state/city in the provided code
  // IconButton, // Not directly used in the provided code
} from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import { Grid } from '@mui/system';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Not directly used
import { Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Services
import GetCountry from "@/services/location/country.services";
import GetState from "@/services/location/state.services";
import GetCity from "@/services/location/city.service";
import GetArea from "@/services/location/area.services";
// import Keyword from "@/services/premium-listing/fixedPackage.service"; // Not directly used in this component logic

const LocationSelection = ({ handleNextClick, handlePreviousClick, data, GetLocution }) => {
  console.log(data, 'datadatadata');

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [allCities, setCities] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    areas: [], // This will store area _ids
  });

  // Use a ref to track if initial data has been processed
  const isDataProcessedRef = useRef(false);

  // Effect to populate formData from 'data' prop on initial mount or data change
  // This needs to be carefully managed to avoid conflicts with user interactions
  useEffect(() => {
    if (data && !isDataProcessedRef.current) {
      const countryId = data.country?.[0]?._id || '';
      const stateId = data.state?.[0]?._id || '';
      const cityId = data.city?.[0]?._id || '';
      const areaIds = Array.isArray(data.area)
        ? data.area.map(a => a.areaId)
        : [];

      setFormData({
        country: countryId,
        state: stateId,
        city: cityId,
        areas: areaIds
      });

      // Trigger fetch chain for dropdown population
      if (countryId) fetchStates(countryId, true).then(() => {
        if (stateId) fetchCities(stateId, true).then(() => {
          if (cityId) fetchAreas(cityId);
        });
      });

      isDataProcessedRef.current = true;
    }
  }, [data]);


  // Cleanup ref on unmount (important if component remounts)
  useEffect(() => {
    return () => {
      isDataProcessedRef.current = false;
    };
  }, []);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // Fetch Countries on component mount
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

  const handlePriviouse = () => {
    handlePreviousClick();
  };

  // Fetch States based on selected Country
  const fetchStates = async (countryId, initialLoad = false) => {
    if (!countryId) { // Added check for empty countryId
      setState([]);
      setCities([]);
      setAllAreas([]);
      if (!initialLoad) {
        setFormData(prev => ({ ...prev, state: '', city: '', areas: [] }));
      }
      return;
    }
    try {
      const result = await GetState.getStateById(countryId);
      setState(result.data || []);
      if (!initialLoad) {
        setCities([]);
        setAllAreas([]);
        setFormData(prev => ({ ...prev, state: '', city: '', areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
      setState([]); // Clear states on error
    }
  };

  // Fetch Cities based on selected State
  const fetchCities = async (stateId, initialLoad = false) => {
    if (!stateId) { // Added check for empty stateId
      setCities([]);
      setAllAreas([]);
      if (!initialLoad) {
        setFormData(prev => ({ ...prev, city: '', areas: [] }));
      }
      return;
    }
    try {
      const result = await GetCity.getCityById(stateId);
      setCities(result.data || []);
      if (!initialLoad) {
        setAllAreas([]);
        setFormData(prev => ({ ...prev, areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]); // Clear cities on error
    }
  };

  // Fetch Areas based on selected City
  const fetchAreas = async (cityId) => {
    if (!cityId) { // Added check for empty cityId
      setAllAreas([]);
      return;
    }
    try {
      const result = await GetArea.getAreaById(cityId);
      setAllAreas(result.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
      setAllAreas([]); // Clear areas on error
    }
  };

  // Handle user changes for Country, State, City
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

  // Effects to re-fetch options when formData changes (for initial data loading or sequential selection)
  useEffect(() => {
    if (formData.country && country.length > 0) {
      fetchStates(formData.country, true);
    } else if (formData.country === '') { // If country is cleared, clear dependents
      setState([]);
      setCities([]);
      setAllAreas([]);
    }
  }, [formData.country, country]);

  useEffect(() => {
    if (formData.state && state.length > 0) {
      fetchCities(formData.state, true);
    } else if (formData.state === '') { // If state is cleared, clear dependents
      setCities([]);
      setAllAreas([]);
    }
  }, [formData.state, state]);

  useEffect(() => {
    if (formData.city && allCities.length > 0) {
      fetchAreas(formData.city);
    } else if (formData.city === '') { // If city is cleared, clear areas
      setAllAreas([]);
    }
  }, [formData.city, allCities]);

  // The renderSelectedValue function is key for placeholder display
  const renderSelectedValue = (selectedId, dataList, placeholder) => {
    if (!selectedId) { // Check if selectedId is falsy (empty string or undefined)
      return <Typography component="span" sx={{ color: 'text.secondary' }}>{placeholder}</Typography>;
    }
    const selectedItem = dataList.find(item => item._id === selectedId);
    return selectedItem ? selectedItem.name : <Typography component="span" sx={{ color: 'text.secondary' }}>{placeholder}</Typography>;
  };

  const handleNextClickSave = async () => {
    const selectedLocationData = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      area: formData.areas // formData.areas already contains _ids
    };

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
            <Grid size={{ xs: 12, md: 6 }} key={name}> {/* Corrected Grid prop from 'size' to 'item' */}
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
                  displayEmpty: true,
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

          {/* Multi-select Area field */}
          <Grid size={{ xs: 12, md: 6 }}> {/* Corrected Grid prop from 'size' to 'item' */}
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
                  placeholder={formData.areas.length === 0 && !formData.city ? 'Select Area' : ''} // Refined placeholder
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

          <Grid size={{ xs: 12, md: 12 }} className="flex justify-between mt-4"> {/* Corrected Grid prop from 'size' to 'item' */}
            <Button variant="outlined" onClick={handlePriviouse}>
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!formData.country || !formData.state || !formData.city || formData.areas.length === 0}
              onClick={handleNextClickSave}
            >
              Save & Next
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationSelection;
