'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, Button, Typography, Box, Dialog, TextField } from '@mui/material'
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
import CustomTextField from '@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import DeleteConfirmationDialog from '../../deleteConfirmation'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import workShiftService from '@/services/attendance/workShift.service'
import TablePaginationComponent from '@/components/TablePaginationComponent'

const columnHelper = createColumnHelper()

// Fuzzy filter for search
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Debounced input for search
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const OfficeShift = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [newShift, setNewShift] = useState({
    shiftName: '',
    startTime: '',
    endTime: ''
  })

  const { hasPermission } = useAuth()

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    const response = await workShiftService.getWorkShift()
    setData(response.data)
  }

  const handleAddOpen = () => {
    setNewShift({ shiftName: '', startTime: '', endTime: '' })
    setAddOpen(true)
  }

  const handleAddSave = async () => {
    if (!newShift.shiftName || !newShift.startTime || !newShift.endTime) return toast.error('All fields are required')

    try {
      const res = await workShiftService.addWorkShift(newShift)
      setData(prev => [...prev, res.data || res])
      setAddOpen(false)
      toast.success('Shift added successfully')
    } catch (err) {
      toast.error(err?.message || 'Failed to add shift')
    }
  }

  const handleDelete = async _id => {
    if (!_id) return toast.error('Invalid shift ID')
    try {
      const res = await workShiftService.deleteShift(_id)
      setData(prev => prev.filter(item => item._id !== _id))
      toast.success(res.message || 'Shift deleted successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete shift')
    }
  }

  const handleEdit = shift => {
    setSelectedShift(shift)
    setEditOpen(true)
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('shiftName', {
        header: 'Shift Name',
        cell: info => info.getValue()
      }),

      columnHelper.accessor('startTime', {
        header: 'Start Time',
        cell: info => {
          const time = info.getValue()
          if (!time) return '-'
          const [hour, minute] = time.split(':')
          const h = parseInt(hour)
          const ampm = h >= 12 ? 'PM' : 'AM'
          const formattedHour = h % 12 || 12
          return `${formattedHour}:${minute} ${ampm}`
        }
      }),

      columnHelper.accessor('endTime', {
        header: 'End Time',
        cell: info => {
          const time = info.getValue()
          if (!time) return '-'
          const [hour, minute] = time.split(':')
          const h = parseInt(hour)
          const ampm = h >= 12 ? 'PM' : 'AM'
          const formattedHour = h % 12 || 12
          return `${formattedHour}:${minute} ${ampm}`
        }
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {hasPermission('attendance_master_shift:edit') && (
              <Button size='small' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit' />
              </Button>
            )}
            {hasPermission('attendance_master_shift:delete') && (
              <DeleteConfirmationDialog
                itemName='Office Shift'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </Box>
        )
      })
    ],
    []
  )

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

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h4'>Working Shift</Typography>}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              gap: 2,
              width: '100%',
              flexWrap: 'wrap'
            }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
              sx={{
                width: { xs: '80%', sm: 250, md: 200 }
              }}
            />

            {hasPermission('attendance_master_shift:add') && (
              <Button
                variant='contained'
                onClick={handleAddOpen}
                sx={{
                  width: { xs: '80%', sm: 'auto' },
                  minWidth: { sm: 120 }
                }}
              >
                Add Shift
              </Button>
            )}
          </Box>
        }
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 }
        }}
      />

      {/* Responsive Table */}
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length} style={{ textAlign: 'center', padding: '16px' }}>
                {isLoading ? 'Loading...' : 'No data available'}
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

      {/* Pagination */}
      <TablePaginationComponent table={table} />

      {/* Add Shift Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          sx: {
            overflow: 'hidden'
          }
        }}
        scroll='body'
      >
        <DialogCloseButton onClick={() => setAddOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <Box
          p={{ xs: 3, sm: 4 }}
          display='flex'
          flexDirection='column'
          gap={3}
          sx={{
            overflow: 'hidden'
          }}
        >
          <Typography variant='h4'>Add New Shift</Typography>

          <TextField
            label='Shift Name'
            value={newShift.shiftName}
            onChange={e => setNewShift({ ...newShift, shiftName: e.target.value })}
            fullWidth
          />

          <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              label='Start Time'
              type='time'
              value={newShift.startTime}
              onChange={e => setNewShift({ ...newShift, startTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label='End Time'
              type='time'
              value={newShift.endTime}
              onChange={e => setNewShift({ ...newShift, endTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box display='flex' justifyContent='flex-end'>
            <Button variant='contained' onClick={handleAddSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth='sm'
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden'
          }
        }}
      >
        <DialogCloseButton onClick={() => setEditOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>
        <Box p={{ xs: 3, sm: 4 }} display='flex' flexDirection='column' gap={3} sx={{ overflow: 'hidden' }}>
          <Typography variant='h4'>Edit Shift</Typography>
          <TextField
            label='Shift Name'
            value={selectedShift?.shiftName || ''}
            onChange={e => setSelectedShift({ ...selectedShift, shiftName: e.target.value })}
            fullWidth
          />
          <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              label='Start Time'
              type='time'
              value={selectedShift?.startTime || ''}
              onChange={e => setSelectedShift({ ...selectedShift, startTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label='End Time'
              type='time'
              value={selectedShift?.endTime || ''}
              onChange={e => setSelectedShift({ ...selectedShift, endTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              variant='contained'
              onClick={async () => {
                if (!selectedShift.shiftName || !selectedShift.startTime || !selectedShift.endTime)
                  return toast.error('All fields are required')
                try {
                  const res = await workShiftService.updateShift(selectedShift._id, selectedShift)
                  setData(prev => prev.map(item => (item._id === selectedShift._id ? res.data || res : item)))
                  setEditOpen(false)
                  toast.success('Shift updated successfully')
                } catch (err) {
                  toast.error(err?.message || 'Failed to update shift')
                }
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Card>
  )
}

export default OfficeShift
