'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '@views/apps/announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { Box, InputLabel } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyle = {
    SOLVED: "success",
    PENDING: 'error'
}

function IssueTable({ handleClickOpen }) {
    const issueReports = [{
        _id: '1',
        couponcode: 'COUPON123',
        solved_by: 'user123',
        description: 'Issue with coupon redemption',
        status: 'PENDING',
        user: 'user456'
    }]

    const [EditData, setEditData] = useState({
        couponcode: '',
        solved_by: '',
        description: '',
        status: 'PENDING',
        user: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditData(row)
        setEditOpen(true)
    }
    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...issueReports].sort((a, b) => {
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

    const validateFields = (data) => {
        let errors = {}

        if (!data.couponcode.trim()) errors.couponcode = 'Coupon code is required'
        if (!data.description.trim()) errors.description = 'Description is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.user.trim()) errors.user = 'User is required'

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



    const handleImageChange = async (e) => {
        const { files } = e.target
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



    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }


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
                        Edit Coupon Report
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>

                        <Box sx={{ pt: 2 }}>
                            {/* Coupon Code Input */}
                            <CustomTextField
                                className="w-full"
                                name="couponcode"
                                label="Coupon Code"
                                onChange={handleInputChange}
                                value={EditData.couponcode}
                                variant="outlined"
                                error={!!formErrors.couponcode}
                                helperText={formErrors.couponcode}
                                sx={{ mb: 3 }}
                            />

                            {/* Solved By Input */}
                            <CustomTextField
                                className="w-full"
                                name="solved_by"
                                label="Solved By (User ID)"
                                onChange={handleInputChange}
                                value={EditData.solved_by}
                                variant="outlined"
                                error={!!formErrors.solved_by}
                                helperText={formErrors.solved_by}
                                sx={{ mb: 3 }}
                            />

                            {/* Description Input */}
                            <CustomTextField
                                className="w-full"
                                name="description"
                                label="Description"
                                onChange={handleInputChange}
                                value={EditData.description}
                                multiline
                                rows={3}
                                variant="outlined"
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                sx={{ mb: 3 }}
                            />

                            {/* Status Selection */}
                            <Box width="50%" mb={3}>
                                <FormControl fullWidth error={!!formErrors.status}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={EditData.status || ''}
                                        onChange={handleInputChange}
                                        label="Status"
                                    >
                                        <MenuItem value="PENDING">PENDING</MenuItem>
                                        <MenuItem value="SOLVED">SOLVED</MenuItem>
                                    </Select>
                                    {formErrors.status && (
                                        <Typography variant="caption" color="error">
                                            {formErrors.status}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>

                            {/* User Input */}
                            <CustomTextField
                                className="w-full"
                                name="user"
                                label="User (User ID)"
                                onChange={handleInputChange}
                                value={EditData.user}
                                variant="outlined"
                                error={!!formErrors.user}
                                helperText={formErrors.user}
                                sx={{ mb: 3 }}
                            />

                        </Box>

                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant='contained'>
                        Edit Coupon Report
                    </Button>
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Issue Reports</h3>
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
                        {/* <Button variant='contained' onClick={handleClickOpen}>Add Issue Report</Button> */}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === '_id'}
                                    direction={orderBy === '_id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('_id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'couponcode'}
                                    direction={orderBy === 'couponcode' ? order : 'asc'}
                                    onClick={() => handleRequestSort('couponcode')}
                                >
                                    Coupon Code
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'solved_by'}
                                    direction={orderBy === 'solved_by' ? order : 'asc'}
                                    onClick={() => handleRequestSort('solved_by')}
                                >
                                    Solved By
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'description'}
                                    direction={orderBy === 'description' ? order : 'asc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    Description
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

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'user'}
                                    direction={orderBy === 'user' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user')}
                                >
                                    User
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

                                <TableCell className='p-2'>{row?.couponcode}</TableCell>
                                <TableCell className='p-2'>{row?.solved_by}</TableCell>
                                <TableCell className='p-2'>{row?.description}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} variant='tonal' color={statusStyle[row?.status]} size='small' /></TableCell>
                                <TableCell className='p-2'>{row?.user}</TableCell>
                                <TableCell className='p-2'>
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
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, issueReports.length)} of {issueReports.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(issueReports.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default IssueTable
