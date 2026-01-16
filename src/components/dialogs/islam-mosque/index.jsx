'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useEffect, useState } from 'react'
import GoogleMapLocation from '@/views/apps/spritual/islam/mosque/components/GoogleMapLocation'
import countryService from '@/services/location/country.services'
import { Autocomplete, MenuItem } from '@mui/material'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'


const AddContent = ({ open, handleClose, handleAdd, title, loading }) => {
    const [data, setData] = useState({ name: '', area: '', city: '', state: '', country: "", coordinates: { latitude: '', longitude: '' }, address: '' })
    const [errors, setErrors] = useState({ name: '', area: '', city: '', state: '', country: '', latitude: '', longitude: '', address: '' })
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [areaList, setAreaList] = useState([])

    const getCountry = async () => {
        const result = await countryService.getCountries()
        setCountryList(result.data)
    }

    const getStatesbyId = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setStateList(result.data)
    }
    const getCityByStateId = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setCityList(result.data)
    }

    const getAreaByCityId = async (cityId) => {
        const result = await areaService.getAreaById(cityId)
        setAreaList(result.data)
    }

    useEffect(() => {
        getCountry()
    }, [])



    const handleChange = (name, value) => {
        if (name === 'latitude' || name === 'longitude') {
            setData(prev => ({ ...prev, coordinates: { ...prev.coordinates, [name]: value } }))
            setErrors(prev => ({ ...prev, [name]: '' }))
            return;
        }
        //make sure doest not update coordinates
        setData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!data.name) newErrors.name = `Name is required`
        if (!data.area) newErrors.area = 'Area is required'
        if (!data.city) newErrors.city = 'City is required'
        if (!data.state) newErrors.state = 'State is required'
        if (!data.area) newErrors.area = 'Area is required'
        if (!data.country) newErrors.country = 'Country is required'
        if (!data.coordinates.latitude) newErrors.latitude = 'Latitude is required'
        if (!data.coordinates.longitude) newErrors.longitude = 'Longitude is required'
        if (!data.address) newErrors.address = 'Address is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        console.log(validate());

        if (validate()) {
            console.log('Submitting data:', data);

            handleAdd(data)
        }
    }


    return (
        <>
            <DialogContent className=' px-4 pt-0 sm:px-6 scrollable-content'>
                <CustomTextField
                    fullWidth
                    label={"Name"}
                    variant='outlined'
                    value={data.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={`Enter Name`}
                    className='mb-4'
                    error={!!errors.name}
                    helperText={errors.name}
                />

                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(countryList) ? countryList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(countryList) ? countryList : []).find(item => item._id === data.country) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('country', id)
                        getStatesbyId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            fullWidth
                            label="Country"
                            placeholder="Select Country"
                            required
                            error={!!errors.country}
                            helperText={errors.country}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(stateList) ? stateList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(stateList) ? stateList : []).find(item => item._id === data.state) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('state', id)
                        getCityByStateId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            fullWidth
                            label="State"
                            placeholder="Select State"
                            required
                            error={!!errors.state}
                            helperText={errors.state}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(cityList) ? cityList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(cityList) ? cityList : []).find(item => item._id === data.city) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('city', id)
                        getAreaByCityId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            fullWidth
                            label="City"
                            placeholder="Select City"
                            required
                            error={!!errors.city}
                            helperText={errors.city}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(areaList) ? areaList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(areaList) ? areaList : []).find(item => item._id === data.area) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('area', id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            label="Area"
                            fullWidth
                            placeholder="Select Area"
                            required
                            error={!!errors.area}
                            helperText={errors.area}
                        />
                    )}
                />
                <GoogleMapLocation errors={errors} address={data.address} coordinates={data.coordinates} handleChange={handleChange} />

            </DialogContent >
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button type='submit' variant='contained' onClick={handleSubmit} disabled={loading}>
                    Create
                </Button>
                <Button onClick={handleClose} variant='outlined'>
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

const EditContent = ({ handleClose, editData, handleUpdate, title, open }) => {
    console.log('EditContent editData:', editData);
    const [data, setData] = useState({ name: editData.name, area: editData.area, city: editData.city._id, state: editData.state._id, country: editData.country._id, coordinates: { latitude: editData.coordinates.latitude, longitude: editData.coordinates.longitude }, address: editData.address, status: editData.status })
    const [errors, setErrors] = useState({ name: '', area: '', city: '', state: '', country: '', latitude: '', longitude: '', address: '' })
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [areaList, setAreaList] = useState([])

    const getCountry = async () => {
        const result = await countryService.getCountries()
        setCountryList(result.data)
    }

    const getStatesbyId = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setStateList(result.data)
    }
    const getCityByStateId = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setCityList(result.data)
    }

    const getAreaByCityId = async (cityId) => {
        const result = await areaService.getAreaById(cityId)
        setAreaList(result.data)
    }

    useEffect(() => {
        getCountry()
        getStatesbyId(editData.country._id)
        getCityByStateId(editData.state._id)
        getAreaByCityId(editData.city._id)
    }, [])



    const handleChange = (name, value) => {
        if (name === 'latitude' || name === 'longitude') {
            setData(prev => ({ ...prev, coordinates: { ...prev.coordinates, [name]: value } }))
            setErrors(prev => ({ ...prev, [name]: '' }))
            return;
        }
        //make sure doest not update coordinates
        setData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!data.name) newErrors.name = `Name is required`
        if (!data.area) newErrors.area = 'Area is required'
        if (!data.city) newErrors.city = 'City is required'
        if (!data.state) newErrors.state = 'State is required'
        if (!data.area) newErrors.area = 'Area is required'
        if (!data.country) newErrors.country = 'Country is required'
        if (!data.coordinates.latitude) newErrors.latitude = 'Latitude is required'
        if (!data.coordinates.longitude) newErrors.longitude = 'Longitude is required'
        if (!data.address) newErrors.address = 'Address is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        console.log(validate());
        if (validate()) {
            console.log('Submitting data:', data);
            handleUpdate(data)
        }
    }


    return (
        <>
            <DialogContent className=' px-4 pt-0 sm:px-6 scrollable-content'>
                <CustomTextField
                    fullWidth
                    label={"Name"}
                    variant='outlined'
                    value={data.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={`Enter Name`}
                    className='mb-4'
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(countryList) ? countryList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(countryList) ? countryList : []).find(item => item._id === data.country) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('country', id)
                        getStatesbyId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            label="Country"
                            placeholder="Select Country"
                            required
                            error={!!errors.country}
                            helperText={errors.country}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(stateList) ? stateList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(stateList) ? stateList : []).find(item => item._id === data.state) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('state', id)
                        getCityByStateId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            label="State"
                            placeholder="Select State"
                            required
                            error={!!errors.state}
                            helperText={errors.state}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(cityList) ? cityList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(cityList) ? cityList : []).find(item => item._id === data.city) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('city', id)
                        getAreaByCityId(id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            label="City"
                            placeholder="Select City"
                            required
                            error={!!errors.city}
                            helperText={errors.city}
                        />
                    )}
                />
                <Autocomplete
                    className='mb-4'
                    fullWidth
                    options={Array.isArray(areaList) ? areaList : []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={(Array.isArray(areaList) ? areaList : []).find(item => item._id === data.area) || null}
                    onChange={(e, newValue) => {
                        const id = newValue?._id || ''
                        handleChange('area', id)
                    }}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            label="Area"
                            placeholder="Select Area"
                            required
                            error={!!errors.area}
                            helperText={errors.area}
                        />
                    )}
                />
                <CustomTextField select onChange={e => handleChange('status', e.target.value)} fullWidth label='Mosque Status' defaultValue={data.status}>
                    <MenuItem value='ACTIVE'>
                        Active
                    </MenuItem>
                    <MenuItem value='INACTIVE'>
                        Inactive
                    </MenuItem>
                </CustomTextField>
                <GoogleMapLocation errors={errors} address={data.address} coordinates={data.coordinates} handleChange={handleChange} />

            </DialogContent>
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button variant='contained' onClick={handleSubmit}>
                    Update
                </Button>
                <Button variant='outlined' onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

const IslamMosqueModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
    if (data === null) {
        console.log('IslamAudio data: ', data);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            closeAfterTransition={false}
            maxWidth='md'
            fullWidth
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogCloseButton onClick={handleClose} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='text-left px-4 pt-6 sm:px-6'>
                {data ? `Edit ${title}` : `Add ${title}`}
            </DialogTitle>
            {data === null ? (
                <AddContent open={open} loading={loading} handleClose={handleClose} handleAdd={handleAdd} title={title} />
            ) : (
                <EditContent open={open} handleClose={handleClose} handleUpdate={handleUpdate} editData={data} title={title} />
            )}
        </Dialog>
    )
}

export default IslamMosqueModal;
