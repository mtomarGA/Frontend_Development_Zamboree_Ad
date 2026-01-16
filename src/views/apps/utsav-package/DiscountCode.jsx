'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Typography,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material'
import { ChevronRight } from 'lucide-react'
import classnames from 'classnames'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@/@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import discountCode from '@/services/utsav-packages/discountCode.service'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../deleteConfirmation'

const productStatusObj = {
  active: { title: 'ACTIVE', color: 'success' },
  inactive: { title: 'INACTIVE', color: 'error' }
}

const formatDateForDisplay = dateStr => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}-${month}-${year.slice(2)}`
}

const DiscountCode = () => {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [editData, setEditData] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { hasPermission } = useAuth()

  const fetchDiscountCodes = async () => {
    try {
      const res = await discountCode.getDiscount()
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      toast.error('Failed to fetch discount codes')
    }
  }

  const handleDelete = async id => {
    try {
      const res = await discountCode.deleteDiscount(id)
      if (res?.status === 200 || res?.success) {
        toast.success('Discount code deleted successfully')
        await fetchDiscountCodes()
      } else {
        toast.error(res?.message || 'Failed to delete discount code')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting discount code')
    }
  }

  const handleEditOpen = row => {
    setEditData({
      ...row,
      date: row.date?.split('T')[0] || new Date().toISOString().split('T')[0]
    })
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setEditData(null)
  }

  const handleEditSave = async () => {
    const { discount, voucherType } = editData

    if (voucherType === 'AMOUNT' && Number(discount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    if (voucherType === 'PERCENTAGE' && (Number(discount) <= 0 || Number(discount) > 100)) {
      toast.error('Percentage must be between 1 and 100')
      return
    }

    try {
      const payload = {
        ...editData,
        date: new Date(editData.date).toISOString()
      }
      const res = await discountCode.updateDiscount(editData._id, payload)
      if (res?.status === 200 || res?.success) {
        toast.success('Discount updated successfully')
        fetchDiscountCodes()
        handleDialogClose()
      } else {
        toast.error(res?.message || 'Failed to update')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update error')
    }
  }

  useEffect(() => {
    fetchDiscountCodes()
  }, [])

  const columnHelper = createColumnHelper()

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'ID',
      header: 'ID',
      cell: ({ table, row }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        const rowsInPage = table.getRowModel().rows
        const index = rowsInPage.findIndex(r => r.id === row.id)
        return <Typography>{pageIndex * pageSize + index + 1}</Typography>
      }
    }),
    columnHelper.accessor('couponCode', { header: 'Name', cell: info => info.getValue() }),
    columnHelper.accessor('discount', { header: 'DISCOUNT', cell: info => info.getValue() }),
    columnHelper.accessor('voucherType', { header: 'VOUCHER TYPE', cell: info => info.getValue() }),
    columnHelper.accessor('date', {
      header: 'EXPIRE DATE',
      cell: info => formatDateForDisplay(info.getValue()?.split('T')[0])
    }),
    columnHelper.accessor('status', {
      header: 'STATUS',
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase()
        const statusData = productStatusObj[status]
        return statusData ? (
          <Chip label={statusData.title} color={statusData.color} variant='tonal' size='small' />
        ) : (
          <Chip label='Unknown' variant='outlined' size='small' />
        )
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <Box display='flex' gap={1}>
          {hasPermission("utsav_package_discount_List:edit") && (
            <Button size='small' onClick={() => handleEditOpen(row.original)}>
              <i className='tabler-edit' />
            </Button>
          )}


          {hasPermission("utsav_package_discount_List:delete")&& (
                       <DeleteConfirmationDialog
                         itemName='Discount List'
                         onConfirm={() =>  handleDelete(row.original._id)}
                         icon={<i className='tabler-trash text-2xl text-error' />}
                       />
                     )} 
       
        </Box>
      ),
      enableSorting: false
    })
  ], [])

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  return (
    <>
     <Card>
  <CardHeader
    title={
      <Typography variant='h4' fontWeight={600}>
        Discount List
      </Typography>
    }
    action={
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search all columns...'
          sx={{
            width: { xs: '100%', sm: '250px' },
            minWidth: { xs: '100%', sm: '200px' }
          }}
        />

        {hasPermission("utsav_package_discount_List:add") && (
          <Button
            variant='contained'
            onClick={() => router.push('/en/apps/utsav-package/create-discount')}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap'
            }}
          >
            Add Discount
          </Button>
        )}
      </Box>
    }
    sx={{
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: { xs: 2, sm: 0 },
      '& .MuiCardHeader-action': {
        margin: { xs: '16px 0 0 0', sm: '0' },
        alignSelf: { xs: 'stretch', sm: 'center' }
      }
    }}
  />

  <div className='overflow-x-auto'>
    <table className={styles.table}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {!header.isPlaceholder && (
                  <div
                    className={classnames({
                      'flex items-center': header.column.getIsSorted(),
                      'cursor-pointer': header.column.getCanSort()
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <ChevronRight className={header.column.getIsSorted() === 'asc' ? '-rotate-90' : 'rotate-90'} />
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getFilteredRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={table.getAllColumns().length} className='text-center'>
              No data available
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  <TablePagination
    component={() => <TablePaginationComponent table={table} />}
    count={table.getFilteredRowModel().rows.length}
    rowsPerPage={table.getState().pagination.pageSize}
    page={table.getState().pagination.pageIndex}
    onPageChange={(_, page) => table.setPageIndex(page)}
  />
</Card>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={handleDialogClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>Edit Discount</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Name'
            fullWidth
            value={editData?.couponCode || ''}
            onChange={e => setEditData(prev => ({ ...prev, couponCode: e.target.value }))}
          />
          <TextField
            margin='dense'
            label='Discount'
            fullWidth
            type='number'
            value={editData?.discount || ''}
            onChange={e => setEditData(prev => ({ ...prev, discount: e.target.value }))}
          />
          <TextField
            margin='dense'
            label='Voucher Type'
            fullWidth
            select
            value={editData?.voucherType || ''}
            onChange={e => setEditData(prev => ({ ...prev, voucherType: e.target.value }))}
          >
            <MenuItem value='PERCENTAGE'>Percentage</MenuItem>
            <MenuItem value='AMOUNT'>Fixed Amount</MenuItem>
          </TextField>
          <TextField
            margin='dense'
            label='Expire Date'
            type='date'
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            value={editData?.date || ''}
            onChange={e => setEditData(prev => ({ ...prev, date: e.target.value }))}
          />
          <TextField
            margin='dense'
            label='Status'
            fullWidth
            select
            value={editData?.status || ''}
            onChange={e => setEditData(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DiscountCode
