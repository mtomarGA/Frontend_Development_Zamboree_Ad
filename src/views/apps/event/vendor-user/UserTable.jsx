'use client'
import React, { useEffect, useState } from 'react'
import {
    TableRow, Table, TableContainer, TableHead, TableCell,
    TableBody, Typography, Button, FormControl, Select, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, Box,
    TableSortLabel, InputAdornment
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '@views/apps/announce/list/pagination'
import { Pencil, Trash2, Search } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { toast } from 'react-toastify'
import CustomTextField from '@/@core/components/mui/TextField'
import { useScannerContext } from '@/contexts/scannerUser/ScannerContext'
import { useAuth } from '@/contexts/AuthContext'

const rowsPerPageOptions = [5, 10, 25, 50]

function UserTable({ handleClickOpen, open, getUserFun, users }) {
    const { getUser, updateUser, deleteUser } = useScannerContext()

    const { hasPermission } = useAuth();

    const [EditData, setEditData] = useState({
        name: '',
        username: '',
        password: '',
        repeatPassword: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [Editopen, setEditOpen] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')
    const [searchQuery, setSearchQuery] = useState('')

    const handleEditOpen = (user) => {
        setEditData({ ...user, password: user.password, repeatPassword: user.password })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validateFields = (data) => {
        let errors = {}
        if (!data.name.trim()) errors.name = 'Name is required'
        if (!data.username.trim()) errors.username = 'Username is required'
        if (!data.password.trim()) errors.password = 'Password is required'
        if (data.password.length < 6) errors.password = 'Password must be at least 6 characters'
        if (data.password !== data.repeatPassword) errors.repeatPassword = 'Passwords do not match'
        return errors
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fix the errors')
            return
        }
        const response = await updateUser(EditData._id, EditData)
        if (response?.response?.data?.success === false) {
            toast.error(response?.response?.data?.message)
            return
        }
        toast.success(response?.message || 'User Updated Successfully')
        handleEditClose()
        getUserFun()
    }

    // Sorting logic
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortData = (data, comparator) => {
        return [...data].sort(comparator)
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    const descendingComparator = (a, b, orderBy) => {
        let valA = a[orderBy]
        let valB = b[orderBy]

        if (orderBy === 'id' || orderBy === '_id') {
            valA = parseInt(a._id)
            valB = parseInt(b._id)
        }

        if (valB < valA) return -1
        if (valB > valA) return 1
        return 0
    }

    // ✅ Filter users by company name
    const filteredUsers = users.filter(user =>
        user?.organizer?.companyInfo?.companyName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    )

    const sortedData = sortData(filteredUsers, getComparator(order, orderBy))
    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleDelete = async (id) => {
        const res = await deleteUser(id)
        if (res?.response?.data?.success === false) {
            toast.error(res?.response?.data?.message)
            return
        }
        toast.success(res?.message)
        getUserFun()
    }

    return (
        <div>
            {/* Edit User Modal */}
            <Dialog open={Editopen} onClose={handleEditClose} PaperProps={{ sx: { overflow: 'visible' } }}>
                <DialogTitle>
                    <Typography variant='h5' component='span'>Edit User</Typography>
                    <DialogCloseButton onClick={handleEditClose}><i className='tabler-x' /></DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <CustomTextField
                            name="name"
                            label="Full Name"
                            value={EditData.name}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 3 }}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                        <CustomTextField
                            name="username"
                            label="Username"
                            value={EditData.username}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 3 }}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                        />
                        <CustomTextField
                            name="password"
                            type="password"
                            label="Password"
                            value={EditData.password}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 3 }}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                        />
                        <CustomTextField
                            name="repeatPassword"
                            type="password"
                            label="Repeat Password"
                            value={EditData.repeatPassword}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 3 }}
                            error={!!formErrors.repeatPassword}
                            helperText={formErrors.repeatPassword}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant='contained' onClick={handleSubmit}>Update User</Button>
                    <Button variant='tonal' color='secondary' onClick={handleEditClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Table Section */}
            <TableContainer className='shadow p-6'>
                <div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-3'>
                    <h3 className='font-semibold text-lg'>Users</h3>
                    <div className='flex flex-col sm:flex-row gap-3 items-center'>

                        {/* ✅ Search field using CustomTextField */}
                        <CustomTextField
                            label='Search by Company Name'
                            variant='outlined'
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} className='text-gray-500' />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ width: 250 }}
                        />

                        {/* Rows per page + Add button */}
                        <div className='flex items-center gap-2'>
                            <Typography variant='body2'>Rows per page:</Typography>
                            <FormControl size='small' variant='standard'>
                                <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} className='mx-2 w-16'>
                                    {rowsPerPageOptions.map(option => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {hasPermission('event_scanner_app_user:add') &&
                                <Button variant='contained' onClick={handleClickOpen}>Add User</Button>
                            }
                        </div>
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {[
                                { label: 'Vendor Name', key: 'organizer.companyInfo.companyName' },
                                { label: 'Full Name', key: 'name' },
                                { label: 'Username', key: 'username' },
                                { label: 'Action', key: 'action' }
                            ].map(col => (
                                <TableCell key={col.key}>
                                    {col.key !== 'action' ? (
                                        <TableSortLabel
                                            active={orderBy === col.key}
                                            direction={orderBy === col.key ? order : 'asc'}
                                            onClick={() => handleRequestSort(col.key)}
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    ) : col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map(user => (
                            <TableRow key={user?._id}>
                                <TableCell>{user?.organizer?.companyInfo?.companyName}</TableCell>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>{user?.username}</TableCell>
                                <TableCell>
                                    {/* <Pencil onClick={() => handleEditOpen(user)} className='text-blue-500 cursor-pointer hover:scale-110 transition mx-2' /> */}
                                    {hasPermission('event_scanner_app_user:delete') && <Trash2 onClick={() => handleDelete(user._id)} className='text-red-500 cursor-pointer hover:scale-110 transition' />}
                                    {/* <Trash2 onClick={() => handleDelete(user._id)} className='text-red-500 cursor-pointer hover:scale-110 transition' /> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(filteredUsers.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default UserTable
