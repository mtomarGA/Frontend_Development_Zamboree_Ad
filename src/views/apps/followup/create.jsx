'use client'

import CustomTextField from "@/@core/components/mui/TextField"
import EmployeeService from "@/services/employee/EmployeeService"
import FollowUpService from "@/services/follow-up/followupService"
import MeetingLabelService from "@/services/follow-up/meetingLabelService"
import CouponRoute from "@/services/utsav/managecoupon/manage"
import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, MenuItem, Paper, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import Script from 'next/script'
import { useState, useCallback, useEffect } from "react"
import { toast } from "react-toastify"

// Debounce function to limit API calls while typing
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const FollowUpMeetingCreate = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        location: {
            latitude: '',
            longitude: '',
            address: ''
        },
        meeting_with: "",
        decision_person_name: "",
        followup_followby: "",
        business_id: "",
        followup_label: "",
isScheduled: false,
        next_followup_note: "",
        next_followup_date: '',
        otp: ''
    })
    const [formErrors, setFormErrors] = useState({})
    const [businessDetails, setBusinessDetails] = useState([])
    const [employeeDetails, setEmployeeDetails] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [employee_inputValue, setEmployeeInputValue] = useState('')
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [meetingLabel, setMeetingLabel] = useState([])
    const [loading, setLoading] = useState({
        business: false,
        employee: false,
        location: false,
        submit: false,
        otp: false
    })

    // Form validation logic
    const validateForm = () => {
        const errors = {}
        if (!formData.meeting_with) errors.meeting_with = "Meeting with is required"
        if (!formData.decision_person_name) errors.decision_person_name = "Decision person name is required"
        if (!formData.followup_label) errors.followup_label = "Follow up label is required"
        if (!formData.business_id) errors.business_id = "Business is required"
        if (!formData.otp) errors.otp = "OTP is required"
        if (formData.isScheduled && !formData.next_followup_note) errors.next_followup_note = "Next follow up note is required"
        if (formData.isScheduled && !formData.next_followup_date) errors.next_followup_date = "Next follow up date is required"
        if (!formData.location.latitude || !formData.location.longitude) errors.location = "Location is required"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Handlers for searching businesses and employees with loading state
    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            setLoading(prev => ({ ...prev, business: true }))
            try {
                const response = await CouponRoute.getSearchBusiness({ search: searchValue })
                setBusinessDetails(response.data || [])
            } catch (error) {
                console.log("Failed to fetch business details:", error);
                setBusinessDetails([])
            } finally {
                setLoading(prev => ({ ...prev, business: false }))
            }
        } else {
            setBusinessDetails([])
        }
    }

    const handleSearchEmployee = async (searchValue) => {
        if (searchValue?.length >= 3) {
            setLoading(prev => ({ ...prev, employee: true }))
            try {
                const response = await EmployeeService.getEmployeeDetailsByMobile({ search: searchValue })
                setEmployeeDetails(response.data || [])
            } catch (error) {
                toast.error("Failed to fetch employee details.")
                setEmployeeDetails([])
            } finally {
                setLoading(prev => ({ ...prev, employee: false }))
            }
        } else {
            setEmployeeDetails([])
        }
    }

    // Centralized change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const val = type === 'checkbox' ? checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
        setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Fetch meeting labels on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MeetingLabelService.get()
                setMeetingLabel(response.data)
            } catch (error) {
                toast.error('Error fetching meeting labels.')
            }
        }
        fetchData()
    }, [])

    // Reverse geocoding with Google Maps API
    const reverseGeocode = (lat, lng) => {
        if (!isMapLoaded) return Promise.reject('Google Maps not loaded yet')
        const geocoder = new window.google.maps.Geocoder()
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve(results[0].formatted_address)
                } else {
                    reject('Geocoding failed')
                }
            })
        })
    }

    // Handler for using the user's current location
    const handleUseCurrentLocation = () => {
        setLoading(prev => ({ ...prev, location: true }))
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords
            try {
                if (!isMapLoaded) {
                    toast.error('Google Maps not loaded yet. Please retry or reload the page.');
                    return
                }
                const address = await reverseGeocode(latitude, longitude)
                setFormData(prev => ({
                    ...prev,
                    location: {
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                        address
                    }
                }))
                setFormErrors(prev => ({ ...prev, location: '' }))
            } catch (error) {
                toast.error('Failed to get address from location.')
            } finally {
                setLoading(prev => ({ ...prev, location: false }))
            }
        }, () => {
            toast.error("Geolocation is not supported by this browser or permission denied.")
            setLoading(prev => ({ ...prev, location: false }))
        })
    }

    const debouncedSearch = useCallback(debounce(handleSearch, 500), [])
    const debouncedSearchEmployee = useCallback(debounce(handleSearchEmployee, 500), [])

    // Handler to send OTP
    const handleSendOTP = async () => {
        setLoading(prev => ({ ...prev, otp: true }))
        try {
            await FollowUpService.sendOTP()
        } catch (error) {
            // toast.error("Failed to send OTP.")
            console.log("Failed to send OTP:", error);
            
        } finally {
            setLoading(prev => ({ ...prev, otp: false }))
        }
    }

    // Form submission handler
    const handleSubmit = async () => {
        if (!validateForm()) return
        setLoading(prev => ({ ...prev, submit: true }))

        const bodyData = { ...formData }
        if (!bodyData.isScheduled) {
            delete bodyData.followup_followby
            delete bodyData.next_followup_date
            delete bodyData.next_followup_note
        }
        if (bodyData.followup_followby === '') {
            delete bodyData.followup_followby
        }

        try {
            await FollowUpService.create(bodyData)
            router.back()
        } catch (error) {
            // toast.error("Failed to create follow-up.")
            console.log("Failed to create follow-up:", error);
        } finally {
            setLoading(prev => ({ ...prev, submit: false }))
        }
    }

    return (
        <Box>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="afterInteractive"
                onLoad={() => setIsMapLoaded(true)}
            />

            <Card>
                <CardHeader
                    title="Create Follow-Up Meeting"
                    subheader="Fill in the details below to schedule a new follow-up."
                />
                <CardContent>
                    <Grid container spacing={4}>

                        {/* Section 1: Meeting Details */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Meeting Details</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={businessDetails}
                                filterOptions={(x) => x}
                                getOptionLabel={(option) => typeof option === 'string' ? option : `${option.companyInfo?.companyName} (${option.vendorId})` || ''}
                                value={businessDetails.find(b => b._id === formData.business_id) || null}
                                onChange={(e, newVal) => setFormData(prev => ({ ...prev, business_id: newVal?._id || '' }))}
                                inputValue={inputValue}
                                onInputChange={(e, newInputValue, reason) => {
                                    setInputValue(newInputValue)
                                    if (reason === 'input') {
                                        setFormErrors(prev => ({ ...prev, business_id: '' }))
                                        debouncedSearch(newInputValue)
                                    }
                                }}
                                loading={loading.business}
                                renderInput={(params) => (
                                    <CustomTextField
                                        {...params}
                                        label="Search Business"
                                        placeholder="Type at least 3 characters"
                                        error={Boolean(formErrors.business_id)}
                                        helperText={formErrors.business_id}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading.business ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => <li {...props} key={option._id}>{`${option.companyInfo?.companyName} - ${option.vendorId}`}</li>}
                                noOptionsText={inputValue.length < 3 ? "Type at least 3 characters to search" : "No businesses found"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="meeting_with" label="Meeting With" placeholder="E.g. John Doe" fullWidth value={formData.meeting_with} onChange={handleChange} error={Boolean(formErrors.meeting_with)} helperText={formErrors.meeting_with} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="decision_person_name" label="Decision Maker Name" placeholder="E.g. Jane Doe" fullWidth value={formData.decision_person_name} onChange={handleChange} error={Boolean(formErrors.decision_person_name)} helperText={formErrors.decision_person_name} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="followup_label" label="Follow-Up Label" select fullWidth value={formData.followup_label} onChange={handleChange} error={Boolean(formErrors.followup_label)} helperText={formErrors.followup_label}>
                                {meetingLabel.map(label => (
                                    <MenuItem key={label._id} value={label._id}>{label.name}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid>

                        {/* Section 2: Location Details */}
                        <Grid item xs={12} mt={2}>
                            <Typography variant="h6" gutterBottom>Location Details</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="latitude" label="Latitude" fullWidth value={formData.location.latitude} disabled />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="longitude" label="Longitude" fullWidth value={formData.location.longitude} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField label="Current Address" fullWidth value={formData.location.address} disabled multiline rows={2} />
                            {formErrors.location && <Typography color="error" variant="caption">{formErrors.location}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" onClick={handleUseCurrentLocation} disabled={loading.location}>
                                {loading.location ? <CircularProgress size={24} color="inherit" /> : 'Use Current Location'}
                            </Button>
                        </Grid>

                        {/* Section 3: Scheduling */}
                        <Grid item xs={12} mt={2}>
                            <Typography variant="h6" gutterBottom>Scheduling</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox name="isScheduled" checked={formData.isScheduled} onChange={handleChange} />}
                                label="Schedule Next Follow-Up?"
                            />
                        </Grid>
                        {formData.isScheduled && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <CustomTextField
                                        name="next_followup_date"
                                        label="Next Follow-Up Date"
                                        type="date"
                                        fullWidth
                                        value={formData.next_followup_date}
                                        onChange={handleChange}
                                        error={Boolean(formErrors.next_followup_date)}
                                        helperText={formErrors.next_followup_date}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        options={employeeDetails}
                                        filterOptions={(x) => x}
                                        getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name} (${option.employee_id})` || ''}
                                        value={employeeDetails.find(e => e._id === formData.followup_followby) || null}
                                        onChange={(e, newVal) => setFormData(prev => ({ ...prev, followup_followby: newVal?._id || '' }))}
                                        inputValue={employee_inputValue}
                                        onInputChange={(e, newInputValue, reason) => {
                                            setEmployeeInputValue(newInputValue)
                                            if (reason === 'input') {
                                                setFormErrors(prev => ({ ...prev, followup_followby: '' }))
                                                debouncedSearchEmployee(newInputValue)
                                            }
                                        }}
                                        loading={loading.employee}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label="Assign to Employee"
                                                placeholder="Type to search employee"
                                                error={Boolean(formErrors.followup_followby)}
                                                helperText={formErrors.followup_followby}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loading.employee ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => <li {...props} key={option._id}>{`${option.name} - ${option.employee_id}`}</li>}
                                        noOptionsText={employee_inputValue.length < 3 ? "Type at least 3 characters to search" : "No employees found"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomTextField name="next_followup_note" label="Next Follow-Up Note" fullWidth multiline rows={3} value={formData.next_followup_note} onChange={handleChange} error={Boolean(formErrors.next_followup_note)} helperText={formErrors.next_followup_note} />
                                </Grid>
                            </>
                        )}
                        
                        {/* Section 4: Verification */}
                        <Grid item xs={12} mt={2}>
                            <Typography variant="h6" gutterBottom>Verification</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="otp" label="Verification OTP" fullWidth value={formData.otp} onChange={handleChange} error={Boolean(formErrors.otp)} helperText={formErrors.otp} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button className="mt-[18px]" fullWidth variant="outlined" onClick={handleSendOTP} disabled={loading.otp}>
                                {loading.otp ? <CircularProgress size={24} /> : 'Send OTP'}
                            </Button>
                        </Grid>
                        
                        {/* Action Buttons */}
                        <Grid item xs={12} mt={4} display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="outlined" color="secondary" onClick={() => router.back()}>
                                Go Back
                            </Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={loading.submit}>
                                {loading.submit ? <CircularProgress size={24} color="inherit" /> : 'Create Follow-Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FollowUpMeetingCreate
