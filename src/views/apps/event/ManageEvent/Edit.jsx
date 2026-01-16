'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
    Button, Typography, Box,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    MenuItem,
    TextField,
    Chip,
    Select,
    Paper,
    IconButton,
    Avatar,
    LinearProgress,
    CircularProgress,
} from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import EventCategory from '@/services/event/masters/categoryService'
import ArtistService from '@/services/event/masters/artistService'
import Image from '@/services/imageService'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { CloseOutlined } from '@mui/icons-material'
import LanguageService from '@/services/event/masters/languageService'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import EventService from '@/services/event/event_mgmt/event'
import SubCategoryTable1 from '../../quiz/funAndLearn/SubCategory/SubCattegory'
import { useParams, useRouter } from 'next/navigation'
import GoogleMapLocation from './GoogleMapLocation'
import { useAuth } from '@/contexts/AuthContext'
import CommissionModal from "@/views/apps/event/Event-Commission/AddModal";

const categories = ['Music', 'Art', 'Technology', 'Health', 'Education']
function Show() {


    const { id, approval } = useParams();

    const { hasPermission } = useAuth();
    const router = useRouter()
    const [inputValueLanguage, setInputValueLanguage] = useState('');
    const [isClient, setIsClient] = useState(false)
    const [imageName, setImageName] = useState('')
    const [galleryImageName, setGalleryImageName] = useState('')
    const [inputValueArtist, setInputValueArtist] = useState('')
    const [formData, setFormData] = useState({
        dateType: 'single',
        countdownStatus: 'ACTIVE',
        startDateTime: null,
        endDateTime: null,
        artists: [],
        thumbnail: '',
        gallery_image: [],
        status: 'ACTIVE',
        languages: [],
        latitude: '26.8381000',
        longitude: '80.9346001',
        address: '',
        event_title: '',
        event_category: '',
        country: '',
        state: '',
        city: '',
        zip_code: '',
        description: '',
        terms_and_conditions: '',
        youtube_link: '',
        external_link: '',
        instagram: '',
        twitter: '',
        facebook: '',
        contact_number: '',
        contact_email: '',
        commission_percentage: '',
        is_feature: '',
        attendees: '',
        organizer: ''
    })
    const [formErrors, setFormErrors] = useState({})

    const validateFields = (data) => {
        let errors = {}
        if (!data.dateType) errors.dateType = 'Date Type is required'
        // if (!data.area) errors.area = 'Area is required'
        if (!data.address) errors.address = 'Address is required'
        if (!data.latitude) errors.latitude = 'Latitude is required'
        if (!data.longitude) errors.longitude = 'Longitude is required'
        if (!data.artists[0]) errors.artists = 'Artists is required'
        if (!data.languages[0]) errors.languages = 'Languages is required'
        if (!data.event_title) errors.event_title = 'Event Title is required'
        if (!data.event_category) errors.event_category = 'Event Category is required'
        if (!data.organizer) errors.organizer = 'Organizer is required'
        if (!data.thumbnail) errors.thumbnail = 'Thumbnail is required'
        if (!data.gallery_image[0]) errors.gallery_image = 'Gallery Image is required'
        if (!data.startDateTime) errors.startDateTime = 'Start Date is required'
        if (!data.endDateTime) errors.endDateTime = 'End Date is required'
        if (!data.countdownStatus) errors.countdownStatus = 'Countdown Status is required'
        if (!data.languages) errors.languages = 'Languages is required'
        // if (!data.country) errors.country = 'Country is required'
        // if (!data.state) errors.state = 'State is required'
        // if (!data.city) errors.city = 'City is required'
        // if (!data.zip_code) errors.zip_code = 'Zip Code is required'
        if (!data.description) errors.description = 'Description is required'
        if (!data.terms_and_conditions) errors.terms_and_conditions = 'Terms and Conditions is required'
        if (!data.contact_number) errors.contact_number = 'Contact Number is required'
        if (!data.contact_email) errors.contact_email = 'Contact Email is required'
        if (!data.is_feature) errors.is_feature = 'Is Feature is required'
        if (!data.upcoming_event) errors.upcoming_event = 'Show In Upcoming Event is required'

        // if (!data.commission_percentage) errors.commission_percentage = 'Commission Percentage is required'
        return errors
    }


    useEffect(() => {
        setIsClient(true)
    }, [])



    // show data by id
    const ShowData = async () => {
        const response = await EventService.getbyid(id)
        if (response?.success === true) {
            const data = response.data;
            if (!data) return;

            // Convert string dates to Date objects
            if (data?.dateType === 'single') {
                data.startDateTime = new Date(data?.startDateTime);
                data.endDateTime = new Date(data?.endDateTime);
            } else {
                data.startDateTime = data?.startDateTime.map(date => new Date(date));
                data.endDateTime = data?.endDateTime.map(date => new Date(date));
            }

            const artistIds = Array.isArray(data.artists)
                ? data.artists.map(a => a._id || a)
                : []
            const languageIds = Array.isArray(data.languages)
                ? data.languages.map(l => l._id || l)
                : []

            // Set formData
            setFormData({
                ...data,
                artists: artistIds,
                languages: languageIds,
                organizerData: data.organizer || null,
                country: data.country?._id || data.country || '',
                state: data.state?._id || data.state || '',
                city: data.city?._id || data.city || '',
                area: data.area?._id || data.area || '',
            });
            // // Ye important hai 👇
            // if (data.country?._id || data.country) {
            //     await states(data.country._id || data.country); // state list load karega
            // }
            // if (data.state?._id || data.state) {
            //     await citys(data.state._id || data.state); // city list load karega
            // }
            // if (data.city?._id || data.city) {
            //     await area(data.city._id || data.city); // area list load karega
            // }

        }
    };


    useEffect(() => {
        ShowData()
    }, [])



    const [thumbnail_public_id, setThumbnail_public_id] = useState('')
    const [gallery_image_public_id, setGallery_image_public_id] = useState([])

    const handleInputChange = e => {
        const { name, value } = e.target

        // Reset date fields when switching between types
        if (name === 'dateType') {
            setFormData(prev => ({
                ...prev,
                dateType: value,
                startDateTime: value === 'multiple' ? [new Date()] : new Date(),
                endDateTime: value === 'multiple' ? [new Date()] : new Date(),
            }))
            return
        }

        setFormData(prev => ({ ...prev, [name]: value }))

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }
    const [loadingImage, setLoadingImage] = useState({ thumbnail: false, gallery_image: false })
    const handleImageChange = async e => {
        const files = e.target.files
        if (!files || files.length === 0) return

        try {
            // For thumbnail (single image)
            if (e.target.name === 'thumbnail') {
                setLoadingImage(prev => ({ ...prev, thumbnail: true }))
                const file = files[0]
                setImageName(file.name)
                const res = await Image.uploadImage({ image: file })
                if (res.data.url) {
                    setFormData(prev => ({ ...prev, thumbnail: res.data.url }))
                    setLoadingImage(prev => ({ ...prev, thumbnail: false }))
                    setThumbnail_public_id(res.data.public_id)
                    setFormErrors(prev => ({ ...prev, thumbnail: '' }))
                }
            }
            // For gallery images (multiple)
            else if (e.target.name === 'gallery_image') {
                const newImages = []
                setLoadingImage(prev => ({ ...prev, gallery_image: true }))
                // Process each file sequentially
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    const res = await Image.uploadImage({ image: file })
                    if (res.data.url) {
                        newImages.push(
                            res.data.url,
                            // name: file.name
                        )
                        setGallery_image_public_id(res.data.public_id)
                        setLoadingImage(prev => ({ ...prev, gallery_image: false }))
                    }
                }

                if (newImages.length > 0) {
                    setLoadingImage(prev => ({ ...prev, gallery_image: true }))
                    setFormData(prev => ({
                        ...prev,
                        gallery_image: [...prev.gallery_image, ...newImages]
                    }))
                    setLoadingImage(prev => ({ ...prev, gallery_image: false }))
                    setFormErrors(prev => ({ ...prev, gallery_image: '' }))
                }
            }
        } catch {
            toast.error('Failed to upload photo')
        }
    }

    // Function to remove a gallery image
    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => {
            const updatedImages = [...prev.gallery_image]
            updatedImages.splice(index, 1)
            return {
                ...prev,
                gallery_image: updatedImages
            }
        })
    }



    // event category
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            const response = await EventCategory.Get();
            if (response.success === true) {
                setCategories(response.data);
            }
        }
        getCategories();
    }, [])

    // event artist
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        const getArtists = async () => {
            const response = await ArtistService.Get();
            if (response.success === true) {
                setArtists(response?.data);
            }
        }
        getArtists();
    }, [])

    // event language
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const getLanguages = async () => {
            const response = await LanguageService.Get();
            if (response.success === true) {
                setLanguages(response.data);
            }
        }
        getLanguages();
    }, [])


    // search
    const [inputValue, setInputValue] = useState('');
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const onSearch = (e) => {
        setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            const response = await BannerRoute.getsearch({ search: searchValue });
            if (response.success === true) {
                setSearchData(response.data);
            }
        } else {
            setSearchData([]);
        }
    };

    useEffect(() => { handleSearch() }, [searchValue]);

    const filter = createFilterOptions();




    const deleteImage = async () => {
        if (thumbnail_public_id) {
            const response = await Image.deleteImage({ public_id: thumbnail_public_id })
            if (response.success === true) {
                toast.success('Thumbnail Image Removed Successfully')
                setFormData(prev => ({ ...prev, thumbnail: '' }))
                setThumbnail_public_id('')
            }
        }
    }


    // location data
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const [allCitys, setcityes] = useState([])
    const [allArea, setAllArea] = useState([])

    const countrys = async () => {
        try {
            const result = await countryService.getCountries()
            setCountry(result.data || [])
        } catch (error) {
            console.error("Error fetching countries:", error)
            setCountry([])
        }
    }

    const states = async (CountryId) => {
        try {
            const result = await stateService.getStateById(CountryId)
            setState(result.data || [])
        } catch (error) {
            console.error("Error fetching states:", error)
            setState([])
        }
    }

    const citys = async (stateId) => {
        try {
            const result = await CityService.getCityById(stateId)
            setcityes(result.data || [])
        } catch (error) {
            console.error("Error fetching cities:", error)
            setcityes([])
        }
    }

    const area = async (cityId) => {
        try {
            const result = await areaService.getAreaById(cityId)
            setAllArea(result.data || [])
        } catch (error) {
            console.error("Error fetching areas:", error)
            setAllArea([])
        }
    }

    useEffect(() => {
        countrys()
    }, [])


    const [openAddCommission, setOpenAddCommission] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validateFields(formData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }
        const response = await EventService.putData(id, formData)
        console.log(response, 'response')
        if (response?.success === false) {
            // ✅ Check for commission error message
            if (
                response?.message?.toLowerCase().includes('commission not found') ||
                response?.message?.toLowerCase().includes('add commission')
            ) {
                toast.error('Commission not found. Please add commission first.')
                setOpenAddCommission(true) // <-- open the modal
                return
            }

            toast.error(response?.message)
            return
        }
        if (response.success === true) {
            toast.success(response?.message);
            setFormData({
                thumbnail: '',
                gallery_image: [],
                dateType: 'single',
                countdownStatus: 'ACTIVE',
                startDateTime: new Date(),
                endDateTime: new Date(),
                is_feature: 'No',
                organizer: '',
                artists: [],
                languages: [],
                country: '',
                state: '',
                city: '',
                area: '',
            });
            setThumbnail_public_id('')
            setGallery_image_public_id([])
            setInputValueArtist('')
            setInputValueLanguage('')
            setInputValue('')
            setSearchData([])
            setSearchValue('')
            setImageName('')
            setGalleryImageName('')
            router.push('/en/apps/event/approval')
        }
    }

    const handleLocationSelect = (location) => {
        setFormData({ ...formData, latitude: location.lat, longitude: location.lng, address: location.address })
        // console.log('Latitude:', location.lat)
        // console.log('Longitude:', location.lng)
        // console.log('Address:', location.address)
    }




    return (
        <div className='shadow-md p-4 rounded-md'>
            <div className='text-center text-2xl font-bold'> Edit Event</div>


            <CommissionModal
                open={openAddCommission}
                handleClose={() => setOpenAddCommission(false)}
                getdata={() => {
                    setOpenAddCommission(false)
                    toast.success('Commission added successfully! Please resubmit your event.')
                }}
            />

            <div className='flex flex-col gap-2'>
                {/* Thumbnail Image Upload */}
                <div className='flex flex-col'>
                    <label htmlFor='thumbnail' className='text-sm'>
                        Thumbnail Image
                    </label>
                    <div>
                        <Button
                            variant='outlined'
                            component='label'
                            className='lg:w-96 sm:w-52 md:w-80 w-50'
                        >
                            Upload Thumbnail Image
                            <input
                                type='file'
                                hidden
                                name='thumbnail'
                                onChange={handleImageChange}
                                key={imageName ? 'file-selected' : 'file-empty'}
                                accept='image/*'
                            />
                        </Button>
                        {formData.thumbnail && (
                            <Box className='mt-2 flex items-center gap-2 shadow rounded-md w-fit p-2'>
                                <Avatar src={formData.thumbnail || ''} />
                                <Typography variant='body2'>
                                    Selected: {imageName || ''}
                                </Typography>
                                <CloseOutlined
                                    fontSize='small'
                                    className='text-red-500 text-2xl rounded-full p-1 cursor-pointer'
                                    onClick={() => {
                                        deleteImage()
                                        setFormData(prev => ({ ...prev, thumbnail: '' }))
                                        setImageName('')
                                    }}
                                />
                            </Box>
                        )}
                        {loadingImage.thumbnail && <>
                            <CircularProgress size={20} />
                        </>
                        }
                        {formErrors.thumbnail && (
                            <Typography variant='body2' className='text-red-500'>
                                {formErrors.thumbnail}
                            </Typography>
                        )}
                    </div>
                </div>

                {/* Gallery Image Upload */}
                <div className='flex flex-col'>
                    <label htmlFor='gallery' className='text-sm'>
                        Gallery Images (Multiple)
                    </label>
                    <div>
                        <Button
                            variant='outlined'
                            component='label'
                            className='lg:w-96 sm:w-52 md:w-80 w-50'
                        >
                            Upload Gallery Images
                            <input
                                type='file'
                                hidden
                                name='gallery_image'
                                onChange={handleImageChange}
                                multiple
                                accept='image/*'
                            />
                        </Button>

                        {/* Display selected gallery images with delete option */}
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {formData.gallery_image.map((image, index) => (
                                <div key={index} className='relative'>
                                    <Paper elevation={3} className='p-2 flex items-center'>
                                        <Avatar src={image} />
                                        <Typography variant='body2' className='mr-2'>
                                            {image.name}
                                        </Typography>
                                        <IconButton
                                            size='small'
                                            onClick={() => handleRemoveGalleryImage(index)}
                                            className='text-red-500'
                                        >
                                            <CloseOutlined fontSize='small' />
                                        </IconButton>
                                    </Paper>
                                </div>
                            ))}
                        </div>
                        {loadingImage.gallery_image && <>
                            <CircularProgress size={20} />
                        </>
                        }
                        {formErrors.gallery_image && (
                            <Typography variant='body2' className='text-red-500'>
                                {formErrors.gallery_image}
                            </Typography>
                        )}
                    </div>
                </div>

                {/* Date Type Selection */}
                <Box sx={{ p: 4 }}>
                    <FormControl>
                        <FormLabel>Date Type</FormLabel>
                        <RadioGroup
                            row
                            value={formData.dateType}
                            name="dateType"
                            onChange={handleInputChange}
                        >
                            <FormControlLabel
                                value="single"
                                control={<Radio />}
                                label="Single Date"
                            />
                            <FormControlLabel
                                value="multiple"
                                control={<Radio />}
                                label="Multiple Date"
                            />
                        </RadioGroup>
                    </FormControl>

                    <Grid container spacing={2} mt={2}>
                        {/* --- Single Date Type --- */}
                        {formData.dateType === "single" && (
                            <Grid item xs={12} lg={10}>
                                <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 rounded-md">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <AppReactDatepicker
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                selected={formData?.startDateTime}
                                                onChange={(date) =>
                                                    setFormData((prev) => ({ ...prev, startDateTime: date }))
                                                }
                                                customInput={<CustomTextField label="Start Date & Time" fullWidth />}
                                                dateFormat="dd/MM/yyyy h:mm aa"
                                                minDate={new Date()}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <AppReactDatepicker
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                selected={formData.endDateTime}
                                                onChange={(date) =>
                                                    setFormData((prev) => ({ ...prev, endDateTime: date }))
                                                }
                                                customInput={<CustomTextField label="End Date & Time" fullWidth />}
                                                dateFormat="dd/MM/yyyy h:mm aa"
                                                minDate={new Date()}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        )}

                        {/* --- Multiple Date Type --- */}
                        {formData.dateType === "multiple" && (
                            <>
                                {formData.startDateTime.map((startDate, index) => (
                                    <Grid item xs={12} lg={10} key={index}>
                                        <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 rounded-md">
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <AppReactDatepicker
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        selected={startDate}
                                                        onChange={(date) => {
                                                            const updatedStart = [...formData.startDateTime];
                                                            updatedStart[index] = date;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                startDateTime: updatedStart,
                                                            }));
                                                        }}
                                                        customInput={
                                                            <CustomTextField
                                                                label={`Start Date & Time ${index + 1}`}
                                                                fullWidth
                                                            />
                                                        }
                                                        dateFormat="dd/MM/yyyy h:mm aa"
                                                        minDate={new Date()}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <AppReactDatepicker
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        selected={formData.endDateTime[index]}
                                                        onChange={(date) => {
                                                            const updatedEnd = [...formData.endDateTime];
                                                            updatedEnd[index] = date;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                endDateTime: updatedEnd,
                                                            }));
                                                        }}
                                                        customInput={
                                                            <CustomTextField
                                                                label={`End Date & Time ${index + 1}`}
                                                                fullWidth
                                                            />
                                                        }
                                                        dateFormat="dd/MM/yyyy h:mm aa"
                                                        minDate={new Date()}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                ))}

                                {/* Add/Remove Buttons */}
                                <Grid item xs={12}>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    startDateTime: [...prev.startDateTime, new Date()],
                                                    endDateTime: [...prev.endDateTime, new Date()],
                                                }));
                                            }}
                                        >
                                            + Add Date Set
                                        </Button>

                                        {formData.startDateTime.length > 1 && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        startDateTime: prev.startDateTime.slice(0, -1),
                                                        endDateTime: prev.endDateTime.slice(0, -1),
                                                    }));
                                                }}
                                            >
                                                - Remove Last
                                            </Button>
                                        )}
                                    </div>
                                </Grid>
                            </>
                        )}
                    </Grid>


                </Box>
                <div className="flex flex-wrap gap-4 justify-between m-2 w-full sm:flex-nowrap">
                    {/* Is Feature */}
                    <CustomTextField
                        select
                        className="w-full sm:w-[33%] lg:w-[33%] md:w-[33%]"
                        name="is_feature"
                        label="Is Feature"
                        value={formData.is_feature || ''}
                        onChange={handleInputChange}
                        error={!!formErrors.is_feature}
                        helperText={formErrors.is_feature}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </CustomTextField>

                    {/* Show In Upcoming Event */}
                    <CustomTextField
                        select
                        className="w-full sm:w-[33%] lg:w-[33%] md:w-[33%]"
                        name="upcoming_event"
                        label="Show In Upcoming Event"
                        value={formData.upcoming_event || ''}
                        onChange={handleInputChange}
                        error={!!formErrors.upcoming_event}
                        helperText={formErrors.upcoming_event}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </CustomTextField>

                    {/* Organizer/Vendor Autocomplete */}
                    <Autocomplete
                        className="w-full sm:w-[33%] lg:w-[33%] md:w-[33%]"
                        freeSolo
                        options={SearchData}
                        value={formData.organizerData || null}
                        filterOptions={(options, state) => {
                            const input = state.inputValue.toLowerCase();
                            return options.filter((option) => {
                                const companyName = option.companyInfo?.companyName?.toLowerCase() || '';
                                const vendorId = option.vendorId?.toLowerCase() || '';
                                const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || '';
                                return (
                                    companyName.includes(input) ||
                                    vendorId.includes(input) ||
                                    phoneNo.includes(input)
                                );
                            });
                        }}
                        getOptionLabel={(option) =>
                            option.companyInfo?.companyName ||
                            option.vendorId ||
                            option.contactInfo?.phoneNo ||
                            ''
                        }
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                            handleSearch(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            if (newValue && newValue._id) {
                                setFormData((prev) => ({
                                    ...prev,
                                    organizer: newValue._id,
                                }));
                                setFormErrors((prev) => ({ ...prev, organizer: '' }));
                            }
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Search Organizer/Vendor"
                                variant="outlined"
                                placeholder="Type at least 3 characters"
                                error={!!formErrors.organizer}
                                helperText={formErrors.organizer}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                {option.companyInfo?.companyName} - {option.vendorId} -{' '}
                                {option.contactInfo?.phoneNo}
                            </li>
                        )}
                        noOptionsText={
                            inputValue.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No Organizer/Vendor found'
                        }
                    />
                </div>


                {/* <FormControl className='w-96 mx-2'>
                    <FormLabel>Attendees</FormLabel>
                    <RadioGroup
                        row
                        value={formData.attendees}
                        name="attendees"
                        onChange={handleInputChange}
                    >
                        <FormControlLabel
                            value="hide"
                            control={<Radio />}
                            label="Hide"
                        />
                        <FormControlLabel
                            value="show"
                            control={<Radio />}
                            label="Show"
                        />
                    </RadioGroup>
                </FormControl> */}



                <div className='flex flex-row gap-2 flex-wrap sm:flex-nowrap '>

                    <div className='border border-2-BackgroundPaper rounded p-2 w-full sm:w-[33%] lg:w-[33%] md:w-[33%]  mx-2'>

                        <FormControl className="w-full sm:w-[33%] lg:w-[33%] md:w-[33%] mx-2 border-2">
                            <FormLabel>Attendees</FormLabel>
                            <RadioGroup
                                row
                                value={formData.attendees || ''}
                                name="attendees"
                                onChange={handleInputChange}
                            >
                                <FormControlLabel
                                    value="hide"
                                    control={<Radio />}
                                    label="Hide"
                                />
                                <FormControlLabel
                                    value="show"
                                    control={<Radio />}
                                    label="Show"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    {formData.dateType === 'single' && (

                        <div className=' p-2 border border-2-BackgroundPaper rounded w-full sm:w-[33%] lg:w-[33%] md:w-[33%] '>
                            <FormControl fullWidth>
                                <FormLabel>Countdown Status</FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.countdownStatus || ''}
                                    name="countdownStatus"
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel
                                        value="ACTIVE"
                                        control={<Radio />}
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        value="INACTIVE"
                                        control={<Radio />}
                                        label="InActive"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                </div>



                <Typography variant="h5" className='ml-2' mb={3} fontWeight="bold">
                    Event Details
                </Typography>
                <div className='flex flex-col gap-2'>
                    <GoogleMapLocation onSelect={handleLocationSelect} latitude={formData.latitude} longitude={formData.longitude} />

                    <div className='flex mx-2 '>
                        <CustomTextField
                            required
                            className='w-96'
                            name='event_title'
                            value={formData.event_title || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.event_title}
                            helperText={formErrors.event_title}
                            label="Event Title"
                            placeholder="Enter Event Name"
                            variant="outlined"
                        />

                        <CustomTextField
                            required
                            className="w-96 mx-2"
                            select
                            name="event_category"
                            value={formData?.event_category?._id || ''}
                            onChange={(e) => {
                                const selectedCategory = categories.find(cat => cat._id === e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    event_category: selectedCategory || ''
                                }));
                                if (formErrors.event_category) {
                                    setFormErrors(prev => ({ ...prev, event_category: '' }));
                                }
                            }}
                            error={!!formErrors.event_category}
                            helperText={formErrors.event_category}
                            label="Category"
                            variant="outlined"
                        >
                            <MenuItem value="">Select Category</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.categoryname}
                                </MenuItem>
                            ))}
                        </CustomTextField>


                        <CustomTextField
                            required
                            className='w-96'
                            label="Venue"
                            placeholder="Enter Venue"
                            variant="outlined"
                            value={formData.venue || ''}
                            onChange={handleInputChange}
                            name='venue'
                            error={!!formErrors.venue}
                            helperText={formErrors.venue}
                        />

                    </div>

                    <div className='flex justify-between mx-2'>
                        <CustomTextField
                            required
                            className='w-96'
                            label="Address"
                            placeholder="Enter Address"
                            variant="outlined"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            name='address'
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />




                        <Autocomplete
                            multiple
                            options={artists.filter(lang => lang.status === 'ACTIVE')}
                            className="w-96 mx-2"
                            value={artists.filter((artist) =>
                                formData.artists.includes(artist._id)
                            )}
                            inputValue={inputValueArtist}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason !== 'reset') {
                                    setInputValueArtist(newInputValue)
                                }
                            }}
                            onChange={(e, newValue) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    artists: newValue.map((artist) => artist._id),
                                }))
                            }
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            filterOptions={(options, { inputValue }) => {
                                if (inputValue.length < 3) return []
                                const searchValue = inputValue.toLowerCase()
                                return options.filter((option) =>
                                    option.name.toLowerCase().includes(searchValue)
                                )
                            }}
                            noOptionsText={
                                inputValue.length < 3
                                    ? 'Type at least 3 characters to search'
                                    : 'No options found'
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="Artists"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Type at least 3 characters..."
                                    error={!!formErrors.artists}
                                    helperText={formErrors.artists}
                                />
                            )}
                            renderTags={(selected, getTagProps) =>
                                selected.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({ index })
                                    return (
                                        <Chip key={key} label={option.name} {...tagProps} />
                                    )
                                })
                            }
                        />



                        <Autocomplete
                            multiple
                            options={languages.filter(lang => lang.status === 'ACTIVE')}
                            className="w-96"
                            // value={formData.languages}
                            value={languages.filter((language) =>
                                formData.languages.includes(language._id)
                            )}
                            inputValue={inputValueLanguage}
                            onInputChange={(event, newInputValue, reason) => {
                                // Prevent reset on selection
                                if (reason !== 'reset') setInputValueLanguage(newInputValue)
                            }}

                            onChange={(e, newValue) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    languages: newValue.map((language) => language._id),
                                }))
                            }
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            filterOptions={(options, { inputValue }) => {
                                if (inputValue.length < 3) return []
                                const search = inputValue.toLowerCase()
                                return options.filter((option) =>
                                    option.name.toLowerCase().includes(search)
                                )
                            }}
                            noOptionsText={
                                inputValueLanguage.length < 3
                                    ? 'Type at least 3 characters to search'
                                    : 'No options found'
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="Languages"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Type at least 3 characters..."
                                    error={!!formErrors.languages}
                                    helperText={formErrors.languages}
                                />
                            )}
                            renderTags={(selected, getTagProps) =>
                                selected.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({ index })
                                    return (
                                        <Chip key={key} label={option.name} {...tagProps} />
                                    )
                                })
                            }
                        />




                        {/* 
                        <CustomTextField
                            select
                            className='w-96'
                            label="Country"
                            value={formData.country || ''}
                            onChange={e => {
                                const selectedCountryId = e.target.value
                                setFormData({ ...formData, country: selectedCountryId, state: '', city: '', area: '' })
                                states(selectedCountryId)
                            }}
                            error={!!formErrors.country}
                            helperText={formErrors.country}
                        >
                            <MenuItem value="" disabled>Select Country</MenuItem>
                            {country.map((item) => (
                                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                            ))}
                        </CustomTextField> */}

                        {/* 
                        <CustomTextField
                            select
                            className='w-96'
                            label="State"
                            value={formData.state || ''}
                            onChange={e => {
                                const selectedStateId = e.target.value
                                setFormData({ ...formData, state: selectedStateId, city: '', area: '' })
                                citys(selectedStateId)
                            }}
                            error={!!formErrors.state}
                            helperText={formErrors.state}
                            disabled={!formData.country}
                        >
                            <MenuItem value="" disabled>Select State</MenuItem>
                            {state.map((item) => (
                                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                            ))}
                        </CustomTextField> */}
                    </div>

                    <div className='flex mx-2 justify-between'>
                        {/* <CustomTextField
                            select
                            className='w-96'
                            label="City"
                            value={formData.city || ''}
                            onChange={e => {
                                const selectedCityId = e.target.value
                                setFormData({ ...formData, city: selectedCityId, area: '' })
                                area(selectedCityId)
                            }}
                            error={!!formErrors.city}
                            helperText={formErrors.city}
                            disabled={!formData.state}
                        >
                            <MenuItem value="" disabled>Select City</MenuItem>
                            {allCitys.map((city) => (
                                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                            ))}
                        </CustomTextField> */}

                        {/* <CustomTextField
                            select
                            className='w-96'
                            label='Area'
                            value={formData.area || ''}
                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                            error={!!formErrors.area}
                            helperText={formErrors.area}
                            disabled={!formData.city}
                        >
                            <MenuItem value="" disabled>Select Area</MenuItem>
                            {allArea.map((area) => (
                                <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                            ))}
                        </CustomTextField> */}

                        {/* <CustomTextField
                            className='w-96 '
                            label="Zip/Post Code"
                            name='zip_code'
                            value={formData.zip_code || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.zip_code}

                            helperText={formErrors.zip_code}
                            placeholder="Enter Zip/Post Code"
                            variant="outlined"

                        /> */}
                    </div>

                    <CustomTextField
                        fullWidth
                        name='description'
                        className=' mx-2 mt-1'
                        label="Description:"
                        placeholder=" Description"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                    />

                    <CustomTextField
                        fullWidth
                        name='terms_and_conditions'
                        className=' mx-2 mt-1 '
                        label="Terms & Conditions:"
                        placeholder=" Terms & Conditions"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={formData.terms_and_conditions || ''}
                        onChange={handleInputChange}
                        error={!!formErrors.terms_and_conditions}
                        helperText={formErrors.terms_and_conditions}
                    />


                    <div className='flex flex-row gap-2'>
                        <CustomTextField
                            className='w-96 mx-2'
                            label="Youtube Link"
                            value={formData.youtube_link || ''}
                            onChange={handleInputChange}
                            name='youtube_link'
                            placeholder="Enter Youtube Link"
                            variant="outlined"
                        />
                        <CustomTextField
                            className='w-96 mx-2'
                            label="External Link"
                            value={formData.external_link || ''}
                            onChange={handleInputChange}
                            name='external_link'
                            placeholder="Enter External Link"
                            variant="outlined"
                        />
                        <CustomTextField
                            className='w-96 mx-2'
                            label="Instagram"
                            value={formData.instagram || ''}
                            onChange={handleInputChange}
                            name='instagram'
                            placeholder="Enter Instagram"
                            variant="outlined"
                        />
                    </div>
                    <div className='flex flex-row gap-2'>
                        <CustomTextField
                            className='w-96 mx-2'
                            label="Twitter"
                            value={formData.twitter || ''}
                            onChange={handleInputChange}
                            name='twitter'
                            placeholder="Enter Twitter"
                            variant="outlined"
                        />
                        <CustomTextField
                            className='w-96 mx-2'
                            label="Facebook"
                            value={formData.facebook || ''}
                            onChange={handleInputChange}
                            name='facebook'
                            placeholder="Enter Facebook"
                            variant="outlined"
                        />
                        <CustomTextField
                            className='w-96 mx-2'
                            label="Contact Number"
                            value={formData.contact_number || ''}
                            onChange={handleInputChange}
                            name='contact_number'
                            placeholder="Enter Contact Number"
                            variant="outlined"
                            error={!!formErrors.contact_number}
                            helperText={formErrors.contact_number}
                        />
                    </div>

                    <div className="flex flex-row gap-2">
                        <CustomTextField
                            className="flex-1 mx-2"
                            label="Contact Email"
                            value={formData.contact_email || ""}
                            onChange={handleInputChange}
                            name="contact_email"
                            placeholder="Enter Contact Email"
                            variant="outlined"
                            error={!!formErrors.contact_email}
                            helperText={formErrors.contact_email}
                        />

                        {approval ? (
                            <div className="flex mx-2 flex-1">
                                <CustomTextField
                                    select
                                    className="w-full"
                                    name="status"
                                    label="Status"
                                    value={formData.status || ""}
                                    onChange={handleInputChange}
                                    error={!!formErrors.status}
                                    helperText={formErrors.status}
                                >
                                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="EXPIRED">EXPIRED</MenuItem>
                                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                                </CustomTextField>
                            </div>
                        ) : (
                            <div className="flex mx-2 flex-1">
                                <CustomTextField
                                    select
                                    className="w-full"
                                    name="status"
                                    label="Status"
                                    value={formData.status || ""}
                                    onChange={handleInputChange}
                                    error={!!formErrors.status}
                                    helperText={formErrors.status}
                                    disabled
                                >
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                </CustomTextField>
                            </div>
                        )}
                    </div>


                    {/* status */}



                    <div className='flex mt-2'>
                        {hasPermission("event_manageEvents:edit") &&
                            <Button variant='contained' className=' mx-2' onClick={handleSubmit}>Save</Button>
                        }
                        <Button variant='outlined' className=' mx-2'>Cancel</Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Show
