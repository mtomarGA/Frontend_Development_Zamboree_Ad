'use client'
import React, { useState, useEffect } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip, Autocomplete } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices'
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService'
import { useAuth } from '@/contexts/AuthContext'
import Image from "@/services/imageService"
import FunAndLearnSubCategoryRoute from '@/services/quiz/funAndLearn/SubCategoryService'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import GuesTheWordSubCategoryRoute from '@/services/quiz/guesstheword/SubCategoryService'

const rowsPerPageOptions = [5, 10, 25, 50]
const statusStyles = {
    ACTIVE: "success",
    INACTIVE: "error",
}


function SubCategoryTable({ handleClickOpen, quizType, GetCategoryFun }) {
    // const quizType = [{
    //     categoryName: "hiii"
    // }]

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
        setImageFileName('')
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const [rows, setRows] = useState(quizType)
    useEffect(() => {
        setRows(quizType)
    }, [quizType])

    const sortedData = [...rows].sort((a, b) => {
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
    const [imageFileName, setImageFileName] = useState('')

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




    const handleImageChange = async (e) => {
        const { files } = e.target
        setImageFileName(files[0]?.name || '')
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setEditData(prev => ({
                ...prev,
                icon: result.data.url
            }))
            if (formErrors.icon) {
                setFormErrors(prev => ({ ...prev, icon: '' }))
            }
        }
    }




    // get data by id
    const Editid = async (row) => {
        // console.log(id);
        handleEditOpen();
        // const res = await GuesTheWordSubCategoryRoute.getdatabyid(id);
        setEditData(row);
        // console.log(res.data, "hiiii")

    }


    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        // const formData = new FormData()
        // formData.append("sort_id", EditData.sort_id)
        // formData.append("categoryName", EditData.categoryName)
        // formData.append("icon", EditData.icon)
        // formData.append("slug", EditData.slug)
        // formData.append("status", EditData.status)




        const response = await GuesTheWordSubCategoryRoute.putData(EditData._id, EditData);

        // if (!response.success) {
        //     return toast.error("Failed to Updated");

        // }
        toast.success(response.message)
        GetCategoryFun();
        handleEditClose()



    }

    const deleteid = async (id) => {
        const res = await GuesTheWordSubCategoryRoute.deleteData(id);
        toast.success("Quiz SubCategory Deleted Successfully" || res.message);
        GetCategoryFun();

    }


    const { hasPermission } = useAuth();

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
        const updatedOrder = newSortedData.map((row, idx) => ({ ...row, sort_id: idx + 1 }))
        setRows(updatedOrder)
        // Call backend API to persist new order
        try {
            // Replace with your actual API call
            await GuesTheWordSubCategoryRoute.updateOrder(updatedOrder)
            toast.success('Order updated!')
            GetCategoryFun()
        } catch (err) {
            toast.error('Failed to update order')
        }
    }


    //    category autocomplete
    const [loading, setLoading] = useState(false);
    const [search, setsearch] = useState('')
    const [Category, setCategory] = useState([])

    const FetchCategory = async () => {
        setLoading(true);
        try {
            const res = await GuesTheWordSubCategoryRoute.searchcategory({ category: search });
            setCategory(res?.data || [])
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search && search.length >= 2) {  // Only call API if search has 2+ characters
                FetchCategory();
            } else {
                setCategory([]);  // Clear results if search is too short
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);
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
                        Edit SubCategory
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {/* <Typography> */}




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


                    <Autocomplete
                        options={Category}
                        getOptionLabel={(option) => option?.categoryName || ''}
                        loading={loading}
                        value={Category.find(cat => cat._id === EditData.categoryId) || null}
                        inputValue={search}
                        onInputChange={(event, newInputValue) => {
                            setsearch(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            setEditData(prev => ({
                                ...prev,
                                categoryId: newValue?._id || '',
                            }));
                            if (!newValue) {
                                setsearch('');
                            }
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                className="w-96 mx-2"
                                label="Select Category"
                                variant="outlined"
                                error={!!formErrors.categoryId}
                                // helperText={formErrors.categoryId}
                                helperText={formErrors.categoryId || (search.length < 2 ? "Type at least 2 characters to search" : "")}

                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Avatar src={option.icon} alt={option.categoryName} style={{ width: 30, height: 30 }} />
                                    <Typography>{option.categoryName}</Typography>
                                </div>
                            </li>
                        )}
                    />


                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='categoryName'
                            label='SubCategory Name'
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
                            value={EditData?.slug || ""}
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
                                    key={EditData.icon ? 'file-selected' : 'file-empty'}
                                    accept="image/*"
                                />
                            </Button>
                            {imageFileName && (
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {imageFileName}
                                </Typography>
                            )}
                            {EditData.icon && (
                                <div className='mt-2'>
                                    <Avatar src={EditData.icon} alt="Current" />
                                </div>
                            )}
                            {formErrors.icon && (
                                <Typography variant='body2' color="error">
                                    {formErrors.icon}
                                </Typography>
                            )}
                        </div>
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData?.status || ''}
                            onChange={handleInputChange}
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
                    {hasPermission('quiz_guesstheword:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Update SubCategory
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
                    <h3 className='mb-4'>Guess The Word SubCategory</h3>
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

                            <Button variant='contained' onClick={handleClickOpen}>Add SubCategory</Button>
                        )}
                    </div>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="subcategory-table-body">
                        {(provided) => (
                            <Table className={tableStyles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='p-2'></TableCell>
                                        <TableCell className='p-2'>ID</TableCell>
                                        <TableCell className='p-2'>Category Name</TableCell>
                                        <TableCell className='p-2'>SubCategory Name</TableCell>
                                        <TableCell className='p-2'>Image</TableCell>
                                        <TableCell className='p-2'>Total Question</TableCell>
                                        <TableCell className='p-2'>Status</TableCell>
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
                                                    <TableCell className='p-2'>{row?.category?.categoryName}</TableCell>
                                                    <TableCell className='p-2'>{row?.categoryName}</TableCell>
                                                    <TableCell className='p-2'> <Avatar src={typeof row.icon === 'string' ? row.icon : undefined} alt='' /></TableCell>
                                                    <TableCell className='p-2'>{row.totalQuestions}</TableCell>
                                                    <TableCell className='p-2'>
                                                        <Chip label={row.status} color={statusStyles[row?.status]} variant='tonal' />
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        {hasPermission('quiz_guesstheword:edit') &&
                                                            <Pencil
                                                                onClick={() => Editid(row)}
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

export default SubCategoryTable
