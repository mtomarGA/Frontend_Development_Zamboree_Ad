'use client'
import React, { useEffect, useState } from 'react'
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
    Autocomplete,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '@/views/apps/announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import commissionService from '@/services/event/masters/commissionService'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyle = {
    ACTIVE: 'success',
    PENDING: 'error'
}

function CommissionTable({ handleClickOpen, getdata, data }) {
    const [EditData, setEditData] = useState({
        organizer: '',
        commission: '',
        commissionType: 'PERCENTAGE', // ✅ Default value
        status: 'ACTIVE'
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)

    const handleEditOpen = row => {
        setEditOpen(true)
        setEditData({
            ...row,
            commissionType: row.commissionType || 'PERCENTAGE', // Ensure it's set
            status: row.status || 'ACTIVE'
        })
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('organizer') // Keep simple for now
    const [order, setOrder] = useState('asc')

    const handleRequestSort = property => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...data].sort((a, b) => {
        let aValue = a[orderBy]
        let bValue = b[orderBy]

        // Handle nested fields safely
        if (orderBy === 'organizerName') {
            aValue = a.organizer?.companyInfo?.companyName || ''
            bValue = b.organizer?.companyInfo?.companyName || ''
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    // pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // form error and submit
    const [formErrors, setFormErrors] = useState({})

    const validateFields = data => {
        let errors = {}
        if (!data.organizer) errors.organizer = 'Business is required'
        if (!data.commission) errors.commission = 'Commission is required'
        else if (data.commission <= 0) errors.commission = 'Must be greater than 0'
        if (!data.commissionType) errors.commissionType = 'Commission type is required'
        return errors
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            const response = await commissionService.putData(EditData._id, EditData)
            if (response.success) {
                toast.success(response.message)
                getdata()
                handleEditClose()
            } else {
                toast.error(response.message || 'Update failed')
            }
        } catch (error) {
            toast.error('Something went wrong')
            console.error(error)
        }
    }

    const [inputValue, setInputValue] = useState('')
    const [SearchData, setSearchData] = useState([])

    // ✅ search business
    const handleSearch = async searchValue => {
        if (searchValue?.length >= 3) {
            const response = await BannerRoute.getsearch({ search: searchValue })
            if (response.success === true) {
                setSearchData(response.data)
            }
        } else {
            setSearchData([])
        }
    }

    useEffect(() => {
        handleSearch(inputValue)
    }, [inputValue])

    const handleInputChange = e => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleCommissionTypeChange = (event, value) => {
        setEditData(prev => ({ ...prev, commissionType: value }))
        if (formErrors.commissionType) {
            setFormErrors(prev => ({ ...prev, commissionType: '' }))
        }
    }

    const handleDelete = async id => {
        const res = await commissionService.deleteData(id)
        if (res.success === true) {
            toast.success(res.message)
            getdata()
        }
    }

    return (
        <div>
            {/* ===================== Edit Dialog ===================== */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Commission
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <div className='flex flex-col gap-4'>

                        {/* Commission Type - Using MUI RadioGroup */}
                        <FormControl component="fieldset">
                            <Typography variant="body1" gutterBottom>Commission Type</Typography>
                            <RadioGroup
                                row
                                name="commissionType"
                                value={EditData.commissionType || 'PERCENTAGE'}
                                onChange={handleCommissionTypeChange}
                            >
                                <FormControlLabel
                                    value="PERCENTAGE"
                                    control={<Radio />}
                                    label="Percentage"
                                />
                                <FormControlLabel
                                    value="FIXED"
                                    control={<Radio />}
                                    label="Fixed"
                                />
                            </RadioGroup>
                        </FormControl>

                        {/* Business Search */}
                        <Autocomplete
                            className='w-full md:w-[24rem]'
                            freeSolo
                            options={SearchData}
                            filterOptions={(options, state) => {
                                const input = state.inputValue.toLowerCase()
                                return options.filter(option => {
                                    const companyName =
                                        option.companyInfo?.companyName?.toLowerCase() || ''
                                    const vendorId = option.vendorId?.toLowerCase() || ''
                                    const phoneNo =
                                        option.contactInfo?.phoneNo?.toLowerCase() || ''
                                    return (
                                        companyName.includes(input) ||
                                        vendorId.includes(input) ||
                                        phoneNo.includes(input)
                                    )
                                })
                            }}
                            getOptionLabel={option =>
                                option.companyInfo?.companyName ||
                                option.vendorId ||
                                option.contactInfo?.phoneNo ||
                                ''
                            }
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue)
                            }}
                            onChange={(event, newValue) => {
                                if (newValue && newValue._id) {
                                    setEditData(prev => ({ ...prev, organizer: newValue._id }))
                                    setFormErrors(prev => ({ ...prev, organizer: '' }))
                                }
                            }}
                            renderInput={params => (
                                <CustomTextField
                                    {...params}
                                    label='Search Business'
                                    placeholder='Type at least 3 characters'
                                    error={!!formErrors.organizer}
                                    helperText={formErrors.organizer}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                    {option.companyInfo?.companyName} - {option.vendorId} -{' '}
                                    {option.contactInfo?.phoneNo}
                                </li>
                            )}
                            noOptionsText={
                                inputValue.length < 3
                                    ? 'Type at least 3 characters to search'
                                    : 'No businesses found'
                            }
                        />

                        {/* Commission Field */}
                        {EditData.commissionType === 'PERCENTAGE' ? (
                            <CustomTextField
                                className='w-full md:w-[24rem]'
                                label='Commission %'
                                name='commission'
                                value={EditData.commission || ''}
                                onChange={handleInputChange}
                                type='number'
                                placeholder='Enter commission percentage'
                                error={!!formErrors.commission}
                                helperText={formErrors.commission}
                            />
                        ) : (
                            <CustomTextField
                                className='w-full md:w-[24rem]'
                                label='Fixed Amount'
                                name='commission'
                                value={EditData.commission || ''}
                                onChange={handleInputChange}
                                type='number'
                                placeholder='Enter Fixed Amount'
                                error={!!formErrors.commission}
                                helperText={formErrors.commission}
                            />
                        )}

                        <CustomTextField
                            select
                            label='Status'
                            name='status'
                            value={EditData.status || 'ACTIVE'}
                            onChange={handleInputChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>
                        </CustomTextField>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSubmit} variant='contained'>
                        Save Changes
                    </Button>
                    <Button
                        onClick={handleEditClose}
                        variant='tonal'
                        color='secondary'
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ===================== Table ===================== */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Commission setup List</h3>
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
                        <Button variant='contained' onClick={handleClickOpen}>
                            Add Commission
                        </Button>
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'organizerName'}
                                    direction={orderBy === 'organizerName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('organizerName')}
                                >
                                    Business
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'commissionType'}
                                    direction={orderBy === 'commissionType' ? order : 'asc'}
                                    onClick={() => handleRequestSort('commissionType')}
                                >
                                    Commission Type
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'commission'}
                                    direction={orderBy === 'commission' ? order : 'asc'}
                                    onClick={() => handleRequestSort('commission')}
                                >
                                    Commission
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className="p-2">
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className="p-2">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map(row => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>
                                        {row?.organizer?.companyInfo?.companyName || row?.organizer?.vendorId || '—'}
                                    </div>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <div className='font-medium'>{row?.commissionType || '—'}</div>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <div className='font-medium'>
                                        {row?.commissionType === 'PERCENTAGE'
                                            ? `${row?.commission}%`
                                            : `₹${row?.commission}`}
                                    </div>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <Chip
                                        label={row?.status || '—'}
                                        color={statusStyle[row?.status] || 'default'}
                                        variant='tonal'
                                        size='small'
                                    />
                                </TableCell>

                                <TableCell className='p-2'>
                                    <Pencil
                                        onClick={() => handleEditOpen(row)}
                                        className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                    <Trash2
                                        onClick={() => handleDelete(row?._id)}
                                        className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}{' '}
                        entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(data.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default CommissionTable
