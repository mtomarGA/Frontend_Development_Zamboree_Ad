'use client'

import { useEffect, useState } from 'react'
import Occupation from '@/services/customers/occupation'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
// MUI Imports
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
} from '@mui/material'

// Table Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

// Style Imports
import styles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

const columnHelper = createColumnHelper()

const OccupationTable = ({ getAlloccupation ,alloccupation}) => {
  const [data, setData] = useState(getAlloccupation?.data || [])
  const { hasPermission } = useAuth();

  const [columnVisibility, setColumnVisibility] = useState({})
  const [editRow, setEditRow] = useState({ _id: '', name: '', status: '' })
  const [open, setOpen] = useState(false)

  const productStatusObj = {
    // PENDING: { title: 'Pending', color: 'warning' },
    ACTIVE: { title: 'ACTIVE', color: 'success' },
    INACTIVE: { title: 'INACTIVE', color: 'error' },
  }

  useEffect(() => {
    if (getAlloccupation?.data) {
      console.log('Occupation data from props:', getAlloccupation.data)
      setData(getAlloccupation.data)
    }
  }, [getAlloccupation])
  const handleEdit = row => {
    setEditRow(row)
    setOpen(true)
  }

  const handleDelete = async rowId => {
    try {
      const result = await Occupation.deleteOccupation(rowId)
      toast.success(result.message)
      setData(prev => prev.filter(item => item._id !== rowId))
    } catch (err) {
      console.error('Error deleting occupation:', err)
    
    }
  }

  const handleSave = async () => {
    if (!editRow._id) {
      toast.error('Invalid occupation selected for update')
      return
    }

    try {
      const updatedResult = await Occupation.updateOccupation(editRow)
      setData(prev =>
        prev.map(item => (item._id === editRow._id ? { ...item, ...editRow } : item))
      )
      setOpen(false)
      alloccupation()
    } catch (err) {
      console.error('Error updating occupation:', err)
    }
  }

  const handleChange = (field, value) => {
    setEditRow(prev => ({ ...prev, [field]: value }))
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const statusValue = row.original.status;
          const status = statusValue ? productStatusObj[statusValue] : null;

          if (!status) return null; // or return some default component

          return (
            <Chip
              label={status.title}
              variant='tonal'
              color={status.color}
              size='small'
            />
          )
        }
      }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-6'>

          {hasPermission("user_user_master:edit") && <Tooltip title="Edit" placement="top-end">
            <i
              className='tabler-edit text-blue-600 text-2xl cursor-pointer'
              onClick={() => handleEdit(row.original)}
            />
          </Tooltip>}
          {hasPermission("user_user_master:delete") && <Tooltip title="Delete" placement="top-end">
            <i
              className='tabler-trash text-red-500 text-2xl cursor-pointer'
              onClick={() => handleDelete(row.original._id)}
            />
          </Tooltip>}

        </div>
      )
    })
  ]

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
      <Card className='shadow-none'>
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {/* <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
       
      </Dialog> */}

      <Dialog
        open={open}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton disableRipple onClick={() => setOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle>Edit Occupation</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin='dense'
            label='Name'
            fullWidth
            value={editRow.name}
            placeholder='Occupation'
            onChange={e => handleChange('name', e.target.value)}
          />

          <FormControl fullWidth margin='normal'>
            <InputLabel>Status</InputLabel>
            <Select
              label='Status'
              value={editRow.status}
              onChange={e => handleChange('status', e.target.value)}
            >
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OccupationTable
