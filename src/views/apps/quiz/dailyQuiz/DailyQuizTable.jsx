'use client'
import React, { useEffect, useState } from 'react'
import {
    TableRow, Table, TableContainer, TableHead, TableCell,
    TableSortLabel, TableBody, Typography, Button, FormControl,
    Select, MenuItem, Dialog, DialogTitle, DialogContent,
    DialogActions, Chip
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import Grid from '@mui/material/Grid2'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import DailyQuizRoute from '@/services/quiz/dailyQuizServices'
import Link from '@/components/Link'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'next/navigation'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyles = {
    ACTIVE: "success",
    INACTIVE: 'error',
}

function DailyQuizTable({ handleClickOpen, GetDailyQuizFun, setDailyQuizData, DailyQuizData }) {
    const { hasPermission } = useAuth()
    const { lang } = useParams()

    const [EditData, setEditData] = useState({
        sort_id: '',
        categoryName: '',
        slug: '',
        status: 'ACTIVE'
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [date, setDate] = useState(new Date())
    const [Editopen, setEditOpen] = useState(false)
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')
    const [search, setSearch] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const handleEditOpen = (row) => {
        setEditOpen(true)
        setEditData(row)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...DailyQuizData].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const FilteredData = sortedData.filter((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('en-GB')
        return (
            item?.prize?.toString().toLowerCase().includes(search.toLowerCase()) ||
            item?.participate_point?.toString().toLowerCase().includes(search.toLowerCase()) ||
            item?.status?.toLowerCase().startsWith(search.toLowerCase()) ||
            formattedDate.includes(search)
        )
    })

    const paginatedData = FilteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
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

    const validateFields = (data) => {
        let errors = {}
        if (!data.date) errors.date = 'Date is required'
        if (!data.entry_fee) errors.entry_fee = 'Entry Fee is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.prize) errors.prize = 'Prize is required'
        if (!data.terms) errors.terms = 'Term and condition is required'
        if (!data.maxQues) errors.maxQues = 'Maximum Questions is required'
        if (!data.winning) errors.winning = 'Winning Percentage is required'
        if (!data.ques_duration) errors.ques_duration = 'Question Duration is required'
        if (!data.scorePerCorrectAns) errors.scorePerCorrectAns = 'Score Credit Per Correct Answer is required'

        return errors
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        const response = await DailyQuizRoute.putData(EditData._id, EditData)
        if (response.success === true) {
            toast.success(response.message)
            GetDailyQuizFun()
            handleEditClose()
        } else {
            toast.error("Unable to Update Daily Quiz")
        }
    }

    const convertDate = (ExpiryDate) => {
        const date = new Date(ExpiryDate)
        return date.toLocaleDateString('en-GB')
    }

    return (
        <div>
            {/* Edit Modal */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5'>Edit Category</Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppReactDatepicker
                            selected={EditData.date ? new Date(EditData.date) : date}
                            className='m-2 w-96'
                            minDate={new Date()}
                            dateFormat='dd/MM/yyyy'
                            onChange={date => setEditData({ ...EditData, date })}
                            placeholderText='Click to select a date'
                            customInput={
                                <CustomTextField
                                    label='Date'
                                    fullWidth
                                    error={!!formErrors.date}
                                    helperText={formErrors.date}
                                />
                            }
                        />
                    </Grid>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='entry_fee'
                            label='Entry Fee'
                            onChange={handleChange}
                            value={EditData.entry_fee || ''}
                            error={!!formErrors.entry_fee}
                            helperText={formErrors.entry_fee}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='prize'
                            label='Prize'
                            onChange={handleChange}
                            value={EditData.prize || ''}
                            error={!!formErrors.prize}
                            helperText={formErrors.prize}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='maxQues'
                            label='Maximum Questions'
                            onChange={handleChange}
                            value={EditData.maxQues || ''}
                            variant='outlined'
                            error={!!formErrors.maxQues}
                            helperText={formErrors.maxQues}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='winning'
                            label='Winning Percentage'
                            onChange={handleChange}
                            value={EditData.winning || ''}
                            variant='outlined'
                            error={!!formErrors.winning}
                            helperText={formErrors.winning}
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
                            value={EditData.status || ''}
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
                    {hasPermission('quiz_dailyquiz:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>Update Daily Quiz</Button>
                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Table */}
            <TableContainer className='shadow p-6'>
                <div className='my-2'>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <CustomTextField
                            name='search'
                            value={search}
                            className='w-52'
                            placeholder="Search by Status, Date or Prize  "
                            onChange={(e) => setSearch(e.target.value)}
                            id='form-props-search'
                            label='Search field'
                            type='search'
                            fullWidth
                        />
                    </Grid>
                </div>

                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Daily Quiz</h3>
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
                        {hasPermission('quiz_dailyquiz:add') && (
                            <Button variant='contained' onClick={handleClickOpen}>Add New</Button>
                        )}
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {['date', 'entry_fee', 'prize', 'maxQues', 'winning %', 'status'].map(col => (
                                <TableCell key={col} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === col}
                                        direction={orderBy === col ? order : 'asc'}
                                        onClick={() => handleRequestSort(col)}
                                    >
                                        {col.replace('_', ' ').toUpperCase()}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{convertDate(row.date)}</TableCell>
                                <TableCell className='p-2'>{row?.entry_fee}</TableCell>
                                <TableCell className='p-2'>{row?.prize}</TableCell>
                                <TableCell className='p-2'>{row.maxQues ? row.maxQues + " Questions" : '-'}</TableCell>
                                <TableCell className='p-2'>{row.winning ? row.winning + "%" : '-'}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row.status} color={statusStyles[row?.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2 flex items-center'>
                                    <Link href={`/${lang}/apps/quiz/dailyquiz/question/${row._id}`}>
                                        <Button variant='tonal' size='small'>Add Ques</Button>
                                    </Link>
                                    <Pencil
                                        onClick={() => handleEditOpen(row)}
                                        className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, FilteredData.length)} of {FilteredData.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(FilteredData.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default DailyQuizTable
