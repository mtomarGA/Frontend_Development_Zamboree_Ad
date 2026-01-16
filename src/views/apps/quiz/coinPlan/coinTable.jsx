'use client'
import React, { useState, useEffect } from 'react'
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
    Avatar,
    Chip
} from '@mui/material'
import Grid from '@mui/material/Grid'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import Image from '@/services/imageService'
import PlanService from '@/services/quiz/coinPlan/planServices'

const rowsPerPageOptions = [5, 10, 25, 50]
const statusStyles = {
    ACTIVE: 'success',
    INACTIVE: 'error'
}

function CoinTable({ handleClickOpen, quizType, GetCategoryFun }) {
    const [EditData, setEditData] = useState({
        title: '',
        coins: '',
        price: '',
        packageId: '',
        icon: '',
        status: 'INACTIVE'
    })

    const [search, setSearch] = useState('')
    const [filteredRows, setFilteredRows] = useState([])
    const [rows, setRows] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState('title')
    const [order, setOrder] = useState('asc')

    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = () => setEditOpen(true)
    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setImageFileName('')
    }

    const [formErrors, setFormErrors] = useState({})
    const [imageFileName, setImageFileName] = useState('')

    const { hasPermission } = useAuth()

    useEffect(() => {
        setRows(quizType)
    }, [quizType])

    useEffect(() => {
        const filtered = rows.filter(item => {
            const searchStr = search.toLowerCase()
            return (
                item.title?.toLowerCase().includes(searchStr) ||
                item.coins?.toString().includes(searchStr) ||
                item.price?.toString().includes(searchStr)
                // item.packageId?.toLowerCase().includes(searchStr)
            )
        })
        setFilteredRows(filtered)
    }, [search, rows])

    const sortedData = [...filteredRows].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleRequestSort = property => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const validateFields = data => {
        let errors = {}
        if (!data.title) errors.title = 'Title is required'
        if (!data.coins) errors.coins = 'Amount of coins is required'
        if (!data.icon) errors.icon = 'Icon is required'
        if (!data.price) errors.price = 'Price is required'
        if (!data.packageId) errors.packageId = 'Package Id is required'
        return errors
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleImageChange = async e => {
        const { files } = e.target
        setImageFileName(files[0]?.name || '')
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setEditData(prev => ({ ...prev, icon: result.data.url }))
            if (formErrors.icon) setFormErrors(prev => ({ ...prev, icon: '' }))
        }
    }

    const Editid = async id => {
        handleEditOpen()
        const res = await PlanService.getdatabyid(id)
        setEditData(res.data)
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        const response = await PlanService.putData(EditData._id, EditData)
        toast.success(response.message)
        GetCategoryFun()
        handleEditClose()
    }

    const deleteid = async id => {
        const res = await PlanService.deleteData(id)
        toast.success(res.message || 'Coin Plan Deleted Successfully')
        GetCategoryFun()
    }

    return (
        <div>
            {/* Edit Dialog */}
            <Dialog onClose={handleEditClose} open={Editopen} PaperProps={{ sx: { overflow: 'visible' } }}>
                <DialogTitle>
                    <Typography variant='h5'>Edit Coin Plan</Typography>
                    <DialogCloseButton onClick={handleEditClose}><i className='tabler-x' /></DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='m-2'>
                        <CustomTextField className='w-96' name='title' label='Title' onChange={handleInputChange}
                            value={EditData.title || ''} error={!!formErrors.title} helperText={formErrors.title} />
                    </div>
                    <div className='m-2'>
                        <CustomTextField className='w-96' type='number' name='coins' label='Coins' onChange={handleInputChange}
                            value={EditData.coins || ''} error={!!formErrors.coins} helperText={formErrors.coins} />
                    </div>
                    <div className='m-2'>
                        <CustomTextField className='w-96' type='number' name='price' label='Price' onChange={handleInputChange}
                            value={EditData.price || ''} error={!!formErrors.price} helperText={formErrors.price} />
                    </div>
                    <div className='m-2'>
                        <CustomTextField className='w-96' name='packageId' label='Package Id' onChange={handleInputChange}
                            value={EditData.packageId || ''} error={!!formErrors.packageId} helperText={formErrors.packageId} />
                    </div>
                    <div className='m-2'>
                        <label className='text-sm'>Image</label>
                        <Button variant='outlined' component='label' className='w-96'>
                            Upload File
                            <input type='file' hidden onChange={handleImageChange} accept='image/*' />
                        </Button>
                        {imageFileName && <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate'>{imageFileName}</Typography>}
                        {EditData.icon && <Avatar src={EditData.icon} className='mt-2' />}
                        {formErrors.icon && <Typography variant='body2' color='error'>{formErrors.icon}</Typography>}
                    </div>
                    <div className='m-2'>
                        <CustomTextField select className='w-96' name='status' label='Status' value={EditData.status}
                            onChange={handleInputChange} error={!!formErrors.status} helperText={formErrors.status}>
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                        </CustomTextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_coin_plan:edit') && <Button onClick={handleSubmit} variant='contained'>Update Plan</Button>}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Table Section */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <Grid item xs={12} md={3}>
                        <CustomTextField label='Search' value={search} onChange={e => setSearch(e.target.value)} />
                    </Grid>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select value={rowsPerPage} className='w-16' onChange={handleChangeRowsPerPage}>
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {hasPermission('quiz_coin_plan:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Coin Plan</Button>
                        )}
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {['title', 'icon', 'coins', 'price', 'packageId', 'status'].map(col => (
                                <TableCell key={col} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === col}
                                        direction={orderBy === col ? order : 'asc'}
                                        onClick={() => handleRequestSort(col)}
                                    >
                                        {col.charAt(0).toUpperCase() + col.slice(1)}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map(row => (
                            <TableRow key={row._id}>
                                <TableCell className='p-2'>{row.title}</TableCell>
                                <TableCell className='p-2'><Avatar src={row.icon} /></TableCell>
                                <TableCell className='p-2'>{row.coins}</TableCell>
                                <TableCell className='p-2'>{row.price}</TableCell>
                                <TableCell className='p-2'>{row.packageId}</TableCell>
                                <TableCell className='p-2'><Chip label={row.status} color={statusStyles[row.status]} variant='tonal' /></TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('quiz_coin_plan:edit') &&
                                        <Pencil onClick={() => Editid(row._id)} className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition' />}
                                    {hasPermission('quiz_coin_plan:delete') &&
                                        <Trash2 onClick={() => deleteid(row._id)} className='text-red-600 size-5 cursor-pointer hover:scale-110 transition' />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(filteredRows.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default CoinTable
