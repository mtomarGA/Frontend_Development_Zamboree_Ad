'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  Typography
} from '@mui/material'

import { useUpdateListingFormContext } from '@/hooks/updateListingForm'

const GoogleMapLocation = ({ nextHandle }) => {
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)
  const geocoderRef = useRef(null); // ADDED: Ref for the Google Maps Geocoder

  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedLocationName, setSelectedLocationName] = useState('');

  const {
    googleMapData,
    locationFormData, // <-- Now including locationFormData
    handleGoogleMapChange,
    handleLocationChange, // <-- Now including handleLocationChange
    googleMapErrors,
    validateGoogleMap
  } = useUpdateListingFormContext()

  // Function to generate Google Maps URL
  // MODIFIED: Changed the URL format for better compatibility and standard usage.
  const generateGoogleMapsUrl = (lat, lng) =>
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  // Function to extract address components from Google Places result
  const extractAddressComponents = (components = []) => {
    const result = {
      country: '',
      state: '',
      city: '',
      area: '',
      pincode: ''
    }

    // DEBUG: Log the raw address components received
    console.log("DEBUG: Incoming address components for extraction:", components);

    for (const component of components) {
      const types = component.types
      if (types.includes('country')) result.country = component.long_name
      if (types.includes('administrative_area_level_1')) result.state = component.long_name
      if (types.includes('locality')) result.city = component.long_name
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) result.area = component.long_name
      if (types.includes('postal_code')) result.pincode = component.long_name
    }

    // DEBUG: Log the extracted result
    console.log("DEBUG: Extracted address components:", result);
    return result
  }

  // This function now updates both googleMapData and locationFormData
  const updateLocation = (lat, lng, businessInfo = {}) => {
    const latitude = parseFloat(lat).toFixed(6)
    const longitude = parseFloat(lng).toFixed(6)

    handleGoogleMapChange({
      latitude,
      longitude,
      google_map_url: generateGoogleMapsUrl(latitude, longitude),
    })

    // DEBUG: Log the data being passed to handleLocationChange
    console.log("DEBUG: Updating locationFormData with:", businessInfo);

    // Update locationFormData with extracted details
    handleLocationChange({
      address: businessInfo.address || '',
      country: businessInfo.country || '',
      state: businessInfo.state || '',
      city: businessInfo.city || '',
      area: businessInfo.area || '',
      pincode: businessInfo.pincode || '',
    });

    // Set the selected location name for display
    setSelectedLocationName(businessInfo.placeName || `Custom Location (${latitude}, ${longitude})`);

    const newPosition = new window.google.maps.LatLng(latitude, longitude)
    if (markerRef.current) {
      markerRef.current.setPosition(newPosition)
      markerRef.current.getMap().setZoom(15) // Zoom in when a new location is selected/dragged
      markerRef.current.getMap().panTo(newPosition)
    }
  }

  // MODIFIED: Added reverse geocoding logic for 'Use Current Location'
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)

        // Use the Geocoder to get address details
        if (geocoderRef.current) { // Ensure geocoder is initialized
          const latLng = new window.google.maps.LatLng(parseFloat(lat), parseFloat(lng));

          geocoderRef.current.geocode({ location: latLng }, (results, status) => {
            // DEBUG: Log geocoder results and status
            console.log("DEBUG: Geocoder Results for Current Location:", results, "Status:", status);

            if (status === 'OK' && results[0]) {
              const place = results[0]; // The first result is usually the most relevant
              const placeName = place.formatted_address || `My Current Location (${lat}, ${lng})`;
              const extracted = extractAddressComponents(place.address_components);

              if (inputRef.current) inputRef.current.value = placeName; // Update search input field

              updateLocation(lat, lng, {
                placeName: placeName,
                address: place.formatted_address || '', // Pass full formatted address
                ...extracted // Pass all extracted address components
              });
            } else {
              console.error("Error: Geocoder failed for current location due to: " + status);
              // Fallback if geocoding fails, still update with lat/lng
              if (inputRef.current) inputRef.current.value = 'My Current Location';
              updateLocation(lat, lng, { placeName: 'My Current Location' });
            }
          });
        } else {
          // Fallback if geocoder is not initialized yet (shouldn't happen with useEffect setup)
          console.warn("Warning: Geocoder not initialized for current location request.");
          if (inputRef.current) inputRef.current.value = 'My Current Location';
          updateLocation(lat, lng, { placeName: 'My Current Location' });
        }

      }, (error) => {
        console.error("Error getting current location:", error);
        alert("Unable to retrieve your current location. Please ensure location services are enabled and try again.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateGoogleMap()) return
    // In the update flow, you'll pass both googleMapData and locationFormData
    nextHandle?.({ googleMapData, locationFormData })
  }

  useEffect(() => {
    // This effect simply sets isMapLoaded to true once window.google is available
    if (window.google) setIsMapLoaded(true)
  }, [])

  useEffect(() => {
    // This effect handles setting the initial display name for the location
    if (googleMapData.latitude && googleMapData.longitude && locationFormData.address) {
      setSelectedLocationName(locationFormData.address);
      if (inputRef.current) {
        inputRef.current.value = locationFormData.address; // Pre-fill search input with initial address
      }
    } else if (googleMapData.latitude && googleMapData.longitude) {
      setSelectedLocationName(`Current Coordinates: (${googleMapData.latitude}, ${googleMapData.longitude})`);
    }
  }, [googleMapData.latitude, googleMapData.longitude, locationFormData.address]);


  useEffect(() => {
    if (!isMapLoaded || typeof window.google === 'undefined') return

    // ADDED: Initialize Geocoder here, once Google Maps API is loaded
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    // Set initial center based on existing googleMapData or a default for India
    const initialCenter = {
      lat: parseFloat(googleMapData.latitude) || 20.5937, // Default to India's center
      lng: parseFloat(googleMapData.longitude) || 78.9629  // Default to India's center
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: googleMapData.latitude && googleMapData.longitude ? 15 : 5, // Zoom closer if location exists
      center: initialCenter
    })

    const marker = new window.google.maps.Marker({
      position: initialCenter,
      map,
      draggable: true
    })

    marker.addListener('dragend', () => {
      const pos = marker.getPosition()
      const lat = pos.lat().toFixed(6)
      const lng = pos.lng().toFixed(6)
      const newPlaceName = `Custom Location (${lat}, ${lng})`;
      if (inputRef.current) inputRef.current.value = newPlaceName; // Update input field
      updateLocation(lat, lng, { placeName: newPlaceName }) // Update state
    })

    markerRef.current = marker

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: [], // Use 'geocode' for addresses
        fields: ['geometry', 'name', 'formatted_address', 'address_components'], // Request name, formatted_address, and address_components
        componentRestrictions: { country: 'in' } // Restrict to India
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()

        // DEBUG: Log the full place object and its address components from Autocomplete
        console.log("DEBUG: Autocomplete Place Object:", place);
        console.log("DEBUG: Autocomplete Address Components (raw):", place.address_components);

        if (!place.geometry || !place.geometry.location) {
          console.warn("⚠️ Place has no geometry.");
          alert("Selected place has no valid location. Please try a different search.");
          return;
        }

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const placeName = place.name || place.formatted_address || `Selected Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;

        const extracted = extractAddressComponents(place.address_components)

        // DEBUG: Log the extracted result from autocomplete
        console.log("DEBUG: Extracted from Autocomplete by extractAddressComponents:", extracted);


        if (inputRef.current) inputRef.current.value = placeName; // Update input field
        updateLocation(lat, lng, {
          placeName: placeName,
          address: place.formatted_address || '', // Full formatted address string
          ...extracted // Pass all extracted address components (country, state, city, area, pincode)
        })

        // DEBUG: Log locationFormData after update (might show previous state on same render cycle)
        console.log("DEBUG: locationFormData AFTER updateLocation (check next render):", locationFormData);
      })
    }
  }, [isMapLoaded]) // Removed googleMapData from dependency array to prevent re-initializing map on every change

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy='afterInteractive'
        onLoad={() => setIsMapLoaded(true)}
      />

      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Update Business Location on Google Map</Typography>
            {/* Search Location */}
            <TextField
              inputRef={inputRef}
              label='Search Location'
              placeholder='Enter a place name or address'
              fullWidth
            // The value will be set by the useEffect or autocomplete listener
            // defaultValue={locationFormData.address || ''} // This is good for initial load
            />

            {selectedLocationName && (
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Selected: <strong>{selectedLocationName}</strong>
              </Typography>
            )}

            {/* Map */}
            <Box
              ref={mapRef}
              sx={{
                height: 300,
                width: '100%',
                borderRadius: 2,
                border: '1px solid #ccc'
              }}
            />

            {/* Latitude and Longitude */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Latitude'
                value={googleMapData.latitude || ''}
                disabled
                // error={!!googleMapErrors.latitude}
                // helperText={googleMapErrors.latitude}
                fullWidth
              />
              <TextField
                label='Longitude'
                value={googleMapData.longitude || ''}
                disabled
                // error={!!googleMapErrors.longitude}
                // helperText={googleMapErrors.longitude}
                fullWidth
              />
            </Stack>

            {/* Displayed Location Details (Read-only) */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Location Details</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label='Country' value={locationFormData.country || ''} disabled fullWidth />
              <TextField label='State' value={locationFormData.state || ''} disabled fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label='City' value={locationFormData.city || ''} disabled fullWidth />
              <TextField label='Area' value={locationFormData.area || ''} disabled fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label='Pincode' value={locationFormData.pincode || ''} disabled fullWidth />
              <TextField label='Address' value={locationFormData.address || ''} disabled fullWidth />
            </Stack>


            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={handleUseCurrentLocation}>
                Use Current Location
              </Button>
              {/* <Button variant='contained' type='submit'>
                Save & Next
              </Button> */}
            </Stack>
          </Stack>
        </Paper>
      </form>
    </>
  )
}

export default GoogleMapLocation
