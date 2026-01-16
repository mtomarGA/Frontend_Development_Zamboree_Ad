'use client'

// React Imports
import { useEffect } from 'react'


// MUI Imports
import {
    Card,
    Button,
    Grid,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material'

// Form Imports
import { useForm, Controller } from 'react-hook-form'
import LeaveMagmentService from "@/services/leave-management/leaveType"
// Component Imports
import CustomTextField from '@core/components/mui/TextField'


// Toast
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

import { Tooltip, IconButton, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';




const LeaveTypeForm = ({ setModalOpen, EditSelectedLeaveType, getLeave }) => {



    const { hasPermission } = useAuth()


    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            code: '',
            value: '',
            allowLeave: ''
        }
    })

    useEffect(() => {
        if (EditSelectedLeaveType) {
            reset({
                name: EditSelectedLeaveType.name || '',
                code: EditSelectedLeaveType.code || '',
                value: EditSelectedLeaveType.deductValues || '',
                allowLeave: EditSelectedLeaveType.allowLeave || ''
            })
        }
    }, [EditSelectedLeaveType, reset])



    const onSubmit = async (data) => {

        const formData = {
            name: data.name,
            code: data.code,
            value: data.value,
            allowLeave: data.allowLeave
        }
        if (EditSelectedLeaveType?._id) {
            const id = EditSelectedLeaveType?._id
            const result = LeaveMagmentService.updateLeaveType(id, formData)
            toast.success(result.message)
        } else {
            const result = await LeaveMagmentService.cretaLeaveType(formData)
            toast.success(result.message)
        }
        getLeave()
        reset()
        setModalOpen(false)




    }

    return (



        <form onSubmit={handleSubmit(onSubmit)}>

            <Typography variant="h4" className="mb-4" gutterBottom>
                {EditSelectedLeaveType?._id ? "Edit Leave Type" : "Add Leave Type"}
            </Typography>

            <DialogContent>
                <Grid container spacing={6}>

                    <Grid item xs={12}>
                        <Controller
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label='Name'
                                    placeholder='Leave Type'
                                    error={!!errors.name}
                                    helperText={errors.name && 'This field is required.'}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name='code'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label='Code'
                                    placeholder='Leave Code'
                                    error={!!errors.name}
                                    helperText={errors.name && 'This field is required.'}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        // Allow only digits and a single dot
                                        const validVal = rawVal
                                            .replace(/[^0-9.]/g, '') // keep digits and "."
                                            .replace(/(\..*)\./g, '$1'); // prevent multiple dots
                                        field.onChange(validVal);
                                    }}
                                    fullWidth
                                    label="Deduct Leave Value"
                                    placeholder="0"
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip
                                                    title={
                                                        <span>
                                                            0 means no deduction<br />
                                                            0.5 means half Day<br />
                                                            1 means full Day
                                                        </span>
                                                    }
                                                    arrow
                                                >
                                                    <IconButton size="small">
                                                        <InfoOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Grid>




                    <Grid item xs={12}>
                        <Controller
                            name='allowLeave'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        const digitsOnly = rawVal.replace(/\D/g, '');
                                        field.onChange(digitsOnly);
                                    }}
                                    fullWidth
                                    label='Allow Leave in per year'
                                    placeholder='Allow Leave in per year'
                                    error={!!errors.name}
                                    helperText={errors.name && 'This field is required.'}
                                />
                            )}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button type='submit' variant='contained'>
                    Save
                </Button>
            </DialogActions>
        </form>
    )
}

export default LeaveTypeForm
