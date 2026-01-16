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
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

const GoogleMapLocation = ({ nextHandle }) => {
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)
  const geocoderRef = useRef(null); // ADDED: Ref for the Google Maps Geocoder

  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null) // Renamed from selectedLocationName for clarity with "business" focus

  const {
    googleMapData,
    locationFormData,
    handleGoogleMapChange,
    handleLocationChange,
    googleMapErrors,
    validateGoogleMap
  } = useAddListingFormContext()

  // CORRECTED: Standard and functional Google Maps URL
  const generateGoogleMapsUrl = (lat, lng) =>
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const updateLocation = (lat, lng, businessInfo = {}) => {
    const latitude = parseFloat(lat).toFixed(6)
    const longitude = parseFloat(lng).toFixed(6)

    handleGoogleMapChange({
      latitude,
      longitude,
      google_map_url: generateGoogleMapsUrl(latitude, longitude),
    })

    // This handles updating locationFormData with any details passed in businessInfo
    handleLocationChange({
      address: businessInfo.address || '',
      country: businessInfo.country || '',
      state: businessInfo.state || '',
      city: businessInfo.city || '',
      area: businessInfo.area || '',
      pincode: businessInfo.pincode || '',
    })

    // Update the selected business/location name for display
    setSelectedBusiness(businessInfo.placeName || `Custom Location (${latitude}, ${longitude})`);


    const newPosition = new window.google.maps.LatLng(latitude, longitude)
    if (markerRef.current) {
      markerRef.current.setPosition(newPosition)
      markerRef.current.getMap().setZoom(15)
      markerRef.current.getMap().panTo(newPosition)
    }
  }

  const extractAddressComponents = (components = []) => {
    const result = {
      country: '',
      state: '',
      city: '',
      area: '',
      pincode: ''
    }

    for (const component of components) {
      const types = component.types
      if (types.includes('country')) result.country = component.long_name
      if (types.includes('administrative_area_level_1')) result.state = component.long_name
      if (types.includes('locality')) result.city = component.long_name
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) result.area = component.long_name
      if (types.includes('postal_code')) result.pincode = component.long_name
    }

    return result
  }

  // MODIFIED: handleUseCurrentLocation to perform reverse geocoding
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) { // Check if browser supports geolocation
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)

        // Ensure input field is updated to show 'My Current Location' while geocoding happens
        if (inputRef.current) inputRef.current.value = 'My Current Location';

        // Perform reverse geocoding to get address details
        if (geocoderRef.current) { // Ensure geocoder is initialized
          const latLng = new window.google.maps.LatLng(parseFloat(lat), parseFloat(lng));

          geocoderRef.current.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const place = results[0]; // Get the most relevant result
              const placeName = place.formatted_address || `My Current Location (${lat}, ${lng})`;
              const extracted = extractAddressComponents(place.address_components);

              updateLocation(lat, lng, {
                placeName: placeName, // Use the formatted address as placeName
                address: place.formatted_address || '',
                ...extracted // Spread the extracted components
              });
            } else {
              console.error("Geocoder failed for current location due to: " + status);
              // Fallback: If geocoding fails, still update with just lat/lng and a generic name
              updateLocation(lat, lng, { placeName: 'My Current Location' });
            }
          });
        } else {
          // Fallback if geocoder is not ready (unlikely if useEffect works)
          console.warn("Geocoder not initialized when trying to get current location address.");
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
    nextHandle?.({ googleMapData, locationFormData })
  }

  useEffect(() => {
    if (window.google) setIsMapLoaded(true)
  }, [])

  useEffect(() => {
    if (!isMapLoaded || typeof window.google === 'undefined') return

    // ADDED: Initialize Geocoder here, once Google Maps API is loaded
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    const center = {
      lat: parseFloat(googleMapData.latitude) || 20.5937, // Default to India's center
      lng: parseFloat(googleMapData.longitude) || 78.9629  // Default to India's center
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 5,
      center
    })

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable: true
    })

    marker.addListener('dragend', () => {
      const pos = marker.getPosition()
      const lat = pos.lat().toFixed(6)
      const lng = pos.lng().toFixed(6)

      // When dragging, you might want to reverse geocode too or just show coords
      if (geocoderRef.current) {
        const latLng = new window.google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        geocoderRef.current.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const place = results[0];
            const placeName = place.formatted_address || `Custom Location (${lat}, ${lng})`;
            const extracted = extractAddressComponents(place.address_components);
            if (inputRef.current) inputRef.current.value = placeName;
            updateLocation(lat, lng, { placeName: placeName, address: place.formatted_address || '', ...extracted });
          } else {
            const newPlaceName = `Custom Location (${lat}, ${lng})`;
            if (inputRef.current) inputRef.current.value = newPlaceName;
            updateLocation(lat, lng, { placeName: newPlaceName });
          }
        });
      } else {
        const newPlaceName = `Custom Location (${lat}, ${lng})`;
        if (inputRef.current) inputRef.current.value = newPlaceName;
        updateLocation(lat, lng, { placeName: newPlaceName });
      }
    })

    markerRef.current = marker

    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        // IMPORTANT: Changed 'types' to 'geocode' or left flexible for addresses.
        // 'establishment' typically limits to businesses, not general addresses.
        // If you specifically want businesses AND their full addresses, 'establishment' might exclude some address details.
        // For broad address search, 'geocode' is better.
        types: [], // Changed from 'establishment' to 'geocode' for broader address results
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
        componentRestrictions: { country: 'in' }
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()

        if (!place.geometry || !place.geometry.location) {
          console.warn("⚠️ Place has no geometry.")
          return
        }

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        const extracted = extractAddressComponents(place.address_components)

        // Use place.name for selectedBusiness if available, fallback to formatted_address
        const placeNameForDisplay = place.name || place.formatted_address || `Selected Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;

        updateLocation(lat, lng, {
          placeName: placeNameForDisplay, // Pass placeName to updateLocation for setSelectedBusiness
          address: place.formatted_address || '',
          ...extracted
        })
      })
    }
  }, [isMapLoaded]) // No need to re-initialize map on every googleMapData change

  // Optional: Set initial selectedBusiness name if data exists on mount
  useEffect(() => {
    if (locationFormData.address) {
      setSelectedBusiness(locationFormData.address);
      if (inputRef.current) {
        inputRef.current.value = locationFormData.address;
      }
    } else if (googleMapData.latitude && googleMapData.longitude) {
      setSelectedBusiness(`Current Coordinates: (${googleMapData.latitude}, ${googleMapData.longitude})`);
    }
  }, [locationFormData.address, googleMapData.latitude, googleMapData.longitude]);


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
            <Typography variant="h6">Find Your Business on Google</Typography>
            <TextField
              inputRef={inputRef}
              label='Search for a Business'
              placeholder='Enter your business name and address'
              fullWidth
            />

            {selectedBusiness && (
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Selected: <strong>{selectedBusiness}</strong>
              </Typography>
            )}

            <Box
              ref={mapRef}
              sx={{ height: 300, width: '100%', borderRadius: 2, border: '1px solid #ccc' }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Latitude'
                value={googleMapData.latitude || ''}
                disabled
                error={!!googleMapErrors.latitude}
                helperText={googleMapErrors.latitude}
                fullWidth
              />
              <TextField
                label='Longitude'
                value={googleMapData.longitude || ''}
                disabled
                error={!!googleMapErrors.longitude}
                helperText={googleMapErrors.longitude}
                fullWidth
              />
            </Stack>

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

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <Button variant='outlined' onClick={handleUseCurrentLocation}>
                Use Current Location
              </Button>
              {/* If you uncommented this, ensure `nextHandle` is passed and `handleSubmit` works */}
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

// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import Script from 'next/script'
// import {
//   Box,
//   Button,
//   TextField,
//   Paper,
//   Stack,
//   Typography
// } from '@mui/material'
// import { useAddListingFormContext } from '@/hooks/useAddListingForm'

// const GoogleMapLocation = ({ nextHandle }) => {
//   const mapRef = useRef(null)
//   const markerRef = useRef(null)
//   const autocompleteRef = useRef(null)
//   const inputRef = useRef(null)

//   const [isMapLoaded, setIsMapLoaded] = useState(false)
//   const [selectedBusiness, setSelectedBusiness] = useState(null)

//   const {
//     googleMapData,
//     locationFormData,
//     handleGoogleMapChange,
//     handleLocationChange,
//     googleMapErrors,
//     validateGoogleMap
//   } = useAddListingFormContext()
//   console.log(locationFormData, "locationFormData locationFormData");

//   const generateGoogleMapsUrl = (lat, lng) =>
//     `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

