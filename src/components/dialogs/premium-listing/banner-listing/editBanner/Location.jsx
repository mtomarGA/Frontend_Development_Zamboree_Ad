'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Checkbox,
} from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import { Grid } from '@mui/system';
import { Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Services
import GetCountry from "@/services/location/country.services";
import GetState from "@/services/location/state.services";
import GetCity from "@/services/location/city.service";
import GetArea from "@/services/location/area.services";

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
    areas: [], // always IDs
  });

  const isDataProcessedRef = useRef(false);

  // Load initial data from props
  useEffect(() => {
    if (data && !isDataProcessedRef.current) {
      setFormData({
        country: data.country?._id || '',
        state: data.state?._id || '',
        city: data.city?._id || '',
        areas: Array.isArray(data.area) ? data.area.map(area => area._id) : []
      });
      isDataProcessedRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    return () => {
      isDataProcessedRef.current = false;
    };
  }, []);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // Fetch countries
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

  // Fetch States
  const fetchStates = async (countryId, initialLoad = false) => {
    if (!countryId) {
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
      setState([]);
    }
  };

  // Fetch Cities
  const fetchCities = async (stateId, initialLoad = false) => {
    if (!stateId) {
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
      setCities([]);
    }
  };

  // Fetch Areas
  const fetchAreas = async (cityId) => {
    if (!cityId) {
      setAllAreas([]);
      return;
    }
    try {
      const result = await GetArea.getAreaById(cityId);
      setAllAreas(result.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
      setAllAreas([]);
    }
  };

  // Handle Dropdown Change
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

  // Auto load States, Cities, Areas
  useEffect(() => {
    if (formData.country && country.length > 0) {
      fetchStates(formData.country, true);
    } else if (formData.country === '') {
      setState([]);
      setCities([]);
      setAllAreas([]);
    }
  }, [formData.country, country]);

  useEffect(() => {
    if (formData.state && state.length > 0) {
      fetchCities(formData.state, true);
    } else if (formData.state === '') {
      setCities([]);
      setAllAreas([]);
    }
  }, [formData.state, state]);

  useEffect(() => {
    if (formData.city && allCities.length > 0) {
      fetchAreas(formData.city);
    } else if (formData.city === '') {
      setAllAreas([]);
    }
  }, [formData.city, allCities]);

  const renderSelectedValue = (selectedId, dataList, placeholder) => {
    if (!selectedId) {
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
      areas: formData.areas, // array of IDs
    };

    console.log(formData, "selectedLocationData");
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

          {/* Multi-select Area */}
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
                setFormData((prev) => ({
                  ...prev,
                  areas: newValue.map(area => area._id), // ✅ correct update
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
                  placeholder={formData.areas.length === 0 && !formData.city ? 'Select Area' : ''}
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

          <Grid size={{ xs: 12, md: 12 }} className="flex justify-between mt-4">
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
