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
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import Image from "@/services/imageService"
import DailyQuizQuesRoute from '@/services/quiz/dailyquizQuesService'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, GetQuesFun, GetData, id }) => {

    const { hasPermission } = useAuth();
    const [Adddata, setAdddata] = useState({
        Quizid: id,
        questionType: 'option'
    });

    console.log(Adddata, "ddj")
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })
    const [questionType, setQuestionType] = useState('option');

    const validateFields = (data) => {
        const errors = {}
        if (!data.question) errors.question = 'Question is required'
        if (!data.A) errors.A = 'Option A is required'
        if (!data.B) errors.B = 'Option B is required'
        if (questionType === 'option') {
            if (!data.C) errors.C = 'Option C is required'
            if (!data.D) errors.D = 'Option D is required'
        }
        if (!data.answer) errors.answer = 'Please select the correct answer'
        if (!data.icon) errors.icon = 'Image is required'
        return errors
    }




    const renderAdddata = () => {
        const fields = [
            { name: 'A', label: 'Option A' },
            { name: 'B', label: 'Option B' }
        ]

        if (questionType === 'option') {
            fields.push({ name: 'C', label: 'Option C' }, { name: 'D', label: 'Option D' })
        }

        return fields.map(({ name, label }) => (
            <TextField
                key={name}
                name={name}
                label={label}
                value={Adddata[name]}
                onChange={handleInputChange}
                sx={{ width: '48%', mb: 2 }}
                error={!!formErrors[name]}
                helperText={formErrors[name]}
            />
        ))
    }

    const handleQuestionTypeChange = (e) => {
        const value = e.target.value;
        setQuestionType(value);
        setAdddata(prev => ({ ...prev, questionType: value }));
    };


    const getAnswerAdddata = () => {
        const keys = ['A', 'B']
        if (questionType === 'option') keys.push('C', 'D')
        return keys.map(key => (
            <MenuItem key={key} value={key}>Option {key}</MenuItem>
        ))
    }


    console.log(Adddata)
    // // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }


    // image upload handler

    const handleImageChange = async (e) => {
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
        const errors = validateFields({ ...Adddata });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await DailyQuizQuesRoute.Post(Adddata);
            if (response.success === true) {
                toast.success(response.message);
                GetQuesFun();
                handleClose();
            }
        } catch (error) {
            toast.error("Failed to add question");
            console.error(error);
        }
    };

    useEffect(() => {
        if (open) {
            setAdddata({ Quizid: id, questionType: 'option'  });

        }

    }, [open])


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
                        Add Question
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <CustomTextField
                        fullWidth
                        name='question'
                        className='my-2'
                        label='Question'
                        multiline
                        rows={2}
                        onChange={handleInputChange}
                        value={Adddata.question || ''}
                        variant='outlined'
                        error={!!formErrors.question}
                        helperText={formErrors.question}
                    />

                    <Box mb={2}>
                        <Typography variant='subtitle1'>Question Type</Typography>
                        <RadioGroup
                            row
                            value={Adddata.questionType || 'option'}
                            onChange={handleQuestionTypeChange}
                        >
                            <FormControlLabel value='option' control={<Radio />} label='Options' />
                            <FormControlLabel value='truefalse' control={<Radio />} label='True / False' />
                        </RadioGroup>

                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {renderAdddata()}
                    </Box>

                    <Box mt={2}>
                        <Typography variant='subtitle1'>Image for Question (if any)</Typography>
                        <input
                            type='file'
                            name='icon'
                            accept='image/png, image/jpeg'
                            onChange={handleImageChange}
                            key={image.icon ? 'file-selected' : 'file-empty'}
                        />
                        {formErrors.icon && (
                            <Typography variant='caption' color='error'>{formErrors.icon}</Typography>
                        )}
                    </Box>

                    <Box mt={3} width="50%">
                        <FormControl fullWidth error={!!formErrors.answer}>
                            <InputLabel>Select Right Answer</InputLabel>
                            <Select
                                name='answer'
                                value={Adddata.answer || ''}
                                onChange={handleInputChange}
                                label='Select Right Answer'
                            >
                                {getAnswerAdddata()}
                            </Select>
                            {formErrors.answer && (
                                <Typography variant='caption' color='error'>{formErrors.answer}</Typography>
                            )}
                        </FormControl>
                    </Box>


                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_dailyquiz:add') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Add Question
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
