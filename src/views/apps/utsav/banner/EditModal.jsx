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
import { Autocomplete, Avatar, createFilterOptions, IconButton, InputAdornment, MenuItem, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'

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
import BannerRoute from '@/services/utsav/banner/bannerServices'
import { toast } from 'react-toastify'
import Image from "@/services/imageService"
import { useAuth } from '@/contexts/AuthContext'
import GoogleMapLocation from '../../event/ManageEvent/GoogleMapLocation'
import manageBusinessService from '@/services/business/manageBusiness.service'


function EditModal({ Editopen, handleEditClose, handleEditOpen, selectedId, getdata }) {
    // Initialize EditData with empty state
    const [EditData, setEditData] = useState({
        BusinessId: '',
        category: '',
        validity: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'ACTIVE',
        latitude: null,
        longitude: null
    })

    const [inputValue, setInputValue] = useState('');
    const [BusinessData, setBusinessData] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [categoryTypes, setcategoryTypes] = useState([])
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const [allCitys, setcityes] = useState([])
    const [allArea, setAllArea] = useState([])
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [image, setImage] = useState({
        webBanner: null,
        mobBanner: null,
    });
    const [initialBanners, setInitialBanners] = useState({
        webBanner: '',
        mobBanner: ''
    });
    const [dataLoaded, setDataLoaded] = useState(false);
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [isUploadingWeb, setIsUploadingWeb] = useState(false);
    const [isUploadingMob, setIsUploadingMob] = useState(false);
    const [filename, setfilename] = useState({});

    const { hasPermission } = useAuth();

    // Reset form when modal is closed
    useEffect(() => {
        if (!Editopen) {
            // Reset all the form state
            setEditData({
                BusinessId: '',
                category: '',
                validity: '',
                country: '',
                state: '',
                city: '',
                area: '',
                status: 'ACTIVE',
                latitude: null,
                longitude: null
            });
            setSelectedPosition(null);
            setSelectedBusiness(null);
            setInputValue('');
            setImage({
                webBanner: null,
                mobBanner: null,
            });
            setInitialBanners({
                webBanner: '',
                mobBanner: ''
            });
            setFormErrors({});
            setDataLoaded(false);
        }
    }, [Editopen]);

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
        if (!data.address) errors.address = 'Address is required';
        if (!data.status) errors.status = 'Status is required';

        return errors;
    };

    // Load categories and countries on component mount
    useEffect(() => {
        const getcategorydata = async () => {
            const response = await categoryRoute.getcategory()
            setcategoryTypes(response.data)
        }

        // const loadCountries = async () => {
        //     const result = await countryService.getCountries()
        //     setCountry(result.data)
        // }

        getcategorydata()
        // loadCountries()
    }, [])

    // Fetch data when selectedId changes and modal is open
    useEffect(() => {
        const fetchData = async () => {
            if (selectedId && Editopen) {
                try {
                    // Reset form data first
                    setDataLoaded(false);

                    const response = await BannerRoute.getdatabyid(selectedId);
                    const data = response.data;

                    // Set initial banners
                    setInitialBanners({
                        webBanner: data.webBanner || '',
                        mobBanner: data.mobBanner || ''
                    });

                    // Set map position if coordinates exist
                    if (data.latitude && data.longitude) {
                        setSelectedPosition({
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude)
                        });
                    }

                    // Load location data sequentially
                    // First load country data (already loaded in the other useEffect)

                    // Now load states based on country
                    let stateData = [];
                    if (data.country?._id) {
                        stateData = await stateService.getStateById(data.country._id);
                        setState(stateData.data);
                    }

                    // Load cities based on state
                    let cityData = [];
                    if (data.state?._id) {
                        cityData = await CityService.getCityById(data.state._id);
                        setcityes(cityData.data);
                    }

                    // Load areas based on city
                    let areaData = [];
                    if (data.city?._id) {
                        areaData = await areaService.getAreaById(data.city._id);
                        setAllArea(areaData.data);
                    }

                    // Now set all the form data at once after all the dependent data is loaded
                    setEditData({
                        BusinessId: data.BusinessId || '',
                        category: data.category || '',
                        validity: data.validity || '',
                        country: data.country?._id || '',
                        state: data.state?._id || '',
                        city: data.city?._id || '',
                        area: data.area?._id || '',
                        status: data.status || 'ACTIVE',
                        latitude: data.latitude || null,
                        longitude: data.longitude || null,
                        link: data.link || '',
                        address: data.address || ''
                    });

                    // Fetch and set business data for Autocomplete
                    if (data.BusinessId) {
                        try {
                            const businessResponse = await manageBusinessService.getBusinessById(data.BusinessId);
                            if (businessResponse.success && businessResponse.data) {
                                setSelectedBusiness(businessResponse.data);
                                setInputValue(businessResponse.data?.companyInfo?.companyName || businessResponse.data?.vendorId || '');
                            }
                        } catch (error) {
                            console.error('Error fetching business data:', error);
                        }
                    }

                    setDataLoaded(true);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast.error("Failed to fetch banner data");
                }
            }
        };

        fetchData();
    }, [selectedId, Editopen]);

    // Fetch states based on country
    // const states = async (CountryId) => {
    //     if (!CountryId) return;

    //     try {
    //         const result = await stateService.getStateById(CountryId)
    //         setState(result.data)
    //         setEditData(prev => ({ ...prev, state: '', city: '', area: '' }))
    //         setFormErrors(prev => ({ ...prev, state: '', city: '', area: '' }))
    //     } catch (error) {
    //         console.error("Error fetching states:", error);
    //     }
    // }

    // // Fetch cities based on state
    // const citys = async (stateId) => {
    //     if (!stateId) return;

    //     try {
    //         const result = await CityService.getCityById(stateId)
    //         setcityes(result.data)
    //         setEditData(prev => ({ ...prev, city: '', area: '' }))
    //         setFormErrors(prev => ({ ...prev, city: '', area: '' }))
    //     } catch (error) {
    //         console.error("Error fetching cities:", error);
    //     }
    // }

    // // Fetch areas based on city
    // const area = async (cityId) => {
    //     if (!cityId) return;

    //     try {
    //         const result = await areaService.getAreaById(cityId)
    //         setAllArea(result.data)
    //         setEditData(prev => ({ ...prev, area: '' }))
    //         setFormErrors(prev => ({ ...prev, area: '' }))
    //     } catch (error) {
    //         console.error("Error fetching areas:", error);
    //     }
    // }

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }


    // Handle location search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }


    // Image upload handler
    const onchangeimage = async (e) => {
        const { name, files } = e.target;
        const imageFile = e.target.files[0];
        if (!imageFile) return;

        // Set uploading state
        if (name === 'webBanner') {
            setIsUploadingWeb(true);
        } else if (name === 'mobBanner') {
            setIsUploadingMob(true);
        }

        try {
            const image = {
                image: imageFile
            }
            const result = await Image.uploadImage(image)
            // console.log(result)
            if (result.data.url) {
                setEditData(prev => ({
                    ...prev,
                    [name]: result.data.url,
                }));
                setfilename(prev => ({
                    ...prev,
                    [name]: imageFile.name,
                }));
                // Clear error when file is selected
                if (formErrors[name]) {
                    setFormErrors(prev => ({ ...prev, [name]: '' }))
                }
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            // Reset uploading state
            if (name === 'webBanner') {
                setIsUploadingWeb(false);
            } else if (name === 'mobBanner') {
                setIsUploadingMob(false);
            }
        }
    };
    console.log(EditData, "ddd")

    // Handle form submission
    const handleSubmit = async () => {
        const errors = validateFields(EditData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }



        try {
            const response = await BannerRoute.putData(selectedId, EditData);
            if (response?.success == true) {
                toast.success(response?.message || "Banner Updated Successfully");
                handleEditClose();
                await getdata();
                setFormErrors({});
            }
        } catch (error) {
            console.error("Error updating banner:", error);
            toast.error("Failed to update banner");
        }
    }

    const onSearch = (e) => {
        setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) { // Only search when at least 3 characters are entered
            try {
                const response = await BannerRoute.getsearch({ search: searchValue });
                if (response.success === true) {
                    setSearchData(response.data);
                }
            } catch (error) {
                console.error("Error searching businesses:", error);
            }
        } else {
            setSearchData([]); // Clear results when search term is too short
        }
    };

    useEffect(() => {
        if (searchValue) {
            handleSearch(searchValue)
        }
    }, [searchValue]);

    const filter = createFilterOptions();

    const handleLocationSelect = (location) => {
        setEditData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }));
    };

    return (
        <Dialog
            onClose={handleEditClose}
            aria-labelledby='customized-dialog-title'
            open={Editopen}
            fullWidth
            maxWidth='md'
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Edit Promotional Banner
                </Typography>
                <DialogCloseButton onClick={handleEditClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>
                <div className='flex justify-between my-2'>
                    <div>
                        <CustomTextField
                            className='m-2 w-96'
                            select
                            name='category'
                            label='Utsav Category'
                            id='controlled-select'
                            value={EditData.category?._id || EditData.category || ''}
                            onChange={e => setEditData({ ...EditData, category: e.target.value })}
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

                    </div>

                    <CustomTextField
                        className='w-96'
                        name='validity'
                        type="number"
                        inputProps={{ min: 0 }}
                        label='Validity in Days'
                        value={EditData.validity || ''}
                        onChange={handleChange}
                        error={!!formErrors.validity}
                        helperText={formErrors.validity}
                    />
                </div>

                <div className='flex justify-between gap-4 flex-wrap items-center'>
                    {/* Web thumbnail section */}
                    <div>
                        <label htmlFor='webBanner' className='text-sm'>
                            Web Banner Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96 truncate mx-2'
                                disabled={isUploadingWeb}
                            >
                                {isUploadingWeb ? <CircularProgress size={20} /> : (EditData.webBanner ? 'Change File' : 'Upload File')}
                                <input
                                    type='file'
                                    hidden
                                    name='webBanner'
                                    onChange={onchangeimage}
                                />
                            </Button>
                            {EditData.webBanner ? (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-green-700 w-96 truncate'
                                >
                                    Selected: {EditData?.webBanner}
                                </Typography>
                            ) : initialBanners.webBanner ? (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-blue-500 w-96 truncate'
                                >
                                    Current: {initialBanners.webBanner}
                                </Typography>
                            ) : (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-gray-500 w-96 truncate'
                                >
                                    No banner selected
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* Mobile banner section */}
                    <div>
                        <label htmlFor='mobBanner' className='text-sm'>
                            Mob Banner Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96 truncate'
                                disabled={isUploadingMob}
                            >
                                {isUploadingMob ? <CircularProgress size={20} /> : (image.mobBanner ? 'Change File' : 'Upload File')}
                                <input
                                    type='file'
                                    hidden
                                    name='mobBanner'
                                    onChange={onchangeimage}
                                />
                            </Button>
                            {image.mobBanner ? (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-green-700 w-96 truncate'
                                >
                                    Selected: {image.mobBanner.name}
                                </Typography>
                            ) : initialBanners.mobBanner ? (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-blue-500 w-96 truncate'
                                >
                                    Current: {initialBanners.mobBanner}
                                </Typography>
                            ) : (
                                <Typography
                                    variant='body2'
                                    className='mt-2 text-gray-500 w-96 truncate'
                                >
                                    No banner selected
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>


                <div className='flex justify-between my-2 items-center'>
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
                        value={selectedBusiness}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                            handleSearch(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            setSelectedBusiness(newValue);
                            if (newValue && newValue._id) {
                                setEditData(prev => ({
                                    ...prev,
                                    BusinessId: newValue._id
                                }));
                                setFormErrors(prev => ({ ...prev, BusinessId: '' }));
                            } else if (!newValue) {
                                // Clear business when input is cleared
                                setSelectedBusiness(null);
                                setEditData(prev => ({
                                    ...prev,
                                    BusinessId: ''
                                }));
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
                            disabled
                            className='w-96 my-2'
                            name='address'
                            label='Address'
                            value={EditData?.address || ''}
                            onChange={handleChange}
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />
                    </div>
                </div>




                <div className=' my-4'>

                    <GoogleMapLocation Editlat={EditData?.latitude} Editlong={EditData?.longitude} onSelect={handleLocationSelect} />
                </div>



                {/* Latitude & Longitude */}
                <div>

                    <div className='flex flex-row flex-wrap justify-between'>

                        <CustomTextField
                            className='w-96'
                            name='latitude'
                            label='Latitude'
                            value={EditData?.latitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.latitude}
                            helperText={formErrors.latitude}
                            disabled
                        />

                        <CustomTextField
                            className='w-96'
                            name='longitude'
                            label='Longitude'
                            value={EditData?.longitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.longitude}
                            helperText={formErrors.longitude}
                            disabled
                        />


                    </div>


                </div>


                <div>
                    <CustomTextField
                        select
                        className='w-96'
                        name='status'
                        label='Status'
                        value={EditData.status || 'ACTIVE'}
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

                {hasPermission("utsav_promotional_banner:edit") && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                    // disabled={!(image.webBanner && image.mobBanner)}
                    >
                        Save Changes
                    </Button>
                )}




                <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditModal
