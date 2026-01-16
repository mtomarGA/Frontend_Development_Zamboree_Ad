'use client'
import React, { useEffect, useState } from 'react'
// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { Autocomplete, createFilterOptions, IconButton, InputAdornment, MenuItem, TextField, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Image from "@/services/imageService"

// Map Imports
import dynamic from 'next/dynamic'
const MapWithNoSSR = dynamic(() => import('./MapPicker'), {
    ssr: false
})

// Services
import categoryRoute from '@/services/utsav/category'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import { searchForIcon } from '@iconify/utils'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import { set } from 'date-fns'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service'
import { useAuth } from '@/contexts/AuthContext'
import GoogleMapLocation from '../../event/ManageEvent/GoogleMapLocation'

function AddModal({ open, getdata, handleClose }) {
    const [AddData, setAddData] = useState({
        category: '',
        validity: '',
        BusinessId: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'PENDING',
        latitude: null,
        longitude: null
    })



    const [formErrors, setFormErrors] = useState({});
    const [categoryTypes, setcategoryTypes] = useState([])
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const [allCitys, setcityes] = useState([])
    const [allArea, setAllArea] = useState([])
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    // const [image, setImage] = useState({
    //     webBanner: null,
    //     mobBanner: null,
    // });
    const [inputValue, setInputValue] = useState('');
    const [BusinessData, setBusinessData] = useState([]);
    const [isUploadingWeb, setIsUploadingWeb] = useState(false);
    const [isUploadingMob, setIsUploadingMob] = useState(false);

    const { hasPermission } = useAuth();

    // Validation function
    const validateFields = (data) => {
        let errors = {};

        if (!data.category) errors.category = 'Category is required';
        if (!data.validity) errors.validity = 'Validity in Days is required';
        if (!data.latitude) errors.latitude = 'Please select a location on the map';
        if (!data.longitude) errors.longitude = 'Please select a location on the map';
        // if (!data.country) errors.country = 'Country is required';
        // if (!data.state) errors.state = 'State is required';
        // if (!data.city) errors.city = 'City is required';
        // if (!data.area) errors.area = 'Area is required';
        if (!data.BusinessId) errors.BusinessId = 'Business is required';
        if (!data.status) errors.status = 'Status is required';
        if (!data.mobBanner) errors.mobBanner = 'Mobile banner is required';
        if (!data.webBanner) errors.webBanner = 'Web banner is required';

        return errors;
    };

    // Fetch category data
    useEffect(() => {
        const getcategorydata = async () => {
            const response = await categoryRoute.getcategory()
            setcategoryTypes(response.data)
        }
        getcategorydata()
        countrys()
        business()
    }, [])

    // Fetch countries
    const countrys = async () => {
        const result = await countryService.getCountries()
        setCountry(result.data)
    }

    // Fetch states based on country
    // const states = async (CountryId) => {
    //     const result = await stateService.getStateById(CountryId)
    //     setState(result.data)
    //     setAddData(prev => ({ ...prev, state: '', city: '', area: '' }))
    //     setFormErrors(prev => ({ ...prev, state: '', city: '', area: '' }))
    // }

    // // Fetch cities based on state
    // const citys = async (stateId) => {
    //     const result = await CityService.getCityById(stateId)
    //     setcityes(result.data)
    //     setAddData(prev => ({ ...prev, city: '', area: '' }))
    //     setFormErrors(prev => ({ ...prev, city: '', area: '' }))
    // }

    // // Fetch areas based on city
    // const area = async (cityId) => {
    //     const result = await areaService.getAreaById(cityId)
    //     setAllArea(result.data)
    //     setAddData(prev => ({ ...prev, area: '' }))
    //     setFormErrors(prev => ({ ...prev, area: '' }))
    // }

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setAddData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }




    const [filename, setfilename] = useState({})
    // image upload handler
    const onchangeimage = async (e) => {
        const { name, files } = e.target;
        setfilename({ ...filename, [name]: files[0]?.name });

        // Set loading state
        if (name === 'webBanner') {
            setIsUploadingWeb(true);
        } else if (name === 'mobBanner') {
            setIsUploadingMob(true);
        }

        const image = {
            image: e.target.files[0]
        }

        try {
            const result = await Image.uploadImage(image)
            console.log(result)
            if (result.data.url) {
                setAddData(prev => ({
                    ...prev,
                    [name]: result.data.url,
                }));
                // Clear error when file is selected
                if (formErrors[name]) {
                    setFormErrors(prev => ({ ...prev, [name]: '' }))
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Image upload failed');
        } finally {
            // Reset loading state
            if (name === 'webBanner') {
                setIsUploadingWeb(false);
            } else if (name === 'mobBanner') {
                setIsUploadingMob(false);
            }
        }
    };


    useEffect(() => {
        setfilename({});
        setAddData({
            category: '',
            validity: '',
            BusinessId: '',
            country: '',
            state: '',
            city: '',
            area: '',
            status: 'PENDING',
            latitude: null,
            longitude: null
        });
    }, [open])



    // Handle form submission
    const handleSubmit = async () => {
        const errors = validateFields({ ...AddData });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await BannerRoute.PostBanner(AddData);
            console.log(response)
            if (response.success === true) {
                toast.success(response.message)
                getdata();
                handleClose()
                // setAddData({});
                setFormErrors({});
            }
        } catch (error) {
            toast.error("Failed to add banner")
            console.error(error);
        }
    }

    // Fetch business data
    const business = async () => {
        const response = await manageBusinessService.getAllBusiness();
        setBusinessData(response?.data);
    }

    // search
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    // const onSearch = (e) => {
    //     setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    // }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) { // Only search when at least 3 characters are entered
            const response = await BannerRoute.getsearch({ search: searchValue });
            if (response.success === true) {
                setSearchData(response.data);
            }
        } else {
            setSearchData([]); // Clear results when search term is too short
        }
    };

    useEffect(() => { handleSearch() }, [searchValue]);

    const filter = createFilterOptions();

    const handleLocationSelect = (location) => {
        setAddData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }));
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            fullWidth
            maxWidth='md'
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Add Promotional Banner
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>
                {/* Category & Validity */}
                <div className='flex flex-col md:flex-row justify-between gap-4 my-2'>
                    <CustomTextField
                        className='w-full md:w-[24rem]'
                        select
                        name='category'
                        label='Utsav Category'
                        id='controlled-select'
                        value={AddData.category}
                        onChange={e => setAddData({ ...AddData, category: e.target.value })}
                        error={!!formErrors.category}
                        helperText={formErrors.category}
                    >
                        {[...new Map(categoryTypes.map(item => [item.categoryname, item])).values()]
                            .filter(type => type.status === 'ACTIVE')
                            .map(type => (
                                <MenuItem key={type._id} value={type._id}>
                                    {type.categoryname}
                                </MenuItem>
                            ))}
                    </CustomTextField>

                    <CustomTextField
                        className='w-full md:w-[24rem]'
                        name='validity'
                        type="number"
                        inputProps={{ min: 0 }}
                        label='Validity in Days'
                        value={AddData.validity}
                        onChange={handleChange}
                        error={!!formErrors.validity}
                        helperText={formErrors.validity}
                    />
                </div>

                {/* Banner Uploads */}
                <div className='flex flex-col md:flex-row justify-between gap-4 my-2'>
                    <div className='w-full md:w-[24rem]'>
                        <label htmlFor='webBanner' className='text-sm'>Web Banner Image</label>
                        <Button
                            variant='outlined'
                            component='label'
                            className='w-full'
                            disabled={isUploadingWeb}
                        >
                            {isUploadingWeb ? (
                                <>
                                    <CircularProgress size={20} className='mr-2' />
                                    Uploading...
                                </>
                            ) : (
                                'Upload File'
                            )}
                            <input type='file' hidden name='webBanner' onChange={onchangeimage} />
                        </Button>
                        {AddData.webBanner && (
                            <Typography variant='body2' className='mt-2 text-green-700 truncate'>
                                Selected: {filename?.webBanner}
                            </Typography>
                        )}
                        {formErrors.webBanner && (
                            <Typography variant='body2' color="error">{formErrors.webBanner}</Typography>
                        )}
                    </div>

                    <div className='w-full md:w-[24rem]'>
                        <label htmlFor='mobBanner' className='text-sm'>Mob Banner Image</label>
                        <Button
                            variant='outlined'
                            component='label'
                            className='w-full'
                            disabled={isUploadingMob}
                        >
                            {isUploadingMob ? (
                                <>
                                    <CircularProgress size={20} className='mr-2' />
                                    Uploading...
                                </>
                            ) : (
                                'Upload File'
                            )}
                            <input type='file' hidden name='mobBanner' onChange={onchangeimage} />
                        </Button>
                        {AddData.mobBanner && (
                            <Typography variant='body2' className='mt-2 text-green-700 truncate'>
                                Selected: {filename?.mobBanner}
                            </Typography>
                        )}
                        {formErrors.mobBanner && (
                            <Typography variant='body2' color="error">{formErrors.mobBanner}</Typography>
                        )}
                    </div>
                </div>

                {/* Business & Country */}
                <div className='flex flex-col md:flex-row justify-between gap-4 my-2 items-center'>
                    <Autocomplete
                        className='w-full md:w-[24rem]'
                        freeSolo
                        options={SearchData}
                        filterOptions={(options, state) => {
                            const input = state.inputValue.toLowerCase()
                            return options.filter((option) => {
                                const companyName = option.companyInfo?.companyName?.toLowerCase() || ''
                                const vendorId = option.vendorId?.toLowerCase() || ''
                                const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || ''
                                return (
                                    companyName.includes(input) ||
                                    vendorId.includes(input) ||
                                    phoneNo.includes(input)
                                )
                            })
                        }}
                        getOptionLabel={(option) =>
                            option.companyInfo?.companyName ||
                            option.vendorId ||
                            option.contactInfo?.phoneNo ||
                            ''
                        }
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue)
                            handleSearch(newInputValue)
                        }}
                        onChange={(event, newValue) => {
                            if (newValue && newValue._id) {
                                setAddData(prev => ({ ...prev, BusinessId: newValue._id }))
                                setFormErrors(prev => ({ ...prev, BusinessId: '' }))
                            }
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                className='w-full md:w-[24rem]'
                                label="Search Business"
                                variant="outlined"
                                placeholder="Type at least 3 characters"
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                {option.companyInfo?.companyName} - {option.vendorId} - {option.contactInfo?.phoneNo}
                            </li>
                        )}
                        noOptionsText={
                            inputValue.length < 3
                                ? "Type at least 3 characters to search"
                                : "No businesses found"
                        }
                    />


                    {/* <CustomTextField
                        className='w-full md:w-[24rem]'
                        id='location-search'
                        label='Search Location'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder='Enter location name to find coordinates'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={searchLocation}
                                        disabled={isSearching || !searchQuery.trim()}
                                    >
                                        <i className='tabler-search' />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                                e.preventDefault()
                                searchLocation()
                            }
                        }}
                    /> */}

                    <div>

                        <CustomTextField
                            disabled
                            className='w-96 my-2'
                            name='address'
                            label='Address'
                            value={AddData?.address || ''}
                            onChange={handleChange}
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />
                    </div>


                </div>



                <div className=' my-4'>

                    <GoogleMapLocation onSelect={handleLocationSelect} />
                </div>



                {/* Latitude & Longitude */}
                <div>

                    <div className='flex flex-row flex-wrap justify-between'>

                        <CustomTextField
                            className='w-96'
                            name='latitude'
                            label='Latitude'
                            value={AddData?.latitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.latitude}
                            helperText={formErrors.latitude}
                            disabled
                        />

                        <CustomTextField
                            className='w-96'
                            name='longitude'
                            label='Longitude'
                            value={AddData?.longitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.longitude}
                            helperText={formErrors.longitude}
                            disabled
                        />


                    </div>


                </div>

                {/* Status */}
                <div className='my-2'>
                    <CustomTextField
                        select
                        className='w-full md:w-[24rem]'
                        name='status'
                        label='Status'
                        value={AddData.status}
                        onChange={handleChange}
                        error={!!formErrors.status}
                        helperText={formErrors.status}
                    >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='PENDING'>PENDING</MenuItem>
                    </CustomTextField>
                </div>

            </DialogContent>
            <DialogActions>

                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Cancel
                </Button>

                {hasPermission("utsav_promotional_banner:add") &&
                    <Button onClick={handleSubmit} variant='contained'>
                        Add Promotional Banner
                    </Button>
                }
                {/* {image.webBanner && image.mobBanner ?:
                    <Button onClick={handleSubmit} variant='contained' disabled>
                        Add Promotional Banner
                    </Button>
                } */}

            </DialogActions>
        </Dialog>
    )
}

export default AddModal
