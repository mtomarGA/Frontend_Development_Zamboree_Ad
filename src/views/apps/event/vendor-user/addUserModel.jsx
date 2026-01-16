'use client'
import { useEffect, useState } from 'react'
import {
    Button, Dialog, Typography, DialogTitle, DialogContent, DialogActions,
    Box, TextField, FormControl, InputLabel, Select, MenuItem,
    Autocomplete
} from '@mui/material'
import { toast } from 'react-toastify'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import { useScannerContext } from '@/contexts/scannerUser/ScannerContext'
// import userService from '@/services/userService' // <-- replace with your API service

const AddUserModal = ({ open, handleClose, getUserFun }) => {

    const { addUser, getUser, vendorEvent, getvendorEvent, setVendorEvent } = useScannerContext();

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        organizer: '',
        password: '',
        repeatPassword: '',

    })

    const [formErrors, setFormErrors] = useState({})

    // handle input changes
    const handleInputChange = e => {
        const { name, value } = e.target
        setUserData(prev => ({ ...prev, [name]: value }))

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // validation
    const validateFields = data => {
        let errors = {}
        if (!data.organizer) errors.organizer = 'Organizer is required'
        if (!data.name.trim()) errors.name = 'Name is required'
        if (!data.username.trim()) errors.username = 'Username is required'
        if (!data.password.trim()) errors.password = 'Password is required'
        if (data.password.length < 6) errors.password = 'Password must be at least 6 characters'
        if (data.password !== data.repeatPassword)
            errors.repeatPassword = 'Passwords do not match'
        return errors
    }

    // submit handler
    const handleSubmit = async () => {
        const errors = validateFields(userData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        console.log(userData, 'userData')
        try {
            const response = await addUser(userData)
            if (response.success) {
                toast.success(response.message)
                getUserFun();
                handleClose()
                return;
            }
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
            }
        } catch (error) {
            toast.error('Failed to add user')
            console.error(error)
        }
    }

    // ✅ search business
    const [inputValue, setInputValue] = useState('')
    const [SearchData, setSearchData] = useState([])
    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            const response = await BannerRoute.getsearch({ search: searchValue })
            if (response.success === true) {
                setSearchData(response.data)
            }
        } else {
            setSearchData([])
        }
    }

    useEffect(() => {
        handleSearch(inputValue)
    }, [inputValue])

    useEffect(() => {
        if (userData?.organizer && open) {
            getvendorEvent(userData?.organizer);
        }
    }, [userData?.organizer])

    useEffect(() => {
        if (open) {
            setUserData({
                name: '',
                username: '',
                organizer: '',
                password: '',
                repeatPassword: '',
            })
        }
    }, [open])

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            closeAfterTransition={false}
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Add User
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ pt: 2 }}>

                    <Autocomplete
                        className='w-full mb-4'
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
                        }}
                        onChange={(event, newValue) => {
                            if (newValue && newValue._id) {
                                setUserData((prev) => ({ ...prev, organizer: newValue._id }))
                                setFormErrors((prev) => ({ ...prev, organizer: '' }))
                            }
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label='Search Business'
                                placeholder='Type at least 3 characters'
                                error={!!formErrors.organizer}
                                helperText={formErrors.organizer}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                {option.companyInfo?.companyName} - {option.vendorId} - {option.contactInfo?.phoneNo}
                            </li>
                        )}
                        noOptionsText={
                            inputValue.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No businesses found'
                        }
                    />

                    {/* ✅ Multiple Event Dropdown */}
                    <Autocomplete
                        multiple
                        className="w-full my-2"
                        options={vendorEvent || []} // prevent undefined
                        getOptionLabel={(option) => option?.event_title || ""}
                        value={vendorEvent?.filter((ev) => userData.eventid?.includes(ev._id)) || []}
                        onChange={(event, newValue) => {
                            setUserData((prev) => ({
                                ...prev,
                                eventid: newValue.map((ev) => ev._id), // store selected IDs
                            }));
                            setFormErrors((prev) => ({ ...prev, eventid: "" }));
                        }}
                        renderOption={(props, option, { selected }) => (
                            <li
                                {...props}
                                key={option._id || option.event_title} // ✅ ensure unique key
                            >
                                {option.event_title}
                            </li>
                        )}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Select Event(s)"
                                placeholder="Choose event(s)"
                                error={!!formErrors.eventid}
                                helperText={formErrors.eventid}
                            />
                        )}
                        noOptionsText={
                            userData.organizer
                                ? vendorEvent?.length === 0
                                    ? "No events found for this vendor"
                                    : "No matching events"
                                : "Select a vendor first"
                        }
                    />

                    {/* </div> */}


                    <CustomTextField
                        fullWidth
                        name='name'
                        label='Full Name'
                        value={userData.name}
                        onChange={handleInputChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 3 }}
                    />

                    <CustomTextField
                        fullWidth
                        name='username'
                        label='Username'
                        value={userData.username}
                        onChange={handleInputChange}
                        error={!!formErrors.username}
                        helperText={formErrors.username}
                        sx={{ mb: 3 }}
                    />

                    <CustomTextField
                        fullWidth
                        name='password'
                        type='password'
                        label='Password'
                        value={userData.password}
                        onChange={handleInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        sx={{ mb: 3 }}
                    />

                    <CustomTextField
                        fullWidth
                        name='repeatPassword'
                        type='password'
                        label='Repeat Password'
                        value={userData.repeatPassword}
                        onChange={handleInputChange}
                        error={!!formErrors.repeatPassword}
                        helperText={formErrors.repeatPassword}
                        sx={{ mb: 3 }}
                    />

                    {/* <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name='status'
                            value={userData.status}
                            label='Status'
                            onChange={handleInputChange}
                        >
                            <MenuItem value='ACTIVE'>Active</MenuItem>
                            <MenuItem value='INACTIVE'>Inactive</MenuItem>
                        </Select>
                    </FormControl> */}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSubmit} variant='contained'>
                    Add User
                </Button>
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddUserModal
