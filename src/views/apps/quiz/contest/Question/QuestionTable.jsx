'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { Avatar, Box, FormControlLabel, InputLabel, Radio, RadioGroup, TextField } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import ContestQues from '@/services/quiz/quiz-contest/questionService'
import { useAuth } from '@/contexts/AuthContext'
const rowsPerPageOptions = [5, 10, 25, 50]

function QuestionTable({ handleClickOpen, QuesData, getdata }) {

    const { hasPermission } = useAuth();

    const [EditData, setEditData] = useState({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        icon: '',
        questionType: 'option',
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditData(row)
        setQuestionType(row?.questionType || 'option')
        setEditOpen(true)
    }
    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setImage({ icon: null })
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...QuesData].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // form error and submit
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })





    const [questionType, setQuestionType] = useState('option')
    // Question type change handler
    const handleQuestionTypeChange = (e) => {
        const newType = e.target.value
        setQuestionType(newType)
        setEditData(prev => ({
            ...prev,
            questionType: newType
        }))
        // Clear C and D options if switching to true/false
        if (newType === 'truefalse') {
            setEditData(prev => ({
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
                value={EditData[name] || ''}
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


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }



    const handleImageChange = async (e) => {
        const { files } = e.target
        if (!files[0]) return

        try {
            const imageData = { image: files[0] }
            const result = await Image.uploadImage(imageData)

            if (result.data.url) {
                setEditData(prev => ({
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



    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }


        try {
            // Replace with your actual API call
            const response = await ContestQues.putData(EditData._id, EditData)
            if (response.success === true) {
                toast.success(response.message)
                getdata();
                handleEditClose()
            }

        } catch (error) {
            toast.error("Failed to add category")
            console.error(error)
        }
    }

    const DeleteData = async (id) => {
        const response = await ContestQues.deleteData(id)
        if (response.success === true) {
            toast.success(response.message)
            getdata();
        }
    }




    return (
        <div>
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Question
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>


                    <Box sx={{ pt: 2 }}>
                        {/* Question Input */}
                        <CustomTextField
                            className="w-full"
                            name="question"
                            label="Question"
                            onChange={handleInputChange}
                            value={EditData.question || ''}
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
                                    value={EditData?.questionType || 'option'}
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
                            {EditData.icon && (
                                <Box mt={1}>
                                    <Avatar
                                        src={EditData.icon}
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
                                    value={EditData.answer || ''}
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


                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_contest:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Question
                        </Button>
                    }
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Contest Questions</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
                                label='Rows per page'
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {hasPermission('quiz_contest:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Question</Button>
                        )}

                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'image'}
                                    direction={orderBy === 'image' ? order : 'asc'}
                                    onClick={() => handleRequestSort('image')}
                                >
                                    Image
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'question'}
                                    direction={orderBy === 'question' ? order : 'asc'}
                                    onClick={() => handleRequestSort('question')}
                                >
                                    Question
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'optionA'}
                                    direction={orderBy === 'optionA' ? order : 'asc'}
                                    onClick={() => handleRequestSort('optionA')}
                                >
                                    Option A
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'optionB'}
                                    direction={orderBy === 'optionB' ? order : 'asc'}
                                    onClick={() => handleRequestSort('optionB')}
                                >
                                    Option B
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'optionC'}
                                    direction={orderBy === 'optionC' ? order : 'asc'}
                                    onClick={() => handleRequestSort('optionC')}
                                >
                                    Option C
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'optionD'}
                                    direction={orderBy === 'optionD' ? order : 'asc'}
                                    onClick={() => handleRequestSort('optionD')}
                                >
                                    Option D
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'answer'}
                                    direction={orderBy === 'answer' ? order : 'asc'}
                                    onClick={() => handleRequestSort('answer')}
                                >
                                    Answer
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row.quesid}</div>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <Avatar
                                        src={row?.icon}
                                        alt="Question image"

                                    />
                                </TableCell>
                                <TableCell className='p-2'>{row?.question}</TableCell>
                                <TableCell className='p-2'>{row?.optionA}</TableCell>
                                <TableCell className='p-2'>{row?.optionB}</TableCell>
                                <TableCell className='p-2'>{row?.optionC}</TableCell>
                                <TableCell className='p-2'>{row?.optionD}</TableCell>
                                <TableCell className='p-2'>{row?.answer}</TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('quiz_contest:edit') && (
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    )}
                                    {hasPermission('quiz_contest:delete') && (
                                        <Trash2
                                            onClick={() => DeleteData(row._id)}
                                            className='text-red-600 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, QuesData.length)} of {QuesData.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(QuesData.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default QuestionTable
