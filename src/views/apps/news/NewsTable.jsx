'use client'
import React, { useEffect, useState, useMemo } from 'react'
import {
    TableRow, Table, TableContainer, TableHead,
    TableCell, TableSortLabel, TableBody, Button, TextField
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import { Pencil, Trash2 } from 'lucide-react'
import CustomTextField from '@/@core/components/mui/TextField'
import Grid from '@mui/material/Grid2'
import PaginationRounded from '../announce/list/pagination'
import NewsService from '@/services/newsletter/newsServices'
import { toast } from 'react-toastify'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import * as XLSX from 'xlsx'
import { useAuth } from '@/contexts/AuthContext'

function NewsTable({ handleClickOpen, NewsData, GetNewsFun, setNewsData }) {
    const { hasPermission } = useAuth()

    const [Editopen, setEditOpen] = useState(false)
    const [EditData, setEditData] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('Newsid')

    const [searchText, setSearchText] = useState('')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) return order
            return a[1] - b[1]
        })
        return stabilizedThis.map((el) => el[0])
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) return -1
        if (b[orderBy] > a[orderBy]) return 1
        return 0
    }

    const handleEditOpen = () => setEditOpen(true)
    const handleEditClose = () => setEditOpen(false)

    const EditOnChange = (e) => {
        setEditData({ ...EditData, [e.target.name]: e.target.value })
    }

    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate)
        return date.toLocaleDateString('en-GB')
    }

    const handleExport = () => {
        const exportData = NewsData.map(item => ({
            ID: item.Newsid,
            'Email Id': item.email,
            'Create Date': expiryDateFun(item.createdAt),
            'IP Address': item.IP
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'News Subscribers')
        XLSX.writeFile(wb, 'News_Subscribers.xlsx')
    }

    const DeleteNews = async (id) => {
        try {
            await NewsService.deleteData(id)
            GetNewsFun()
            toast.success('Newsletter Deleted')
        } catch (error) {
            toast.error('Something Went Wrong')
        }
    }

    const validateFields = (data) => {
        let errors = {}
        if (!data.email) errors.email = 'Email is required'
        return errors
    }

    const editid = async (updateid) => {
        const result = await NewsService.getdatabyid(updateid)
        setEditData(result.data)
    }

    const Submit = async () => {
        try {
            const errors = validateFields(EditData)
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return
            }
            setFormErrors({})
            await NewsService.putData(EditData._id, EditData)
            handleEditClose()
            GetNewsFun()
            toast.success('Newsletter Updated')
        } catch (error) {
            toast.error('Something went Wrong')
        }
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase())
        setCurrentPage(1)
    }

    const filteredData = useMemo(() => {
        return NewsData.filter(item =>
            (item.email || '').toLowerCase().includes(searchText) ||
            (item.Newsid || '').toString().toLowerCase().includes(searchText) ||
            (item.IP || '').toLowerCase().includes(searchText)
        )
    }, [NewsData, searchText])

    const sortedData = stableSort([...filteredData], getComparator(order, orderBy))
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <>
            {/* Edit Modal */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Newsletter
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='m-4'>
                        <CustomTextField
                            name='email'
                            className='w-96'
                            placeholder='Enter Email Id'
                            label='Email Id'
                            value={EditData.email || ''}
                            onChange={EditOnChange}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    {hasPermission('newsletter:edit') && (
                        <Button onClick={Submit} variant='contained'>
                            Edit News Subscriber
                        </Button>
                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Table */}
            <TableContainer className='shadow p-4'>
                <div className='flex justify-between flex-wrap px-3 m-2'>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <CustomTextField
                            id='form-props-search'
                            label='Search'
                            name='search'
                            type='search'
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <div className='m-2'>
                        <TextField
                            select
                            size='small'
                            value={itemsPerPage}
                            onChange={e => {
                                setItemsPerPage(parseInt(e.target.value))
                                setCurrentPage(1)
                            }}
                            SelectProps={{ native: true }}
                        >
                            {[5, 10, 20, 50].map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </TextField>

                        {hasPermission('newsletter:add') && (
                            <Button variant='contained' className='mx-2' onClick={handleClickOpen}>
                                Add
                            </Button>
                        )}
                        <Button
                            variant='contained'
                            className='mx-2'
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'Newsid'}
                                    direction={orderBy === 'Newsid' ? order : 'asc'}
                                    onClick={() => handleRequestSort('Newsid')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'email'}
                                    direction={orderBy === 'email' ? order : 'asc'}
                                    onClick={() => handleRequestSort('email')}
                                >
                                    Email Id
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderBy === 'createdAt' ? order : 'asc'}
                                    onClick={() => handleRequestSort('createdAt')}
                                >
                                    Create Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>IP Address</TableCell>
                            <TableCell className='p-2'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2'>
                                    <div className='font-medium'>{item.Newsid}</div>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <div className='font-medium'>{item.email}</div>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <div className='font-medium'>{expiryDateFun(item.createdAt)}</div>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <div className='font-medium'>{item.IP}</div>
                                </TableCell>
                                <TableCell className='px-4 py-2 flex items-center gap-3'>
                                    {hasPermission('newsletter:edit') && (
                                        <Pencil className='text-blue-500 cursor-pointer hover:scale-110 transition' onClick={() => { editid(item._id); handleEditOpen() }} />
                                    )}
                                    {hasPermission('newsletter:delete') && (
                                        <Trash2 className='text-red-500 cursor-pointer hover:scale-110 transition' onClick={() => DeleteNews(item._id)} />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex justify-between items-center m-4'>
                    <div className='text-sm text-gray-600'>
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <PaginationRounded
                        count={Math.ceil(filteredData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </>
    )
}

export default NewsTable
