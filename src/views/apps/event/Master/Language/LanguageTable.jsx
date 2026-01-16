'use client'
import React, { useState, useEffect } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import Image from "@/services/imageService"
import dynamic from 'next/dynamic'
import LanguageService from '@/services/event/masters/languageService'

// Dynamically import drag and drop components to avoid SSR
const DragDropContext = dynamic(
    () => import('@hello-pangea/dnd').then(mod => mod.DragDropContext),
    { ssr: false }
)
const Droppable = dynamic(
    () => import('@hello-pangea/dnd').then(mod => mod.Droppable),
    { ssr: false }
)
const Draggable = dynamic(
    () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
    { ssr: false }
)

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyles = {
    ACTIVE: "success",
    INACTIVE: "error",
}

function ArtistTable({ handleClickOpen, GetCategoryFun, quizType }) {
    const [isClient, setIsClient] = useState(false)
    const [EditData, setEditData] = useState({
        _id: '',
        name: '',
        language_code: '',
        status: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [Editopen, setEditOpen] = useState(false)
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')
    const [rows, setRows] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const handleEditOpen = () => setEditOpen(true)
    useEffect(() => {
        setIsClient(true)
        setRows(quizType)
    }, [quizType])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...rows].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    const paginatedData = sortedData
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleInputChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const validateFields = (data) => {
        let errors = {}
        if (!data.name) errors.name = 'Name is required'
        if (!data.language_code) errors.language_code = 'Language Code is required'
        if (!data.status) errors.status = 'Status is required'
        return errors
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleImageChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setImageName(file.name)
        try {
            const result = await Image.uploadImage({ image: file })
            if (result.data?.url) {
                setEditData(prev => ({
                    ...prev,
                    image: result.data.url
                }))
            }
        } catch (error) {
            toast.error('Failed to upload image')
        }
    }

    // Edit modal State
    // const [Editopen, setEditOpen] = useState(false)




    const Editid = async (row) => {
        handleEditOpen()
        setEditData({
            _id: row?._id,
            name: row?.name,
            language_code: row?.language_code,
            status: row?.status
        })
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            const response = await LanguageService.putData(EditData._id, EditData)
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
                return
            }
            toast.success(response?.message)
            GetCategoryFun()
            handleEditClose()
        } catch (error) {
            toast.error('Failed to update language')
        }
    }

    const deleteid = async (id) => {
        try {
            const res = await LanguageService.deleteData(id)
            if (res?.response?.data?.success === false) {
                toast.error(res?.response?.data?.message)
                return
            }
            toast.success(res?.message)
            GetCategoryFun()
        } catch (error) {
            toast.error('Failed to delete language')
        }
    }

    const { hasPermission } = useAuth()


    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            _id: '',
            name: '',
            language_code: '',
            status: ''
        })
    }

    if (!isClient) return null

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
                        Edit Language
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='name'
                            label='Name'
                            onChange={handleInputChange}
                            value={EditData.name || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='language_code'
                            label='Language Code'
                            onChange={handleInputChange}
                            value={EditData.language_code || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.language_code}
                            helperText={formErrors.language_code}
                        />
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData.status || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                        </CustomTextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    {hasPermission('event_masters:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Update Language
                        </Button>}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Event Language</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleInputChangeRowsPerPage}
                                label='Rows per page'
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {hasPermission('event_masters:add') &&
                            <Button variant='contained' onClick={handleClickOpen}>Add Language</Button>
                        }
                    </div>
                </div>



                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'eventcount'}
                                    direction={orderBy === 'eventcount' ? order : 'asc'}
                                    onClick={() => handleRequestSort('eventcount')}
                                >
                                    Event Count
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
                        {paginatedData.map((row, index) => (

                            <TableRow key={row._id}>

                                <TableCell className='p-2'>{row?.name}</TableCell>
                                <TableCell className='p-2'>{row?.eventcount}</TableCell>



                                <TableCell className='p-2'>
                                    <Chip label={row.status} color={statusStyles[row?.status]} variant='tonal' />
                                </TableCell>

                                <TableCell className='p-2'>
                                    {hasPermission('event_masters:edit') &&
                                        <Pencil
                                            onClick={() => Editid(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }
                                    {hasPermission('event_masters:delete') &&
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
            </TableContainer>
        </div>
    )
}

export default ArtistTable
