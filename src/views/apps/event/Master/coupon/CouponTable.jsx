'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Autocomplete } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import { Grid } from '@mui/system'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import EventCouponService from '@/services/event/coupon/eventCouponService'

const rowsPerPageOptions = [5, 10, 25, 50]


const styleStatus = {
    ACTIVE: "success",
    INACTIVE: "error"
}

function CouponTable({ handleClickOpen, quizType, getdata, event }) {
    const { hasPermission } = useAuth();

    const [inputValueArtist, setInputValueArtist] = useState('')
    const [EditData, setEditData] = useState({
        event: '',
        id: '',
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        discount: '',
        status: 'INACTIVE',

    });

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditData({
            id: row?._id,
            name: row?.name || '',
            code: row?.code || '',
            discount: row?.discount || '',
            status: row?.status || 'INACTIVE',
            couponlimit: row?.couponlimit || "",
            couponType: row?.couponType || "",
            startDate: new Date(row?.startDate),
            endDate: new Date(row?.endDate)

        })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            id: '',
            name: '',
            code: '',
            discount: '',
            status: 'INACTIVE',
            couponlimit: "",
            couponType: "",
            startDate: '',
            endDate: '',

        })
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


    const validateFields = (data) => {
        let errors = {}
        if (!data.code) errors.code = 'Code is required'
        if (!data.name) errors.name = 'Name is required'
        if (!data.discount) errors.discount = 'Discount is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.startDate) errors.startDate = "Start Date is required"
        if (!data.endDate) errors.endDate = "End Date is required"
        // if (!data.event) errors.event = "Event is required"


        return errors
    }

    const handleChange = (e) => {
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

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {

            const response = await EventCouponService.putData(EditData.id, EditData);
            if (response.success === true) {
                toast.success(response?.message);
                getdata()
                handleEditClose()
                return
            }

            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
            }
        } catch (error) {
            toast.error("Failed To Edit")
        }

    }


    const DeleteReq = async (id) => {
        try {

            const response = await EventCouponService.deleteData(id);
            if (response.success === true) {
                toast.success(response?.message);
                getdata()
                handleEditClose()
                return
            }

            if (response?.response?.data?.success === false) {
                toast.error(response?.response?.data?.message)
            }
        } catch (error) {
            toast.error("Failed To Delete")
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
                        Edit Coupon
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='name'
                            label='Name'
                            onChange={handleChange}
                            value={EditData.name || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='code'
                            label='Code'
                            onChange={handleChange}
                            value={EditData.code || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.code}
                            helperText={formErrors.code}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='discount'
                            label='Discount'
                            type='number'
                            onChange={handleChange}
                            value={EditData.discount || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.discount}
                            helperText={formErrors.discount}
                        />
                    </div>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='couponlimit'
                            label='Coupon Limit'
                            type='number'
                            onChange={handleChange}
                            value={EditData.couponlimit || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.couponlimit}
                            helperText={formErrors.couponlimit}
                        />
                    </div>




                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='couponType'
                            label='Coupon Type'
                            value={EditData.couponType || ''}
                            onChange={handleChange}
                            error={!!formErrors.couponType}
                            helperText={formErrors.couponType}
                        >
                            <MenuItem value='fixed'>Fixed</MenuItem>
                            <MenuItem value='percentage'>Percentage</MenuItem>
                        </CustomTextField>
                    </div>



                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppReactDatepicker
                            selected={EditData?.startDate || null}
                            onChange={(date) =>
                                setEditData((prev) => ({ ...prev, startDate: date }))
                            }
                            id="basic-input"
                            dateFormat="dd/MM/yyy"
                            className="m-2 w-96"
                            placeholderText="Click to select a date"
                            customInput={<CustomTextField error={!!formErrors.startDate} helperText={formErrors.startDate} label="Start Date" fullWidth />}
                            minDate={new Date()}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppReactDatepicker
                            selected={EditData?.endDate || null}
                            onChange={(date) =>
                                setEditData((prev) => ({ ...prev, endDate: date }))
                            }
                            id="basic-input"
                            dateFormat="dd/MM/yyy"
                            className="m-2 w-96"
                            placeholderText='Click to select a date'
                            customInput={<CustomTextField label='End Date' error={!!formErrors.endDate} helperText={formErrors.endDate} fullWidth />}
                            minDate={new Date()}
                        />

                    </Grid>

                    <Autocomplete
                        options={event.filter(artist => typeof artist?.event_title === 'string')}
                        className="w-96 mx-2"
                        value={event.find(artist => artist._id === EditData.event) || null}
                        inputValue={inputValueArtist}
                        onInputChange={(event, newInputValue, reason) => {
                            if (reason !== 'reset') {
                                setInputValueArtist(newInputValue)
                            }
                        }}
                        onChange={(e, newValue) =>
                            setEditData((prev) => ({
                                ...prev,
                                event: newValue?._id || '',
                            }))
                        }
                        getOptionLabel={(option) => option?.event_title || ''}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        filterOptions={(options, { inputValue }) => {
                            if (inputValue.length < 3) return []
                            const searchValue = inputValue.toLowerCase()
                            return options.filter((option) =>
                                option?.event_title.toLowerCase().includes(searchValue)
                            )
                        }}
                        noOptionsText={
                            inputValueArtist.length < 3
                                ? 'Type at least 3 characters to search'
                                : 'No options found'
                        }
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Event"
                                variant="outlined"
                                fullWidth
                                placeholder="Type at least 3 characters..."
                                error={!!formErrors.event}
                                helperText={formErrors.event}
                            />
                        )}
                    />



                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData?.status}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                        </CustomTextField>
                    </div>

                </DialogContent>
                <DialogActions>
                    {hasPermission('event_masters:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>
                            Save changes
                        </Button>
                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Coupons for Ticket</h3>
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
                        {hasPermission('event_masters:add') && (
                            <Button variant='contained' onClick={() => {
                                handleClickOpen()
                            }}>Add Coupon</Button>

                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'desc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'desc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'code'}
                                    direction={orderBy === 'code' ? order : 'desc'}
                                    onClick={() => handleRequestSort('code')}
                                >
                                    Code
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'discount'}
                                    direction={orderBy === 'discount' ? order : 'desc'}
                                    onClick={() => handleRequestSort('discount')}
                                >
                                    Discount
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'desc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.couponid}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row?.name}</TableCell>
                                <TableCell className='p-2'>{row?.code}</TableCell>
                                <TableCell className='p-2'>{row?.discount}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} variant='tonal' color={`${styleStatus[row?.status]}`} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('event_masters:edit') && (
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />

                                    )}
                                    {hasPermission('event_masters:delete') && (

                                        <Trash2 className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                            onClick={() => DeleteReq(row?._id)}
                                        />
                                    )}
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

export default CouponTable
