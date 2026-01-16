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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Grid } from '@mui/system';
import CustomTextField from '@/@core/components/mui/TextField';

const GoogleMapLocation = ({ userData, setUserData }) => {

    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const autocompleteRef = useRef(null)
    const inputRef = useRef(null)

    const [isMapLoaded, setIsMapLoaded] = useState(userData)
    const [searchValue, setSearchValue] = useState('')
    // const [predictions, setPredictions] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null)


    const updateLocation = (latitude, longitude) => {
        setUserData(prev => ({
            ...prev,
            latitude,
            longitude
        }))


        const newPosition = new window.google.maps.LatLng(latitude, longitude)
        if (markerRef.current) {
            markerRef.current.setPosition(newPosition)
            markerRef.current.getMap().panTo(newPosition)
        }
    }

    useEffect(() => {
        if (!isMapLoaded || typeof window.google === 'undefined') return

        const lat = parseFloat(userData.latitude) || 28.6139
        const lng = parseFloat(userData.longitude) || 77.2090
        const center = { lat, lng }

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center
        })

        const marker = new window.google.maps.Marker({
            position: center,
            map,
            draggable: true
        })

        marker.addListener('dragend', async () => {
            const pos = marker.getPosition()
            const lat = pos.lat().toFixed(6)
            const lng = pos.lng().toFixed(6)

            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({
                location: { lat: parseFloat(lat), lng: parseFloat(lng) }
            })
            const address = results[0]?.formatted_address || ''

            setSearchValue(address)
            updateLocation(lat, lng, address)
        })

        markerRef.current = marker

        if (inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                fields: ['geometry', 'formatted_address', 'name'],
                componentRestrictions: { country: 'in' }
            })

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace()
                if (place.geometry) {
                    const lat = place.geometry.location.lat().toFixed(6)
                    const lng = place.geometry.location.lng().toFixed(6)
                    const address = place.formatted_address || ''
                    const name = place.name || ''

                    setUserData(prev => ({
                        ...prev,
                        name,
                        latitude: lat,
                        longitude: lng,
                    }))

                    setSearchValue(address)
                    updateLocation(lat, lng, address)
                }
            })

        }
    }, [isMapLoaded, userData])

    // const handleSearchChange = (e) => {
    //     const value = e.target.value
    //     setSearchValue(value)
    //     setUserData(prev => ({
    //         ...prev,
    //         location: value,
    //     }))

    //     if (!value || !window.google) {
    //         setPredictions([])
    //         return
    //     }

    //     const service = new window.google.maps.places.AutocompleteService()
    //     service.getPlacePredictions({ input: value }, (preds, status) => {
    //         if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
    //             setPredictions(preds)
    //         } else {
    //             setPredictions([])
    //         }
    //     })
    // }

    // const handlePredictionClick = (placeId) => {
    //     const service = new window.google.maps.places.PlacesService(mapRef.current)
    //     service.getDetails({ placeId }, (place, status) => {
    //         if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
    //             const lat = place.geometry.location.lat().toFixed(6)
    //             const lng = place.geometry.location.lng().toFixed(6)
    //             const address = place.formatted_address

    //             setUserData(prev => ({
    //                 ...prev,
    //                 name: place.name,
    //                 latitude: lat,
    //                 longitude: lng,
    //             }))

    //             setSearchValue(address)
    //             setPredictions([])
    //             updateLocation(lat, lng, address)
    //         }
    //     })
    // }


    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy='afterInteractive'
                onLoad={() => setIsMapLoaded(true)}
            />


            <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                    <CustomTextField
                        inputRef={inputRef}
                        label='Search Location'
                        placeholder='Enter a place name or address'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        fullWidth
                        inputProps={{
                            autoComplete: 'off',
                            spellCheck: false
                        }}
                    />
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{ mt: 2 }}>
                <Grid container spacing={4} className='my-6 w-full'>

                    {/* {predictions.length > 0 && (
                        <Box
                            sx={{
                                mt: 1,
                                maxHeight: 200,
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                width: '100%'
                            }}
                        >
                            {predictions.map(pred => (
                                <Box
                                    key={pred.place_id}
                                    onClick={() => handlePredictionClick(pred.place_id)}
                                    sx={{
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderBottom: '1px solid #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    <LocationOnIcon sx={{ marginRight: '8px', color: 'red' }} />
                                    {pred.description}
                                </Box>
                            ))}
                        </Box>

                    )} */}
                </Grid>

                <Stack spacing={3} className='flex md:flex-row flex-col'>
                    <Box
                        ref={mapRef}
                        sx={{
                            height: 150,
                            width: '100%',
                            borderRadius: 2,
                            border: '1px solid #ccc',
                        }}
                    />

                    <Stack spacing={2} width={{ xs: '100%', sm: '50%' }} className='md:ml-5'>
                        <CustomTextField
                            label='Latitude'
                            disabled
                            value={userData.latitude}
                            fullWidth
                        />
                        <CustomTextField
                            label='Longitude'
                            disabled
                            value={userData.longitude}
                            fullWidth
                        />
                    </Stack>
                </Stack>
            </Paper>
        </>
    )
}

export default GoogleMapLocation