//   const updateLocation = (lat, lng, businessInfo = {}) => {
//     const latitude = parseFloat(lat).toFixed(6)
//     const longitude = parseFloat(lng).toFixed(6)

//     handleGoogleMapChange({
//       latitude,
//       longitude,
//       google_map_url: generateGoogleMapsUrl(latitude, longitude),
//     })

//     handleLocationChange({
//       address: businessInfo.address || '',
//       country: businessInfo.country || '',
//       state: businessInfo.state || '',
//       city: businessInfo.city || '',
//       area: businessInfo.area || '',
//       pincode: businessInfo.pincode || '',
//     })

//     const newPosition = new window.google.maps.LatLng(latitude, longitude)
//     if (markerRef.current) {
//       markerRef.current.setPosition(newPosition)
//       markerRef.current.getMap().setZoom(15)
//       markerRef.current.getMap().panTo(newPosition)
//     }
//   }

//   const extractAddressComponents = (components = []) => {
//     const result = {
//       country: '',
//       state: '',
//       city: '',
//       area: '',
//       pincode: ''
//     }

//     for (const component of components) {
//       const types = component.types
//       if (types.includes('country')) result.country = component.long_name
//       if (types.includes('administrative_area_level_1')) result.state = component.long_name
//       if (types.includes('locality')) result.city = component.long_name
//       if (types.includes('sublocality') || types.includes('sublocality_level_1')) result.area = component.long_name
//       if (types.includes('postal_code')) result.pincode = component.long_name
//     }

