'use client'
// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { Autocomplete, MenuItem } from '@mui/material'
import Image from "@/services/imageService"
import { toast } from 'react-toastify'
import Grid from '@mui/material/Grid2'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { add } from 'date-fns'
import { Add } from '@mui/icons-material'
import EventCouponService from '@/services/event/coupon/eventCouponService'
import EventService from '@/services/event/event_mgmt/event'
import { useAuth } from '@/contexts/AuthContext'

// import eventRoute from '@/services/event/eventServices'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, handleClickOpen, getdata, event }) => {
    const [date, setDate] = useState(new Date())
    const [Adddata, setAdddata] = useState({
        event: '',
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        discount: '',
        status: 'INACTIVE',

    });
    const [formErrors, setFormErrors] = useState({})

    const { hasPermission } = useAuth();

    const validateFields = (data) => {
        let errors = {}
        if (!data.code) errors.code = 'Code is required'
        if (!data.name) errors.name = 'Name is required'
        if (!data.discount) errors.discount = 'Discount is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.couponType) errors.couponType = 'Coupon Type is required'
        if (!data.startDate) errors.startDate = 'Start Date is required'
        if (!data.endDate) errors.endDate = 'End Date is required'
        if (!data.event) errors.event = "Event is required"

        return errors
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setAdddata(prev => ({
            ...prev,
            [name]: value
        }));


        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    };


    useEffect(() => {
        setAdddata({
            event: '',
            name: '',
            code: '',
            startDate: '',
            endDate: '',
            discount: '',
            status: 'INACTIVE',
        })
    }, [open])


    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }



        try {
            const response = await EventCouponService.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleClose()
                return
            }
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
            }
        } catch (error) {
            toast.error("Failed to add coupon")
            console.error(error)
        }
    }
    // console.log(Adddata, "Adddata")


    const [inputValueArtist, setInputValueArtist] = useState('')



    return (
        <>

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Add Coupon
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='name'
                            label='Name'
                            onChange={handleChange}
                            value={Adddata.name || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='code'
                            label='Code'
                            onChange={handleChange}
                            value={Adddata.code || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.code}
                            helperText={formErrors.code}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='discount'
                            label='Discount'
                            type='number'
                            onChange={handleChange}
                            value={Adddata.discount || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.discount}
                            helperText={formErrors.discount}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='couponlimit'
                            label='Coupon Limit'
                            type='number'
                            onChange={handleChange}
                            value={Adddata.couponlimit || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.couponlimit}
                            helperText={formErrors.couponlimit}
                        />
                    </div>




                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='couponType'
                            label='Coupon Type'
                            value={Adddata.couponType || ''}
                            onChange={handleChange}
                            error={!!formErrors.couponType}
                            helperText={formErrors.couponType}
                        >
                            <MenuItem value='fixed'>Fixed</MenuItem>
                            <MenuItem value='percentage'>Percentage</MenuItem>
                        </CustomTextField>
                    </div>




                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppReactDatepicker
                            selected={Adddata?.startDate || null}
                            onChange={(date) =>
                                setAdddata((prev) => ({ ...prev, startDate: date }))
                            }
                            id="basic-input"
                            dateFormat="dd/MM/yyy"
                            className="m-2 w-96"
                            placeholderText="Click to select a date"
                            customInput={<CustomTextField error={!!formErrors.startDate} helperText={formErrors.startDate} label="Start Date" fullWidth />}
                            minDate={new Date()}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppReactDatepicker
                            selected={Adddata?.endDate || null}
                            onChange={(date) =>
                                setAdddata((prev) => ({ ...prev, endDate: date }))
                            }
                            id="basic-input"
                            dateFormat="dd/MM/yyy"
                            className="m-2 w-96"
                            placeholderText='Click to select a date'
                            customInput={<CustomTextField label='End Date' error={!!formErrors.endDate} helperText={formErrors.endDate} fullWidth />}
                            minDate={new Date()}
                        />

                    </Grid>

                    <Autocomplete
                        options={event.filter(artist => typeof artist?.event_title === 'string')}
                        className="w-96 mx-2"
                        value={event.find(artist => artist._id === Adddata.event) || null}
                        inputValue={inputValueArtist}
                        onInputChange={(event, newInputValue, reason) => {
                            if (reason !== 'reset') {
                                setInputValueArtist(newInputValue)
                            }
                        }}
                        onChange={(e, newValue) =>
                            setAdddata((prev) => ({
                                ...prev,
                                event: newValue?._id || '',
                            }))
                        }
                        getOptionLabel={(option) => option?.event_title || ''}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        filterOptions={(options, { inputValue }) => {
                            if (inputValue.length < 3) return []
                            const searchValue = inputValue.toLowerCase()
                            return options.filter((option) =>
                                option?.event_title.toLowerCase().includes(searchValue)
                            )
                        }}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                {option.event_title}
                            </li>
                        )}
                        noOptionsText={
                            inputValueArtist.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No options found'
                        }
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Event"
                                variant="outlined"
                                fullWidth
                                placeholder="Type at least 3 characters..."
                                error={!!formErrors.event}
                                helperText={formErrors.event}
                            />
                        )}
                    />




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
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                        </CustomTextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    {hasPermission('event_masters:add') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Add Coupon
                        </Button>
                    }
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddModal
