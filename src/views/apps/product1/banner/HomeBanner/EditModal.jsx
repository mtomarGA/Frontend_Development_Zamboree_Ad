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
import { Autocomplete, createFilterOptions, MenuItem, Grid, FormControlLabel, Switch } from '@mui/material'

// Services
import categoryRoute from '@/services/utsav/category'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service'
import CategoryBannerRoute from '@/services/business/service/categoryBanner.service.js'
import { useAuth } from '@/contexts/AuthContext'
import GoogleMapLocation from '@/views/apps/event/ManageEvent/GoogleMapLocation'
import Image from '@/services/imageService'

function EditModal({ Editopen, handleEditClose, handleEditOpen, selectedId, getdata }) {

    const [AddData, setAddData] = useState({
        BusinessId: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'PENDING',
    })

    const { hasPermission } = useAuth()
    const [formErrors, setFormErrors] = useState({})
    const [categoryTypes, setcategoryTypes] = useState([])
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const [allCitys, setcityes] = useState([])
    const [allArea, setAllArea] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [BusinessData, setBusinessData] = useState([])
    const [SearchData, setSearchData] = useState([])
    const [selectedBusiness, setSelectedBusiness] = useState(null)

    const validateFields = (data) => {
        let errors = {}
        if (!data.status) errors.status = 'Status is required'
        if (!data.mobBanner) errors.mobBanner = 'Mobile banner is required'
        if (!data.webBanner) errors.webBanner = 'Web banner is required'
        if (!data.latitude) errors.latitude = 'Latitude is required'
        if (!data.longitude) errors.longitude = 'Longitude is required'
        if (!data.address) errors.address = 'Address is required'
        return errors
    }

    useEffect(() => {
        const getcategorydata = async () => {
            const response = await categoryRoute.getcategory()
            setcategoryTypes(response.data)
        }
        getcategorydata()
        countrys()
        business()
    }, [])

    const countrys = async () => {
        const result = await countryService.getCountries()
        setCountry(result.data)
    }

    const states = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setState(result.data)
        setAddData((prev) => ({ ...prev, state: '', city: '', area: '' }))
        setFormErrors((prev) => ({ ...prev, state: '', city: '', area: '' }))
    }

    const citys = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setcityes(result.data)
        setAddData((prev) => ({ ...prev, city: '', area: '' }))
        setFormErrors((prev) => ({ ...prev, city: '', area: '' }))
    }

    const area = async (cityId) => {
        const result = await areaService.getAreaById(cityId)
        setAllArea(result.data)
        setAddData((prev) => ({ ...prev, area: '' }))
        setFormErrors((prev) => ({ ...prev, area: '' }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddData((prev) => ({ ...prev, [name]: value }))
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const onchangeimage = async (e) => {
        const { name, files } = e.target
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setAddData((prev) => ({
                ...prev,
                [name]: result.data.url,
            }))
            if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    useEffect(() => {
        const fetchEditData = async () => {
            if (!Editopen || !selectedId) return

            await countrys()

            const countryId = selectedId?.country?._id || ''
            if (countryId) await states(countryId)

            const stateId = selectedId?.state?._id || ''
            if (stateId) await citys(stateId)

            const cityId = selectedId?.city?._id || ''
            if (cityId) await area(cityId)

            setAddData({
                _id: selectedId?._id || '',
                BusinessId: selectedId?.BusinessId?._id || '',
                country: countryId,
                state: stateId,
                city: cityId,
                isFeatured:selectedId.isFeatured||'',
                area: selectedId?.area?._id || '',
                status: selectedId?.status || 'ACTIVE',
                webBanner: selectedId?.webBanner || '',
                mobBanner: selectedId?.mobBanner || '',
                latitude: selectedId?.latitude || '',
                longitude: selectedId?.longitude || '',
                address: selectedId?.address || '',
            })
            if (selectedId?.BusinessId) {
                setSelectedBusiness(selectedId?.BusinessId)
            } else {
                setSelectedBusiness("")
            }

            // set selected business for autocomplete

        }

        fetchEditData()
    }, [Editopen, selectedId])

    const handleSubmit = async () => {
        const errors = validateFields({ ...AddData })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
        try {
            // console.log(selectedId._id,"selectedIdselectedId");
            const id = selectedId._id
            const response = await CategoryBannerRoute.putData(id, AddData)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleEditClose()
                setAddData({
                    BusinessId: '',
                    country: '',
                    state: '',
                    city: '',
                    area: '',
                    status: 'PENDING',
                })
                setFormErrors({})
            }
        } catch (error) {
            toast.error('Failed to add banner')
            console.error(error)
        }
    }

    const business = async () => {
        const response = await manageBusinessService.getAllBusiness()
        setBusinessData(response.data)
    }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            const response = await CategoryBannerRoute.getsearch({ search: searchValue })
            if (response.success === true) {
                setSearchData(response.data)
            }
        } else {
            setSearchData([])
        }
    }

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target
        setAddData((prev) => ({
            ...prev,
            [name]: checked,
        }))
    }

    const filter = createFilterOptions()

    const handleLocationSelect = (location) => {
        setAddData((prev) => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }))
    }

    return (
        <Dialog
            onClose={handleEditClose}
            aria-labelledby="customized-dialog-title"
            open={Editopen}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id="customized-dialog-title">
                <Typography variant="h5" component="span">
                    Update Home Banner
                </Typography>
                <DialogCloseButton onClick={handleEditClose} disableRipple>
                    <i className="tabler-x" />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>

                    {/* Web Banner */}
                    <Grid item xs={12} md={6}>
                        <label htmlFor="webBanner" className="text-sm">
                            Web Banner Image
                        </label>
                        <Button variant="outlined" component="label" className="w-full mt-1">
                            Upload File
                            <input type="file" hidden name="webBanner" onChange={onchangeimage} />
                        </Button>
                        {AddData.webBanner && (
                            <Typography variant="body2" className="mt-2 text-green-700 truncate">
                                Selected: {AddData.webBanner}
                            </Typography>
                        )}
                        {formErrors.webBanner && (
                            <Typography variant="body2" color="error">
                                {formErrors.webBanner}
                            </Typography>
                        )}
                    </Grid>

                    {/* Mobile Banner */}
                    <Grid item xs={12} md={6}>
                        <label htmlFor="mobBanner" className="text-sm">
                            Mob Banner Image
                        </label>
                        <Button variant="outlined" component="label" className="w-full mt-1">
                            Upload File
                            <input type="file" hidden name="mobBanner" onChange={onchangeimage} />
                        </Button>
                        {AddData.mobBanner && (
                            <Typography variant="body2" className="mt-2 text-green-700 truncate">
                                Selected: {AddData.mobBanner}
                            </Typography>
                        )}
                        {formErrors.mobBanner && (
                            <Typography variant="body2" color="error">
                                {formErrors.mobBanner}
                            </Typography>
                        )}
                    </Grid>

                    {/* Business Search */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={SearchData}
                            value={selectedBusiness}
                            filterOptions={(options, state) => {
                                const input = state.inputValue.toLowerCase()
                                return options.filter((option) => {
                                    const companyName = option.companyInfo?.companyName?.toLowerCase() || ''
                                    const vendorId = option.vendorId?.toLowerCase() || ''
                                    const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || ''
                                    return companyName.includes(input) || vendorId.includes(input) || phoneNo.includes(input)
                                })
                            }}
                            getOptionLabel={(option) =>
                                option?.companyInfo?.companyName ||
                                option?.vendorId ||
                                option?.contactInfo?.phoneNo ||
                                ''
                            }
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue)
                                handleSearch(newInputValue)
                            }}
                            onChange={(event, newValue) => {
                                setSelectedBusiness(newValue)
                                setAddData((prev) => ({
                                    ...prev,
                                    BusinessId: newValue?._id || '',
                                }))
                                if (formErrors.BusinessId) setFormErrors((prev) => ({ ...prev, BusinessId: '' }))
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="Search Business"
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
                                inputValue.length < 3 ? 'Type at least 3 characters to search' : 'No businesses found'
                            }
                        />
                    </Grid>

                    {/* Country */}
                    {/* <Grid item xs={12} md={6}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Country"
                            name="country"
                            value={AddData.country || ''}
                            error={!!formErrors.country}
                            helperText={formErrors.country}
                            onChange={(e) => {
                                handleChange(e)
                                states(e.target.value)
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select Country
                            </MenuItem>
                            {country.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid> */}

                    {/* State */}
                    {/* <Grid item xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            options={state || []}
                            getOptionLabel={(option) => option?.name || ''}
                            value={state.find((s) => s._id === AddData.state) || null}
                            onChange={(e, newValue) => {
                                setAddData((prev) => ({
                                    ...prev,
                                    state: newValue?._id || '',
                                    city: '',
                                    area: '',
                                }))
                                if (newValue?._id) citys(newValue._id)
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="State"
                                    error={!!formErrors.state}
                                    helperText={formErrors.state}
                                    placeholder="Search or select State"
                                    disabled={!AddData.country}
                                />
                            )}
                        />
                    </Grid> */}

                    {/* City */}
                    {/* <Grid item xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            options={allCitys || []}
                            getOptionLabel={(option) => option?.name || ''}
                            value={allCitys.find((c) => c._id === AddData.city) || null}
                            onChange={(e, newValue) => {
                                setAddData((prev) => ({
                                    ...prev,
                                    city: newValue?._id || '',
                                    area: '',
                                }))
                                if (newValue?._id) area(newValue._id)
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="City"
                                    error={!!formErrors.city}
                                    helperText={formErrors.city}
                                    placeholder="Search or select City"
                                    disabled={!AddData.state}
                                />
                            )}
                        />
                    </Grid> */}

                    {/* Area */}
                    {/* <Grid item xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            options={allArea || []}
                            getOptionLabel={(option) => option?.name || ''}
                            value={allArea.find((a) => a._id === AddData.area) || null}
                            onChange={(e, newValue) => {
                                setAddData((prev) => ({
                                    ...prev,
                                    area: newValue?._id || '',
                                }))
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="Area"
                                    error={!!formErrors.area}
                                    helperText={formErrors.area}
                                    placeholder="Search or select Area"
                                    disabled={!AddData.city}
                                />
                            )}
                        />
                    </Grid> */}

                    {/* Status */}
                    <Grid item xs={12} md={4}>
                        <CustomTextField
                            select
                            fullWidth
                            name="status"
                            label="Status"
                            value={AddData.status || ''}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="PENDING">PENDING</MenuItem>
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12} md={2} className="mt-4">

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={AddData.isFeatured}
                                    onChange={handleSwitchChange}
                                    name="isFeatured"
                                    color="primary"
                                />
                            }
                            label={AddData.isFeatured ? 'Black' : 'White'}
                        />
                    </Grid>

                    {/* Google Map */}
                    <Grid item xs={12}>
                        <GoogleMapLocation onSelect={handleLocationSelect} />
                    </Grid>

                    {/* Coordinates */}
                    <Grid item xs={12} md={6}>
                        <CustomTextField
                            fullWidth
                            name="latitude"
                            label="Latitude"
                            value={AddData?.latitude || ''}
                            error={!!formErrors.latitude}
                            helperText={formErrors.latitude}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomTextField
                            fullWidth
                            name="longitude"
                            label="Longitude"
                            value={AddData?.longitude || ''}
                            error={!!formErrors.longitude}
                            helperText={formErrors.longitude}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField
                            fullWidth
                            disabled
                            name="address"
                            label="Address"
                            value={AddData?.address || ''}
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions className="mt-3">
                <Button onClick={handleEditClose} variant="tonal" color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    Update Home Banner
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditModal
