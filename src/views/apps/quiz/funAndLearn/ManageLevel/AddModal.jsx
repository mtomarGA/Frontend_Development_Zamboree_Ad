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
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService'
import Subcategory from '@/views/apps/subcategory'
import QuizLevelRoute from '@/services/quiz/quizLevel.route'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import FunAndLearnLevelRoute from '@/services/quiz/funAndLearn/LevelServices'
import FunCategoryRoute from '@/services/quiz/funAndLearn/CategoryService'
import FunAndLearnSubCategoryRoute from '@/services/quiz/funAndLearn/SubCategoryService'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, handleClickOpen, GetLevelFun }) => {

    const [Adddata, setAdddata] = useState({
        status: "INACTIVE"
    });
    const [formErrors, setFormErrors] = useState({})

    // fetch category
    const [category, setcategory] = useState([]);
    const [subcategory, setsubcategory] = useState([]);


    const validateFields = (data) => {
        let errors = {}
        if (!data.category) errors.category = 'Category is required'
        if (!data.subcategory) errors.subcategory = 'Sub Category  is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.prize) errors.prize = 'Prize is required'
        if (!data.entry_fee) errors.entry_fee = 'Entry_fee is required'
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
                setAdddata(prev => ({ ...prev, [name]: value }));

                // Clear error when user starts typing
                if (formErrors[name]) {
                    setFormErrors(prev => ({ ...prev, [name]: '' }));
                }
            }
        } else {
            // For non-numeric fields
            setAdddata(prev => ({ ...prev, [name]: value }));

            // Clear error when user starts typing
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };


    // console.log(Adddata)

    const { hasPermission } = useAuth();



    const fetchcategory = async () => {
        const res = await FunCategoryRoute.category();
        setcategory(res.data);
    }

    // fetch Sub Category 

    const fetchsubcategory = async () => {
        const res = await FunAndLearnSubCategoryRoute.subcategory(Adddata?.category || []);
        setsubcategory(res.data);
    }


    useEffect(() => {
        if (Adddata?.category) {
            fetchsubcategory()
        }
        fetchcategory()
    }, [Adddata?.category]);


    useEffect(() => {
        if (open) {
            setAdddata({
                status: "INACTIVE",

                // Add other default fields if needed
            });
            setFormErrors({});

        }
    }, [open]);


    // console.log(Adddata, "hii")

    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }



        try {
            const response = await FunAndLearnLevelRoute.Post(Adddata)
            // console.log(, "hiiii")
            if (response.success === true) {
                toast.success(response?.message)
                GetLevelFun()
                handleClose()
            }
            if (response.response?.data?.success === false) {
                toast.error(response.response?.data?.message)
            }

        } catch (error) {
            toast.error("Failed to Add Level");
            console.error(error)
        }
    }

    console.log(Adddata, "hii")
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
                        Add Level In Fun And Learn
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Typography component={'div'}>
                        <div >
                            <CustomTextField
                                className='m-2 w-96'
                                select
                                name='category'
                                label='Category'
                                value={Adddata.category || ''}
                                onChange={e => setAdddata({ ...Adddata, category: e.target.value })}
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
                                value={Adddata.subcategory || ''}
                                onChange={e => setAdddata({ ...Adddata, subcategory: e.target.value })}
                                error={!!formErrors.subcategory}
                                helperText={formErrors.subcategory}
                            >
                                <MenuItem value="" disabled>Select SubCategory</MenuItem>
                                {subcategory
                                    // .filter(type => type.status === 'ACTIVE')
                                    .map(type => (
                                        <MenuItem key={type?._id} value={type?._id}>
                                            {type?.categoryName}
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
                                name='maxQues'
                                label='Maximum Questions'
                                type='number'
                                onChange={handleChange}
                                value={Adddata.maxQues || ''}
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
                                value={Adddata.entry_fee || ''}
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
                                value={Adddata.prize || ''}
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
                                onChange={handleChange}
                                value={Adddata.winning || ''}
                                variant='outlined'
                                error={!!formErrors.winning}
                                helperText={formErrors.winning}
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                    onKeyDown: (e) => {
                                        // Prevent negative numbers and scientific notation
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
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
                                value={Adddata.level || ''}
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
                        value={Adddata.ques_duration || ''}
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
                        value={Adddata.scorePerCorrectAns || ''}
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
                                value={Adddata.terms || ''}
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
                                value={Adddata.status}
                                onChange={handleChange}
                                error={!!formErrors.status}
                                helperText={formErrors.status}
                            >
                                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                                <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                            </CustomTextField>
                        </div>


                    </Typography>
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_funAndLearn:add') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Add Level
                        </Button>}
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddModal
