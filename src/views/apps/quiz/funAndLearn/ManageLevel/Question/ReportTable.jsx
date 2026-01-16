'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

const rowsPerPageOptions = [5, 10, 25, 50]

function ReportTable({ handleClickOpen }) {
    const quizType = [{
        Name: "hiii",
        ques: "hii",
        message: "hii",
        id: "1",
    }]

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

    const sortedData = [...quizType].sort((a, b) => {
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
        if (!data.sort_id) errors.sort_id = 'Sorting id is required'
        if (!data.categoryName) errors.categoryName = 'Category Name is required'
        if (!data.slug) errors.slug = 'Slug is required'
        if (!image.icon) errors.icon = 'Icon is required'

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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage({ icon: e.target.files[0] })
            if (formErrors.icon) {
                setFormErrors(prev => ({
                    ...prev,
                    icon: ''
                }))
            }
        }
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        const formData = new FormData()
        formData.append("sort_id", EditData.sort_id)
        formData.append("categoryName", EditData.categoryName)
        formData.append("icon", image.icon)
        formData.append("slug", EditData.slug)
        formData.append("status", EditData.status)

        try {
            // Replace with your actual API call
            // const response = await quizRoute.Post(formData)
            // if (response.success === true) {
            //     toast.success(response.message)
            //     getdata()
            //     handleEditClose()
            // }
            toast.success('Form submitted successfully (demo)')
            handleEditClose()
        } catch (error) {
            toast.error("Failed to add category")
            console.error(error)
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
                        Edit Question Report
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
                                value={EditData.sort_id}
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
                                value={EditData.categoryName}
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
                                value={EditData.slug}
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
                                {image.icon && (
                                    <Typography variant='body2' className='mt-2 text-green-700'>
                                        Selected: {image.icon.name}
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
                            <CustomTextField
                                select
                                className='w-96'
                                name='status'
                                label='Status'
                                value={EditData.status}
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
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                    {hasPermission('quiz_funAndLearn:edit') && (

                        <Button onClick={handleSubmit} variant='contained'>
                            Save changes
                        </Button>
                    )}
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Question Report</h3>
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

                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
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
                                    active={orderBy === 'Name'}
                                    direction={orderBy === 'Name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('Name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'question'}
                                    direction={orderBy === 'question' ? order : 'asc'}
                                    onClick={() => handleRequestSort('question')}
                                >
                                    Question
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'message'}
                                    direction={orderBy === 'message' ? order : 'asc'}
                                    onClick={() => handleRequestSort('message')}
                                >
                                    Message
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'date'}
                                    direction={orderBy === 'date' ? order : 'asc'}
                                    onClick={() => handleRequestSort('date')}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>



                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row._id}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row.Name}</TableCell>
                                <TableCell className='p-2'>{row.ques}</TableCell>
                                <TableCell className='p-2'>{''}</TableCell>
                                <TableCell className='p-2'>{row.coins}</TableCell>

                                <TableCell className='p-2'>
                                    <Pencil
                                        onClick={() => handleEditOpen()}
                                        className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
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

export default ReportTable
