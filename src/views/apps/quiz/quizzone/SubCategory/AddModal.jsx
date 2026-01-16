'use client'
// React Imports
import { use, useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { Autocomplete, Avatar, MenuItem, TextField } from '@mui/material'


import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import { toast } from 'react-toastify'
import Image from "@/services/imageService"
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService'
import { useAuth } from '@/contexts/AuthContext'

const AddModal = ({ open, handleClose, handleClickOpen, GetCategoryFun }) => {
    const [Adddata, setAdddata] = useState({
        status: "INACTIVE",
        isPremium: false,
    });
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })
    const [imageFileName, setImageFileName] = useState('')

    const validateFields = (data) => {
        let errors = {}
        if (!data.categoryName) errors.categoryName = 'Category Name is required'
        if (!data.slug) errors.slug = 'Status is required'
        if (!data.icon) errors.icon = 'Icon is required'
        if (!data.categoryId) errors.categoryId = 'Category is required'
        return errors
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoryName') {
            const slugValue = value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '');
            setAdddata(prev => ({
                ...prev,
                categoryName: value,
                slug: slugValue
            }));
        } else {
            setAdddata(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    };

    useEffect(() => {
        if (open) {
            setAdddata({
                status: "INACTIVE",
                isPremium: false,
            });
            setFormErrors({});
            setsearch('');
        }
    }, [open]);

    const onchangeimage = async (e) => {
        const { name, files } = e.target
        setImageFileName(files[0]?.name || '')
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

    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            const response = await QuizSubCategoryRoute.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                GetCategoryFun()
                handleClose()
                setAdddata({});
                setImage({ icon: null })
            }
        } catch (error) {
            toast.error("Failed to add banner")
            console.error(error)
        }
    }

    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState(false);
    const [search, setsearch] = useState('')
    const [Category, setCategory] = useState([])

    const FetchCategory = async () => {
        setLoading(true);
        try {
            const res = await QuizSubCategoryRoute.searchcategory({ category: search });
            setCategory(res?.data || [])
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== null && search !== undefined) {
                FetchCategory();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

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
                    Add SubCategory
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>
            <DialogContent>
                <div className='m-2'>
                    <Autocomplete
                        options={Category}
                        getOptionLabel={(option) => option?.categoryName || ''}
                        loading={loading}
                        value={Category.find(cat => cat._id === Adddata.categoryId) || null}
                        inputValue={search}
                        onInputChange={(event, newInputValue) => {
                            setsearch(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            setAdddata(prev => ({
                                ...prev,
                                categoryId: newValue?._id || '',
                            }));
                            if (!newValue) {
                                setsearch('');
                            }
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                className="w-96 "
                                label="Select Category"
                                variant="outlined"
                                error={!!formErrors.categoryId}
                                helperText={formErrors.categoryId}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Avatar src={option.icon} alt={option.categoryName} style={{ width: 30, height: 30 }} />
                                    <Typography>{option.categoryName}</Typography>
                                </div>
                            </li>
                        )}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='categoryName'
                        label='SubCategory Name'
                        onChange={handleChange}
                        value={Adddata?.categoryName || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.categoryName}
                        helperText={formErrors.categoryName}
                    />
                </div>
                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='slug'
                        label='Slug'
                        onChange={handleChange}
                        value={Adddata?.slug || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.slug}
                        helperText={formErrors.slug}
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
                                name='icon'
                                onChange={onchangeimage}
                                key={Adddata.icon ? 'file-selected' : 'file-empty'}
                            />
                        </Button>
                        {imageFileName && (
                            <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                Selected: {imageFileName}
                            </Typography>
                        )}
                        {formErrors.icon && (
                            <Typography variant='body2' color="error">
                                {formErrors.icon}
                            </Typography>
                        )}
                    </div>
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
                {hasPermission('quiz_quiz_zone:add') &&
                    <Button onClick={handleSubmit} variant='contained'>
                        Add SubCategory
                    </Button>
                }
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddModal
