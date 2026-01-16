'use client'
import React, { useState, useEffect } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip, CircularProgress } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import Image from "@/services/imageService"
import dynamic from 'next/dynamic'
import EventCategory from '@/services/event/masters/categoryService'

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

function CategoryTable({ handleClickOpen, GetCategoryFun, quizType }) {
    const [isClient, setIsClient] = useState(false)
    const [EditData, setEditData] = useState({
        _id: '',
        categoryname: '',
        icon: '',
        image: '',
        status: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [Editopen, setEditOpen] = useState(false)
    const [orderBy, setOrderBy] = useState('sort_id')
    const [order, setOrder] = useState('asc')
    const [rows, setRows] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [imageName, setImageName] = useState({
        icon: '',
        image: ''
    })
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
        if (!data.categoryname) errors.categoryname = 'Category Name is required'
        if (!data.image) errors.image = 'Image is required'
        if (!data.icon) errors.icon = 'Icon is required'
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

    const [isLoading, setIsLoading] = useState({
        icon: false,
        image: false
    })
    const handleImageChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setIsLoading(prev => ({
            ...prev,
            [e.target.name]: true
        }))
        setImageName({
            ...imageName,
            [e.target.name]: file.name
        })
        try {
            const result = await Image.uploadImage({ image: file })
            if (result.data?.url) {
                setEditData(prev => ({
                    ...prev,
                    [e.target.name]: result.data.url
                }))
            }
            setIsLoading(prev => ({
                ...prev,
                [e.target.name]: false
            }))

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
            categoryname: row?.categoryname,
            icon: row?.icon,
            image: row?.image,
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
            const response = await EventCategory.putData(EditData._id, EditData)
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
                return
            }
            toast.success(response?.message)
            GetCategoryFun()
            handleEditClose()
        } catch (error) {
            toast.error('Failed to update category')
        }
    }

    const deleteid = async (id) => {
        try {
            const res = await EventCategory.deleteData(id)
            if (res?.response?.data?.success === false) {
                toast.error(res?.response?.data?.message)
                return
            }
            toast.success(res?.message)
            GetCategoryFun()
        } catch (error) {
            toast.error('Failed to delete category')
        }
    }

    const { hasPermission } = useAuth()

    const handleDragEnd = async (result) => {
        if (!result.destination) return

        const startIndex = (currentPage - 1) * rowsPerPage
        const endIndex = currentPage * rowsPerPage
        const currentPageRows = sortedData.slice(startIndex, endIndex)
        const [removed] = currentPageRows.splice(result.source.index, 1)
        currentPageRows.splice(result.destination.index, 0, removed)

        const newSortedData = [
            ...sortedData.slice(0, startIndex),
            ...currentPageRows,
            ...sortedData.slice(endIndex)
        ]

        setRows(newSortedData)
        const updatedOrder = newSortedData.map((row, idx) => ({ ...row, sort_id: idx + 1 }))

        try {
            await EventCategory.updateOrder(updatedOrder)
            toast.success('Order updated!')
            GetCategoryFun()
        } catch (err) {
            toast.error('Failed to update order')
        }
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            _id: '',
            categoryname: '',
            serialNumber: '',
            image: '',
            status: ''
        })
        setImageName('')
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
                        Edit Category
                    </Typography>

                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='categoryname'
                            label='Name'
                            onChange={handleInputChange}
                            value={EditData.categoryname || ''}
                            error={!!formErrors.categoryname}
                            helperText={formErrors.categoryname}
                        />
                    </div>

                    <div className='m-2'>
                        <label htmlFor='icon' className='text-sm'>
                            Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'
                            >
                                Upload File
                                <input
                                    type='file'
                                    hidden
                                    name='image'
                                    onChange={handleImageChange}
                                    key={imageName.image ? 'file-selected' : 'file-empty'}
                                />
                            </Button>
                            {isLoading.image && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    < CircularProgress size={20} className='mr-2' />
                                </Typography>
                            )}
                            {EditData.image && (
                                <div className='mt-2 text-green-700'>
                                    Selected: <Avatar src={EditData.image} /> {imageName.image}
                                </div>
                            )}
                            {formErrors.image && (
                                <Typography variant='body2' color="error">
                                    {formErrors.image}
                                </Typography>
                            )}
                        </div>
                    </div>
                    <div className='m-2'>
                        <label htmlFor='icon' className='text-sm'>
                            Icon
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'
                            >
                                Upload File
                                <input
                                    type='file'
                                    hidden
                                    name='icon'
                                    onChange={handleImageChange}
                                    key={imageName.icon ? 'file-selected' : 'file-empty'}
                                />
                            </Button>
                            {isLoading.icon && (
                                <Typography variant='body2' className='mt-2 text-green-700'>
                                    < CircularProgress size={20} className='mr-2' />
                                </Typography>
                            )}
                            {EditData.icon && (
                                <div className='mt-2 text-green-700'>
                                    Selected: <Avatar src={EditData.icon} /> {imageName.icon}
                                </div>
                            )}
                            {formErrors.icon && (
                                <Typography variant='body2' color="error">
                                    {formErrors.icon}
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='serialNumber'
                            label='Serial Number'
                            type='number'
                            onChange={handleInputChange}
                            value={EditData?.serialNumber || ''}
                            error={!!formErrors.serialNumber}
                            helperText={formErrors.serialNumber}
                        />
                    </div> */}

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
                            Save changes
                        </Button>}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Event Category</h3>
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
                        {hasPermission('event_masters:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Category</Button>
                        )}
                    </div>
                </div>

                {isClient && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="zone-table-body">
                            {(provided) => (
                                <div className='overflow-auto w-full'>


                                    <Table className={tableStyles.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='p-2'></TableCell>
                                                <TableCell className='p-2'>
                                                    <TableSortLabel
                                                        active={orderBy === 'sort_id'}
                                                        direction={orderBy === 'sort_id' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('sort_id')}
                                                    >
                                                        Sort ID
                                                    </TableSortLabel>
                                                </TableCell>
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
                                                        active={orderBy === 'eventCount'}
                                                        direction={orderBy === 'eventCount' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('eventCount')}
                                                    >
                                                        Event Count
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell className='p-2'>Icon</TableCell>
                                                <TableCell className='p-2'>Image</TableCell>

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
                                        <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                            {paginatedData.map((row, index) => (
                                                <Draggable key={row._id} draggableId={row._id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <TableRow
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`border-b ${snapshot.isDragging ? 'bg-gray-100' : ''}`}
                                                        >
                                                            <TableCell className='p-2 cursor-grab' {...provided.dragHandleProps}>
                                                                <i className='tabler-grip-vertical text-gray-400 text-xl' />
                                                            </TableCell>
                                                            <TableCell className='p-2'>{row?.sort_id}</TableCell>
                                                            <TableCell className='p-2'>{row?.categoryname}</TableCell>
                                                            <TableCell className='p-2'>{row?.eventCount}</TableCell>
                                                            <TableCell className='p-2'><Avatar src={row?.icon} alt='' /></TableCell>
                                                            <TableCell className='p-2'><Avatar src={row?.image} alt='' /></TableCell>
                                                            {/* <TableCell className='p-2'>{row?.serialNumber}</TableCell> */}
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
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}

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

export default CategoryTable
