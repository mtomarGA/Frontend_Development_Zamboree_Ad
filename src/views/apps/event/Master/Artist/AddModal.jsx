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
import ArtistService from '@/services/event/masters/artistService'
import { useAuth } from '@/contexts/AuthContext'
// import eventRoute from '@/services/event/eventServices'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, getdata }) => {
    const { hasPermission } = useAuth()
    const [Adddata, setAdddata] = useState({
        image: '',
        name: '',
        profession: '',
        status: 'INACTIVE'

    });
    const [formErrors, setFormErrors] = useState({})
    const [imageName, setImageName] = useState('');

    const validateFields = (data) => {
        let errors = {}
        if (!data.name) errors.name = 'Category Name is required'
        if (!data.image) errors.image = 'Image is required'
        if (!data.profession) errors.profession = 'Profession is required'
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

    console.log(Adddata)


    useEffect(() => {
        // setImageName(Adddata.icon)
        setAdddata(prev => ({
            image: '',
            name: '',
            status: 'INACTIVE',
            profession: ''
        }))

        setFormErrors({})
    }, [open])
    // console.log(Adddata)

    // image upload handler
    const onchangeimage = async (e) => {
        const { name, files } = e.target
        setImageName(files[0].name);
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
        const errors = validateFields({ ...Adddata, ...imageName })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }



        try {
            const response = await ArtistService.Post(Adddata)
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
            console.error(error)
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
                    {hasPermission('event_masters:add') && (

                        <Typography variant='h5' component='span'>
                            Add Artist
                        </Typography>
                    )}

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
                        <label htmlFor='icon' className='text-sm'>
                            Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'

                            >
                                Upload File
                                <input
                                    type='file'
                                    hidden
                                    name='image'
                                    onChange={onchangeimage}
                                    key={imageName ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                />
                            </Button>
                            {Adddata.image && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    Selected: {imageName}
                                </Typography>
                            )}
                            {formErrors.image && (
                                <Typography variant='body2' color="error">
                                    {formErrors.image}
                                </Typography>
                            )}
                        </div>
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='profession'
                            label='Profession'
                            type='number'
                            onChange={handleChange}
                            value={Adddata?.profession || ''}


                            variant='outlined'
                            error={!!formErrors.profession}
                            helperText={formErrors.profession}
                        >
                            <MenuItem value='Singing'>Singing</MenuItem>
                            <MenuItem value='Dancing'>Dancing</MenuItem>
                            <MenuItem value='Comedy'>Comedy</MenuItem>
                            <MenuItem value='Other'>Other</MenuItem>

                        </CustomTextField>
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
                            Add Artist
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
