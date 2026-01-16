'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import {
    TextField,
    Paper,
    Box,
    Typography,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    CardMedia
} from '@mui/material'
import { debounce } from '@mui/material/utils'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CloseIcon from '@mui/icons-material/Close'
import Script from 'next/script'
import TestService from '@/services/premium-listing/test.service'
import { Grid } from '@mui/system'
import { useRouter, useSearchParams } from 'next/navigation'

/** ----------------- CompanyCard ----------------- */
const CompanyCard = ({ data }) => {
    console.log('CompanyCard data:', data) // Debugging




    return (
        <Card className='shadow-md rounded-2xl bg-white p-4 gap-4'>
            {/* Fixed Listing */}


            {/* Free Listing */}
            {data.map((company, i) => (
               
                <Card
                    key={`free-${i}`}
                    className='flex flex-col sm:flex-row gap-4 p-4 mb-4 w-full'
                >
                    <CardMedia
                        component='img'
                        image={company?.coverImage?.url || company?.basicDetails?.vendor?.coverImage?.url || company?.basicDetails?.vendor?.coverImage?.url || ''}
                        alt={company?.companyInfo?.companyName || 'Company Image'}
                        className='w-full sm:w-44 h-48 sm:h-auto object-contain rounded shadow-sm'
                    />

                    <CardContent className='flex-1 p-0 flex flex-col justify-between'>
                        <Typography variant='h6' className='font-bold'>
                            {company?.companyInfo?.companyName || company?.basicDetails?.vendor?.companyInfo?.companyName || company?.basicDetails?.vendor?.companyInfo?.companyName || 'Company Name'}
                        </Typography>
                        <Typography variant='body1'>
                            Company Id: {company?.vendorId || company?.basicDetails?.vendor?.vendorId || company?.basicDetails?.vendor?.vendorId || 'N/A'}
                        </Typography>
                        <Typography variant='body2'>
                            CEO: {company?.companyInfo?.companyCeo || company?.basicDetails?.vendor?.companyInfo?.companyCeo || company?.basicDetails?.vendor?.companyInfo?.companyCeo || 'N/A'}
                        </Typography>
                        <Box className='flex items-center gap-1 mt-2'>
                            <Chip
                                label='★'
                                className='bg-green-600 text-white font-semibold'
                                size='small'
                            />
                            <Typography variant='body2' className='text-gray-500'>
                                Ratings
                            </Typography>
                        </Box>
                        <Box className='flex items-center gap-1 mt-2'>

                            <Typography variant='body2' className='text-gray-500'>
                                <span className='text-xl text-red-700'>types:</span> {company?.type}
                            </Typography>
                        </Box>
                        {(
                            (company?.googleLocation?.latitude && company?.googleLocation?.longitude || company?.basicDetails?.vendor?.googleLocation?.latitude) ||
                            (company?.basicDetails?.vendor?.googleLocation?.latitude && company?.basicDetails?.vendor?.googleLocation?.longitude || company?.basicDetails?.vendor?.googleLocation?.longitude)
                        ) && (
                                <a
                                    href={`https://www.google.com/maps?q=${company?.googleLocation?.latitude || company?.basicDetails?.vendor?.googleLocation?.latitude || company?.basicDetails?.vendor?.googleLocation?.latitude
                                        },${company?.googleLocation?.longitude || company?.basicDetails?.vendor?.googleLocation?.longitude || company?.basicDetails?.vendor?.googleLocation?.longitude
                                        }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Typography
                                        variant="body2"
                                        className="text-gray-600 break-words text-sm sm:text-base"
                                    >
                                        <LocationOnIcon fontSize="small" />  km •{" "}
                                        {company?.locationInfo?.address ||
                                            company?.basicDetails?.vendor?.locationInfo?.address || company?.basicDetails?.vendor?.locationInfo?.address}
                                        {" • "}
                                        {/* {company?.vendorEstablishYear} Years */}
                                    </Typography>

                                </a>
                            )}

                        <Box className='flex flex-wrap gap-1 mt-2'>
                            {company?.keywords?.map((tag, i) => (
                                <Chip key={i} label={tag} size='small' variant='outlined' />
                            ))}
                        </Box>
                        <Box className="flex flex-wrap gap-2 mt-4">
                            {/* Phone Button */}
                            <Button variant="contained" color="success">
                                {company?.contactInfo?.phoneNo ||
                                    company?.basicDetails?.vendor?.contactInfo?.phoneNo ||
                                    company?.basicDetails?.vendor?.contactInfo?.phoneNo ||
                                    "N/A"}
                            </Button>

                            {/* WhatsApp Button */}
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<WhatsAppIcon />}
                            >
                                {company?.contactInfo?.phoneNo ||
                                    company?.basicDetails?.vendor?.contactInfo?.phoneNo ||
                                    company?.basicDetails?.vendor?.contactInfo?.phoneNo ||
                                    "N/A"}
                            </Button>

                            {/* Best Price Button */}
                            <Button variant="contained" color="primary">
                                Get Best Price
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            ))}
        </Card>
    )
}

/** ----------------- LocationAndBusinessSearch ----------------- */
const LocationAndBusinessSearch = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialAddress = searchParams.get('address')
        ? decodeURIComponent(searchParams.get('address'))
        : ''
    const initialLat = searchParams.get('lat')
        ? parseFloat(searchParams.get('lat'))
        : ''
    const initialLng = searchParams.get('lng')
        ? parseFloat(searchParams.get('lng'))
        : ''

    const [formData, setFormData] = useState({
        locution: initialAddress,
        latitude: initialLat,
        langitude: initialLng,
        businessId: null,
        keywords: ''
    })
    const [searchLocation, setSearchLocation] = useState(initialAddress)

    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const inputRef = useRef(null)
    const [isMapLoaded, setIsMapLoaded] = useState(true)
    const [locationSuggestions, setLocationSuggestions] = useState([])
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const [searchBusiness, setSearchBusiness] = useState('')
    const [businessSuggestions, setBusinessSuggestions] = useState([])
    const [showBusinessDropdown, setShowBusinessDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    // -------- Location search ----------
    const performLocationSearch = useCallback(
        debounce((value) => {
            if (!value || !window.google) return
            const service = new window.google.maps.places.AutocompleteService()
            service.getPlacePredictions(
                { input: value, types: ['(regions)'] },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setLocationSuggestions(predictions)
                        setShowLocationDropdown(predictions.length > 0)
                    } else {
                        setLocationSuggestions([])
                        setShowLocationDropdown(false)
                    }
                }
            )
        }, 400),
        []
    )

    const handleLocationChange = (e) => {
        const val = e.target.value
        setSearchLocation(val)
        performLocationSearch(val)
    }

    const handleLocationSelect = async (item) => {
        setSearchLocation(item.description)
        setFormData((prev) => ({ ...prev, locution: item.description }))
        setShowLocationDropdown(false)

        if (window.google) {
            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({ address: item.description })
            if (results?.[0]?.geometry?.location) {
                const lat = results[0].geometry.location.lat()
                const lng = results[0].geometry.location.lng()

                if (markerRef.current) markerRef.current.setPosition({ lat, lng })
                if (mapRef.current)
                    new window.google.maps.Map(mapRef.current, { center: { lat, lng }, zoom: 12 })

                const newData = {
                    ...formData,
                    locution: item.description,
                    latitude: lat,
                    langitude: lng
                }
                setFormData(newData)

                const params = new URLSearchParams(window.location.search)
                params.set('lat', lat)
                params.set('lng', lng)
                params.set('address', encodeURIComponent(item.description))
                router.replace(`?${params.toString()}`)
            }
        }
    }

    // -------- Business search ----------
    const performBusinessSearch = useCallback(
        debounce(async (value) => {
            if (!value) return
            setLoading(true)
            try {
                const result = await TestService.getTest(value)
                const data = Array.isArray(result?.data) ? result.data : []
                setBusinessSuggestions(data)
                setShowBusinessDropdown(data.length > 0)
            } catch {
                setBusinessSuggestions([])
                setShowBusinessDropdown(false)
            } finally {
                setLoading(false)
            }
        }, 500),
        []
    )

    const handleBusinessChange = (e) => {
        const val = e.target.value
        setSearchBusiness(val)
        performBusinessSearch(val)
    }

    const handleBusinessSelect = (item) => {
        setSearchBusiness(item.name)
        setFormData((prev) => ({ ...prev, keywords: item.name }))
        setShowBusinessDropdown(false)
    }

    // -------- Auto detect location ----------
    useEffect(() => {
        if (!isMapLoaded || !window.google) return

        if (!formData.latitude || !formData.langitude) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const userLat = position.coords.latitude
                    const userLng = position.coords.longitude

                    const geocoder = new window.google.maps.Geocoder()
                    const { results } = await geocoder.geocode({
                        location: { lat: userLat, lng: userLng }
                    })

                    const userAddress = results?.[0]?.formatted_address || ''
                    const countryComponent = results?.[0]?.address_components.find((c) =>
                        c.types.includes('country')
                    )

                    if (countryComponent?.short_name === 'IN') {
                        setFormData({
                            locution: userAddress,
                            latitude: userLat,
                            langitude: userLng,
                            businessId: null
                        })
                        setSearchLocation(userAddress)

                        const params = new URLSearchParams()
                        params.set('lat', userLat)
                        params.set('lng', userLng)
                        params.set('address', encodeURIComponent(userAddress))
                        router.replace(`?${params.toString()}`)
                    }
                })
            }
        }
    }, [isMapLoaded])

    // -------- Fetch listing data ----------
    useEffect(() => {
        const fetchData = async () => {
            if (!formData.latitude || !formData.langitude || !formData.keywords) return
            try {
                const result = await TestService.getAllFixedListing({
                    userLat: formData.latitude,
                    userLng: formData.langitude,
                    keyword: formData.keywords
                })
                console.log(result)
                setData(result?.statusCode?.data || null)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [formData.latitude, formData.langitude, formData.keywords])




    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy='afterInteractive'
                onLoad={() => setIsMapLoaded(true)}
            />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        value={searchBusiness}
                        onChange={handleBusinessChange}
                        placeholder='Search Business / Service'
                        InputProps={{
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={18} />}
                                    <IconButton onClick={() => setSearchBusiness('')}>
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            )
                        }}
                    />
                    {showBusinessDropdown && (
                        <Paper>
                            {businessSuggestions.map((item, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => handleBusinessSelect(item)}
                                    className='p-2 hover:bg-gray-100 cursor-pointer'
                                >
                                    <Typography>{item.name}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        inputRef={inputRef}
                        value={searchLocation}
                        onChange={handleLocationChange}
                        placeholder='Search Location'
                    />
                    {showLocationDropdown && (
                        <Paper>
                            {locationSuggestions.map((item, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => handleLocationSelect(item)}
                                    className='p-2 hover:bg-gray-100 cursor-pointer'
                                >
                                    <Typography>{item.description}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Grid>
            </Grid>

            {/* Render CompanyCard with results */}
            <Box className='mt-6'>
                {data ? <CompanyCard data={data} /> : <p>No results yet</p>}
            </Box>
        </>
    )
}

export default LocationAndBusinessSearch
