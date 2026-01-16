'use client'

import CustomTextField from "@/@core/components/mui/TextField"
import EmployeeService from "@/services/employee/EmployeeService"
import FollowUpService from "@/services/follow-up/followupService"
import MeetingLabelService from "@/services/follow-up/meetingLabelService"
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    Typography
} from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import Script from 'next/script'
import { useState, useCallback, useEffect } from "react"
import { toast } from "react-toastify"

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const FollowUpMeetingEdit = () => {
    const { id } = useParams()
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
    const [businessDetails, setBusinessDetails] = useState(null)
    const [employeeDetails, setEmployeeDetails] = useState([])
    const [employeeInputValue, setEmployeeInputValue] = useState('')
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [meetingLabel, setMeetingLabel] = useState([])
    const [loading, setLoading] = useState({
        page: true, // Initial page load
        employee: false,
        location: false,
        submit: false,
        otp: false
    })

    // Fetch initial follow-up data
    useEffect(() => {
        const fetchFollowUpData = async () => {
            if (!id) return
            setLoading(prev => ({ ...prev, page: true }))
            try {
                const response = await FollowUpService.getById(id)
                const data = response.data

                setFormData({
                    // meeting_with: data.meeting_with || "",
                    // decision_person_name: data.decision_person_name || "",
                    // followup_label: data.followup_label?._id || "",
                    // isScheduled: data.isScheduled || false,
                    // next_followup_note: data.next_followup_note || "",
                    // Format date for datetime-local input
                    // next_followup_date: data.next_followup_date ? new Date(data.next_followup_date).toISOString().slice(0, 16) : '',
                    // followup_followby: data.followup_followby?._id || "",
                    business_id: data.business_id?._id || "",
                    // location: data.location || { latitude: '', longitude: '', address: '' },
                    otp: ''
                })

                if (data.business_id) {
                    setBusinessDetails(data.business_id)
                }

                if (data.followup_followby) {
                    setEmployeeDetails([data.followup_followby])
                    setEmployeeInputValue(`${data.followup_followby.name} (${data.followup_followby.employee_id})`)
                }

            } catch (error) {
                // toast.error('Failed to fetch follow-up details.')
                console.error("Failed to fetch follow-up details:", error)
                router.back()
            } finally {
                setLoading(prev => ({ ...prev, page: false }))
            }
        }

        fetchFollowUpData()
    }, [id, router])

    // Fetch meeting labels
    useEffect(() => {
        const fetchMeetingLabels = async () => {
            try {
                const response = await MeetingLabelService.get()
                setMeetingLabel(response.data)
            } catch (error) {
                console.error('Error fetching meeting labels:', error)
            }
        }
        fetchMeetingLabels()
    }, [])

    // Form validation
    const validateForm = () => {
        const errors = {}
        if (!formData.meeting_with) errors.meeting_with = "Meeting with is required"
        if (!formData.decision_person_name) errors.decision_person_name = "Decision person name is required"
        if (!formData.followup_label) errors.followup_label = "Follow-up label is required"
        if (!formData.business_id) errors.business_id = "Business is required"
        if (!formData.otp) errors.otp = "OTP is required"
        if (formData.isScheduled && !formData.next_followup_note) errors.next_followup_note = "Next follow-up note is required"
        if (formData.isScheduled && !formData.next_followup_date) errors.next_followup_date = "Next follow-up date is required"
        if (!formData.location.latitude || !formData.location.longitude) errors.location = "Location is required"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Employee search handler
    const handleSearchEmployee = async (searchValue) => {
        if (searchValue?.length >= 3) {
            setLoading(prev => ({ ...prev, employee: true }))
            try {
                const response = await EmployeeService.getEmployeeDetailsByMobile({ search: searchValue })
                // Prevent duplicates if already selected
                const existingEmployee = employeeDetails.find(e => e._id === formData.followup_followby);
                const newEmployees = response.data.filter(e => e._id !== existingEmployee?._id);
                setEmployeeDetails(existingEmployee ? [existingEmployee, ...newEmployees] : newEmployees)
            } catch (error) {
                console.error("Failed to fetch employee details:", error)
            } finally {
                setLoading(prev => ({ ...prev, employee: false }))
            }
        }
    }

    // Centralized change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const val = type === 'checkbox' ? checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
        setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Reverse geocoding
    const reverseGeocode = (lat, lng) => {
        if (!isMapLoaded) return Promise.reject('Google Maps not loaded')
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

    // Use current location handler
    const handleUseCurrentLocation = () => {
        setLoading(prev => ({ ...prev, location: true }))
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords
            try {
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
            toast.error("Geolocation is not supported or permission denied.")
            setLoading(prev => ({ ...prev, location: false }))
        })
    }

    const debouncedSearchEmployee = useCallback(debounce(handleSearchEmployee, 500), [employeeDetails]);

    // Send OTP handler
    const handleSendOTP = async () => {
        setLoading(prev => ({ ...prev, otp: true }))
        try {
            await FollowUpService.sendOTP()
            // toast.success("OTP sent successfully!")
        } catch (error) {
            // toast.error("Failed to send OTP.")
            console.error("Failed to send OTP:", error)
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
        try {
            await FollowUpService.update(id, bodyData)
            router.back()
        } catch (error) {
            console.error("Failed to update follow-up:", error)
        } finally {
            setLoading(prev => ({ ...prev, submit: false }))
        }
    }

    if (loading.page) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        )
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
                    title="Edit Follow-Up Meeting"
                    subheader={`Editing details for Business: ${businessDetails?.companyInfo?.companyName || 'N/A'}`}
                />
                <CardContent>
                    <Grid container spacing={4}>
                        {/* Section 1: Meeting Details */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Meeting Details</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField
                                label="Business"
                                fullWidth
                                value={businessDetails ? `${businessDetails.companyInfo?.companyName} (${businessDetails.vendorId})` : ''}
                                disabled
                                error={Boolean(formErrors.business_id)}
                                helperText={formErrors.business_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="meeting_with" label="Meeting With" fullWidth value={formData.meeting_with} onChange={handleChange} error={Boolean(formErrors.meeting_with)} helperText={formErrors.meeting_with} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="decision_person_name" label="Decision Maker Name" fullWidth value={formData.decision_person_name} onChange={handleChange} error={Boolean(formErrors.decision_person_name)} helperText={formErrors.decision_person_name} />
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
                            <CustomTextField name="latitude" label="Latitude" fullWidth value={formData.location?.latitude} disabled />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomTextField name="longitude" label="Longitude" fullWidth value={formData.location?.longitude} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField label="Current Address" fullWidth value={formData.location?.address} disabled multiline rows={2} />
                            {formErrors.location && <Typography color="error" variant="caption">{formErrors.location}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" onClick={handleUseCurrentLocation} disabled={loading.location}>
                                {loading.location ? <CircularProgress size={24} color="inherit" /> : 'Update to Current Location'}
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
                                        getOptionLabel={(option) => `${option.name} (${option.employee_id})`}
                                        value={employeeDetails.find(e => e._id === formData.followup_followby) || null}
                                        onChange={(e, newVal) => setFormData(prev => ({ ...prev, followup_followby: newVal?._id || '' }))}
                                        inputValue={employeeInputValue}
                                        onInputChange={(e, newInputValue, reason) => {
                                            setEmployeeInputValue(newInputValue)
                                            if (reason === 'input') debouncedSearchEmployee(newInputValue)
                                        }}
                                        loading={loading.employee}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label="Assign to Employee"
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
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={loading.submit}>
                                {loading.submit ? <CircularProgress size={24} color="inherit" /> : 'Update Follow-Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FollowUpMeetingEdit;
