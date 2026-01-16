'use client'
import React, { useState } from 'react'
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
    Box,

    TextField,
    InputLabel,
    Chip
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import EditModal from './EditModal'

import TrueAndFalseLevelRoute from '@/services/quiz/trueAndFalse/LevelServices'
import TrueFalseQuesService from '@/services/quiz/trueAndFalse/TrueFalseQuesService'
import { useParams } from 'next/navigation'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyles = {
    ACTIVE: 'success',
    INACTIVE: 'error'
}

function ZoneTable({ handleClickOpen, GetLevelFun, getlevel }) {
    const [options, setOptions] = useState({ A: '', B: '', answer: '', question: '' })
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [QuesOpen, setQuesOpen] = useState(false)

    const { lang } = useParams();
    console.log(lang,"dddhdhj")
    const handleQuesOpen = (id) => {
        setQuesOpen(true)
        setOptions({ A: '', B: '', answer: '', question: '', level: id })
    }

    const handleQuesClose = () => {
        setQuesOpen(false)
        setFormErrors({})
        setImage({ icon: null })
    }

    const [selectedLevel, setSelectedLevel] = useState(null)

    //level edit modal 
    const [levelEditOpen, setLevelEditOpen] = useState(false)

    const handlelevelEditOpen = (row) => {
        setSelectedLevel(row)
        setLevelEditOpen(true)
    }

    const handlelevelEditClose = () => {
        setLevelEditOpen(false)
        setFormErrors({})
    }

    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...getlevel].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const validateFields = (data) => {
        const errors = {}
        if (!data.question) errors.question = 'Question is required'
        if (!data.A) errors.A = 'Option A is required'
        if (!data.B) errors.B = 'Option B is required'
        if (!data.answer) errors.answer = 'Please select the correct answer'
        if (!data.icon) errors.icon = 'Image is required'
        return errors
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setOptions(prev => ({
            ...prev,
            [name]: value
        }))
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
            setOptions(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }

    const handleSubmit = async () => {
        const errors = validateFields(options)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            const response = await TrueFalseQuesService.Post(options)
            if (!response.success) {
                toast.error(response.message)
                return
            }
            toast.success(response.message)
            GetLevelFun()
            handleQuesClose()
        } catch (error) {
            toast.error('Failed to add question')
            console.error(error)
        }
    }

    // delete level
    const deleteid = async (id) => {
        const response = await TrueAndFalseLevelRoute.deleteData(id);
        if (response.success === true) {
            toast.success(response.message);
            GetLevelFun();
            return;
        }
        toast.error("Unable to Delete");
    }

    const { hasPermission } = useAuth();

    // Render only Option A and Option B fields
    const renderOptions = () => [
        <TextField
            key="A"
            name="A"
            label="Option A"
            value={options.A}
            className='my-2'
            onChange={handleInputChange}
            sx={{ width: '48%', mb: 2 }}
            error={!!formErrors.A}
            helperText={formErrors.A}
        />,
        <TextField
            key="B"
            name="B"
            label="Option B"
            className='my-2'
            value={options.B}
            onChange={handleInputChange}
            sx={{ width: '48%', mb: 2 }}
            error={!!formErrors.B}
            helperText={formErrors.B}
        />
    ];
    // Only Option A and B for answer selection
    const getAnswerOptions = () => [
        <MenuItem key="A" value="A">Option A</MenuItem>,
        <MenuItem key="B" value="B">Option B</MenuItem>
    ];

    return (
        <div>
            <Dialog open={QuesOpen} onClose={handleQuesClose} PaperProps={{ sx: { overflow: 'visible' } }}>
                <DialogTitle>
                    <Typography variant='div'>Add Questions</Typography>
                    <DialogCloseButton onClick={handleQuesClose}><i className='tabler-x' /></DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <CustomTextField
                        fullWidth
                        name='question'
                        label='Question'
                        multiline
                        rows={2}
                        onChange={handleInputChange}
                        value={options.question}
                        variant='outlined'
                        error={!!formErrors.question}
                        helperText={formErrors.question}
                    />

                    <Box display="flex " flexWrap="wrap" gap={2}>
                        {renderOptions()}
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
                                value={options.answer}
                                onChange={handleInputChange}
                                label='Select Right Answer'
                            >
                                {getAnswerOptions()}
                            </Select>
                            {formErrors.answer && (
                                <Typography variant='caption' color='error'>{formErrors.answer}</Typography>
                            )}
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_trueAndFalse:add') &&
                        <Button onClick={handleSubmit} variant='contained' disabled={!options.icon}>Add Question</Button>
                    }
                    <Button onClick={handleQuesClose} variant='tonal' color='secondary'>Close</Button>
                </DialogActions>
            </Dialog>

            {/* edit modal */}
            <EditModal levelEditOpen={levelEditOpen} handlelevelEditClose={handlelevelEditClose} GetLevelFun={GetLevelFun} selectedLevel={selectedLevel} />

            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>True & False Manage Level</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {hasPermission('quiz_trueAndFalse:add') && (
                            <Button variant='contained' onClick={handleClickOpen}>Add Level</Button>

                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {['Category', 'Sub Category', 'Title', 'Level', 'Max Questions', , 'Entry_Fee', 'Prize', 'Added Question', 'winning %'].map((head, index) => (
                                <TableCell key={index} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === head.toLowerCase()}
                                        direction={orderBy === head.toLowerCase() ? order : 'asc'}
                                        onClick={() => handleRequestSort(head.toLowerCase())}
                                    >
                                        {head}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Status</TableCell>
                            <TableCell className='p-2'>View</TableCell>
                            <TableCell className='p-2'>Add Questions</TableCell>
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row?.category?.categoryName}</TableCell>
                                <TableCell className='p-2'>{row?.subcategory?.categoryName}</TableCell>
                                <TableCell className='p-2'>{row?.title}</TableCell>
                                <TableCell className='p-2'>{row?.level}</TableCell>
                                <TableCell className='p-2'>{row?.maxQues}</TableCell>
                                <TableCell className='p-2'>{row?.entry_fee}</TableCell>
                                <TableCell className='p-2'>{row?.prize}</TableCell>
                                <TableCell className='p-2'>{row?.questionCount}</TableCell>
                                <TableCell className='p-2'>{row?.winning}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row.status} color={statusStyles[row?.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('quiz_trueAndFalse:view') && (

                                        <Link href={`/${lang}/apps/quiz/trueAndFalse/managelevel/question/${row._id}`}>
                                            <Eye className='text-blue-500 size-5 mx-2 cursor-pointer hover:scale-110 transition' />
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('quiz_trueAndFalse:add') && (
                                        <Button variant='tonal' size='small' onClick={() => handleQuesOpen(row._id)}>Add Ques</Button>
                                    )}
                                </TableCell>
                                <TableCell className='p-2 flex items-center'>
                                    {hasPermission('quiz_trueAndFalse:edit') &&
                                        <Pencil
                                            className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition mx-2'
                                            onClick={() => handlelevelEditOpen(row)} disabled={row.questionCount <= 0}
                                        />
                                    }
                                    {hasPermission('quiz_trueAndFalse:delete') &&
                                        <Trash2
                                            className='text-red-600 size-5 cursor-pointer hover:scale-110 transition'
                                            onClick={() => deleteid(row._id)} disabled={row.questionCount <= 0}
                                        />
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, getlevel.length)} of {getlevel.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(getlevel.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default ZoneTable
