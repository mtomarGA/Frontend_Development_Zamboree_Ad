'use client'
import React, { useState, useMemo } from 'react'
import {
  TableRow, Table, TableContainer, TableHead, TableCell,
  TableSortLabel, TableBody, Typography, Button, FormControl,
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Chip
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'

const rowsPerPageOptions = [5, 10, 25, 50]
const paymentMethods = ['All', 'PayPal', 'Bank of America', 'Citibank', 'Razorpay']
const paymentStatuses = ['All', 'COMPLETED', 'PENDING', 'FAILED']

function EventReportTable({ handleClickOpen, data, onSubmit }) {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    method: 'All',
    status: 'All'
  })
  const handleChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Edit modal
  const [Editopen, setEditOpen] = useState(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

  // Sorting
  const [orderBy, setOrderBy] = useState('orderid')
  const [order, setOrder] = useState('asc')
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Generic sorter
  const getNestedValue = (obj, path) =>
    path.split('.').reduce((acc, key) => acc && acc[key], obj)

  // ✅ Filtered data (based on from, to, method, status)
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const rowDate = new Date(row?.createdAt)
      const fromDate = filters.from ? new Date(filters.from) : null
      const toDate = filters.to ? new Date(filters.to) : null

      // date check
      if (fromDate && rowDate < fromDate) return false
      if (toDate) {
        // add 1 day to include "to" day fully
        const endOfTo = new Date(toDate)
        endOfTo.setHours(23, 59, 59, 999)
        if (rowDate > endOfTo) return false
      }

      // payment method check
      if (filters.method !== 'All' && row?.paid_via !== filters.method) return false

      // status check
      if (filters.status !== 'All' && row?.status !== filters.status) return false

      return true
    })
  }, [data, filters])

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    const valA = getNestedValue(a, orderBy) || ''
    const valB = getNestedValue(b, orderBy) || ''
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
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

  const { hasPermission } = useAuth()
  const statusStyles = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error'
  }


  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const val = obj[k];
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(acc, flattenObject(val, newKey));
      } else {
        acc[newKey] = val;
      }
      return acc;
    }, {});
  };

  const handleExport = (rows) => {
    if (!rows?.length) return alert("No data to export");

    const flatRows = rows.map(flattenObject);
    const header = Object.keys(flatRows[0]);
    const csv = [
      header.join(","),
      ...flatRows.map(row => header.map(h => JSON.stringify(row[h] ?? "")).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-report.csv";
    a.click();
  };


  return (
    <div>
      {/* Edit Modal */}
      <Dialog
        onClose={handleEditClose}
        aria-labelledby='customized-dialog-title'
        open={Editopen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5'>Edit</Typography>
          <DialogCloseButton onClick={handleEditClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          Edit form will go here...
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleEditClose} variant='contained'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filters + Table */}
      <TableContainer className='shadow p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='mb-4'>Console Event Report</h3>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField label="From" name="from" type="date" value={filters.from}
              onChange={handleChange} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="To" name="to" type="date" value={filters.to}
              onChange={handleChange} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="Payment Method" name="method" select value={filters.method}
              onChange={handleChange} size="small">
              {paymentMethods.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <TextField label="Payment Status" name="status" select value={filters.status}
              onChange={handleChange} size="small">
              {paymentStatuses.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <Button variant="contained" color="primary" onClick={() => onSubmit?.(filters)}>Submit</Button>
            <Button variant="contained" color="success" onClick={() => handleExport(filteredData)}>Export</Button>
          </Box>
        </div>

        {/* Rows per page selector */}
        <div className='flex items-center justify-end gap-2 m-4'>
          <Typography variant='body2'>Rows per page:</Typography>
          <FormControl size='small' variant='standard'>
            <Select value={rowsPerPage} className='mx-2 w-16' onChange={handleChangeRowsPerPage}>
              {rowsPerPageOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </div>

        {/* Table */}
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              {[
                { id: 'orderid', label: 'Order ID' },
                { id: 'transactionid', label: 'Transaction ID' },
                { id: 'Eventid.event_title', label: 'Event' },
                { id: 'user', label: 'Customer' },
                { id: 'Eventid.organizer.companyInfo.companyName', label: 'Organizer' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'cust_paid', label: 'Amount Paid' },
                { id: 'paid_via', label: 'Payment Method' },
                { id: 'status', label: 'Payment Status' },
                { id: 'createdAt', label: 'Date' }
              ].map(col => (
                <TableCell key={col.id} className='p-2'>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleRequestSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell className='p-2'>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row?._id} className='border-b'>
                <TableCell className='p-2'>{row?.orderid}</TableCell>
                <TableCell className='p-2'>{row?.transactionid || '-'}</TableCell>
                <TableCell className='p-2'>{row?.Eventid?.event_title}</TableCell>
                <TableCell className='p-2'>
                  {row?.user?.firstName
                    ? `${row.user.firstName} ${row.user.lastName}`
                    : row?.user || '-'}
                </TableCell>
                <TableCell className='p-2'>{row?.Eventid?.organizer?.companyInfo?.companyName}</TableCell>
                <TableCell className='p-2'>{row?.quantity}</TableCell>
                <TableCell className='p-2'>{row?.cust_paid}</TableCell>
                <TableCell className='p-2'>{row?.paid_via}</TableCell>
                <TableCell className='p-2'>
                  <Chip label={row?.status} color={statusStyles[row?.status]} variant='tonal' />
                </TableCell>
                <TableCell className='p-2'>
                  {new Date(row?.createdAt).toLocaleDateString('en-GB')},
                  {new Date(row?.createdAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  })}
                </TableCell>
                <TableCell className='p-2'>
                  {hasPermission('event_manageEvents:edit') && (
                    <Pencil
                      onClick={handleEditOpen}
                      className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
          <Typography variant='body2' className='text-gray-600'>
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </Typography>
          <PaginationRounded
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
          />
        </div>
      </TableContainer>
    </div>
  )
}

export default EventReportTable
