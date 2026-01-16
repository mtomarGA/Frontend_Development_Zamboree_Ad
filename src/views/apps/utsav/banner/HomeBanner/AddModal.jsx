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



// Services
import categoryRoute from '@/services/utsav/category'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices'
import { useAuth } from '@/contexts/AuthContext'
import GoogleMapLocation from '@/views/apps/event/ManageEvent/GoogleMapLocation'

import Image from '@/services/imageService'


function AddModal({ open, getdata, handleClose }) {
    const [AddData, setAddData] = useState({
        BusinessId: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'PENDING',
    })

    const { hasPermission } = useAuth();

    const [formErrors, setFormErrors] = useState({});
    const [categoryTypes, setcategoryTypes] = useState([])
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const [allCitys, setcityes] = useState([])
    const [allArea, setAllArea] = useState([])

    const [image, setImage] = useState({
        webBanner: null,
        mobBanner: null,
    });
    const [inputValue, setInputValue] = useState('');
    const [BusinessData, setBusinessData] = useState([]);
    const [isUploadingWeb, setIsUploadingWeb] = useState(false);
    const [isUploadingMob, setIsUploadingMob] = useState(false);

    // Validation function
    const validateFields = (data) => {
        let errors = {};

        // if (!data.category) errors.category = 'Category is required';
        // if (!data.validity) errors.validity = 'Validity in Days is required';
        // if (!data.country) errors.country = 'Country is required';
        // if (!data.state) errors.state = 'State is required';
        // if (!data.city) errors.city = 'City is required';
        // if (!data.area) errors.area = 'Area is required';
        if (!data.BusinessId) errors.BusinessId = 'Business is required';
        if (!data.status) errors.status = 'Status is required';
        if (!data.mobBanner) errors.mobBanner = 'Mobile banner is required';
        if (!data.webBanner) errors.webBanner = 'Web banner is required';
        if (!data.latitude) errors.latitude = 'latitude is required';
        if (!data.longitude) errors.longitude = 'Longitude is required';
        if (!data.address) errors.address = 'Address is required';

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
    const states = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setState(result.data)
        setAddData(prev => ({ ...prev, state: '', city: '', area: '' }))
        setFormErrors(prev => ({ ...prev, state: '', city: '', area: '' }))
    }

    // Fetch cities based on state
    const citys = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setcityes(result.data)
        setAddData(prev => ({ ...prev, city: '', area: '' }))
        setFormErrors(prev => ({ ...prev, city: '', area: '' }))
    }

    // Fetch areas based on city
    const area = async (cityId) => {
        const result = await areaService.getAreaById(cityId)
        setAllArea(result.data)
        setAddData(prev => ({ ...prev, area: '' }))
        setFormErrors(prev => ({ ...prev, area: '' }))
    }

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setAddData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }


    // image upload handler
    // const onchangeimage = (e) => {
    //     const { name, files } = e.target;

    //     if (files && files.length > 0) {
    //         const file = files[0];
    //         setImage(prev => ({
    //             ...prev,
    //             [name]: file,
    //         }));
    //         // Clear error when file is selected
    //         if (formErrors[name]) {
    //             setFormErrors(prev => ({ ...prev, [name]: '' }))
    //         }
    //     }
    // };




    const onchangeimage = async (e) => {
        const { name, files } = e.target
        // Set loading state
        if (name === 'webBanner') {
            setIsUploadingWeb(true);
        } else if (name === 'mobBanner') {
            setIsUploadingMob(true);
        }

        try {
            const result = await Image.uploadImage({ image: files[0] })
            if (result.data.url) {
                setAddData(prev => ({
                    ...prev,
                    [name]: result.data.url
                }))
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
    }

    // Handle form submission
    const handleSubmit = async () => {
        const errors = validateFields({ ...AddData });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await HomeBannerRoute.PostBanner(AddData);
            if (response.success === true) {
                toast.success(response.message)
                getdata();
                handleClose()
                setAddData({});
                setImage({ webBanner: null, mobBanner: null });
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
        setBusinessData(response.data);
    }

    // search
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const onSearch = (e) => {
        setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) { // Only search when at least 3 characters are entered
            const response = await HomeBannerRoute.getsearch({ search: searchValue });
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
        console.log(location, "dd")
        setAddData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }));
    };

    console.log(AddData, "ss")


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
                    Add Home Banner
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>


                <div className='flex justify-between'>
                    {/* Web thumbnail section */}
                    <div>
                        <label htmlFor='webBanner' className='text-sm'>
                            Web Banner Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'
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
                                <Typography variant='body2' className='mt-2 text-green-700 truncate align-bottom w-96'>
                                    Selected: {AddData.webBanner}
                                </Typography>
                            )}
                            {formErrors.webBanner && (
                                <Typography variant='body2' color="error">
                                    {formErrors.webBanner}
                                </Typography>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor='mobbanner' className='text-sm'>
                            Mob Banner Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'
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
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {AddData.mobBanner}
                                </Typography>
                            )}
                            {formErrors.mobBanner && (
                                <Typography variant='body2' color="error">
                                    {formErrors.mobBanner}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>


                {/* search code */}
                <div className='flex justify-between my-2'>
                    <Autocomplete
                        className="w-96"
                        freeSolo
                        options={SearchData}
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
                                setAddData(prev => ({
                                    ...prev,
                                    BusinessId: newValue._id
                                }));
                                setFormErrors(prev => ({ ...prev, BusinessId: '' }));
                            }
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                className='w-96'

                                label="Search Business"
                                variant="outlined"
                                placeholder="Type at least 3 characters"
                                error={!!formErrors.BusinessId}
                                helperText={formErrors.BusinessId}
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



                    <div>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={AddData.status || ''}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>
                        </CustomTextField>
                    </div>



                    {/*  */}

                    {/* 
                    <Grid item xs={6}>
                        <CustomTextField
                            select
                            className='w-96'
                            label="Country"
                            name='country'
                            value={AddData.country || ''}
                            error={!!formErrors.country}
                            helperText={formErrors.country}
                            onChange={(e) => {
                                handleChange(e)
                                states(e.target.value)
                            }}
                        >
                            <MenuItem value='' disabled>Select Country</MenuItem>
                            {country.map((item) => (
                                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid> */}
                </div>
                {/* 
                <div className='flex justify-between my-2'>
                    <Grid item xs={6}>
                        <CustomTextField
                            select
                            className='w-96'
                            label="State"
                            name='state'
                            value={AddData.state || ""}
                            error={!!formErrors.state}
                            helperText={formErrors.state}
                            onChange={(e) => {
                                handleChange(e)
                                citys(e.target.value)
                            }}
                            disabled={!AddData.country}
                        >
                            <MenuItem value='' disabled>Select State</MenuItem>
                            {state.map((item) => (
                                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={6}>
                        <CustomTextField
                            select
                            className='w-96'
                            label="City"
                            name='city'
                            value={AddData.city || ''}
                            error={!!formErrors.city}
                            helperText={formErrors.city}
                            onChange={(e) => {
                                handleChange(e)
                                area(e.target.value)
                            }}
                            disabled={!AddData.state}
                        >
                            <MenuItem value='' disabled>Select City</MenuItem>
                            {allCitys.map((city) => (
                                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>
                </div> */}

                <div className='flex justify-between my-2'>
                    {/* <Grid item xs={6}>
                        <CustomTextField
                            select
                            className='w-96'
                            label='Area'
                            name='area'
                            value={AddData.area || ''}
                            error={!!formErrors.area}
                            helperText={formErrors.area}
                            onChange={handleChange}
                            disabled={!AddData.city}
                        >
                            <MenuItem value='' disabled>Select Area</MenuItem>
                            {allArea.map((area) => (
                                <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid> */}



                </div>

                <div className=' my-4'>

                    <GoogleMapLocation onSelect={handleLocationSelect} />
                </div>


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


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Cancel
                </Button>

                {hasPermission("utsav_banner:add") && (
                    <Button onClick={handleSubmit} variant='contained'
                    >
                        Add Home Banner
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default AddModal
