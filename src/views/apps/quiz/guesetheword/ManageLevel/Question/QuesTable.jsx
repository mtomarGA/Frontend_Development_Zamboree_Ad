'use client'
import React, { useEffect, useState } from 'react'
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Box,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    InputLabel
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../../announce/list/pagination'
import { Edit, Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'next/navigation'
import FunQuesService from '@/services/quiz/funAndLearn/FunQuesService'
import GuesTheWordQuesService from '@/services/quiz/guesstheword/GueseQuestion'

const rowsPerPageOptions = [5, 10, 25, 50]

function QuesTable({ handleClickOpen }) {
    // Main data state
    const [getQues, setGetQues] = useState([])

    // Question form state
    const [editData, setEditData] = useState({
        id: '',
        question: '',
        answer: '',
        icon: null
    })

    // UI state
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    // const [questionType, setQuestionType] = useState('options')
    const [editOpen, setEditOpen] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const { id } = useParams();
    // Fetch data
    const fetchData = async () => {
        try {
            const res = await GuesTheWordQuesService.getdatabyid(id)
            setGetQues(res.data)
        } catch (error) {
            toast.error('Failed to fetch questions')
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



    // Modal handlers
    const handleEditOpen = (question = null) => {
        if (question) {
            setEditData({
                id: question._id,
                question: question.question || '',

                answer: question.answer || '',
                icon: question.icon || null
            });

        } else {
            // If adding a new question, reset to defaults
            setEditData({
                id: '',
                question: '',

                answer: '',
                icon: null
            });
            // setQuestionType('options');
        }
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setFormErrors({});
        setEditData({
            id: '',
            question: '',
            answer: '',
            icon: null
        });
        // setQuestionType('options');
    };

    // Input handlers
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
        console.log(files, "files")
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




    console.log(editData, "editData")
    // Form validation
    const validateFields = (data) => {
        let errors = {}

        if (!data.question.trim()) errors.question = 'Question is required'
        if (!data.answer) errors.answer = 'Correct answer is required'

        return errors
    }




    // Form submission
    const handleSubmit = async () => {
        const errors = validateFields(editData)

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }


        // Prepare data for submission
        const formData = new FormData()
        formData.append('question', editData.question)
        formData.append('answer', editData.answer)
        if (editData.icon && typeof editData.icon === 'string') {
            formData.append('icon', editData.icon)
        }
        const response = await GuesTheWordQuesService.putData(editData.id, formData)
        if (response?.data === null) {
            toast.error('Failed to update question');
            return;
        }

        // console.log(response.data, "response")

        toast.success(response.message || 'Question updated successfully')
        fetchData();
        handleEditClose();
    }

    // Sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...getQues].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // Pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }


    const deleteid = async (id) => {
        // const confirmDelete = window.confirm('Are you sure you want to delete this question?')
        // if (!confirmDelete) return
        try {
            const response = await GuesTheWordQuesService.deleteData(id)
            if (response?.data === null) {
                toast.error('Failed to delete question')
                return
            }
            toast.success('Question deleted successfully')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete question')
            console.error(error)
        }
    }

    const { hasPermission } = useAuth();
    return (
        <div>
            {/* Edit Dialog */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby="customized-dialog-title"
                open={editOpen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="customized-dialog-title">
                    <Typography variant="h5" component="span">
                        {editData.id ? 'Edit Question' : 'Add Question'}
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className="tabler-x" />
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
                            value={editData.question}
                            multiline
                            rows={3}
                            variant="outlined"
                            error={!!formErrors.question}
                            helperText={formErrors.question}
                            sx={{ mb: 3 }}
                        />



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
                            {editData.icon && typeof editData.icon === 'string' && (
                                <Box mt={1}>
                                    <Avatar
                                        src={editData.icon || undefined}
                                        alt="Question image"
                                        sx={{ width: 60, height: 60 }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <CustomTextField
                            fullWidth
                            name='answer'
                            label='Answer'
                            multiline
                            className='mt-2'
                            rows={2}
                            onChange={handleInputChange}
                            value={editData?.answer}
                            variant='outlined'
                            error={!!formErrors.answer}
                            helperText={formErrors.answer}
                        />


                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleEditClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    {hasPermission("quiz_guesstheword:edit") &&
                        (editData.icon) ? <Button onClick={handleSubmit} variant="contained">
                            {editData.id ? 'Update Question' : 'Add Question'}
                        </Button> : <Button onClick={handleSubmit} variant="contained" disabled>
                            {editData.id ? 'Update Question' : 'Add Question'}
                        </Button>}


                </DialogActions>
            </Dialog>

            {/* Table */}
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
                                <TableCell className="p-2">
                                    <span className="font-medium"> {row?.answer}</span>
                                </TableCell>
                                <TableCell className="p-2">
                                    {hasPermission("quiz_guesstheword:edit") &&
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className="text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition"
                                        />
                                    }

                                    {hasPermission("quiz_guesstheword:delete") &&
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
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, getQues.length)} of {getQues.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(getQues.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default QuesTable
