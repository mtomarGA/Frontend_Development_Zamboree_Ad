'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'
import { TextField, Button, Box, Grid } from '@mui/material'

const LIBRARIES = ['places']

const containerStyle = {
    width: '100%',
    height: '400px'
}

export default function GoogleMapLocation({ onSelect, latitude, longitude, Editlat, Editlong }) {
    const [input, setInput] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const autocompleteRef = useRef(null)
    const mapRef = useRef(null)

    const defaultCenter = {
        lat: Number(latitude) || Number(Editlat) || 20.5937,
        lng: Number(longitude) || Number(Editlong) || 78.9629 // India center by default
    }

    // 🧭 Preload marker for edit form
    useEffect(() => {
        if (Editlat && Editlong) {
            const location = { lat: Number(Editlat), lng: Number(Editlong) }
            setSelectedLocation(location)
            if (mapRef.current) {
                mapRef.current.panTo(location)
                mapRef.current.setZoom(15)
            }
        } else if (latitude && longitude) {
            const location = { lat: Number(latitude), lng: Number(longitude) }
            setSelectedLocation(location)
            if (mapRef.current) {
                mapRef.current.panTo(location)
                mapRef.current.setZoom(15)
            }
        }
    }, [latitude, longitude, Editlat, Editlong])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES
    })

    const handleLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    // 🔹 Utility to extract city name from Google Maps address components
    const extractCity = (addressComponents) => {
        if (!addressComponents) return ''
        const cityComp =
            addressComponents.find((c) =>
                c.types.includes('locality')
            ) ||
            addressComponents.find((c) =>
                c.types.includes('administrative_area_level_2')
            ) ||
            addressComponents.find((c) =>
                c.types.includes('administrative_area_level_1')
            )
        return cityComp?.long_name || ''
    }

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace()
        if (!place.geometry) return

        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name || '',
            address: place.formatted_address || '',
            city: extractCity(place.address_components)
        }

        setInput(location.address || location.name)
        setSelectedLocation({ lat: location.lat, lng: location.lng })

        if (mapRef.current) {
            mapRef.current.panTo(location)
            mapRef.current.setZoom(15)
        }

        onSelect?.(location)
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }

                    setSelectedLocation(location)

                    if (mapRef.current) {
                        mapRef.current.panTo(location)
                        mapRef.current.setZoom(15)
                    }

                    const geocoder = new window.google.maps.Geocoder()
                    geocoder.geocode({ location }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            const city = extractCity(results[0].address_components)
                            setInput(results[0].formatted_address)
                            onSelect?.({
                                ...location,
                                address: results[0].formatted_address,
                                name: results[0].name || '',
                                city
                            })
                        } else {
                            onSelect?.(location)
                        }
                    })
                },
                (err) => {
                    console.error('Geolocation error', err)
                    alert('Failed to fetch your location')
                }
            )
        } else {
            alert('Geolocation not supported by your browser')
        }
    }

    const onMapClick = (e) => {
        const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }

        setSelectedLocation(location)

        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const city = extractCity(results[0].address_components)
                setInput(results[0].formatted_address)
                onSelect?.({
                    ...location,
                    address: results[0].formatted_address,
                    name: results[0].name || '',
                    city
                })
            } else {
                onSelect?.(location)
            }
        })
    }

    const onLoad = useCallback((map) => {
        mapRef.current = map
        // If edit values are provided, center and zoom to that location
        if (Editlat && Editlong) {
            const location = { lat: Number(Editlat), lng: Number(Editlong) }
            map.panTo(location)
            map.setZoom(15)
            setSelectedLocation(location)
        } else if (latitude && longitude) {
            const location = { lat: Number(latitude), lng: Number(longitude) }
            map.panTo(location)
            map.setZoom(15)
            setSelectedLocation(location)
        } else {
            const bounds = new window.google.maps.LatLngBounds(defaultCenter)
            map.fitBounds(bounds)
        }
    }, [Editlat, Editlong, latitude, longitude, defaultCenter])

    const onUnmount = useCallback(() => {
        mapRef.current = null
    }, [])

    if (!isLoaded) return <p>Loading…</p>

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    {/* Autocomplete Field */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
                            <TextField
                                label="Search Location"
                                variant="outlined"
                                fullWidth
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                size="small"
                            />
                        </Autocomplete>
                    </Grid>

                    {/* Button */}
                    <Grid item xs={12} md={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleCurrentLocation}
                            sx={{ height: '40px' }}
                        >
                            Use Current Location
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedLocation || defaultCenter}
                zoom={selectedLocation ? 15 : 5}
                onClick={onMapClick}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
        </>
    )
}
