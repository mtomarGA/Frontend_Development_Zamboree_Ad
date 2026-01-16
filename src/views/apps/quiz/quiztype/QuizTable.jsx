'use client'
import React, { useState, useMemo } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Button, Chip, Dialog, DialogTitle, Typography, DialogContent, TextField, MenuItem, DialogActions, Avatar, Select, FormControl, InputLabel } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'

import quizRoute from '@/services/quiz/quiztypeServices'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from "@/services/imageService"
import { useAuth } from '@/contexts/AuthContext'
const statusStyles = {
    PENDING: 'warning',
    ACTIVE: 'success',
    INACTIVE: 'error',
}

const rowsPerPageOptions = [5, 10, 25, 50]

function QuizTable({ handleClickOpen, quizType, getdata }) {
    const { hasPermission } = useAuth();

    const [image, setImage] = useState({ icon: null })
    const [EditData, setEditData] = useState({})
    const [Editopen, setEditOpen] = useState(false)
    const [existingImageUrl, setExistingImageUrl] = useState('')
    const [formErrors, setFormErrors] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('type')

    const handleEditOpen = () => setEditOpen(true)
    const handleEditClose = () => {
        setEditOpen(false)
        setImage({ icon: null })
        setExistingImageUrl('')
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = useMemo(() => {
        return [...quizType].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1
            }
            return 0
        })
    }, [quizType, orderBy, order])

    const paginatedData = useMemo(() => {
        return sortedData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        )
    }, [sortedData, currentPage, rowsPerPage])

    const editid = async (id) => {
        const response = await quizRoute.getdatabyid(id)
        setEditData(response.data)
        setExistingImageUrl(response.data.icon)
        handleEditOpen()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateFields = (data) => {
        let errors = {}
        if (!data.type) errors.type = 'Quiz Type is required'
        if (!data.description) errors.description = 'Short Description is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.icon && !existingImageUrl) errors.icon = 'Icon is required'
        return errors
    }

    const onchangeimage = async (e) => {
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

    const handleSubmit = async () => {
        const errors = validateFields({ ...EditData, ...image })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }


        try {
            const response = await quizRoute.putData(EditData._id, EditData)
            toast.success("Quiz Type Updated Successfully")
            getdata()
            handleEditClose()
        } catch (error) {
            toast.error("Failed to update quiz type")
            console.error(error)
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    return (
        <div>
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                maxWidth='md'
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Quiz Type
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div>
                        <CustomTextField
                            className='w-96'
                            name='type'
                            label='Type'
                            onChange={handleChange}
                            value={EditData.type || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.type}
                            helperText={formErrors.type}
                        />
                    </div>

                    <div className='mt-4'>
                        <label htmlFor='icon' className='text-sm font-medium'>
                            Icon
                        </label>
                        <div className='flex flex-col gap-2 mt-1'>
                            <Button variant='outlined' component='label' className='w-96'>
                                {EditData.icon ? 'Change File' : 'Upload File'}
                                <input
                                    type='file'
                                    hidden
                                    name='icon'
                                    accept='image/*'
                                    onChange={onchangeimage}
                                />
                            </Button>

                            {EditData.icon &&
                                <Typography component={'div'} variant='body2' className='text-green-700 my-1 truncate w-96 align-bottom'>
                                    Selected:   {EditData.icon} <Avatar src={EditData.icon} />

                                </Typography>}
                            {/* {EditData.icon ? (
                                <div className='flex items-center gap-3'>
                                    <Typography variant='body2' className='text-green-700 truncate w-96 align-bottom'>
                                        Selected: {image.icon}
                                    </Typography>
                                </div>
                            ) : existingImageUrl ? (
                                <div className='flex items-center gap-3'>
                                    <Typography variant='body2' className='text-blue-500'>
                                        Current: {existingImageUrl.split('/').pop()}
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant='body2' className='text-gray-500'>
                                    No icon selected
                                </Typography>
                            )} */}

                            {formErrors.icon && (
                                <Typography component={'div'} variant='body2' color='error'>
                                    {formErrors.icon}
                                </Typography>
                            )}
                        </div>
                    </div>



                    <div className='flex flex-col'>
                        <div className='my-3'>
                            <TextField
                                className='w-96'
                                name='description'
                                label='Short Description'
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                variant='outlined'
                                value={EditData.description || ''}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                            />
                        </div>
                    </div>

                    <div>
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
                    {hasPermission('quiz_quiz_type:add') && (

                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Quiz Type
                        </Button>
                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer className='p-6 shadow'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Quiz Type</h3>
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
                        {hasPermission('quiz_quiz_type:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Quiz Type</Button>
                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'type'}
                                    direction={orderBy === 'type' ? order : 'asc'}
                                    onClick={() => handleRequestSort('type')}
                                >
                                    Type
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'icon'}
                                    direction={orderBy === 'icon' ? order : 'asc'}
                                    onClick={() => handleRequestSort('icon')}
                                >
                                    Icon
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'description'}
                                    direction={orderBy === 'description' ? order : 'asc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    Short Description
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
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <div className='font-medium'>{item?.type}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <Avatar
                                        src={item.icon}
                                        alt='icon'
                                        onError={(e) => {
                                            e.target.src = '/images/default-icon.png'
                                        }}
                                    />
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <div className='font-medium'>{item?.description}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    {hasPermission('quiz_quiz_type:edit') && (

                                        <Pencil
                                            onClick={() => editid(item._id)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>


                <Typography variant='body2' className='text-gray-600'>
                    Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, quizType.length)} of {quizType.length} entries
                </Typography>
                <PaginationRounded
                    count={Math.ceil(quizType.length / rowsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />
            </div>
        </div >
    )
}

export default QuizTable
