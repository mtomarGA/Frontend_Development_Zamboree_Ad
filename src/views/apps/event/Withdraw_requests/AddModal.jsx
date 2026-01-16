'use client'

import { useEffect, useState } from 'react'

// MUI
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Autocomplete, createFilterOptions, MenuItem } from '@mui/material'

// Custom Components
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

// Services
import BannerRoute from '@/services/utsav/banner/bannerServices'
import WithdrawService from '@/services/event/event_mgmt/WithdrawService'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import bankService from '@/services/business/bank.service'

const AddModal = ({ open, handleClose, handleClickOpen, getdata, getbank }) => {
    const [Adddata, setAdddata] = useState({ status: 'PENDING' })
    const { hasPermission } = useAuth()
    const [formErrors, setFormErrors] = useState({})
    const [inputValue, setInputValue] = useState('')
    const [SearchData, setSearchData] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const validateFields = data => {
        let errors = {}
        // if (!data.withdrawid) errors.withdrawid = 'Withdraw id is required'
        if (!data.req_amount) errors.req_amount = 'Request amount is required'
        if (!data.eventid) errors.eventid = 'Event id is required'
        if (!data.organizer) errors.organizer = 'Organizer is required'
        if (!data.status) errors.status = 'Status is required'
        // if (!data.bank) errors.bank = 'Bank Name is required'
        // if (!data.ifsc) errors.ifsc = 'IFSC Code is required'
        // if (!data.accountNo) errors.accountNo = 'Account No. is required'
        // if (!data.repeat_accountNo) errors.repeat_accountNo = 'Repeat Account No. is required'

        return errors
    }

    const handleSearch = async searchValue => {
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
        handleSearch()
    }, [searchValue])

    const filter = createFilterOptions()

    const handleChange = e => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    useEffect(() => {
        setAdddata({ status: 'PENDING' })
        setFormErrors({})
    }, [open])

    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })

        // if (Adddata.accountNo !== Adddata.repeat_accountNo) {
        //     errors.repeat_accountNo = 'Account No. Mismatched'
        // }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            const response = await WithdrawService.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                handleClose()
                getdata();
                return;
            }
            toast.error(response.message || "Failed to Craete Withdraw Request");
        } catch (error) {
            toast.error('Failed to Add')
        }
    }



    const [vendorEvent, setVendorEvent] = useState([]);
    const getvendorEvent = async () => {
        // console.log(Adddata)
        const res = await WithdrawService.vendorEvent(Adddata?.organizer);
        console.log(res, "vendorEVnt");
        setVendorEvent(res.data || []);
    }

    useEffect(() => {
        getvendorEvent();
    }, [Adddata.organizer])

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            closeAfterTransition={false}
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Add Withdraw Request
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                {/* Organizer Search */}
                <div className='mx-2'>
                    <Autocomplete
                        className='w-96'
                        freeSolo
                        options={SearchData}
                        filterOptions={(options, state) => {
                            const input = state.inputValue.toLowerCase()
                            return options.filter(option => {
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
                        getOptionLabel={option =>
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
                                setAdddata(prev => ({
                                    ...prev,
                                    organizer: newValue._id
                                }))
                                setFormErrors(prev => ({ ...prev, organizer: '' }))
                            }
                        }}
                        renderInput={params => (
                            <CustomTextField
                                {...params}
                                className='w-96'
                                label='Search Organizer/Vendor'
                                variant='outlined'
                                placeholder='Type at least 3 characters'
                                error={!!formErrors.organizer}
                                helperText={formErrors.organizer}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                {option.companyInfo?.companyName} - {option.vendorId} -{' '}
                                {option.contactInfo?.phoneNo}
                            </li>
                        )}
                        noOptionsText={
                            inputValue.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No Organizer/Vendor found'
                        }
                    />
                </div>



                <div className="mx-2 mt-4">
                    <Autocomplete
                        className="w-96"
                        options={vendorEvent}
                        getOptionLabel={(option) => option.event_title || ""}
                        value={vendorEvent.find((ev) => ev._id === Adddata.eventid) || null}
                        onChange={(event, newValue) => {
                            setAdddata((prev) => ({
                                ...prev,
                                eventid: newValue?._id || "",
                            }));
                            setFormErrors((prev) => ({ ...prev, eventid: "" }));
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                className="w-96"
                                label="Select Event"
                                variant="outlined"
                                placeholder="Choose event"
                                error={!!formErrors.eventid}
                                helperText={formErrors.eventid}
                            />
                        )}
                        noOptionsText={
                            Adddata.organizer
                                ? vendorEvent.length === 0
                                    ? "No events found for this vendor"
                                    : "No matching events"
                                : "Select a vendor first"
                        }
                    />
                </div>


                {/* Bank Autocomplete */}
                {/* <div className='m-2'>
                    <CustomAutocomplete
                        fullWidth
                        options={getbank.filter(bank => bank.status === 'ACTIVE')}
                        id='autocomplete-custom'
                        getOptionLabel={option => option.name || ''}
                        renderInput={params => (
                            <CustomTextField
                                placeholder='Select Bank Name'
                                {...params}
                                label='Bank Name'
                                error={!!formErrors.bank}
                                helperText={formErrors.bank}
                            />
                        )}
                        value={getbank.find(bank => bank._id === Adddata.bank) || null}
                        onChange={(event, value) => {
                            setAdddata({ ...Adddata, bank: value ? value._id : '' })
                            setFormErrors(prev => ({ ...prev, bank: '' }))
                        }}
                    />

                </div> */}

                {/* Account No. */}
                {/* <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='accountNo'
                        label='Account No.'
                        onChange={handleChange}
                        value={Adddata.accountNo || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.accountNo}
                        helperText={formErrors.accountNo}
                    />
                </div> */}

                {/* Repeat Account No. */}
                {/* <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='repeat_accountNo'
                        label='Repeat Account No.'
                        onChange={handleChange}
                        value={Adddata.repeat_accountNo || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={
                            !!formErrors.repeat_accountNo ||
                            (!!Adddata.accountNo &&
                                !!Adddata.repeat_accountNo &&
                                Adddata.accountNo !== Adddata.repeat_accountNo)
                        }
                        helperText={
                            formErrors.repeat_accountNo
                                ? formErrors.repeat_accountNo
                                : !!Adddata.accountNo &&
                                    !!Adddata.repeat_accountNo &&
                                    Adddata.accountNo !== Adddata.repeat_accountNo
                                    ? 'Account No. Mismatched'
                                    : ''
                        }
                    />
                </div> */}

                {/* IFSC */}
                {/* <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='ifsc'
                        label='IFSC code'
                        onChange={handleChange}
                        value={Adddata.ifsc || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.ifsc}
                        helperText={formErrors.ifsc}
                    />
                </div> */}

                {/* Request Amount */}
                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='req_amount'
                        label='Request Amount'
                        onChange={handleChange}
                        value={Adddata.req_amount || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.req_amount}
                        helperText={formErrors.req_amount}
                    />
                </div>

                {/* Withdraw ID */}
                {/* <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='withdrawid'
                        label='Withdraw ID'
                        onChange={handleChange}
                        value={Adddata.withdrawid || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.withdrawid}
                        helperText={formErrors.withdrawid}
                    />
                </div> */}

                {/* Status */}
                <div className='m-2'>
                    <CustomTextField
                        select
                        className='w-96'
                        name='status'
                        label='Status'
                        value={Adddata.status}
                        onChange={handleChange}
                        error={!!formErrors.status}
                        helperText={formErrors.status}
                    >
                        <MenuItem value='PENDING'>PENDING</MenuItem>
                    </CustomTextField>
                </div>
            </DialogContent>

            <DialogActions>
                {hasPermission('event_withdraw_requests:add') && (
                    <Button
                        onClick={handleSubmit}
                        variant='contained'

                    >
                        Add
                    </Button>
                )}
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddModal
