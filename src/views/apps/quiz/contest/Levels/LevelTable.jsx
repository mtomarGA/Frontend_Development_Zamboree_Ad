'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import LevelRoute from '@/services/quiz/quiz-contest/LevelService'
import Link from '@/components/Link'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'next/navigation'

const rowsPerPageOptions = [5, 10, 25, 50]

function LevelTable({ handleClickOpen, GetLevel, GetLevelFun, contest }) {
    // const GetLevel = [{
    //     categoryName: "hiii"
    // }]

    const { hasPermission } = useAuth();

    const [EditData, setEditData] = useState({});
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditData({
            _id: row._id,
            contestid: row.contestid?._id || '',
            title: row.title || '',
            level: row.level || '',
            maxQues: row.maxQues || '',
            winning: row.winning || '',
            terms: row.terms || '',
            status: row.status || '',
            ques_duration: row.ques_duration || '',
            scorePerCorrectAns: row.scorePerCorrectAns || '',
            free_bomb_per_level: row.free_bomb_per_level || '',
            bomb_deduct_Coins: row.bomb_deduct_Coins || '',
            free_add_time: row.free_add_time || '',
            add_time_deduct_Coins: row.add_time_deduct_Coins || '',
            free_poll_per_level: row.free_poll_per_level || '',
            poll_deduct_Coins: row.poll_deduct_Coins || '',
            free_skip: row.free_skip || '',
            skip_deduct_Coins: row.skip_deduct_Coins || '',
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

    const sortedData = [...GetLevel].sort((a, b) => {
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

    const handleChange = (e) => {
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



    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            // Replace with your actual API call
            const response = await LevelRoute.putData(EditData._id, EditData)
            if (response.success === true) {
                toast.success(response.message)
                GetLevelFun()
                handleEditClose()
            }

        } catch (error) {
            toast.error("Failed to update level")
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await LevelRoute.deleteData(id)
            if (response.success === true) {
                toast.success(response.message)
                GetLevelFun()
            }
        } catch (error) {
            toast.error("Failed to delete category")
            console.error(error)
        }
    }

    const { lang } = useParams();

    const statusStyle = {
        ACTIVE: 'success',
        PENDING: "error"
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
                        Edit Level
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {/* <Typography> */}

                    <div >
                        <CustomTextField
                            className='m-2 w-96'
                            select
                            name='contestid'
                            label='Contest'
                            value={EditData?.contestid || ''}
                            onChange={e => setEditData({ ...EditData, contestid: e.target.value })}
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
                            value={EditData?.title || ''}
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
                            onChange={handleChange}
                            value={EditData?.maxQues || ''}
                            multiline
                            rows={1}
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
                            value={EditData?.winning || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.winning}
                            helperText={formErrors.winning}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='level'
                            label='Level'
                            onChange={handleChange}
                            value={EditData?.level || ''}
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
                            name='free_bomb_per_level'
                            label='Free Bomb Per Quiz'
                            type='number'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                            }}
                            onChange={handleChange}
                            value={EditData.free_bomb_per_level || ''}
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
                            value={EditData.bomb_deduct_Coins || ''}
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
                            value={EditData.free_poll_per_level || ''}
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
                            value={EditData.poll_deduct_Coins || ''}
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
                            value={EditData.free_add_time || ''}
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
                            value={EditData.add_time_deduct_Coins || ''}
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
                            value={EditData.free_skip || ''}
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
                            value={EditData.skip_deduct_Coins || ''}
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
                            value={EditData?.terms || ''}
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
                            value={EditData?.status}
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
                    {hasPermission('quiz_contest:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Save changes
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
                    <h3 className='mb-4'>Contest Level</h3>
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
                            <Button variant='contained' onClick={handleClickOpen}>Add Level</Button>

                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'contestid'}
                                    direction={orderBy === 'contestid' ? order : 'asc'}
                                    onClick={() => handleRequestSort('contestid')}
                                >
                                    Contest
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleRequestSort('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'level'}
                                    direction={orderBy === 'level' ? order : 'asc'}
                                    onClick={() => handleRequestSort('level')}
                                >
                                    Level
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'maxQues'}
                                    direction={orderBy === 'maxQues' ? order : 'asc'}
                                    onClick={() => handleRequestSort('maxQues')}
                                >
                                    Max Question
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'winning'}
                                    direction={orderBy === 'winning' ? order : 'asc'}
                                    onClick={() => handleRequestSort('winning')}
                                >
                                    Winning Percentage
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'addedQues'}
                                    direction={orderBy === 'addedQues' ? order : 'asc'}
                                    onClick={() => handleRequestSort('addedQues')}
                                >
                                    Added Question
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.contestid?.name}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row?.title}</TableCell>
                                <TableCell className='p-2'>{row?.level}</TableCell>
                                <TableCell className='p-2'>{row?.maxQues}</TableCell>
                                <TableCell className='p-2'>{row?.winning}</TableCell>
                                <TableCell className='p-2'>{row?.questionCount}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} variant='tonal' color={statusStyle[row?.status]} />
                                </TableCell>
                                <TableCell className='p-2 flex items-center'>
                                    {hasPermission('quiz_contest:edit') &&
                                        (row.questionCount <= 0) ?
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                        :
                                        <Pencil
                                            className='text-gray-700 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }

                                    {hasPermission('quiz_contest:delete') &&
                                        (row.questionCount <= 0) ?
                                        <Trash2
                                            onClick={() => handleDelete(row._id)}
                                            className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                        :
                                        <Trash2
                                            className='text-gray-700 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }

                                    {hasPermission('quiz_contest:add') && (

                                        row.status === 'ACTIVE' ?
                                            <Link href={`/${lang}/apps/quiz/contest/question/${row._id}`}>
                                                <Button variant='tonal' size='small'>
                                                    Add Question
                                                </Button>
                                            </Link>
                                            :
                                            <Button variant='tonal' size='small'>
                                                Add Question
                                            </Button>

                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, GetLevel.length)} of {GetLevel.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(GetLevel.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default LevelTable
