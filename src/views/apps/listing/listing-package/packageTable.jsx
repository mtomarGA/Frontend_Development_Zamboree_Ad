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
    Chip,
    Avatar,
    Box,
    InputLabel,
    IconButton,
    Grid
} from '@mui/material'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '@views/apps/announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import ListingPackage from '@/services/listingPackage/PackageService'
import { useAuth } from '@/contexts/AuthContext'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyle = {
    ACTIVE: 'success',
    INACTIVE: 'error'
}

function PackageTable({ handleClickOpen, packages, GetPackageFun }) {
    const { hasPermission } = useAuth()

    const [EditData, setEditData] = useState({
        title: '',
        price: '',
        discountPrice: '',
        validity: '',
        image: '',
        status: 'INACTIVE',
        features: ['']
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [Editopen, setEditOpen] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    // ---------------------- Table Sorting ----------------------
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = property => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...packages].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // ---------------------- Modal Handlers ----------------------
    const handleEditOpen = row => {
        setEditData({
            ...row,
            features: row.features?.length ? row.features : ['']
        })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
    }

    // ---------------------- Form Handlers ----------------------
    const handleInputChange = e => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'discountPrice' ? parseFloat(value) || '' : value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleAddFeature = () => {
        setEditData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }))
    }

    const handleRemoveFeature = index => {
        setEditData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    const handleFeatureChange = (index, value) => {
        const updated = [...EditData.features]
        updated[index] = value
        setEditData(prev => ({ ...prev, features: updated }))
    }

    const handleImageChange = async e => {
        const { files } = e.target
        if (!files[0]) return
        try {
            const imageData = { image: files[0] }
            const result = await Image.uploadImage(imageData)
            if (result.data.url) {
                setEditData(prev => ({ ...prev, image: result.data.url }))
                if (formErrors.image) {
                    setFormErrors(prev => ({ ...prev, image: '' }))
                }
            }
        } catch (error) {
            toast.error('Failed to upload image')
            console.error(error)
        }
    }

    // ---------------------- Validation ----------------------
    const validateFields = data => {
        let errors = {}
        if (!data.title.trim()) errors.title = 'Title is required'
        if (!data.price || isNaN(data.price)) errors.price = 'Valid price is required'
        if (!data.discountPrice && data.discountPrice !== 0)
            errors.discountPrice = 'Discount price is required'
        if (!data.validity || isNaN(data.validity))
            errors.validity = 'Valid validity (days) is required'
        if (!data.image.trim()) errors.image = 'Image is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.features.length || data.features.some(f => !f.trim()))
            errors.features = 'At least one feature is required'
        return errors
    }

    // ---------------------- Submit ----------------------
    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }
        try {
            await ListingPackage.update(EditData._id, EditData)
            toast.success('Package updated successfully')
            handleEditClose()
            GetPackageFun()
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update package')
            console.error(error)
        }
    }

    // ---------------------- Delete ----------------------
    const handleDelete = async id => {
        try {
            const res = await ListingPackage.delete(id)
            toast.success(res.message || 'Package deleted successfully')
            GetPackageFun()
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete package')
            console.error(error)
        }
    }

    return (
        <div>
            {/* ---------------------- Edit Dialog ---------------------- */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Package
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {/* Title */}
                        <CustomTextField
                            fullWidth
                            name='title'
                            label='Title'
                            onChange={handleInputChange}
                            value={EditData.title}
                            variant='outlined'
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            sx={{ mb: 3 }}
                        />

                        {/* Price */}
                        <CustomTextField
                            fullWidth
                            name='price'
                            label='Price'
                            type='number'
                            onChange={handleInputChange}
                            value={EditData.price}
                            variant='outlined'
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            sx={{ mb: 3 }}
                        />

                        {/* Discount Price */}
                        <CustomTextField
                            fullWidth
                            name='discountPrice'
                            label='Discount Price'
                            type='number'
                            onChange={handleInputChange}
                            value={EditData.discountPrice}
                            variant='outlined'
                            error={!!formErrors.discountPrice}
                            helperText={formErrors.discountPrice}
                            sx={{ mb: 3 }}
                        />

                        {/* Validity */}
                        <CustomTextField
                            fullWidth
                            name='validity'
                            label='Validity (days)'
                            type='number'
                            onChange={handleInputChange}
                            value={EditData.validity}
                            variant='outlined'
                            error={!!formErrors.validity}
                            helperText={formErrors.validity}
                            sx={{ mb: 3 }}
                        />

                        {/* Features */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant='body2' sx={{ mb: 1 }}>
                                Features
                            </Typography>
                            {EditData.features.map((feature, index) => (
                                <Grid container spacing={1} alignItems='center' key={index} sx={{ mb: 1 }}>
                                    <Grid item xs={11}>
                                        <CustomTextField
                                            fullWidth
                                            label={`Feature ${index + 1}`}
                                            value={feature}
                                            onChange={e => handleFeatureChange(index, e.target.value)}
                                            variant='outlined'
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        {index === EditData.features.length - 1 ? (
                                            <IconButton color='primary' onClick={handleAddFeature}>
                                                <AddCircleOutline />
                                            </IconButton>
                                        ) : (
                                            <IconButton color='error' onClick={() => handleRemoveFeature(index)}>
                                                <RemoveCircleOutline />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                            {formErrors.features && (
                                <Typography variant='caption' color='error'>
                                    {formErrors.features}
                                </Typography>
                            )}
                        </Box>

                        {/* Image */}
                        <div className='my-2'>
                            <label htmlFor='image' className='text-sm'>
                                Image
                            </label>
                            <div>
                                <Button variant='outlined' component='label' className='w-full' sx={{ mb: 3 }}>
                                    Upload File
                                    <input
                                        type='file'
                                        hidden
                                        name='image'
                                        onChange={handleImageChange}
                                        accept='image/*'
                                    />
                                </Button>
                                {EditData.image && <Avatar src={EditData.image} sx={{ width: 56, height: 56 }} />}
                                {formErrors.image && (
                                    <Typography variant='body2' color='error'>
                                        {formErrors.image}
                                    </Typography>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <Box width='100%' mb={3}>
                            <FormControl fullWidth error={!!formErrors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name='status'
                                    value={EditData.status || ''}
                                    onChange={handleInputChange}
                                    label='Status'
                                >
                                    <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                                    <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                                </Select>
                                {formErrors.status && (
                                    <Typography variant='caption' color='error'>
                                        {formErrors.status}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions>
                    {hasPermission('partner_packages:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Package
                        </Button>
                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------------------- Table ---------------------- */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Partner Packages</h3>
                    <div className='flex items-center gap-2 mx-4'>
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
                        {hasPermission('partner_packages:add') && (
                            <Button variant='contained' onClick={handleClickOpen}>
                                Add Package
                            </Button>
                        )}
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
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
                                    active={orderBy === 'price'}
                                    direction={orderBy === 'price' ? order : 'asc'}
                                    onClick={() => handleRequestSort('price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'discountPrice'}
                                    direction={orderBy === 'discountPrice' ? order : 'asc'}
                                    onClick={() => handleRequestSort('discountPrice')}
                                >
                                    Discount Price
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'validity'}
                                    direction={orderBy === 'validity' ? order : 'asc'}
                                    onClick={() => handleRequestSort('validity')}
                                >
                                    Validity
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
                        {paginatedData.map(row => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row.title}</TableCell>
                                <TableCell className='p-2'>₹ {row.price}</TableCell>
                                <TableCell className='p-2'>₹ {row.discountPrice}</TableCell>
                                <TableCell className='p-2'>{row.validity} days</TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={row.image} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Chip
                                        label={row.status}
                                        variant='tonal'
                                        color={statusStyle[row.status]}
                                        size='small'
                                    />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('partner_packages:edit') && (
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    )}
                                    {hasPermission('partner_packages:delete') && (
                                        <Trash2
                                            onClick={() => handleDelete(row._id)}
                                            className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, packages.length)} of {packages.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(packages.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default PackageTable
