'use client'

import CustomTextField from "@/@core/components/mui/TextField"
import EmployeeService from "@/services/employee/EmployeeService"
import FollowUpCallService from "@/services/follow-up/followupCallService"
import FollowUpService from "@/services/follow-up/followupService"
import MeetingLabelService from "@/services/follow-up/meetingLabelService"
import CouponRoute from "@/services/utsav/managecoupon/manage"
import { Autocomplete, Box, Button, MenuItem, Typography, Grid, Paper } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import Script from 'next/script'
import { useState, useCallback, useEffect, use } from "react"

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const FollowUpCallEdit = () => {
    const { id } = useParams()
    const router = useRouter()
    const [formData, setformData] = useState({
        followup_followby: "",
        business_id: "",
        call_label: "",
        call_type: "",
        call_note: "",
        isScheduled: false,
        next_call_date: '',
    })
    const [formErrors, setFormErrors] = useState({})
    const [businessDetails, setBusinessDetails] = useState([])
    const [employeeDetails, setEmployeeDetails] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [employee_inputValue, setEmployeeInputValue] = useState('')
    const [address, setAddress] = useState('')
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [meetingLabel, setMeetingLabel] = useState([])

    const fetchData = async () => {
        try {
            const response = await FollowUpCallService.getById(id)
            setformData({ ...formData, business_id: response.data?.business_id._id || '' })

            setBusinessDetails({ ...response.data?.business_id.companyInfo, vendorId: response.data.business_id.vendorId || '' })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    const validateForm = () => {
        const errors = {}
        if (!formData.call_label) errors.call_label = "Call label is required"
        if (!formData.business_id) errors.business_id = "Business is required"
        if (!formData.call_type) errors.call_type = "Call type is required"
        if (!formData.call_note) errors.call_note = "Call note is required"
        if (formData.isScheduled && !formData.next_call_date) errors.next_call_date = "Next call date is required if scheduled"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    console.log("Form Errors:", formErrors);
    

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            try {
                const response = await CouponRoute.getSearchBusiness({ search: searchValue })
                setBusinessDetails(response.data || [])
            } catch (error) {
                console.error("Failed to fetch business details:", error);
                setBusinessDetails([])
            }
        } else {
            setBusinessDetails([])
        }
    }

    const handleSearchEmployee = async (searchValue) => {
        if (searchValue?.length >= 3) {
            try {
                const response = await EmployeeService.getEmployeeDetailsByMobile({ search: searchValue })
                setEmployeeDetails(response.data || [])
            } catch (error) {
                console.error("Failed to fetch employee details:", error);
                setEmployeeDetails([])
            }
        } else {
            setEmployeeDetails([])
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setformData(prev => ({ ...prev, [name]: checked }))
        } else if (name === 'latitude' || name === 'longitude') {
            setformData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }))
        } else {
            setformData(prev => ({ ...prev, [name]: value }))
        }
        setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MeetingLabelService.get()
                setMeetingLabel(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const reverseGeocode = (lat, lng) => {
        if (!isMapLoaded) return Promise.reject('Google Maps not loaded yet')
        const geocoder = new window.google.maps.Geocoder()
        const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }

        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve(results[0].formatted_address)
                } else {
                    reject('Geocoding failed')
                }
            })
        })
    }

    const handleUseCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude.toFixed(6)
            const lng = position.coords.longitude.toFixed(6)
            setformData(prev => ({ ...prev, location: { latitude: lat, longitude: lng } }))
            try {
                const address = await reverseGeocode(lat, lng)
                setAddress(address)
            } catch (error) {
                console.error('Failed to get address:', error)
            }
        })
    }

    const debouncedSearch = useCallback(debounce(handleSearch, 500), [])
    const debouncedSearchEmployee = useCallback(debounce(handleSearchEmployee, 500), [])

    const handleSubmit = async () => {
        if (!validateForm()) return
        //remove followup_followby  and next followup_date if not scheduled and next followup_date is not provided
        const bodyData = { ...formData }
        if (!bodyData.isScheduled) {
            delete bodyData.followup_followby
            delete bodyData.next_call_date
        }
        if (bodyData.followup_followby === '') {
            delete bodyData.followup_followby
        }
        try {
            await FollowUpCallService.update(id, bodyData)
            router.back();
        } catch (error) {
            console.error("Failed to update follow up:", error)
        }
    }
    console.log("Form Data:", formData);

    const call_labels = ["connected", "answered", "call_later", "no_answered", "not_connected", "number_busy", "wrong_number", "switched_off"];
    const call_types = ["outgoing", "incoming"];


    return (
        <Box>

            <Typography variant="h4" sx={{ mb: 4, textAlign: { xs: 'center', sm: 'left' } }}>
                Update Follow Up Call
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField name="business_id"
                            label="Business"
                            fullWidth
                            value={`${businessDetails.companyName} - ${businessDetails.vendorId}`}
                            error={Boolean(formErrors.business_id)}
                            helperText={formErrors.business_id}
                            disabled />
                    </Grid>
                

                    <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField name="call_label" label="Call Label" select fullWidth value={formData.call_label} onChange={handleChange} error={Boolean(formErrors.call_label)} helperText={formErrors.call_label}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Call Label</p>
                                        }
                                        const selectedItem = call_labels.find(item => item === selected)
                                        return selectedItem ? selectedItem.replace(/_/g, ' ').charAt(0).toUpperCase() + selectedItem.replace(/_/g, ' ').slice(1) : ''
                                    }
                                }
                            }}
                        >
                            {call_labels.map(label => (
                                <MenuItem key={label} value={label}>{label.replace(/_/g, ' ').charAt(0).toUpperCase() + label.replace(/_/g, ' ').slice(1)}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField name="call_type" label="Call Type" select fullWidth value={formData.call_type} onChange={handleChange} error={Boolean(formErrors.call_type)} helperText={formErrors.call_type}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Call Type</p>
                                        }
                                        const selectedItem = call_types.find(item => item === selected)
                                        return selectedItem ? selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1) : ''
                                    }
                                }
                            }}
                        >
                            {call_types.map(type => (
                                <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField name="call_note" label="Call Note" fullWidth value={formData.call_note} onChange={handleChange} error={Boolean(formErrors.call_note)} helperText={formErrors.call_note} multiline rows={2} />
                    </Grid>





                    <Grid item xs={12} sm={6} md={3}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input type="checkbox" name="isScheduled" checked={formData.isScheduled} onChange={handleChange} style={{ marginRight: 8 }} />
                            <Typography variant="body1">Is Scheduled?</Typography>
                        </label>
                    </Grid>

                    {formData.isScheduled && <Grid item xs={12} sm={6} md={3}>
                        <CustomTextField name="next_call_date" label="Next Follow Up Date" type="date" fullWidth value={formData.next_call_date} onChange={handleChange} error={Boolean(formErrors.next_call_date)} helperText={formErrors.next_call_date} />
                    </Grid>}






                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleSubmit}>Create Follow Up</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default FollowUpCallEdit
