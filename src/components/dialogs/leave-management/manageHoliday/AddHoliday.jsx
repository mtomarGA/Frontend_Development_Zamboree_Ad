'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import {
    Button,
    Grid,
    DialogContent,
    DialogActions,
    Typography,
    MenuItem
} from '@mui/material'


import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

// Form Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast
import { toast } from 'react-toastify'
import manageHolidaysServices from '@/services/leave-management/manageHolidays'


const AddHolidayForm = ({ setModalOpen, holidayData, getAllHolidays }) => {

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            holidayName: "",
            startDate: null,
            endDate: null,
            status: "ACTIVE",
        }
    });

    // Autofill details 
    useEffect(() => {
        if (holidayData) {
            reset({
                holidayName: holidayData?.holidayName,
                startDate: holidayData?.startDate
                    ? dayjs(holidayData?.startDate).format("YYYY-MM-DD")
                    : '',
                endDate: holidayData?.endDate
                    ? dayjs(holidayData?.endDate).format("YYYY-MM-DD")
                    : '',
                status: holidayData?.status,
            })


        }
    }, [holidayData, reset])

    const onSubmit = async (data) => {
        console.log(data)
        const formData = {
            holidayName: data.holidayName,
            startDate: data.startDate ? dayjs(data.startDate).format("YYYY-MM-DD") : null,
            endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : null,
            status: data.status,
        }

        try {
            if (holidayData?._id) {
                const id = holidayData._id
                const result = await manageHolidaysServices.updateHoliday(id, formData)
                toast.success(result.message)
            } else {
                const result = await manageHolidaysServices.createHolidays(formData)
                toast.success(result.message)
            }

            getAllHolidays()
            reset()
            setModalOpen(false)
        } catch (error) {
            toast.error('Something went wrong.')
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h4" className="mb-4 text-center" gutterBottom>
                Add Holiday
            </Typography>
                
                <DialogContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Controller
                                name='holidayName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Holiday Name'
                                        placeholder='Holiday name'
                                        error={!!errors.holidayName}
                                        helperText={errors.holidayName && 'This field is required.'}
                                    />
                                )}
                            />
                        </Grid>


                        {/* Start Date */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: 'Start Date is required' }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        type="date"
                                        fullWidth
                                        label="Start Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                    />
                                )}
                            />
                        </Grid>




                        {/* End Date */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: 'End Date is required' }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        type="date"
                                        fullWidth
                                        label="End Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Status"
                                        error={!!errors.status}
                                        helperText={errors.status && 'This field is required.'}
                                        InputProps={{
                                            sx: { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value="" disabled>Select Status</MenuItem>
                                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                                    </CustomTextField>
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button type='submit' variant='contained'>
                        Save
                    </Button>
                    <Button onClick={() => setModalOpen(false)} variant='outlined'>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </LocalizationProvider>
    )
}

export default AddHolidayForm
