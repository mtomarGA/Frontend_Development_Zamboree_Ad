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
    Avatar
} from '@mui/material'

import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import PaginationRounded from '@/views/apps/announce/list/pagination'
import ArtistService from '@/services/event/masters/artistService'
import tableStyles from '@core/styles/table.module.css'

const rowsPerPageOptions = [5, 10, 25, 50]

function LocalArtistTable({ data, LocalArtistfun }) {
    const { hasPermission } = useAuth()
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [Editopen, setEditOpen] = useState(false)
    const [EditData, setEditData] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleEditOpen = (row) => {
        setEditData({
            id: row._id || '',
            addedInMain: row?.addedInMain ?? false
        })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setEditData({})
        setFormErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value === 'true' ? true : value === 'false' ? false : value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateFields = (data) => {
        let errors = {}
        if (data.addedInMain === null || data.addedInMain === undefined) {
            errors.addedInMain = 'Added in main is required'
        }
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
            const response = await ArtistService.putData(EditData.id, EditData)
            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
                return
            }
            toast.success(response?.message || 'Updated Successfully')
            LocalArtistfun()
            handleEditClose()
        } catch (error) {
            toast.error(EditData.id ? 'Failed to update artist' : 'Failed to add artist')
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        // if (!confirm('Are you sure you want to delete this artist?')) return
        try {
            const response = await ArtistService.deleteData(id);
            if (response.success === true) {
                toast.success(response?.message || 'Deleted successfully')
                LocalArtistfun();
                return;
            }
        } catch (error) {
            toast.error('Failed to delete artist')
        }
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[orderBy] ?? ''
        const bVal = b[orderBy] ?? ''

        if (orderBy === 'createdAt' || orderBy === 'id') {
            return order === 'asc'
                ? new Date(aVal) - new Date(bVal)
                : new Date(bVal) - new Date(aVal)
        }

        if (aVal < bVal) return order === 'asc' ? -1 : 1
        if (aVal > bVal) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    return (
        <div>
            {/* Edit Dialog */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='edit-artist-dialog'
                open={Editopen}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='edit-artist-dialog'>
                    <Typography variant='h5'>Edit Artist</Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='addedInMain'
                            label='Want to Add in Main Artist Category?'
                            value={EditData.addedInMain ?? ''}
                            onChange={handleInputChange}
                            error={!!formErrors.addedInMain}
                            helperText={formErrors.addedInMain}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </CustomTextField>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                    {hasPermission('quiz_user_details:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>
                            Save
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Local Artists</h3>
                    <div className='flex items-center gap-2'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
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
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'desc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>Image</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'event_title'}
                                    direction={orderBy === 'event_title' ? order : 'desc'}
                                    onClick={() => handleRequestSort('event_title')}
                                >
                                    Event Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Event Start Date</TableCell>
                            <TableCell>Event End Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell>{row?.name}</TableCell>
                                <TableCell>
                                    <Avatar src={row?.image} />
                                </TableCell>
                                <TableCell>{row?.eventid?.event_title || '-'}</TableCell>
                                <TableCell>
                                    {row?.eventid?.startDateTime?.[0]
                                        ? new Date(row.eventid.startDateTime[0]).toLocaleString()
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    {row?.eventid?.endDateTime?.length
                                        ? new Date(row.eventid.endDateTime.slice(-1)[0]).toLocaleString()
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <Pencil
                                        onClick={() => handleEditOpen(row)}
                                        className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                    <Trash2
                                        onClick={() => handleDelete(row._id)}
                                        className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
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

export default LocalArtistTable
