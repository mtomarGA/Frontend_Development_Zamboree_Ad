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
import { Autocomplete, createFilterOptions, IconButton, InputAdornment, MenuItem, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Services
import categoryRoute from '@/services/utsav/category'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices'
import { useAuth } from '@/contexts/AuthContext'
import Image from '@/services/imageService'
import GoogleMapLocation from '@/views/apps/event/ManageEvent/GoogleMapLocation'

function EditModal({ Editopen, handleEditClose, handleEditOpen, selectedId, getdata }) {
    const [EditData, setEditData] = useState({
        category: '',
        latitude: '',
        longitude: '',
        address: '',
        validity: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'ACTIVE',
        BusinessId: ''
    })

    const [inputValue, setInputValue] = useState('');
    // const [BusinessData, setBusinessData] = useState([]);
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

    const [isUploadingWeb, setIsUploadingWeb] = useState(false);
    const [isUploadingMob, setIsUploadingMob] = useState(false);

    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const { hasPermission } = useAuth();
    // Simplified validation function
    const validateFields = (data) => {
        let errors = {};
        // if (!data.country) errors.country = 'Country is required';
        // if (!data.state) errors.state = 'State is required';
        // if (!data.city) errors.city = 'City is required';
        // if (!data.area) errors.area = 'Area is required';
        if (!data.status) errors.status = 'Status is required';

        return errors;
    };

    console.log(selectedId, "dd")
    // Fetch business data by ID
    const fetchBusinessData = async (businessId) => {
        try {
            const response = await manageBusinessService.getBusinessById(businessId);
            if (response.success && response.data) {
                setSelectedBusiness(response.data);
                // Set input value for Autocomplete display
                setInputValue(response.data?.companyInfo?.companyName || response.data?.vendorId || '');
            }
        } catch (error) {
            console.error('Error fetching business data:', error);
        }
    };

    // Fetch data when dialog opens
    useEffect(() => {
        const fetchAllData = async () => {
            if (!Editopen || !selectedId) return;

            // Step 1: Load countries first (commented out as location fields are not used)
            // await countrys();

            // Step 2: Set country and fetch dependent state (commented out as location fields are not used)
            // const countryId = selectedId?.country?._id || '';
            // if (countryId) await states(countryId);

            // Step 3: Set state and fetch dependent city (commented out as location fields are not used)
            // const stateId = selectedId?.state?._id || '';
            // if (stateId) await citys(stateId);

            // Step 4: Set city and fetch dependent area (commented out as location fields are not used)
            // const cityId = selectedId?.city?._id || '';
            // if (cityId) await area(cityId);

            // Step 5: Set all form data
            setEditData({
                _id: selectedId?._id || '',
                category: selectedId?.category || '',
                validity: selectedId?.validity || '',
                status: selectedId?.status || 'ACTIVE',
                BusinessId: selectedId?.BusinessId || '',
                // country: countryId,
                // state: stateId,
                // city: cityId,
                // area: selectedId?.area?._id || '',
                address: selectedId?.address || '',
                longitude: selectedId?.longitude || '',
                latitude: selectedId?.latitude || '',
                webBanner: selectedId?.webBanner || '',
                mobBanner: selectedId?.mobBanner || ''
            });

            // Step 6: Set selected business (fetch full details for Autocomplete)
            if (selectedId?.BusinessId) {
                await fetchBusinessData(selectedId.BusinessId);
            }
        };

        fetchAllData();
    }, [Editopen, selectedId]);


    console.log(EditData, "sss")

    // Fetch initial data
    useEffect(() => {
        const getcategorydata = async () => {
            const response = await categoryRoute.getcategory()
            setcategoryTypes(response?.data)
        }
        getcategorydata()
        // countrys()
    }, [])

    // // Location data fetch functions
    // const countrys = async () => {
    //     const result = await countryService.getCountries()
    //     setCountry(result.data)
    // }

    // const states = async (CountryId) => {
    //     const result = await stateService.getStateById(CountryId)
    //     setState(result.data)
    // }

    // const citys = async (stateId) => {
    //     const result = await CityService.getCityById(stateId)
    //     setcityes(result.data)
    // }

    // const area = async (cityId) => {
    //     const result = await areaService.getAreaById(cityId)
    //     setAllArea(result?.data)
    // }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // const onchangeimage = (e) => {
    //     const { name, files } = e.target;
    //     if (files && files.length > 0) {
    //         setImage(prev => ({ ...prev, [name]: files[0] }));
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
                setEditData(prev => ({
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

    const handleSubmit = async () => {
        const errors = validateFields(EditData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }


        try {
            const response = await HomeBannerRoute.putData(EditData?._id, EditData);
            if (response?.success == true) {
                toast.success(response?.message || "Home Banner Updated Successfully");
                handleEditClose();
                await getdata();
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
            const response = await HomeBannerRoute.getsearch({ search: searchValue });
            if (response.success === true) {
                setSearchData(response.data);
            }
        } else {
            setSearchData([]); // Clear results when search term is too short
        }
    };

    const filter = createFilterOptions();

    // Reset form when dialog closes
    const handleClose = () => {
        handleEditClose();
    };


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
            onClose={handleClose}
            open={Editopen}
            fullWidth
            maxWidth='md'
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle>
                <Typography variant='span'>Edit Home Banner</Typography>
                <DialogCloseButton onClick={handleClose}>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>
                {/* Image upload sections */}
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
                                    EditData.webBanner ? 'Change File' : 'Upload File'
                                )}
                                <input type='file' hidden name='webBanner' onChange={onchangeimage} />
                            </Button>
                            {EditData.webBanner && (
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {EditData?.webBanner}
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
                                    EditData.mobBanner ? 'Change File' : 'Upload File'
                                )}
                                <input type='file' hidden name='mobBanner' onChange={onchangeimage} />
                            </Button>
                            {EditData.mobBanner && (
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {EditData?.mobBanner}
                                </Typography>

                            )}
                        </div>
                    </div>
                </div>

                {/* Location fields */}
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


                    <CustomTextField
                        select
                        className='w-96'
                        name='status'
                        label='Status'
                        value={EditData.status || ''}
                        onChange={handleChange}
                        error={!!formErrors.status}
                        helperText={formErrors.status}
                    >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='PENDING'>PENDING</MenuItem>

                    </CustomTextField>
                    {/* 
                    <CustomTextField
                        select
                        className='w-96'
                        label="Country"
                        name='country'
                        value={EditData.country || ''}
                        onChange={(e) => {
                            handleChange(e);
                            states(e.target.value);
                            setEditData(prev => ({ ...prev, state: '', city: '', area: '' }));
                        }}
                        error={!!formErrors.country}
                        helperText={formErrors.country}
                    >
                        <MenuItem value='' disabled>Select Country</MenuItem>
                        {country.map(item => (
                            <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                        ))}
                    </CustomTextField> */}
                </div>

                {/* <div className='flex justify-between my-2'>
                    <CustomTextField
                        select
                        className='w-96'
                        label="State"
                        name='state'
                        value={EditData.state || ''}
                        onChange={(e) => {
                            handleChange(e);
                            citys(e.target.value);
                            setEditData(prev => ({ ...prev, city: '', area: '' }));
                        }}
                        disabled={!EditData.country}
                        error={!!formErrors.state}
                        helperText={formErrors.state}
                    >
                        <MenuItem value='' disabled>Select State</MenuItem>
                        {state.map(item => (
                            <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                        ))}
                    </CustomTextField>

                    <CustomTextField
                        select
                        className='w-96'
                        label="City"
                        name='city'
                        value={EditData.city || ""}
                        onChange={(e) => {
                            handleChange(e);
                            area(e.target.value);
                            setEditData(prev => ({ ...prev, area: '' }));
                        }}
                        disabled={!EditData.state}
                        error={!!formErrors.city}
                        helperText={formErrors.city}
                    >
                        <MenuItem value='' disabled>Select City</MenuItem>
                        {allCitys.map(city => (
                            <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                        ))}
                    </CustomTextField>
                </div> */}

                <div className='flex justify-between my-2'>
                    {/* <CustomTextField
                        select
                        className='w-96'
                        label='Area'
                        name='area'
                        value={EditData.area || ""}
                        onChange={handleChange}
                        disabled={!EditData.city}
                        error={!!formErrors.area}
                        helperText={formErrors.area}
                    >
                        <MenuItem value='' disabled>Select Area</MenuItem>
                        {allArea.map(area => (
                            <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                        ))}
                    </CustomTextField> */}

                </div>


                <div className=' my-4'>

                    <GoogleMapLocation Editlat={EditData?.latitude} Editlong={EditData?.longitude} onSelect={handleLocationSelect} />
                </div>


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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Cancel
                </Button>
                {hasPermission("utsav_banner:edit") && (
                    <Button onClick={handleSubmit} variant='contained'>
                        Save Changes
                    </Button>)
                }

            </DialogActions>
        </Dialog>
    )
}

export default EditModal
