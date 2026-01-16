'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack
} from '@mui/material'
import { useTempleContext } from '@/contexts/TempleFormContext'
import CustomTextField from '@/@core/components/mui/TextField'
import { input } from '@material-tailwind/react'

const GoogleMapLocation = ({ address, coordinates, handleChange, errors }) => {



  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)


  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder()
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address)
        } else {
          reject('Geocoding failed')
        }
      })
    })
  }


  const updateLocation = (latitude, longitude) => {
    handleChange('latitude', latitude)
    handleChange('longitude', longitude)

    const newPosition = new window.google.maps.LatLng(latitude, longitude)
    if (markerRef.current) {
      markerRef.current.setPosition(newPosition)
      markerRef.current.getMap().panTo(newPosition)
    }
  }

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude.toFixed(6)
      const lng = position.coords.longitude.toFixed(6)

      updateLocation(lat, lng)

      try {
        const address = await reverseGeocode(lat, lng)
        if (inputRef.current) {
          inputRef.current.value = address
          handleChange('address', address)
        }
      } catch (error) {
        console.error('Failed to get address:', error)
      }
    })
  }


  useEffect(() => {
    if (window.google) setIsMapLoaded(true)
  }, [])

  useEffect(() => {
    if (!isMapLoaded || typeof window.google === 'undefined') return

    const center = {
      lat: parseFloat(coordinates.latitude) || 40.7128,
      lng: parseFloat(coordinates.longitude) || -74.006
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
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
      updateLocation(lat, lng)
      reverseGeocode(lat, lng)
        .then(address => {
          if (inputRef.current) {
            inputRef.current.value = address
          }
        })
        .catch(error => console.error('Failed to get address:', error))
    })

    markerRef.current = marker

    // Initialize Places Autocomplete
    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'in' }
      })
      autocompleteRef.current.setFields(['geometry', 'formatted_address'])

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()

        if (place && place.geometry) {
          const lat = place.geometry.location.lat().toFixed(6)
          const lng = place.geometry.location.lng().toFixed(6)
          updateLocation(lat, lng)

          const formattedAddress = place.formatted_address || inputRef.current?.value
          console.log('Selected Address:', formattedAddress)
          console.log('Place Details:', place)

          if (formattedAddress) {
            handleChange('address', formattedAddress)
          }
        }
      })

    }
  }, [isMapLoaded])

  useEffect(() => {
    if (!isMapLoaded || !markerRef.current || typeof window.google === 'undefined') return;

    const lat = parseFloat(coordinates.latitude)
    const lng = parseFloat(coordinates.longitude)

    if (isNaN(lat) || isNaN(lng)) return;

    const newPosition = new window.google.maps.LatLng(lat, lng)

    // Move marker smoothly
    markerRef.current.setPosition(newPosition)

    // Smoothly pan the map
    markerRef.current.getMap().panTo(newPosition)
  }, [coordinates.latitude, coordinates.longitude, isMapLoaded])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy='afterInteractive'
        onLoad={() => setIsMapLoaded(true)}
      />

      <Paper elevation={2} sx={{ p: 0, mt: 2 }} >
        <CustomTextField
          inputRef={inputRef}
          value={address}
          onChange={e => handleChange('address', e.target.value)}
          label='Search Location'
          placeholder='Enter a place name or address'
          fullWidth
          className='mb-4'
          error={!!errors.address}
          helperText={errors.address}
        />
        <Stack spacing={3} className='flex md:flex-row flex-col m-2'>
          {/* Google Map */}
          <Box
            ref={mapRef}
            sx={{
              height: 200,
              width: '100%',
              borderRadius: 2,
              border: '1px solid #ccc',
            }}
          />
          {/* Location Fields */}
          <Stack spacing={2} width={{ xs: '100%', sm: '50%' }} className='md:ml-5'>
            <CustomTextField
              label='Latitude'
              disabled
              value={coordinates.latitude}
              error={!!errors.latitude}
              helperText={errors.latitude}
              placeholder='Not Available'
              fullWidth
            />
            <CustomTextField
              label='Longitude'
              disabled
              value={coordinates.longitude}
              error={!!errors.longitude}
              helperText={errors.longitude}
              placeholder='Not Available'
              fullWidth
            />
            <Button variant='contained' onClick={handleUseCurrentLocation}>
              Use Current Location
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export default GoogleMapLocation