//     return result
//   }

//   const handleUseCurrentLocation = () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const lat = position.coords.latitude.toFixed(6)
//       const lng = position.coords.longitude.toFixed(6)
//       if (inputRef.current) inputRef.current.value = 'My Current Location'
//       updateLocation(lat, lng, {
//         address: '',
//         country: '',
//         state: '',
//         city: '',
//         area: '',
//         pincode: ''
//       })
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (!validateGoogleMap()) return
//     nextHandle?.({ googleMapData, locationFormData })
//   }

//   useEffect(() => {
//     if (window.google) setIsMapLoaded(true)
//   }, [])

//   useEffect(() => {
//     if (!isMapLoaded || typeof window.google === 'undefined') return

//     const center = {
//       lat: parseFloat(googleMapData.latitude) || 20.5937,
//       lng: parseFloat(googleMapData.longitude) || 78.9629
//     }

//     const map = new window.google.maps.Map(mapRef.current, {
//       zoom: 5,
//       center
//     })

//     const marker = new window.google.maps.Marker({
//       position: center,
//       map,
//       draggable: true
//     })

//     marker.addListener('dragend', () => {
//       const pos = marker.getPosition()
//       const lat = pos.lat().toFixed(6)
//       const lng = pos.lng().toFixed(6)
//       if (inputRef.current) inputRef.current.value = `Custom Location (${lat}, ${lng})`
//       updateLocation(lat, lng, {})
//     })

//     markerRef.current = marker

//     if (inputRef.current) {
//       autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
//         types: ['establishment'],
//         fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
//         componentRestrictions: { country: 'in' }
//       })

//       autocompleteRef.current.addListener('place_changed', () => {
//         const place = autocompleteRef.current.getPlace()

//         if (!place.geometry || !place.geometry.location) {
//           console.warn("⚠️ Place has no geometry.")
//           return
//         }

//         const lat = place.geometry.location.lat()
//         const lng = place.geometry.location.lng()

//         const extracted = extractAddressComponents(place.address_components)

//         updateLocation(lat, lng, {
//           address: place.formatted_address || '',
//           ...extracted
//         })

//         setSelectedBusiness(place.name || '')
//       })
//     }
//   }, [isMapLoaded])

//   return (
//     <>
//       <Script
//         src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
//         strategy='afterInteractive'
//         onLoad={() => setIsMapLoaded(true)}
//       />

//       <form onSubmit={handleSubmit}>
//         <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
//           <Stack spacing={2}>
//             <Typography variant="h6">Find Your Business on Google</Typography>
//             <TextField
//               inputRef={inputRef}
//               label='Search for a Business'
//               placeholder='Enter your business name and address'
//               fullWidth
//             />

//             {selectedBusiness && (
//               <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
//                 Selected: <strong>{selectedBusiness}</strong>
//               </Typography>
//             )}

//             <Box
//               ref={mapRef}
//               sx={{ height: 300, width: '100%', borderRadius: 2, border: '1px solid #ccc' }}
//             />

//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <TextField
//                 label='Latitude'
//                 value={googleMapData.latitude || ''}
//                 disabled
//                 error={!!googleMapErrors.latitude}
//                 helperText={googleMapErrors.latitude}
//                 fullWidth
//               />
//               <TextField
//                 label='Longitude'
//                 value={googleMapData.longitude || ''}
//                 disabled
//                 error={!!googleMapErrors.longitude}
//                 helperText={googleMapErrors.longitude}
//                 fullWidth
//               />
//             </Stack>

//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <TextField label='Country' value={locationFormData.country || ''} disabled fullWidth />
//               <TextField label='State' value={locationFormData.state || ''} disabled fullWidth />
//             </Stack>
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <TextField label='City' value={locationFormData.city || ''} disabled fullWidth />
//               <TextField label='Area' value={locationFormData.area || ''} disabled fullWidth />
//             </Stack>
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <TextField label='Pincode' value={locationFormData.pincode || ''} disabled fullWidth />
//               <TextField label='Address' value={locationFormData.address || ''} disabled fullWidth />
//             </Stack>

//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
//               <Button variant='outlined' onClick={handleUseCurrentLocation}>
//                 Use Current Location
//               </Button>
//               {/* <Button variant='contained' type='submit'>
//                 Save & Next
//               </Button> */}
//             </Stack>
//           </Stack>
//         </Paper>
//       </form>
//     </>
//   )
// }

// export default GoogleMapLocation
