'use client'
import React, { useEffect, useState } from 'react'
import ContestQues from '@/services/quiz/quiz-contest/questionService'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Dialog, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import contestRoute from '@/services/quiz/quiz-contest/contestService'
import LevelRoute from '@/services/quiz/quiz-contest/LevelService'

// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, handleClickOpen, GetLevelFun, contest, contestid }) => {

    const [Adddata, setAdddata] = useState({
        status: "INACTIVE",
        contestid: contestid,
    });
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null, name: '' });

    // fetch category

    // const [subcategory, setsubcategory] = useState([]);

    useEffect(() => {
        if (open) {
            setAdddata({
                status: "INACTIVE",
                contestid: contestid,
                // Add other default fields if needed
            });
            setFormErrors({});

        }
    }, [open]);

    const validateFields = (data) => {
        let errors = {}
        if (!data.contestid) errors.contestid = 'Contest is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.level) errors.level = 'Level is required'
        if (!data.terms) errors.terms = 'Terms and Conditions is required'
        if (!data.title) errors.title = 'Title is required'
        if (!data.maxQues) errors.maxQues = 'Maximum Questions is required'
        if (!data.winning) errors.winning = 'Winning Percentage is required'
        if (!data.ques_duration) errors.ques_duration = 'Question Duration is required'
        if (!data.scorePerCorrectAns) errors.scorePerCorrectAns = 'Score Credit Per Correct Answer is required'
        if (!data.free_bomb_per_level) errors.free_bomb_per_level = 'Free Bomb Per Level is required'
        if (!data.bomb_deduct_Coins) errors.bomb_deduct_Coins = 'Bomb Deduct Coins is required'
        if (!data.free_add_time) errors.free_add_time = 'Free Add Time is required'
        if (!data.add_time_deduct_Coins) errors.add_time_deduct_Coins = 'Add Time Deduct Coins is required'
        if (!data.free_poll_per_level) errors.free_poll_per_level = 'Free Poll Per Level is required'
        if (!data.poll_deduct_Coins) errors.poll_deduct_Coins = 'Poll Deduct Coins is required'
        if (!data.free_skip) errors.free_skip = 'Free Skip Per Level is required'
        if (!data.skip_deduct_Coins) errors.skip_deduct_Coins = 'Skip Deduct Coins is required'

        return errors
    }


    // // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }


    console.log(Adddata, "hiiii")


    const { hasPermission } = useAuth();





    // console.log(Adddata, "hii")

    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            console.log(errors, "errors")
            return
        }



        try {
            const response = await LevelRoute.Post(Adddata)
            // console.log(response, "hiiii")
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
                        Add Level In Contest
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div >
                        <CustomTextField
                            className='m-2 w-96'
                            select
                            name='contestid'
                            label='Contest'
                            disabled
                            value={Adddata.contestid || ''}
                            onChange={e => setAdddata({ ...Adddata, contestid: e.target.value })}
                            error={!!formErrors.contestid}
                            helperText={formErrors.contestid}
                        >
                            <MenuItem value="" disabled>Select Contest</MenuItem>
                            {contest
                                .filter(type => type.status === 'ACTIVE')
                                .map(type => (
                                    <MenuItem key={type._id} value={type._id}>
                                        {type.name}
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
                            type='number'
                            name='maxQues'
                            label='Maximum Questions'
                            onChange={handleChange}
                            value={Adddata.maxQues || ''}
                            variant='outlined'
                            error={!!formErrors.maxQues}
                            helperText={formErrors.maxQues}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onKeyDown={e => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            type='number'
                            name='winning'
                            label='Winning Percentage'
                            onChange={handleChange}
                            value={Adddata.winning || ''}
                            variant='outlined'
                            error={!!formErrors.winning}
                            helperText={formErrors.winning}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onKeyDown={e => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='level'
                            label='Level'
                            onChange={handleChange}
                            value={Adddata.level || ''}
                            variant='outlined'
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onKeyDown={e => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
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
                            name='free_bomb_per_level'
                            label='Free Bomb Per Quiz'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.free_bomb_per_level || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.free_bomb_per_level}
                            helperText={formErrors.free_bomb_per_level}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='bomb_deduct_Coins'
                            label='Bomb Deduct Coins'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.bomb_deduct_Coins || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.bomb_deduct_Coins}
                            helperText={formErrors.bomb_deduct_Coins}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='free_poll_per_level'
                            label='Free Poll Deduct Coins'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.free_poll_per_level || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.free_poll_per_level}
                            helperText={formErrors.free_poll_per_level}
                        />
                    </div>




                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='poll_deduct_Coins'
                            label='Poll Deduct Coins'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.poll_deduct_Coins || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.poll_deduct_Coins}
                            helperText={formErrors.poll_deduct_Coins}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='free_add_time'
                            label='Free Add Time'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.free_add_time || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.free_add_time}
                            helperText={formErrors.free_add_time}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='add_time_deduct_Coins'
                            label='Add Time Deduct Coins'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.add_time_deduct_Coins || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.add_time_deduct_Coins}
                            helperText={formErrors.add_time_deduct_Coins}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='free_skip'
                            label='Free Skip'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.free_skip || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.free_skip}
                            helperText={formErrors.free_skip}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='skip_deduct_Coins'
                            label='Skip Deduct Coins'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={Adddata.skip_deduct_Coins || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.skip_deduct_Coins}
                            helperText={formErrors.skip_deduct_Coins}
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
                            value={Adddata.status || ''}
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
                    {hasPermission('quiz_contest:add') &&
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
