'use client'
// React Imports
import { useState } from 'react'

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
import PremiumEntry from './PremiumButton'
import CategoryRoute from '@/services/quiz/quizCategoryServices'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
// import Quiztype from '../quiztype/quiztype'
import Image from '@/services/imageService'
import FunCategoryRoute from '@/services/quiz/funAndLearn/CategoryService'
import GuesTheWordCategoryRoute from '@/services/quiz/guesstheword/CategoryService'

const AddModal = ({ open, handleClose, handleClickOpen, GetCategoryFun }) => {

    const [Adddata, setAdddata] = useState({
        status: "INACTIVE",
        isPremium: false,
        coins: '',

        categoryName: '',
        slug: '',
        icon: '',
    });
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const validateFields = (data) => {
        let errors = {}
        // if (!data.sort_id) errors.sort_id = 'Sorting id is required'
        if (!data.categoryName) errors.categoryName = 'Category Name is required'
        if (!data.slug) errors.slug = 'Status is required'
        if (!data.icon) errors.icon = 'Icon is required'

        return errors
    }


    // // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the changed field is categoryName, update both categoryName and slug
        if (name === 'categoryName') {
            const slugValue = value
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^\w\-]+/g, ''); // Remove special characters

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

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    };


    // console.log(Adddata)

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



    const handlePremiumToggle = (e) => {
        const { checked } = e.target;
        setAdddata(prev => ({ ...prev, isPremium: checked }));

        // Optional: Clear coins if premium is disabled
        if (!checked) {
            setAdddata(prev => ({ ...prev, coins: '' }));
        }
    };





    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }




        try {
            const response = await GuesTheWordCategoryRoute.Post(Adddata)
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
                        Add Category
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='categoryName'
                            label='Category Name'
                            onChange={handleChange}
                            value={Adddata.categoryName || ''}
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
                            value={Adddata.slug || ''}
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
                                    key={Adddata.icon ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                />
                            </Button>
                            {Adddata.icon && (
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {Adddata.icon}
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
                        <PremiumEntry
                            isPremium={Adddata.isPremium}
                            coins={Adddata.coins}
                            handleChange={handleChange}
                            handlePremiumToggle={handlePremiumToggle}
                        />

                    </div>


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


                    {/* </Typography> */}
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_guesstheword:add') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Add Category
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
