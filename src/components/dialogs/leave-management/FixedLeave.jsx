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
// Component Imports
import CustomTextField from '@core/components/mui/TextField'


// Toast
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

import { Tooltip, IconButton, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import fixedleaveNameService from '@/services/leave-management/fixedLeaveName'




const FixedLeaveForm = ({ setModalOpen, EditSelectedLeaveType, getLeave }) => {



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
        }
    })

    useEffect(() => {
        if (EditSelectedLeaveType) {
            reset({
                name: EditSelectedLeaveType.name || '',
                code: EditSelectedLeaveType.code || '',
            })
        }
    }, [EditSelectedLeaveType, reset])



    const onSubmit = async (data) => {

        const formData = {
            name: data.name,
            code: data.code,
        }

        console.log(formData, "formData")
        if (EditSelectedLeaveType?._id) {
            const id = EditSelectedLeaveType?._id
            const result = await fixedleaveNameService.updatefixedLeaveName(id, formData)
            toast.success(result.message)
        } else {
            const result = await fixedleaveNameService.createfixedleaveName(formData)
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

export default FixedLeaveForm
