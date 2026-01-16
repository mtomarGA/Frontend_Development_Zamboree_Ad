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
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

import TrueAndFalseSubCategoryRoute from '@/services/quiz/trueAndFalse/SubCategoryService'
import TrueAndFalseLevelRoute from '@/services/quiz/trueAndFalse/LevelServices'
import TrueAndFalseCategoryRoute from '@/services/quiz/trueAndFalse/CategoryService'


// import Quiztype from '../quiztype/quiztype'

const EditModal = ({ levelEditOpen, handlelevelEditClose, GetLevelFun, selectedLevel }) => {

    const [EditData, setEditData] = useState({
        status: selectedLevel?.status || "INACTIVE"
    });

    const [formErrors, setFormErrors] = useState({})

    // fetch category
    const [category, setcategory] = useState([]);
    const [subcategory, setsubcategory] = useState([]);

    // console.log(selectedLevel, "hiii")


    const validateFields = (data) => {
        let errors = {}
        if (!data.category) errors.category = 'Category is required'
        if (!data.subcategory) errors.subcategory = 'Sub Category  is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.prize) errors.prize = 'Prize is required'
        if (!data.entry_fee) errors.entry_fee = 'Entry_Fee is required'
        if (!data.terms) errors.terms = 'Terms and Conditions is required'
        if (!data.title) errors.title = 'Title is required'
        if (!data.level) errors.level = 'Level is required'
        if (!data.maxQues) errors.maxQues = 'Maximum Questions is required'
        if (!data.winning) errors.winning = 'Winning Percentage is required'
        if (!data.ques_duration) errors.ques_duration = 'Question Duration is required'
        if (!data.scorePerCorrectAns) errors.scorePerCorrectAns = 'Score Credit Per Correct Answer is required'



        return errors
    }


    // // Handle form field changes
    // Handle form field changes with number validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        // For numeric fields (maxQues, winning, level)
        if (['maxQues', 'winning', 'level'].includes(name)) {
            // Only allow numbers or empty string
            if (value === '' || /^[0-9\b]+$/.test(value)) {
                setEditData(prev => ({ ...prev, [name]: value }));

                // Clear error when user starts typing
                if (formErrors[name]) {
                    setFormErrors(prev => ({ ...prev, [name]: '' }));
                }
            }
        } else {
            // For non-numeric fields
            setEditData(prev => ({ ...prev, [name]: value }));

            // Clear error when user starts typing
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    // console.log(EditData)

    const { hasPermission } = useAuth();


    const fetchcategory = async () => {
        const res = await TrueAndFalseCategoryRoute.category();
        setcategory(res?.data || []);
    }

    // fetch Sub Category 

    const fetchsubcategory = async () => {
        const res = await TrueAndFalseSubCategoryRoute.subcategory(EditData?.category || []);
        setsubcategory(res?.data || []);
    }


    useEffect(() => {
        if (open) {
            if (EditData?.category) {
                fetchsubcategory()
            }
            fetchcategory();
        }
    }, [open, EditData?.category]);


    // console.log(EditData, "hii")

    useEffect(() => {
        if (selectedLevel) {
            setEditData({
                category: selectedLevel?.category?._id || '',
                subcategory: selectedLevel?.subcategory?._id || '',
                title: selectedLevel?.title || '',
                prize: selectedLevel?.prize || '',
                entry_fee: selectedLevel?.entry_fee || '',
                maxQues: selectedLevel?.maxQues || '',
                winning: selectedLevel?.winning || '',
                level: selectedLevel?.level || '',
                terms: selectedLevel?.terms || '',
                status: selectedLevel?.status || 'INACTIVE'
            });
        }
    }, [selectedLevel]);


    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...EditData })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }




        const response = await TrueAndFalseLevelRoute.putData(selectedLevel?._id, EditData)

        if (response.success == true) {
            toast.success(response?.message)
            GetLevelFun()
            handlelevelEditClose()
        }
        else {
            toast.error(response?.message)

        }

    }

    return (
        <>

            <Dialog
                onClose={handlelevelEditClose}
                aria-labelledby='customized-dialog-title'
                open={levelEditOpen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Level In True and False
                    </Typography>
                    <DialogCloseButton onClick={handlelevelEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {/* <Typography> */}
                    <div >
                        <CustomTextField
                            className='m-2 w-96'
                            select
                            name='category'
                            label='Category'
                            value={EditData.category || ''}
                            onChange={e => setEditData({ ...EditData, category: e.target.value })}
                            error={!!formErrors.category}
                            helperText={formErrors.category}
                        >
                            <MenuItem value="" disabled>Select Category</MenuItem>
                            {category
                                // .filter(type => type.status === 'ACTIVE')
                                .map(type => (
                                    <MenuItem key={type._id} value={type._id}>
                                        {type.categoryName}
                                    </MenuItem>
                                ))}
                        </CustomTextField>
                    </div>



                    <div>
                        <CustomTextField
                            className='m-2 w-96'
                            select
                            name='subcategory'
                            label='Sub Category'
                            value={EditData.subcategory || ''}
                            onChange={e => setEditData({ ...EditData, subcategory: e.target.value })}
                            error={!!formErrors.subcategory}
                            helperText={formErrors.subcategory}
                        >
                            <MenuItem value="" disabled>Select SubCategory</MenuItem>
                            {subcategory
                                // .filter(type => type.status === 'ACTIVE')
                                .map(type => (
                                    <MenuItem key={type._id} value={type._id}>
                                        {type.categoryName}
                                    </MenuItem>
                                ))}
                        </CustomTextField>
                    </div>




                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='title'
                            label='Title'
                            onChange={handleChange}
                            value={EditData.title || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                        />
                    </div>

                    {/* For maxQues field */}
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='maxQues'
                            label='Maximum Questions'
                            type='number'
                            onChange={handleChange}
                            value={EditData.maxQues || ''}
                            variant='outlined'
                            error={!!formErrors.maxQues}
                            helperText={formErrors.maxQues}
                            inputProps={{
                                min: 0,
                                onKeyDown: (e) => {
                                    // Prevent negative numbers from being entered
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='entry_fee'
                            label='Entry Fee (Coins) Deduct'
                            type='number'
                            onChange={handleChange}
                            value={EditData.entry_fee || ''}
                            variant='outlined'
                            error={!!formErrors.entry_fee}
                            helperText={formErrors.entry_fee}
                            inputProps={{
                                min: 0,
                                // max: 100,
                                onKeyDown: (e) => {
                                    // Prevent negative numbers and scientific notation
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='prize'
                            label='Prize (Coins)'
                            type='number'
                            onChange={handleChange}
                            value={EditData.prize || ''}
                            variant='outlined'
                            error={!!formErrors.prize}
                            helperText={formErrors.prize}
                            inputProps={{
                                min: 0,
                                // max: 100,
                                onKeyDown: (e) => {
                                    // Prevent negative numbers and scientific notation
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* For winning field */}
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='winning'
                            label='Winning Percentage'
                            type='number'
                            value={EditData.winning || ''}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 100) {
                                    handleChange(e); // only update when valid
                                } else if (e.target.value === '') {
                                    handleChange(e); // allow clearing the input
                                }
                            }}
                            variant='outlined'
                            error={!!formErrors.winning}
                            helperText={formErrors.winning}
                            inputProps={{
                                min: 0,
                                max: 100,
                                onKeyDown: (e) => {
                                    // Block negative and scientific notation
                                    if (['-', 'e', 'E'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* For level field */}
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='level'
                            label='Level'
                            type='number'
                            onChange={handleChange}
                            value={EditData.level || ''}
                            variant='outlined'
                            error={!!formErrors.level}
                            helperText={formErrors.level}
                            inputProps={{
                                min: 1,
                                onKeyDown: (e) => {
                                    // Prevent negative numbers and scientific notation
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='ques_duration'
                            label='Question Duration'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={EditData.ques_duration || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.ques_duration}
                            helperText={formErrors.ques_duration}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='scorePerCorrectAns'
                            label='Score Credit Per Correct Answer'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={EditData.scorePerCorrectAns || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.scorePerCorrectAns}
                            helperText={formErrors.scorePerCorrectAns}
                        />
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='terms'
                            label='Terms and Conditions'
                            onChange={handleChange}
                            value={EditData.terms || ''}
                            multiline
                            rows={4}
                            variant='outlined'
                            error={!!formErrors.terms}
                            helperText={formErrors.terms}
                        />
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData.status}
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
                    {hasPermission('quiz_trueAndFalse:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Level
                        </Button>}
                    <Button onClick={handlelevelEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditModal
