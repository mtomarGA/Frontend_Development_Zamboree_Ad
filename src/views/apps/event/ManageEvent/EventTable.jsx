'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip, Menu, IconButton, Tooltip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Eye, MoreVerticalIcon, Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import EventService from '@/services/event/event_mgmt/event'
import AttendeesModal from './AttendeesModal'
import { useParams } from 'next/navigation'

const rowsPerPageOptions = [5, 10, 25, 50]



const statusColor = {
    ACTIVE: 'success',
    INACTIVE: 'error',
    PENDING: 'warning',
    REJECTED: 'error',
    APPROVED: 'success'
}

function EventTable({ quizType, setQuizType, getEventData }) {
    const { hasPermission } = useAuth();

    const [EditData, setEditData] = useState({
        // id: '',
        // sort_id: '',
        // categoryName: '',
        // slug: '',
        status: 'ACTIVE',

    });

    const useparams = useParams();
    const { lang } = useparams;


    // States
    const [Eventid, seteventid] = useState("");
    const [open, setOpen] = useState(false)
    const handleClickOpen = (id) => {
        setOpen(true)
        seteventid(id);
    }
    const handleClose = () => setOpen(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditData({
            id: row.id,
            sort_id: row.sort_id || '',
            categoryName: row.categoryName,
            slug: row.slug || '',
            status: row.status || 'ACTIVE',
            createdAt: row.createdAt || new Date().toISOString()
        })
        // setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            id: '',
            sort_id: '',
            categoryName: '',
            slug: '',
            status: 'ACTIVE',

        })
    }

    // action options
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuOpenId, setMenuOpenId] = useState(null)

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget)
        setMenuOpenId(id)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuOpenId(null)
    }


    // Sorting state - default to newest first
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...quizType].sort((a, b) => {
        // For date fields, newest first by default
        if (orderBy === 'createdAt' || orderBy === 'id') {
            if (order === 'desc') {
                return new Date(b[orderBy]) - new Date(a[orderBy])
            } else {
                return new Date(a[orderBy]) - new Date(b[orderBy])
            }
        }

        // For other fields
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

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

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            // For demo purposes - in a real app, you would call your API here
            if (EditData.id) {
                // Update existing item
                setQuizType(prev => prev.map(item =>
                    item.id === EditData.id ? EditData : item
                ))
            } else {
                // Add new item (with new ID and current timestamp)
                const newItem = {
                    ...EditData,
                    id: Math.max(...quizType.map(item => item.id)) + 1,
                    createdAt: new Date().toISOString()
                }
                setQuizType(prev => [newItem, ...prev]) // Add to beginning of array
            }

            toast.success(EditData.id ? 'Category updated successfully' : 'Category added successfully')
            handleEditClose()
        } catch (error) {
            toast.error(EditData.id ? "Failed to update category" : "Failed to add category")
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        const response = await EventService.deleteData(id)
        if (response.success === true) {
            toast.success(response?.message);
            getEventData()
        } else {
            toast.error(response?.response?.data?.message)
        }
    }

    return (
        <div>

            <AttendeesModal open={open} handleClickOpen={handleClickOpen} Eventid={Eventid} handleClose={handleClose} />


            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        {EditData.id ? 'Edit' : 'Add'} Category
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
                                        key={EditData.icon ? 'file-selected' : 'file-empty'}
                                        accept="image/*"
                                    />
                                </Button>
                                {EditData.icon && (
                                    <Typography variant='body2' className='mt-2 text-green-700'>
                                        Selected: {EditData.icon}
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
                    {hasPermission('quiz_user_details:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>
                            {EditData.id ? 'Save changes' : 'Add Category'}
                        </Button>
                    )}
                    <Button onClick={(() => handleClickOpen(row?._id))} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Manage Events</h3>
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
                        {hasPermission('event_manageEvents:add') && (
                            <Link href={`/${lang}/apps/event/manageEvents/add`} className='cursor-pointer'>
                                <Button variant='contained'>Add Event</Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 🟢 Added wrapper div to make only the table scroll */}
                <div className='overflow-x-auto w-full'>
                    <Table className={tableStyles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'thumbnail'}
                                        direction={orderBy === 'thumbnail' ? order : 'desc'}
                                        onClick={() => handleRequestSort('thumbnail')}
                                    >
                                        Image
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'event_title'}
                                        direction={orderBy === 'event_title' ? order : 'desc'}
                                        onClick={() => handleRequestSort('event_title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'event_category'}
                                        direction={orderBy === 'event_category' ? order : 'desc'}
                                        onClick={() => handleRequestSort('event_category')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'organizer'}
                                        direction={orderBy === 'organizer' ? order : 'desc'}
                                        onClick={() => handleRequestSort('organizer')}
                                    >
                                        Organizer
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'sales'}
                                        direction={orderBy === 'sales' ? order : 'desc'}
                                        onClick={() => handleRequestSort('sales')}
                                    >
                                        Sales
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'desc'}
                                        onClick={() => handleRequestSort('status')}
                                    >
                                        Approval Status
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'is_feature'}
                                        direction={orderBy === 'is_feature' ? order : 'desc'}
                                        onClick={() => handleRequestSort('is_feature')}
                                    >
                                        Is Featured
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginatedData.map((row) => (
                                <TableRow key={row._id} className='border-b'>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                        <div className='font-medium'>
                                            <Avatar src={row?.thumbnail} />
                                        </div>
                                    </TableCell>
                                    <TableCell className='p-2'>{row?.event_title}</TableCell>
                                    <TableCell className='p-2'>{row?.event_category?.categoryname}</TableCell>
                                    <TableCell className='p-2'>{row?.organizer?.companyInfo?.companyName}</TableCell>
                                    <TableCell className='p-2'>{row?.sales}</TableCell>

                                    <TableCell className='p-2'>
                                        <Chip label={row?.status} variant='tonal' color={statusColor[row?.status]} />
                                    </TableCell>
                                    <TableCell className='p-2'>{row?.is_feature}</TableCell>
                                    <TableCell className='p-2 flex items-center flex-row'>



                                        {hasPermission('event_manageEvents:view') &&
                                            <Link href={`/${lang}/apps/event/manageEvents/show/${row._id}`} className='cursor-pointer'>
                                                <Eye
                                                    className='text-blue-500 mx-2 mt-1 size-5 cursor-pointer hover:scale-110 transition'
                                                />
                                            </Link>
                                        }


                                        {hasPermission('event_manageEvents:edit') && (
                                            row.status !== "ACTIVE" ? (
                                                <Link
                                                    href={`/${lang}/apps/event/manageEvents/edit/${row._id}`}
                                                    className='cursor-pointer'
                                                >
                                                    <Pencil
                                                        onClick={() => handleEditOpen(row)}
                                                        className='text-blue-500 mt-1 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                                    />
                                                </Link>
                                            ) : (
                                                <Tooltip title="Editing is disabled for active events">

                                                    <Pencil
                                                        className='text-gray-400 mt-1 mx-2 size-5 cursor-not-allowed'

                                                        onClick={(e) => e.preventDefault()}
                                                    />
                                                </Tooltip>
                                            )
                                        )}

                                        {hasPermission('event_manageEvents:delete') && (
                                            row.status !== "ACTIVE" ? (
                                                <Tooltip title="Delete Event">
                                                    <Trash2
                                                        onClick={() => handleDelete(row._id)}
                                                        className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Deletion disabled for active events">
                                                    <span>
                                                        <Trash2
                                                            className='text-gray-400 mx-2 size-5 cursor-not-allowed'
                                                            onClick={(e) => e.preventDefault()}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            )
                                        )}
                                        {/* 
                                    <Link href={`/en/apps/event/allTickets/${row._id}`} >
                                        <Button>All Booked Tickets</Button>
                                    </Link>

                                    <Link href={`/${lang}/apps/event/ticketSetting/${row._id}`} >
                                        <Button>Ticket Setting</Button>
                                    </Link>
                                    <Link href={`/${lang}/apps/event/ticketPrice/${row._id}`} >
                                        <Button>Ticket Price</Button>
                                    </Link>
                                    <Link href={`/${lang}/apps/event/transaction/${row._id}`} >
                                        <Button>Transaction</Button>
                                    </Link>

                                    <Button onClick={(() => { handleClickOpen(row._id) })}>Attendees Check In</Button> */}
                                        {hasPermission('event_dots:view') && (
                                            <>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls={`menu-${row._id}`}
                                                    aria-haspopup="true"
                                                    onClick={(event) => handleMenuOpen(event, row._id)}
                                                >
                                                    <MoreVerticalIcon />
                                                </IconButton>

                                                <Menu
                                                    id={`menu-${row._id}`}
                                                    anchorEl={anchorEl}
                                                    open={menuOpenId === row._id}
                                                    onClose={handleMenuClose}
                                                >
                                                    {hasPermission('event_manageEvents:view') && (
                                                        <MenuItem component={Link} href={`/${lang}/apps/event/allTickets/${row._id}`}>
                                                            All Booked Tickets
                                                        </MenuItem>
                                                    )}

                                                    {hasPermission('event_manageEvents:view') && (
                                                        <MenuItem component={Link} href={`/${lang}/apps/event/ticketSetting/${row._id}`}>
                                                            Ticket Setting
                                                        </MenuItem>
                                                    )}

                                                    {hasPermission('event_manageEvents:view') && (
                                                        <MenuItem component={Link} href={`/${lang}/apps/event/ticketPrice/${row._id}`}>
                                                            Ticket Price
                                                        </MenuItem>
                                                    )}

                                                    {hasPermission('event_manageEvents:view') && (
                                                        <MenuItem component={Link} href={`/${lang}/apps/event/transaction/${row._id}`}>
                                                            Transaction
                                                        </MenuItem>
                                                    )}

                                                    {hasPermission('event_manageEvents:view') && (
                                                        <MenuItem onClick={() => { handleClickOpen(row._id); handleMenuClose(); }}>
                                                            Attendees Check In
                                                        </MenuItem>
                                                    )}
                                                </Menu>
                                            </>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* 🟢 closed the new div here */}



                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, quizType.length)} of {quizType.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(quizType.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>

        </div >
    )
}

export default EventTable
