'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Button, Paper, Stack } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { Grid } from '@mui/system'

const GoogleAddressMapLocation = ({ setFormData, googleMapData, addressLine1 }) => {
    // console.log(addressLine1, "addressLine1addressLine1addressLine1");

    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const autocompleteRef = useRef(null)
    const inputRef = useRef(null)
    const [searchValue, setSearchValue] = useState('')

    const getAddressComponents = components => {
        const result = {
            addressLine1: addressLine1 || '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        };

        components.forEach(component => {
            if (component.types.includes('route')) result.addressLine1 += component.long_name + ' ';
            if (component.types.includes('street_number')) result.addressLine1 += component.long_name;
            if (component.types.includes('locality')) result.city = component.long_name;
            if (component.types.includes('administrative_area_level_1')) result.state = component.long_name;
            if (component.types.includes('postal_code')) result.zipCode = component.long_name;
            if (component.types.includes('country')) result.country = component.long_name;
        });

        return result;
    };

    const updateLocation = (lat, lng, address, components) => {
        const parsed = getAddressComponents(components || [])
        setFormData(prev => ({
            ...prev,
            addressLine1: address || addressLine1,
            city: parsed.city,
            state: parsed.state,
            zipCode: parsed.zipCode,
            country: parsed.country,
            latitude: lat,
            longitude: lng
        }))

        const newPos = new window.google.maps.LatLng(lat, lng)
        if (markerRef.current) {
            markerRef.current.setPosition(newPos)
            markerRef.current.getMap().panTo(newPos)
        }
    }

    const handleUseCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude

            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({ location: { lat, lng } })
            const address = results[0]?.formatted_address || ''
            setSearchValue(address)

            updateLocation(lat, lng, address, results[0].address_components)
        })
    }

    useEffect(() => {
        if (typeof window.google === 'undefined') return

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
            const lat = pos.lat()
            const lng = pos.lng()

            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({ location: { lat, lng } })
            const address = results[0]?.formatted_address || ''
            setSearchValue(address)
            updateLocation(lat, lng, address, results[0].address_components)
        })

        markerRef.current = marker

        if (inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current)
            autocomplete.setFields(['geometry', 'formatted_address', 'address_components'])

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (!place.geometry) return

                const lat = place.geometry.location.lat()
                const lng = place.geometry.location.lng()
                const address = place.formatted_address
                setSearchValue(address)

                updateLocation(lat, lng, address, place.address_components)
            })

            autocompleteRef.current = autocomplete
        }
    }, [googleMapData])
    useEffect(() => {
        if (addressLine1) {
            setSearchValue(addressLine1);
        }
    }, [addressLine1]);

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy='afterInteractive'
            />
            <Paper elevation={0} sx={{ mt: 2 }} >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            inputRef={inputRef}
                            label='Choose Location'
                            placeholder='Enter a place name or address'
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }} >
                        <Button variant='contained' className='mt-5' onClick={handleUseCurrentLocation} fullWidth>
                            Use Current Location
                        </Button>
                    </Grid>
                </Grid>

                <div ref={mapRef} hidden style={{ width: '100%', height: '300px', marginTop: '20px' }} />
            </Paper>
        </>
    )
}

export default GoogleAddressMapLocation
