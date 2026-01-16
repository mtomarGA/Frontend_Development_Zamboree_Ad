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
import { MenuItem } from '@mui/material'
import Image from "@/services/imageService"
import { toast } from 'react-toastify'
import LanguageService from '@/services/event/masters/languageService'
import { useAuth } from '@/contexts/AuthContext'
// import eventRoute from '@/services/event/eventServices'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, getdata }) => {
    const { hasPermission } = useAuth()
    const [Adddata, setAdddata] = useState({
        name: '',
        language_code: '',
        status: 'INACTIVE'

    });
    const [formErrors, setFormErrors] = useState({})

    const validateFields = (data) => {
        let errors = {}
        if (!data.name) errors.name = 'Name is required'
        if (!data.language_code) errors.language_code = 'Language Code is required'
        if (!data.status) errors.status = 'Status is required'

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

    // console.log(Adddata)


    useEffect(() => {
        setAdddata(prev => ({
            name: '',
            language_code: '',
            status: 'INACTIVE',
        }))

        setFormErrors({})
    }, [open])

    // image upload handler
    const onchangeimage = async (e) => {
        const { name, files } = e.target
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setAdddata(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }


    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }



        try {
            const response = await LanguageService.Post(Adddata)
            if (response.success === true) {
                toast.success(response?.message)
                getdata()
                handleClose()
                return
            }
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
            }
        } catch (error) {
            toast.error("Failed to Add")
            // console.error(error)
        }
    }

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
                        Add Language
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
                            name='language_code'
                            label='Language Code'
                            onChange={handleChange}
                            value={Adddata.language_code || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.language_code}
                            helperText={formErrors.language_code}
                        />
                    </div>







                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={Adddata.status || ''}
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
                            Add Language
                        </Button>
                    }
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog >
        </>
    )
}

export default AddModal
