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
import { Avatar, MenuItem } from '@mui/material'


import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import { toast } from 'react-toastify'
import Image from "@/services/imageService"
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService'
import { useAuth } from '@/contexts/AuthContext'
import FunAndLearnSubCategoryRoute from '@/services/quiz/funAndLearn/SubCategoryService'
import GuesTheWordSubCategoryRoute from '@/services/quiz/guesstheword/SubCategoryService'
import TrueAndFalseSubCategoryRoute from '@/services/quiz/trueAndFalse/SubCategoryService'
import PlanService from '@/services/quiz/coinPlan/planServices'
// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, handleClickOpen, GetCategoryFun }) => {

    const [Adddata, setAdddata] = useState({
        status: "INACTIVE",
        packageId: '',
        price: '',
        title: '',
        coins: '',
        icon: '',
    });
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })
    const [imageFileName, setImageFileName] = useState('')

    const validateFields = (data) => {
        let errors = {}

        if (!data.title) errors.title = 'Title is required'
        if (!data.packageId) errors.packageId = 'Package Id is required'
        if (!data.price) errors.price = 'Price is required'
        if (!data.coins) errors.coins = 'Coins is required'
        if (!data.icon) errors.icon = 'Icon is required'


        return errors
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }



    useEffect(() => {
        if (open) {
            setAdddata({
                status: "INACTIVE",

                // Add other default fields if needed
            });
            setImageFileName('');
            setFormErrors({});

        }
    }, [open]);


    // console.log(Adddata)

    // image upload handler
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









    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }





        try {
            const response = await PlanService.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                GetCategoryFun()
                handleClose()
                setAdddata({});
                setImage({ icon: null })
            }
        } catch (error) {
            toast.error("Failed to add Coin Plan")
            console.error(error)
        }
    }


    console.log(Adddata);
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
                        Add Coin Plan
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>


                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='title'
                            label='Title'
                            onChange={handleChange}
                            value={Adddata.title || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            type='Number'
                            name='coins'
                            label='Amount of coins'
                            onChange={handleChange}
                            value={Adddata.coins || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.coins}
                            helperText={formErrors.coins}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            type='Number'
                            name='price'
                            label='Price'
                            onChange={handleChange}
                            value={Adddata.price || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            type='Number'
                            name='packageId'
                            label='Package Id (For In App Purchase)'
                            onChange={handleChange}
                            value={Adddata.packageId || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.packageId}
                            helperText={formErrors.packageId}
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
                            {imageFileName && (
                                <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {imageFileName}
                                    <Avatar src={Adddata.icon} alt='Current' title="Please Wait Until Image is not Showing" />
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
                    {hasPermission('quiz_coin_plan:add') &&
                        <Button onClick={handleSubmit}
                            disabled={!Adddata.title || !Adddata.coins || !Adddata.price || !Adddata.packageId || !Adddata.icon}
                            variant='contained'>
                            Add Coin Plan
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
