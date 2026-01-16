'use client'
import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField
} from '@mui/material'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import Image from '@/services/imageService'
import quizRoute from '@/services/quiz/quiztypeServices'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

function AddModal({ open, getdata, handleClose }) {
    const { hasPermission } = useAuth()

    const defaultState = {
        type: '',
        description: '',
        icon: null,
        status: 'INACTIVE'
    }

    const [AddData, setAddData] = useState(defaultState)
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        if (!open) {
            setAddData(defaultState)
            setFormErrors({})
        }
    }, [open])

    const validateFields = (data) => {
        let errors = {}
        if (!data.type) errors.type = 'Quiz Type is required'
        if (!data.description) errors.description = 'Short Description is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.icon) errors.icon = 'Icon is required'
        return errors
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const onchangeimage = async (e) => {
        const { name, files } = e.target
        const result = await Image.uploadImage({ image: files[0] })

        if (result.data.url) {
            setAddData(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }

    const handleSubmit = async () => {
        const errors = validateFields(AddData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            const response = await quizRoute.Post(AddData)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleClose()
            }
        } catch (error) {
            toast.error('Failed to add quiz type')
            console.error(error)
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            className='w-full'
            maxWidth='md'
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Add Quiz Type
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                {/* Quiz Type */}
                <div className='mb-4'>
                    <CustomTextField
                        className='w-96'
                        name='type'
                        label='Type'
                        onChange={handleChange}
                        value={AddData.type || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.type}
                        helperText={formErrors.type}
                    />
                </div>

                {/* Icon Upload */}
                <div className='mb-4'>
                    <label htmlFor='icon' className='text-sm font-medium'>
                        Icon
                    </label>
                    <div className='mt-1 flex flex-col gap-2'>
                        <Button
                            variant='outlined'
                            component='label'
                            className='w-96'
                            color={formErrors.icon ? 'error' : 'primary'}
                        >
                            Upload File
                            <input
                                type='file'
                                hidden
                                name='icon'
                                accept='image/*'
                                onChange={onchangeimage}
                            />
                        </Button>

                        {AddData.icon && (
                            <Typography
                                component={'div'}
                                variant='body2'
                                className='text-green-700 truncate w-96 align-bottom'
                            >
                                Selected: {AddData.icon}
                            </Typography>
                        )}

                        {formErrors.icon && (
                            <Typography component={'div'} variant='body2' color='error'>
                                {formErrors.icon}
                            </Typography>
                        )}
                    </div>
                </div>

                {/* Short Description */}
                <div className='mb-4'>
                    <TextField
                        className='w-96'
                        name='description'
                        label='Short Description'
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        value={AddData.description || ''}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                    />
                </div>

                {/* Status */}
                <div>
                    <CustomTextField
                        select
                        className='w-96'
                        name='status'
                        label='Status'
                        value={AddData.status || ''}
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
                {hasPermission('quiz_quiz_type:add') && (
                    <Button onClick={handleSubmit} variant='contained'>
                        Add Quiz Type
                    </Button>
                )}
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddModal
