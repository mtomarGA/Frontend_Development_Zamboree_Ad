'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, FormLabel, RadioGroup, FormControlLabel, Radio, Chip, TextField } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import UserDetailsService from '@/services/quiz/userDetails/UserDetailsService'
import ActivityService from '@/services/quiz/activity/ActivityServices'
const rowsPerPageOptions = [5, 10, 25, 50]
const statusColor = {
    ACTIVE: 'success',
    INACTIVE: 'error'
}


function UserTable({ handleClickOpen, getdata, quizType }) {

    const { hasPermission } = useAuth();


    // search
    const [searchTerm, setSearchTerm] = useState('')

    const [EditData, setEditData] = useState({
        coins: '',
        manageCoins: 'Add'
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditOpen(true)
        setEditData({
            id: row?._id,
            coins: '',
            manageCoins: 'Add'
        })
    }
    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            coins: '',
            manageCoins: 'Add'
        })
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const filteredData = quizType.filter(item => {
        const search = searchTerm.toLowerCase()
        return (
            item?.firstName?.toLowerCase().includes(search) ||
            item?.lastName?.toLowerCase().includes(search) ||
            item?.userId?.toString().toLowerCase().includes(search)
        )
    })

    const sortedData = [...filteredData].sort((a, b) => {
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

    // form error and submit
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const validateFields = (data) => {
        let errors = {}
        if (!data.coins) errors.coins = 'Coins is required'
        if (!data.manageCoins) errors.manageCoins = 'Manage Coins is required'

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

            const response = await UserDetailsService.putData(EditData?.id, EditData)

            if (response.success === true && EditData?.manageCoins === 'Add') {
                toast.success(response?.message)
                getdata()
                handleEditClose()

                const activityData = {
                    coins: EditData?.coins,
                    details: "Coins Added",
                }
                const activity = await ActivityService.Post(activityData)
            }

            if (response.success === true && EditData?.manageCoins === 'Deduct') {
                toast.success(response?.message)
                getdata()
                handleEditClose()
                const activityData = {
                    coins: EditData?.coins,
                    details: "Coins Deducted",
                }
                const activity = await ActivityService.Post(activityData)
            }



            if (response.response?.data?.success === false) {
                toast.error(response.response?.data?.message)
                getdata()
                handleEditClose()
                const activityData = {
                    coins: EditData?.coins,
                    details: "Coins Deducted",
                }
                const activity = await ActivityService.Post(activityData)
            }
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
                        Manage Coins
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
                                name='coins'
                                label='Coins'
                                onChange={handleInputChange}
                                value={EditData?.coins}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.coins}
                                helperText={formErrors.coins}
                            />
                        </div>

                        <div className='m-2'>

                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Manage Coins</FormLabel>
                                <RadioGroup
                                    className='flex flex-row gap-2'
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="Add"
                                    name="manageCoins"
                                    onChange={handleInputChange}
                                    value={EditData?.manageCoins}
                                >
                                    <FormControlLabel value="Add" control={<Radio />} label="Add Coins" />
                                    <FormControlLabel value="Deduct" control={<Radio />} label="Deduct Coins" />
                                </RadioGroup>
                            </FormControl>
                        </div>


                    </Typography>
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_user_details:edit') && (
                        <Button onClick={handleSubmit} variant='contained' color={EditData?.manageCoins === 'Add' ? 'primary' : 'error'}>
                            {EditData?.manageCoins === 'Add' ? 'Add Coins' : 'Deduct Coins'}
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

                    <TextField
                        placeholder="Search by name or ID"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        size="small"
                        className="w-60"
                    />
                </div>

                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>User Details</h3>
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
                                    active={orderBy === 'profile'}
                                    direction={orderBy === 'profile' ? order : 'asc'}
                                    onClick={() => handleRequestSort('profile')}
                                >
                                    Profile
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'totalscore'}
                                    direction={orderBy === 'totalscore' ? order : 'asc'}
                                    onClick={() => handleRequestSort('totalscore')}
                                >
                                    Total Score
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'played_contest'}
                                    direction={orderBy === 'played_contest' ? order : 'asc'}
                                    onClick={() => handleRequestSort('played_contest')}
                                >
                                    Played Contest
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'total_transaction'}
                                    direction={orderBy === 'total_transaction' ? order : 'asc'}
                                    onClick={() => handleRequestSort('total_transaction')}
                                >
                                    Total Transaction
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'coins'}
                                    direction={orderBy === 'coins' ? order : 'asc'}
                                    onClick={() => handleRequestSort('coins')}
                                >
                                    Coins
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
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.userId}</div>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={row?.profile} />
                                </TableCell>
                                <TableCell className='p-2'>{row?.firstName} {row?.lastName}</TableCell>
                                <TableCell className='p-2'>{row?.totalscore}</TableCell>
                                <TableCell className='p-2'>{row?.played_contest}</TableCell>
                                <TableCell className='p-2'>{row?.total_transaction}</TableCell>
                                <TableCell className='p-2'>{row?.coins}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} color={statusColor[row?.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2 flex items-center gap-1'>

                                    <Button variant='tonal' onClick={() => handleEditOpen(row)} size='small'>
                                        Manage Coins
                                    </Button>
                                    <Link
                                        href={`/apps/quiz/activitytracker/userActivity/${row._id}`}>
                                        <Button variant='tonal' size='small'>
                                            Activity Tracker
                                        </Button>
                                    </Link>

                                    <Link
                                        href={`/apps/quiz/inappurchase/${row._id}`}
                                    >
                                        <Button variant='tonal' size='small'>
                                            Purchases
                                        </Button>

                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
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

export default UserTable
