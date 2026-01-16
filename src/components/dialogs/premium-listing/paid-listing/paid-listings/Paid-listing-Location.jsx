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

const LocationSelection = ({ handleNextClick, handlePreviousClick, data, keywords, GetLocution }) => {
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [allCities, setCities] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    areas: [],
    latitude: "",
    longitude: ""
  });
  const isDataProcessedRef = useRef(false);
  useEffect(() => {

    if (data && !isDataProcessedRef.current) {

      setFormData({
        country: data?.country || '',
        state: data?.state || '',
        city: data?.city || '',
        areas: data?.area || [],
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

  // Fetch Countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await GetCountry.getCountries();
        console.log('Fetched countries:', result.data);

        setCountry(result.data || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch States based on selected Country
  const fetchStates = async (countryId, initialLoad = false) => {
    try {
      const result = await GetState.getStateById(countryId);
      console.log('Fetched countries:', result.data);
      setState(result.data || []);
      if (!initialLoad) {
        setCities([]);
        setAllAreas([]);
        setFormData(prev => ({ ...prev, state: '', city: '', areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  // Fetch Cities based on selected State
  const fetchCities = async (stateId, initialLoad = false) => {
    try {
      const result = await GetCity.getCityById(stateId);
      console.log('Fetched countries:', result.data);
      setCities(result.data || []);
      if (!initialLoad) {
        setAllAreas([]);
        setFormData(prev => ({ ...prev, areas: [] }));
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  // Fetch Areas based on selected City
  const fetchAreas = async (cityId) => {
    try {
      const result = await GetArea.getAreaById(cityId);
      console.log('Fetched countries:', result.data);
      setAllAreas(result.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

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


  useEffect(() => {
    if (formData.country && country.length > 0) {
      fetchStates(formData.country, true); // Pass true for initialLoad
    }
  }, [formData.country, country]); // Depend on country list to ensure it's loaded

  useEffect(() => {
    if (formData.state && state.length > 0) {
      fetchCities(formData.state, true); // Pass true for initialLoad
    }
  }, [formData.state, state]);

  useEffect(() => {
    // Only fetch if formData.city is set and cities are loaded
    if (formData.city && allCities.length > 0) {
      fetchAreas(formData.city);
    }
  }, [formData.city, allCities]);




  const renderSelectedValue = (selectedId, dataList, placeholder) => {
    if (!selectedId || dataList.length === 0) return <span>{placeholder}</span>;
    const selectedItem = dataList.find(item => item._id === selectedId);
    return selectedItem ? selectedItem.name : `Loading ${placeholder.toLowerCase()}...`;
  };

  const handleNextClickSave = async () => {
    const selectedLocationData = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      area: formData.areas
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
            <Grid size={{ xs: 12, md: 6 }} key={name}> {/* Changed size to item xs and md for correct Grid usage */}
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              options={allAreas}
              disableCloseOnSelect
              disabled={!formData.city}
              getOptionLabel={(option) => option.name}
              size="small"
              value={formData.areas} // full objects
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  areas: newValue, // full objects
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
                  placeholder={formData.areas.length === 0 ? "Select Area" : ""}
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              PaperProps={{
                style: {
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "hidden",
                },
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 12 }} className="flex justify-between mt-4"> {/* Changed size to item xs and md */}
            <Button variant="outlined" onClick={handlePreviousClick}>
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
