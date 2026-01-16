'use client'

import { useState, useEffect } from 'react'
import {
    Button,
    Dialog,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    MenuItem
} from '@mui/material'
import { toast } from 'react-toastify'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import commissionService from '@/services/event/masters/commissionService'


const AddModal = ({ open, handleClose, getdata }) => {
    const [Adddata, setAdddata] = useState({
        organizer: '',
        commission: '',
        status: ''
    })

    const [formErrors, setFormErrors] = useState({})
    const [inputValue, setInputValue] = useState('')
    const [SearchData, setSearchData] = useState([])

    // ✅ validate
    const validateFields = (data) => {
        let errors = {}
        if (!data.organizer) errors.organizer = 'organizer is required'
        if (!data.commission) errors.commission = 'Commission is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.commissionType) errors.commissionType = 'Commission Type is required'
        return errors
    }

    // ✅ input change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAdddata((prev) => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    // ✅ search business
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

    // ✅ submit
    const handleSubmit = async () => {
        const errors = validateFields(Adddata)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            console.log(errors, "ddd")
            return
        }

        try {
            const response = await commissionService.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                handleClose()
                getdata()
                return
            }
            toast.error(response.message || 'Failed to add commission');

        } catch (error) {
            toast.error('Failed to add commission')
            console.error(error)
        }
    }


    useEffect(() => {
        setAdddata({
            organizer: '',
            commission: '',
            commissionType: '',
            status: 'ACTIVE'
        });
    }, [open])

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
                    Add Commission
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col'>


                    <label htmlFor="PERCENTAGE">Commission Type</label>
                    <div className='flex my-2'>
                        <div className='flex  flex-row border border-BackgroundPaper p-2 rounded'>
                            <input
                                className='mr-2'
                                type="radio"
                                name="commissionType"
                                id="percentage"
                                value="PERCENTAGE"
                                checked={Adddata.commissionType === "PERCENTAGE"}
                                onChange={(e) =>
                                    setAdddata((prev) => ({ ...prev, commissionType: e.target.value }))
                                }
                                error={!!formErrors.commissionType}
                                helperText={formErrors.commissionType}
                            />
                            <label htmlFor="percentage">Percentage</label>
                        </div>

                        <div className='flex  flex-row mx-2 border border-BackgroundPaper p-2 rounded'>

                            <input
                                type="radio"
                                className='mr-2'
                                name="commissionType"
                                id="fixed"
                                value="FIXED"
                                checked={Adddata.commissionType === "FIXED"}
                                onChange={(e) =>
                                    setAdddata((prev) => ({ ...prev, commissionType: e.target.value }))
                                }
                            />
                            <label htmlFor="fixed">Fixed</label>
                        </div>
                    </div>



                    {/* Organizer Search */}
                    <Autocomplete
                        className='w-full md:w-[24rem] mb-4'
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
                                setAdddata((prev) => ({ ...prev, organizer: newValue._id }))
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

                    {/* Commission Field */}
                    {Adddata?.commissionType === "PERCENTAGE" && (
                        <CustomTextField
                            className='w-full md:w-[24rem] mb-4'
                            label='Commission %'
                            name='commission'
                            value={Adddata.commission || ''}
                            onChange={handleInputChange}
                            type='number'
                            placeholder='Enter commission percentage'
                            error={!!formErrors.commission}
                            helperText={formErrors.commission}
                        />

                    )}
                    {Adddata?.commissionType === "FIXED" && (
                        <CustomTextField
                            className='w-full md:w-[24rem] mb-4'
                            label='Fixed Amount'
                            name='commission'
                            value={Adddata.commission || ''}
                            onChange={handleInputChange}
                            type='number'
                            placeholder='Enter Fixed Amount'
                            error={!!formErrors.commission}
                            helperText={formErrors.commission}
                        />
                    )}

                    {/* Status Field */}
                    <CustomTextField
                        className='w-full md:w-[24rem]'
                        select
                        label='Status'
                        name='status'
                        value={Adddata.status || ''}
                        onChange={handleInputChange}
                        error={!!formErrors.status}
                        helperText={formErrors.status}
                    >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='PENDING'>PENDING</MenuItem>
                    </CustomTextField>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant='contained'>
                    Add Commission
                </Button>
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog >

    )
}

export default AddModal


