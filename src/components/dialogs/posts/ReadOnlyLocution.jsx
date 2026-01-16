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
const ReadGoogleMapLocation = ({ setFormData, googleMapData, EditSelectedPost, formData, errors }) => {


    console.log(formData,'sasasasasa')


    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const autocompleteRef = useRef(null)
    const inputRef = useRef(null)
    const [isMapLoaded, setIsMapLoaded] = useState({ googleMapData })
    const [searchValue, setSearchValue] = useState(formData.locution)
    const [predictions, setPredictions] = useState([])


    const updateLocation = (latitude, longitude, address = '') => {
        setFormData(prev => ({
            ...prev,
            latCoordinage: latitude,
            langCoordinagee: longitude,
            locution: address,
            location: address
        }))

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

            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({
                location: { lat: parseFloat(lat), lng: parseFloat(lng) }
            })
            const address = results[0]?.formatted_address || ''

            setSearchValue(address)
            setFormData(prev => ({
                ...prev,
                locution: address
            }))
            updateLocation(lat, lng, address)
        })
    }

    useEffect(() => {
        if (!googleMapData || typeof window.google === 'undefined') return

        const center = {
            lat: parseFloat(googleMapData.latitude) || 28.6139,
            lng: parseFloat(googleMapData.longitude) || 77.2090
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

        marker.addListener('dragend', async () => {
            const pos = marker.getPosition()
            const lat = pos.lat().toFixed(6)
            const lng = pos.lng().toFixed(6)
            draggable = false
            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({
                location: { lat: parseFloat(lat), lng: parseFloat(lng) }
            })
            const address = results[0]?.formatted_address || ''

            setSearchValue(address)
            updateLocation(lat, lng, address)
        })

        markerRef.current = marker

        // Setup Google Autocomplete
        if (inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                fields: ['geometry', 'formatted_address'],
            })

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace()
                if (place.geometry) {
                    const lat = place.geometry.location.lat().toFixed(6)
                    const lng = place.geometry.location.lng().toFixed(6)
                    const address = place.formatted_address || ''

                    setSearchValue(address) // Set input value
                    updateLocation(lat, lng, address)
                }
            })
        }
    }, [isMapLoaded, searchValue])


    useEffect(() => {
        if (!isMapLoaded || !markerRef.current || typeof window.google === 'undefined') return;

        const lat = parseFloat(googleMapData.latitude)
        const lng = parseFloat(googleMapData.longitude)

        if (isNaN(lat) || isNaN(lng)) return;

        const newPosition = new window.google.maps.LatLng(lat, lng)

        // Move marker smoothly
        markerRef.current.setPosition(newPosition)

        // Smoothly pan the map
        markerRef.current.getMap().panTo(newPosition)
    }, [googleMapData.latitude, googleMapData.longitude, isMapLoaded])



    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchValue(value)
        setFormData(prev => ({
            ...prev,
            locution: value,
        }))


        if (!value || !window.google) {
            setPredictions([])
            return
        }

        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions({ input: value }, (preds, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
                setPredictions(preds)
            } else {
                setPredictions([])
            }
        })
    }


    const handlePredictionClick = (placeId) => {
        const service = new window.google.maps.places.PlacesService(mapRef.current)

        service.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                const lat = place.geometry.location.lat().toFixed(6)
                const lng = place.geometry.location.lng().toFixed(6)
                const address = place.formatted_address

                setSearchValue(address)
                setPredictions([]) // clear suggestions

                updateLocation(lat, lng, address)
            }
        })
    }


    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy='afterInteractive'
                onLoad={() => setIsMapLoaded(true)}
            />

            <Paper elevation={0} sx={{ mt: 2 }}>
                <Grid container spacing={4} className='my-6  w-full' alignItems="between">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            inputRef={inputRef}
                            label='Search Location'
                            placeholder='Enter a place name or address'
                            disabled
                            value={formData.locution}
                            onChange={handleSearchChange}
                            fullWidth
                            inputProps={{
                                autoComplete: 'off',
                                spellCheck: false
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Visibility Radius (in KM)"
                            disabled
                            placeholder="Enter radius in KM"
                            value={formData.locutionkm}
                            onChange={e => setFormData({ ...formData, locutionkm: e.target.value })}
                            error={!!errors.locutionkm}
                            helperText={errors.locutionkm}
                        />
                    </Grid>

                    {/* Show predictions in a table */}
                    {predictions.length > 0 && (
                        <Box sx={{ mt: 1, maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 1, width: '100%' }}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    {predictions.map(pred => (
                                        <tr
                                            key={pred.place_id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handlePredictionClick(pred.place_id)}
                                        >
                                            <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', textAlign: 'start' }}>
                                                    <LocationOnIcon sx={{ marginRight: '8px', color: 'red' }} />
                                                    {pred.description}
                                                </Box>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Grid>
                <Stack spacing={3} className='flex md:flex-row flex-col  ' disabled>
                    {/* Map */}
                    <Box
                        ref={mapRef}
                        sx={{
                            height: 200,
                            width: '100%',
                            borderRadius: 2,
                            border: '1px solid #ccc',
                        }}
                    />

                    {/* Form */}
                    <Stack spacing={2} width={{ xs: '100%', sm: '50%' }} disabled className='md:ml-5'>
                        {/* Search Input */}

                        <TextField
                            label='Latitude'
                            disabled
                            value={formData.latCoordinate ||formData?.latCoordinage|| ''}
                            fullWidth
                        />
                        <TextField
                            label='Longitude'
                            disabled
                            value={formData.langCoordinate ||formData?.langCoordinagee|| ''}
                            fullWidth
                        />
                        <Button variant='contained' disabled onClick={handleUseCurrentLocation}>
                            Use Current Location
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </>
    )
}

export default ReadGoogleMapLocation
