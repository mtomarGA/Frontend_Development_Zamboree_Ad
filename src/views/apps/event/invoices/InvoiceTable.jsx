'use client'

import React, { useState, useEffect } from 'react'
import {
  TableRow, Table, TableContainer, TableHead, TableCell,
  TableSortLabel, TableBody, Typography, Button, FormControl,
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'

import { Circle, Eye, Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import PaginationRounded from '../../announce/list/pagination'
import Link from '@/components/Link'

const rowsPerPageOptions = [5, 10, 25, 50]

function InvoiceTable({ handleClickOpen, data, loading, setdata, DeleteData }) {
  const { hasPermission } = useAuth()


  const [initialDate, setInitialDate] = useState('')

  useEffect(() => {
    const dateStr = new Date().toISOString()
    setInitialDate(dateStr)
    setdata(prev =>
      prev.map(item => ({ ...item, createdAt: dateStr }))
    )
  }, [])



  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [Editopen, setEditOpen] = useState(false)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')


  const handleEditOpen = (row) => {
    // setEditData({
    //   id: row.id,
    //   sort_id: row.sort_id || '',
    //   categoryName: row.categoryName,
    //   slug: row.slug || '',
    //   status: row.status || 'ACTIVE',
    //   createdAt: row.createdAt || initialDate
    // })
    setEditOpen(true)
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







  const statusStyle = {
    COMPLETED: 'success',
    PENDING: 'warning',
    FAILED: 'error'
  }

  return (
    <div>

      {/* table */}
      <TableContainer className='shadow p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='mb-4'>Event Invoice</h3>
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
            {/* <Button
              variant='contained'
              onClick={() => {
                setEditData({
                  id: '',
                  sort_id: '',
                  categoryName: '',
                  slug: '',
                  status: 'ACTIVE',
                  createdAt: initialDate
                })
                handleClickOpen()
              }}
            >
              Add Category
            </Button> */}
          </div>
        </div>
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              {["invoiceid", 'orderid', 'customerName', 'amount', 'status'].map(col => (
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
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className='p-2 text-center'>
                  <h4>Loading....</h4>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row._id} className='border-b'>
                  <TableCell className='p-2'>{row?.invoiceid}</TableCell>
                  <TableCell className='p-2'>{row?.orderid}</TableCell>
                  <TableCell className='p-2'>{row?.user?.firstName}&nbsp;{row?.user?.lastName}</TableCell>
                  <TableCell className='p-2'>{row?.amount}</TableCell>
                  <TableCell className='p-2'>
                    <Chip label={row?.status} size='small' color={statusStyle[row?.status]} variant='tonal' />
                  </TableCell>

                  <TableCell className='p-2'>
                    {/* <Pencil
                      onClick={() => handleEditOpen(row)}
                      className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                    /> */}
                    <Link href={`/en/apps/event/invoices/show/${row?._id}`}>
                      <Eye
                        className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                      />
                    </Link>


                    <Trash2 className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition' onClick={() => DeleteData(row?._id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
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

export default InvoiceTable
