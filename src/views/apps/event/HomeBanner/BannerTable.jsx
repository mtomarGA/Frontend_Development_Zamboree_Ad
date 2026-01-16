'use client'

import React, { useState, useEffect } from 'react'
import {
    TableRow, Table, TableContainer, TableHead, TableCell,
    TableSortLabel, TableBody, Typography, Button, FormControl,
    Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
    Autocomplete,
    Avatar,
    Chip,
    CircularProgress
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

import { useAuth } from '@/contexts/AuthContext'
import GoogleMapLocation from '../ManageEvent/GoogleMapLocation'

const rowsPerPageOptions = [5, 10, 25, 50]


const statusStyle = {
    ACTIVE: "success",
    PENDING: "error",
}
function BannerTable(props) {


    const {
        // open add modal
        handleClickOpen,
        // event Search
        EventSearch, event, setevent, AddBanner, inputValueArtist,
        setInputValueArtist,
        setsearch,
        search,
        // fromError
        validateFields,
        formErrors,
        setFormErrors,
        // image Name and onchange for image
        imageName,
        setImageName,
        onchangeimage,
        // add state
        Adddata,
        setAdddata,

        // fetch banner , data is the state where Banner stores
        FetchBanner,
        data,
        // Edit Api
        EditBanner,
        DeleteBanner,
        imageLoading
    } = props


    const { hasPermission } = useAuth()

    // const [data, setdata] = useState([{
    //     id: 1,
    //     categoryName: "Sample Category",
    //     image: "sample.jpg",
    //     isPremium: false,
    //     coins: 10,
    //     totalQuestion: 5,
    //     createdAt: ''
    // }])




    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [Editopen, setEditOpen] = useState(false)
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')


    // Edit Modal
    const handleEditOpen = (row) => {
        setAdddata({
            id: row._id,
            event: row?.event?._id || '',
            webBanner: row?.webBanner,
            mobBanner: row?.mobBanner,
            latitude: row?.latitude,
            longitude: row?.longitude,
            status: row?.status,
            address: row?.address
        })
        setInputValueArtist(row?.event?.event_title || '') // ✅ show title in Autocomplete
        setEditOpen(true)
    }



    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})

    }


    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...data].sort((a, b) => {
        if (orderBy === 'createdAt' || orderBy === 'id') {
            return order === 'desc'
                ? new Date(b[orderBy]) - new Date(a[orderBy])
                : new Date(a[orderBy]) - new Date(b[orderBy])
        }

        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
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



    const handleSubmit = async () => {
        const errors = validateFields(Adddata)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }
        try {
            const res = await EditBanner(Adddata.id, Adddata);
            if (res.success == true) {
                toast.success(res?.message)
                FetchBanner()
                handleEditClose()
            }

        } catch (err) {
            toast.error(err);
        }
    }


    const DeleteFun = async (id) => {
        try {
            const res = await DeleteBanner(id);
            if (res.success == true) {
                toast.success(res?.message || [])
                FetchBanner();

            }
            return;
        } catch (error) {
            toast.error(error || "Failed to Delete")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleLocationSelect = (location) => {
        setAdddata(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }));
    };


    return (
        <div>
            <Dialog
                onClose={handleEditClose}
                open={Editopen}
                maxWidth='md'
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle>
                    <Typography component={'div'}>
                        Edit Home Banner
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <div className='flex flex-row justify-between'>

                        <Autocomplete
                            options={event.filter(e => typeof e?.event_title === 'string')}
                            className="w-96 mx-2"
                            value={event.find(e => e._id === Adddata.event) || null}
                            inputValue={inputValueArtist}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason !== 'reset') {
                                    setInputValueArtist(newInputValue);
                                    setsearch(newInputValue); // <-- triggers useEffect
                                }
                            }}
                            onChange={(e, newValue) =>
                                setAdddata(prev => ({
                                    ...prev,
                                    event: newValue?._id || '',
                                }))
                            }
                            getOptionLabel={(option) => option?.event_title || ''}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            filterOptions={(options, { inputValue }) => options}
                            renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                    {option.event_title}
                                </li>
                            )}
                            noOptionsText={
                                inputValueArtist.length < 3
                                    ? 'Type at least 3 characters to search'
                                    : 'No events found'
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



                        <div className='mx-2'>
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
                                        name='webBanner'
                                        onChange={onchangeimage}
                                        key={Adddata.webBanner ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                    />
                                </Button>
                                {Adddata.webBanner && (
                                    <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {Adddata?.webBanner || imageName?.webBanner}
                                        {/* <Avatar src={Adddata?.icon} /> */}
                                    </Typography>
                                )}
                                {formErrors.webBanner && (
                                    <Typography variant='body2' color="error">
                                        {formErrors?.webBanner}
                                    </Typography>
                                )}
                            </div>
                            {imageLoading.webBanner && (
                                <CircularProgress size={20} className='mt-2' />
                            )}
                        </div>


                    </div>

                    <div className='flex flex-row justify-between items-center flex-wrap'>

                        <div className='mx-2'>
                            <label htmlFor='icon' className='text-sm'>
                                MobBanner Image
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
                                        name='mobBanner'
                                        onChange={onchangeimage}
                                        key={Adddata.mobBanner ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                    />
                                </Button>
                                {Adddata.mobBanner && (
                                    <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {Adddata?.mobBanner || imageName?.mobBanner}
                                        {/* <Avatar src={Adddata?.mobBanner} /> */}
                                    </Typography>
                                )}
                                {formErrors.mobBanner && (
                                    <Typography variant='body2' color="error">
                                        {formErrors?.mobBanner}
                                    </Typography>
                                )}
                            </div>
                            {imageLoading.mobBanner && (
                                <CircularProgress size={20} className='mt-2' />
                            )}
                        </div>

                        <div>

                            <CustomTextField
                                disabled
                                className='w-96 mx-2'
                                name='address'
                                label='Address'
                                value={Adddata?.address || ''}
                                onChange={handleChange}
                                error={!!formErrors.address}
                                helperText={formErrors.address}
                            />
                        </div>

                    </div>

                    <div className='flex flex-row justify-between items-center m-2 flex-wrap'>

                        <CustomTextField
                            className='w-96'
                            name='latitude'
                            label='Latitude'
                            value={Adddata?.latitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.latitude}
                            helperText={formErrors.latitude}
                            disabled
                        />

                        <CustomTextField
                            className='w-96'
                            name='longitude'
                            label='Longitude'
                            value={Adddata?.longitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.longitude}
                            helperText={formErrors.longitude}
                            disabled
                        />

                    </div>
                    <div className=' my-4 mx-2'>

                        <GoogleMapLocation onSelect={handleLocationSelect} />
                    </div>




                    <div>
                        <CustomTextField
                            select
                            className='w-96 mx-2'
                            name='status'
                            label='Status'
                            value={Adddata.status || ''}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>

                        </CustomTextField>
                    </div>


                </DialogContent>

                <DialogActions>
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                    {hasPermission('event_masters:edit') && (
                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Banner
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Home Banner</h3>
                    <div className='flex items-center gap-2 mx-4'>
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

                        {hasPermission('event_masters:add') && (
                            <Button
                                variant='contained'
                                onClick={() => {
                                    handleClickOpen()
                                }}
                            >
                                Add Home Banner
                            </Button>

                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {['Event Name', 'webBanner', 'MobBanner', , 'latitude', 'longitude', 'status'].map(col => (
                                <TableCell key={col} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === col}
                                        direction={orderBy === col ? order : 'desc'}
                                        onClick={() => handleRequestSort(col)}
                                    >
                                        {col.replace(/([A-Z])/g, ' $1')}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row?.event?.event_title}</TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={row?.webBanner} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={row?.mobBanner} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {row?.latitude}
                                </TableCell>
                                <TableCell className='p-2'>
                                    {row?.longitude}
                                </TableCell>
                                <TableCell className='p-2'>

                                    <Chip label={row?.status} size='small' variant='tonal' color={statusStyle[row?.status]} />
                                </TableCell>

                                <TableCell className='p-2'>

                                    {hasPermission('event_masters:edit') && (
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />

                                    )}

                                    {hasPermission('event_masters:delete') && (
                                        <Trash2
                                            onClick={() => DeleteFun(row?._id)}
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

export default BannerTable
