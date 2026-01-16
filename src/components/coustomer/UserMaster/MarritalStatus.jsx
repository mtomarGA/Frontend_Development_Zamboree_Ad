'use client'

import { useState, useEffect } from 'react'
import Marital from '@/services/customers/maritalstatus'

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
  Chip
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

const ColumnVisibility = ({ getedData }) => {
  const [data, setData] = useState(getedData || [])
  const { hasPermission } = useAuth();
  const [columnVisibility, setColumnVisibility] = useState({})
  const [editRow, setEditRow] = useState({
    name: "",
    status: ''
  })
  const [open, setOpen] = useState(false)
  const productStatusObj = {
    // PENDING: { title: 'Pending', color: 'warning' },
    ACTIVE: { title: 'ACTIVE', color: 'success' },
    INACTIVE: { title: 'INACTIVE', color: 'error' },
  }
  useEffect(() => {
    setData(getedData || [])
  }, [getedData])

  const handleEdit = row => {

    // console.log('row',row)
    setEditRow(row)
    setOpen(true)
  }

  const handleDelete = async (row) => {
    // console.log(row._id)
    try {
      const result = await Marital.deleteMaritalStatus(row._id)
      // console.log(result)
      setData(prev => prev.filter(item => item._id !== row._id))

      toast.success(result.message)

    } catch (error) {
      console.error('Error deleting marital status:', error)
    }
  }






  const handleSave = async () => {
    console.log(editRow)
    const result = await Marital.updateMaritalStatus(editRow)
    // console.log(result)
    toast.success(result.message)
    setData(prev =>
      prev.map(item => (item._id === editRow._id ? editRow : item))
    )
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setEditRow(prev => ({
      ...prev,
      [field]: field === 'status' ? value.toUpperCase() : value
    }))
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
              onClick={() => handleDelete(row.original)}
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


      <Dialog
        open={open}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton disableRipple onClick={() => setOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>Edit Marital Status</DialogTitle>
        <DialogContent>
          {editRow && (
            <>
              <TextField
                margin='dense'
                label='Name'
                fullWidth
                value={editRow.name}
                placeholder='Occupation'
                onChange={e => handleChange('name', e.target.value)}
              />
              {editRow && (
                <FormControl fullWidth style={{ marginTop: '1rem' }}>

                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editRow.status}
                    label='Status'
                    onChange={e => handleChange('status', e.target.value)}
                  >
                    <MenuItem value='INACTIVE'>Inactive</MenuItem>
                    <MenuItem value='ACTIVE'>Active</MenuItem>
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </DialogActions>

      </Dialog>
      {/* Edit Modal */}
      {/* <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
       
      </Dialog> */}
    </>
  )
}

export default ColumnVisibility
