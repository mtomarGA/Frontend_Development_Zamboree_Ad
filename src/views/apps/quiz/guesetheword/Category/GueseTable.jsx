'use client'
import React, { useState, useEffect } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import PremiumEntry from './PremiumButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import { useAuth } from '@/contexts/AuthContext'
import Image from "@/services/imageService"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import FunCategoryRoute from '@/services/quiz/funAndLearn/CategoryService'
import GuesTheWordCategoryRoute from '@/services/quiz/guesstheword/CategoryService'

const rowsPerPageOptions = [5, 10, 25, 50]


const statusStyles = {
    ACTIVE: "success",
    INACTIVE: "error",
}
function GuesTheWordTable({ handleClickOpen, quizType, GetCategoryFun }) {


    const [EditData, setEditData] = useState({
        sort_id: '',
        categoryName: '',
        slug: '',
        status: 'ACTIVE'
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = () => setEditOpen(true)
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

    // Add local state for rows to allow reordering
    const [rows, setRows] = useState(quizType)
    // Update rows when quizType changes
    useEffect(() => {
        setRows(quizType)
    }, [quizType])

    // Replace sortedData and paginatedData to use rows
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // form error and submit
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const validateFields = (data) => {
        let errors = {}
        if (!data.sort_id) errors.sort_id = 'Sorting id is required'
        if (!data.categoryName) errors.categoryName = 'Category Name is required'
        if (!data.slug) errors.slug = 'Slug is required'
        if (!data.icon) errors.icon = 'Icon is required'

        return errors
    }

    // // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the changed field is categoryName, update both categoryName and slug
        if (name === 'categoryName') {
            const slugValue = value
                .toLowerCase() // Convert to lowercase
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^\w\-]+/g, ''); // Remove special characters

            setEditData(prev => ({
                ...prev,
                categoryName: value,
                slug: slugValue
            }));
        } else {
            setEditData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    };

    console.log(EditData)



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



    const handlePremiumToggle = (e) => {
        const { checked } = e.target;
        setEditData(prev => ({ ...prev, isPremium: checked }));

        // Optional: Clear coins if premium is disabled
        if (!checked) {
            setEditData(prev => ({ ...prev, coins: '' }));
        }
    };


    // get data by id
    const Editid = async (id) => {
        handleEditOpen();
        const res = await GuesTheWordCategoryRoute.getdatabyid(id);
        const data = res.data || {};
        setEditData({
            sort_id: data.sort_id || '',
            categoryName: data.categoryName || '',
            slug: data.slug || '',
            status: data.status || 'ACTIVE',
            icon: typeof data.icon === 'string' ? data.icon : '',
            isPremium: data.isPremium || false,
            coins: data.coins || '',
            _id: data._id || '',
            // add any other fields you expect
        });
    }


    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }





        const response = await GuesTheWordCategoryRoute.putData(EditData._id, EditData)

        toast.success("Quiz Category Updated Successfully")
        GetCategoryFun();
        handleEditClose()



    }


    const deleteid = async (id) => {
        const res = await GuesTheWordCategoryRoute.deleteData(id);
        toast.success("Quiz Category Deleted Successfully" || res.message);
        GetCategoryFun();

    }


    const { hasPermission } = useAuth();

    // Drag and drop handler
    const handleDragEnd = async (result) => {
        if (!result.destination) return
        const startIndex = (currentPage - 1) * rowsPerPage
        const endIndex = currentPage * rowsPerPage
        const currentPageRows = sortedData.slice(startIndex, endIndex)
        const [removed] = currentPageRows.splice(result.source.index, 1)
        currentPageRows.splice(result.destination.index, 0, removed)
        // Merge back into the full sortedData
        const newSortedData = [
            ...sortedData.slice(0, startIndex),
            ...currentPageRows,
            ...sortedData.slice(endIndex)
        ]
        setRows(newSortedData)
        // Prepare new order for backend (e.g., array of IDs or objects with new sort_id)
        // Here, we update sort_id based on new order
        const updatedOrder = newSortedData.map((row, idx) => ({ ...row, sort_id: idx + 1 }))
        setRows(updatedOrder)
        // Call backend API to persist new order
        try {
            // Replace with your actual API call
            await GuesTheWordCategoryRoute.updateOrder(updatedOrder)
            toast.success('Order updated!')
            GetCategoryFun()
        } catch (err) {
            toast.error('Failed to update order')
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
                        Edit Category
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='sort_id'
                                label='Sorting Id'
                                onChange={handleInputChange}
                                value={EditData?.sort_id || ''}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.sort_id}
                                helperText={formErrors.sort_id}
                            />
                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='categoryName'
                                label='Category Name'
                                onChange={handleInputChange}
                                value={EditData?.categoryName || ""}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.categoryName}
                                helperText={formErrors.categoryName}
                            />
                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='slug'
                                label='Slug'
                                onChange={handleInputChange}
                                value={EditData?.slug}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.slug}
                                helperText={formErrors.slug}
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
                                        name='icon'
                                        onChange={handleImageChange}
                                        key={image.icon ? 'file-selected' : 'file-empty'}
                                        accept="image/*"
                                    />
                                </Button>
                                {EditData.icon && typeof EditData.icon === 'string' && (
                                    <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {EditData.icon}
                                        <Avatar src={EditData.icon || undefined} alt='' />
                                    </Typography>
                                )}
                                {formErrors.icon && (
                                    <Typography variant='body2' color="error">
                                        {formErrors.icon}
                                    </Typography>
                                )}
                            </div>
                        </div>

                        <div className='m-2'>
                            <PremiumEntry
                                isPremium={EditData.isPremium}
                                coins={EditData?.coins}
                                handleChange={handleInputChange}
                                handlePremiumToggle={handlePremiumToggle}
                            />

                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                select
                                className='w-96'
                                name='status'
                                label='Status'
                                value={EditData?.status}
                                onChange={handleInputChange}
                                error={!!formErrors.status}
                                helperText={formErrors.status}
                            >
                                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                                <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                            </CustomTextField>
                        </div>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_guesstheword:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Save changes
                        </Button>}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Guess The Word</h3>
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
                        {hasPermission('quiz_guesstheword:add') && (
                            <Button variant='contained' onClick={handleClickOpen}>Add Category</Button>

                        )}
                    </div>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="zone-table-body">
                        {(provided) => (
                            <Table className={tableStyles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='p-2'>
                                            <TableSortLabel
                                                active={orderBy === ''}
                                                direction={orderBy === '' ? order : 'asc'}
                                                onClick={() => handleRequestSort('')}
                                            >

                                            </TableSortLabel>
                                        </TableCell>
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
                                                active={orderBy === 'categoryName'}
                                                direction={orderBy === 'categoryName' ? order : 'asc'}
                                                onClick={() => handleRequestSort('categoryName')}
                                            >
                                                Category Name
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
                                                active={orderBy === 'isPremium'}
                                                direction={orderBy === 'isPremium' ? order : 'asc'}
                                                onClick={() => handleRequestSort('isPremium')}
                                            >
                                                Is Premium
                                            </TableSortLabel>
                                        </TableCell>

                                        <TableCell className='p-2'>
                                            <TableSortLabel
                                                active={orderBy === 'coins'}
                                                direction={orderBy === 'coins' ? order : 'asc'}
                                                onClick={() => handleRequestSort('coins')}
                                            >
                                                Coins
                                            </TableSortLabel>
                                        </TableCell>

                                        <TableCell className='p-2'>
                                            <TableSortLabel
                                                active={orderBy === 'totalQuestion'}
                                                direction={orderBy === 'totalQuestion' ? order : 'asc'}
                                                onClick={() => handleRequestSort('totalQuestion')}
                                            >
                                                Total Question
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
                                <TableBody
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
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
                                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                                        <div className='font-medium'>{row.sort_id}</div>
                                                    </TableCell>
                                                    <TableCell className='p-2'>{row.categoryName}</TableCell>
                                                    <TableCell className='p-2'> <Avatar src={typeof row.icon === 'string' ? row.icon : undefined} alt='' /></TableCell>
                                                    <TableCell className='p-2'>{row.isPremium ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell className='p-2'>{row.coins}</TableCell>
                                                    <TableCell className='p-2'>{row.totalQuestions}</TableCell>
                                                    <TableCell className='p-2'>
                                                        <Chip label={row.status} color={statusStyles[row?.status]} variant='tonal' />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        {hasPermission('quiz_guesstheword:edit') &&
                                                            <Pencil
                                                                onClick={() => Editid(row._id)}
                                                                className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                                            />
                                                        }
                                                        {hasPermission('quiz_guesstheword:delete') &&
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
                        )}
                    </Droppable>
                </DragDropContext>

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

export default GuesTheWordTable
