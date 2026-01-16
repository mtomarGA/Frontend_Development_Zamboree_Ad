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
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { Avatar, Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import ContestQues from '@/services/quiz/quiz-contest/questionService'
import { useAuth } from '@/contexts/AuthContext'
// import Quiztype from '../quiztype/quiztype'

const AddModal = ({ open, handleClose, handleClickOpen, getdata, level }) => {
    const { hasPermission } = useAuth();
    const [Adddata, setAdddata] = useState({
        status: "INACTIVE",
        level: level,
        answer: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        icon: '',
        questionType: 'option',
    });
    console.log(Adddata, "level")
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })
    const [questionType, setQuestionType] = useState('option')
    // Question type change handler
    const handleQuestionTypeChange = (e) => {
        const newType = e.target.value
        setQuestionType(newType)
        setAdddata(prev => ({
            ...prev,
            questionType: newType
        }))
        // Clear C and D options if switching to true/false
        if (newType === 'truefalse') {
            setAdddata(prev => ({
                ...prev,
                optionC: '',
                optionD: ''
            }))
        }
    }

    // Render option fields
    const renderOptions = () => {
        const fields = [
            { name: 'optionA', label: 'Option A' },
            { name: 'optionB', label: 'Option B' }
        ]

        if (questionType === 'option') {
            fields.push(
                { name: 'optionC', label: 'Option C' },
                { name: 'optionD', label: 'Option D' }
            )
        }

        return fields.map(({ name, label }) => (
            <TextField
                key={name}
                name={name}
                label={label}
                value={Adddata[name] || ''}
                onChange={handleInputChange}
                sx={{ width: '48%', mb: 2 }}
                error={!!formErrors[name]}
                helperText={formErrors[name]}
            />
        ))
    }

    // Get answer options based on question type
    const getAnswerOptions = () => {
        const keys = ['A', 'B']
        if (questionType === 'option') keys.push('C', 'D')
        return keys.map(key => (
            <MenuItem key={key} value={key}>
                Option {key}
            </MenuItem>
        ))
    }

    // console.log(Adddata, "editData")
    // Form validation
    const validateFields = (data) => {
        let errors = {}

        if (!data.question.trim()) errors.question = 'Question is required'
        if (!data.optionA.trim()) errors.optionA = 'Option A is required'
        if (!data.optionB.trim()) errors.optionB = 'Option B is required'

        if (questionType === 'option') {
            if (!data.optionC.trim()) errors.optionC = 'Option C is required'
            if (!data.optionD.trim()) errors.optionD = 'Option D is required'
        }

        if (!data.answer) errors.answer = 'Correct answer is required'
        if (!data.icon) errors.icon = 'Image is required'

        return errors
    }


    useEffect(() => {
        if (open) {
            setAdddata({
                status: "INACTIVE",
                level: level,
                answer: '',
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                icon: '',
                questionType: 'option',
            });

            setFormErrors({});

        }
    }, [open]);


    // // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }


    const handleImageChange = async (e) => {
        const { files } = e.target
        if (!files[0]) return

        try {
            const imageData = { image: files[0] }
            const result = await Image.uploadImage(imageData)

            if (result.data.url) {
                setAdddata(prev => ({
                    ...prev,
                    icon: result.data.url
                }))

                // Clear error when file is selected
                if (formErrors.icon) {
                    setFormErrors(prev => ({ ...prev, icon: '' }))
                }
            }
        } catch (error) {
            toast.error('Failed to upload image')
            console.error(error)
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
            const response = await ContestQues.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleClose()
            }
        } catch (error) {
            toast.error("Failed to add banner")
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
                        Add Question
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {/* <Typography> */}
                    <Box sx={{ pt: 2 }}>
                        {/* Question Input */}
                        <CustomTextField
                            className="w-full"
                            name="question"
                            label="Question"
                            onChange={handleInputChange}
                            value={Adddata.question}
                            multiline
                            rows={3}
                            variant="outlined"
                            error={!!formErrors.question}
                            helperText={formErrors.question}
                            sx={{ mb: 3 }}
                        />

                        {/* Question Type Selection */}
                        <Box mb={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Question Type
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    value={questionType}
                                    onChange={handleQuestionTypeChange}
                                >
                                    <FormControlLabel
                                        value="option"
                                        control={<Radio />}
                                        label="Multiple Choice (4 Options)"
                                    />
                                    <FormControlLabel
                                        value="truefalse"
                                        control={<Radio />}
                                        label="True / False"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Typography variant="caption" color="textSecondary">
                                {questionType === 'truefalse'
                                    ? 'Only Option A and B will be available'
                                    : 'All 4 options will be available'}
                            </Typography>
                        </Box>

                        {/* Options */}
                        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                            {renderOptions()}
                        </Box>

                        {/* Image Upload */}
                        <Box mb={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Question Image (Optional)
                            </Typography>
                            <input
                                type="file"
                                name="icon"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageChange}
                            />
                            <Typography variant="caption" display="block" color="textSecondary">
                                Supported formats: PNG, JPG, JPEG
                            </Typography>
                            {Adddata.icon && (
                                <Box mt={1}>
                                    <Avatar
                                        src={Adddata.icon}
                                        alt="Question image"
                                        sx={{ width: 60, height: 60 }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Correct Answer Selection */}
                        <Box width="50%">
                            <FormControl fullWidth error={!!formErrors.answer}>
                                <InputLabel>Select Correct Answer</InputLabel>
                                <Select
                                    name="answer"
                                    value={Adddata.answer || ''}
                                    onChange={handleInputChange}
                                    label="Select Correct Answer"
                                >
                                    {getAnswerOptions()}
                                </Select>
                                {formErrors.answer && (
                                    <Typography variant="caption" color="error">
                                        {formErrors.answer}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                    </Box>

                    {/* </Typography> */}
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_contest:add') &&
                        <Button onClick={handleSubmit} disabled={!Adddata.icon} variant='contained'>
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
