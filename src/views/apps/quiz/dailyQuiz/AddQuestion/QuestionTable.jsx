'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from "@/services/imageService"
import DailyQuizQuesRoute from '@/services/quiz/dailyquizQuesService'
import { useAuth } from '@/contexts/AuthContext'
const rowsPerPageOptions = [5, 10, 25, 50]

function QuestionTable({ handleClickOpen, GetQuesFun, GetData }) {
    // const GetData = [{
    //     categoryName: "hiii"
    // }]
    const { hasPermission } = useAuth();

    const [questionType, setQuestionType] = useState('option')

    const [EditData, setEditData] = useState({

    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setQuestionType(row.optionC && row.optionD ? 'option' : 'truefalse')

        setEditData({
            id: row._id,
            icon: row.icon,
            answer: row.answer,
            question: row.question,
            A: row.optionA,
            B: row.optionB,
            C: row.optionC,
            D: row.optionD,
            icon: row.icon,
            question: row.question,
            answer: row.answer,
            questionType: questionType || (row.optionC || row.optionD ? "option" : "truefalse"),
        })

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

    const sortedData = [...GetData].sort((a, b) => {
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
        const { name, files } = e.target
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setEditData(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }

    console.log(EditData, "edit")

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }



        const response = await DailyQuizQuesRoute.putData(EditData.id, EditData)
        if (response.success === true) {
            toast.success(response.message)
            GetQuesFun();
            handleEditClose();
            return;

        }

        toast.error("Unable to Update");


    }

const handleQuestionTypeChange = (e) => {
  const value = e.target.value
  setQuestionType(value)
  setEditData(prev => ({ ...prev, questionType: value }))  // ✅ keep in EditData
}


    const renderOptions = () => {
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
                value={EditData[name]}
                onChange={handleInputChange}
                sx={{ width: '48%', mb: 2 }}
                error={!!formErrors[name]}
                helperText={formErrors[name]}
            />
        ))
    }

    const getAnswerOptions = () => {
        const keys = ['A', 'B']
        if (questionType === 'option') keys.push('C', 'D')
        return keys.map(key => (
            <MenuItem key={key} value={key}>Option {key}</MenuItem>
        ))
    }

    const getAnswerEditData = () => {
        const keys = ['A', 'B']
        if (questionType === 'option') keys.push('C', 'D')
        return keys.map(key => (
            <MenuItem key={key} value={key}>Option {key}</MenuItem>
        ))
    }


    const renderEditData = () => {
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
                value={EditData[name]}
                onChange={handleInputChange}
                sx={{ width: '48%', mb: 2 }}
                error={!!formErrors[name]}
                helperText={formErrors[name]}
            />
        ))
    }

    // delete question

    const deleteid = async (id) => {
        const response = await DailyQuizQuesRoute.deleteData(id);
        if (response.success) {
            toast.success(response.message || "Question Deleted Successfully");
            GetQuesFun();
            return;
        }
        toast.error("Unable to Delete Question");
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

                    <CustomTextField
                        fullWidth
                        name='question'
                        className='my-2'
                        label='Question'
                        multiline
                        rows={2}
                        onChange={handleInputChange}
                        value={EditData.question}
                        variant='outlined'
                        error={!!formErrors.question}
                        helperText={formErrors.question}
                    />

                    <Box mb={2}>
                        <Typography variant='subtitle1'>Question Type</Typography>
                        <RadioGroup row value={questionType}  onChange={handleQuestionTypeChange}>
                            <FormControlLabel value='option' control={<Radio />} label='options' />
                            <FormControlLabel value='truefalse' control={<Radio />} label='True / False' />
                        </RadioGroup>
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {renderEditData()}
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
                        {EditData.icon && (
                            <Avatar src={EditData.icon} className='m-2' />
                        )}
                        {formErrors.icon && (
                            <Typography variant='caption' color='error'>{formErrors.icon}</Typography>
                        )}
                    </Box>

                    <Box mt={3} width="50%">
                        <FormControl fullWidth error={!!formErrors.answer}>
                            <InputLabel>Select Right Answer</InputLabel>
                            <Select
                                name='answer'
                                value={EditData.answer}
                                onChange={handleInputChange}
                                label='Select Right Answer'
                            >
                                {getAnswerEditData()}
                            </Select>
                            {formErrors.answer && (
                                <Typography variant='caption' color='error'>{formErrors.answer}</Typography>
                            )}
                        </FormControl>
                    </Box>

                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_dailyquiz:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Update Question
                        </Button>
                    }
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className="shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="mb-4">Quiz Questions</h3>
                    <div className="flex items-center gap-2 mx-4">
                        <Typography variant="body2">Rows per page:</Typography>
                        <FormControl size="small" variant="standard">
                            <Select
                                value={rowsPerPage}
                                className="mx-2 w-16"
                                onChange={handleChangeRowsPerPage}
                                label="Rows per page"
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            {hasPermission('quiz_dailyquiz:add') && (

                                <Button variant='contained' color='primary' onClick={handleClickOpen}>Add Question</Button>
                            )}
                        </FormControl>
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'quesid'}
                                    direction={orderBy === 'quesid' ? order : 'asc'}
                                    onClick={() => handleRequestSort('quesid')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="p-2">Image</TableCell>
                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'question'}
                                    direction={orderBy === 'question' ? order : 'asc'}
                                    onClick={() => handleRequestSort('question')}
                                >
                                    Question
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="p-2">Option A</TableCell>
                            <TableCell className="p-2">Option B</TableCell>
                            <TableCell className="p-2">Option C</TableCell>
                            <TableCell className="p-2">Option D</TableCell>
                            <TableCell className="p-2">Correct Answer</TableCell>
                            <TableCell className="p-2">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className="border-b">
                                <TableCell className="p-2">
                                    <div className="font-medium">{row?.quesid}</div>
                                </TableCell>
                                <TableCell className="p-2">
                                    <Avatar src={row?.icon} alt="Question" />
                                </TableCell>
                                <TableCell className="p-2 max-w-xs">
                                    <div className="truncate" title={row?.question}>
                                        {row?.question}
                                    </div>
                                </TableCell>
                                <TableCell className="p-2">{row?.optionA}</TableCell>
                                <TableCell className="p-2">{row?.optionB}</TableCell>
                                <TableCell className="p-2">{row?.optionC || '-'}</TableCell>
                                <TableCell className="p-2">{row?.optionD || '-'}</TableCell>
                                <TableCell className="p-2">
                                    <span className="font-medium">Option {row?.answer}</span>
                                </TableCell>
                                <TableCell className="p-2">
                                    {hasPermission('quiz_dailyquiz:edit') &&
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className="text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition"
                                        />
                                    }


                                    {hasPermission('quiz_dailyquiz:delete') &&
                                        <Trash2
                                            className='text-red-600 size-5 cursor-pointer hover:scale-110 transition'
                                            onClick={() => deleteid(row._id)}
                                        />
                                    }

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-col sm:flex-row justify-between items-center m-4 gap-4">
                    <Typography variant="body2" className="text-gray-600">
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, GetData.length)} of {GetData.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(GetData.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default QuestionTable
