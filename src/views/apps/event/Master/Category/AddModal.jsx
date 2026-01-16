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
import { CircularProgress, MenuItem } from '@mui/material'
import Image from "@/services/imageService"
import { toast } from 'react-toastify'
import EventCategory from '@/services/event/masters/categoryService'
import { useAuth } from '@/contexts/AuthContext'
// import eventRoute from '@/services/event/eventServices'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, getdata }) => {

    const [Adddata, setAdddata] = useState({
        image: '',
        icon: '',
        categoryname: '',
        serialNumber: '',
        status: 'INACTIVE'

    });

    const { hasPermission } = useAuth();
    const [formErrors, setFormErrors] = useState({})
    const [imageName, setImageName] = useState({
        image: '',
        icon: ''
    });

    const validateFields = (data) => {
        let errors = {}
        if (!data.categoryname) errors.categoryname = 'Category Name is required'
        if (!data.image) errors.image = 'Image is required'
        if (!data.icon) errors.icon = 'Icon is required'
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
            categoryname: '',
            status: 'INACTIVE',
            icon: '',

        }))

        setFormErrors({})
    }, [open])
    // console.log(Adddata)

    // image upload handler
    const [isloading, setIsloading] = useState({
        image: false,
        icon: false
    });
    const onchangeimage = async (e) => {
        const { name, files } = e.target
        setIsloading(prev => ({
            ...prev,
            [name]: true
        }))
        setImageName(prev => ({
            ...prev,
            [name]: files[0]?.name
        }));
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setAdddata(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            setIsloading(prev => ({
                ...prev,
                [name]: false
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
            const response = await EventCategory.Post(Adddata)
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
                    <Typography variant='h5' component='span'>
                        Add Event Category
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='categoryname'
                            label='Name'
                            onChange={handleChange}
                            value={Adddata.categoryname || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.categoryname}
                            helperText={formErrors.categoryname}
                        />
                    </div>


                    <div className='m-2'>
                        <label htmlFor='image' className='text-sm'>
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
                                    id='image'
                                    name='image'
                                    onChange={onchangeimage}
                                    key={imageName.image ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                />
                            </Button>
                            {isloading.image && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    < CircularProgress size={20} className='mr-2' />
                                </Typography>
                            )}
                            {Adddata.image && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    Selected: {imageName.image}
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
                        <label htmlFor='icon' className='text-sm'>
                            Icon
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
                                    name='icon'
                                    id='icon'
                                    onChange={onchangeimage}
                                    key={imageName.icon ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                />
                            </Button>
                            {isloading.icon && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    < CircularProgress size={20} className='mr-2' />
                                </Typography>
                            )}
                            {Adddata.icon && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    Selected: {imageName.icon}
                                </Typography>
                            )}
                            {formErrors.icon && (
                                <Typography variant='body2' color="error">
                                    {formErrors.icon}
                                </Typography>
                            )}
                        </div>
                    </div>


                    {/* <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='serialNumber'
                            label='Serial Number'
                            type='number'
                            onChange={handleChange}
                            value={Adddata?.serialNumber || ''}
                            multiline
                            rows={1}

                            variant='outlined'
                            error={!!formErrors.serialNumber}
                            helperText={formErrors.serialNumber}
                        />
                    </div> */}


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
                            Add Event Category
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
