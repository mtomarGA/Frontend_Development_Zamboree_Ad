'use client'

import { useEffect, useState } from 'react'

import Interest from '@/services/customers/interestService'
import Image from '@/services/imageService' // 👈 make sure this path is correct

// MUI Imports
import {
  Card,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

// Table Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import CustomTextField from '@/@core/components/mui/TextField'

const columnHelper = createColumnHelper()

const ColumnVisibility = () => {
  const [data, setData] = useState([])
  const { hasPermission } = useAuth()
  const [imageUrl, setImageUrl] = useState(null)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [editRow, setEditRow] = useState({ name: '', status: '', image: '' })
  const [open, setOpen] = useState(false)
  const [imageLoader, setImageLoader] = useState(false)
  const [preview, setPreview] = useState('')

  const productStatusObj = {
    ACTIVE: { title: 'ACTIVE', color: 'success' },
    INACTIVE: { title: 'INACTIVE', color: 'error' }
  }

  const getInterest = async () => {
    const result = await Interest.getAllInterest()
    setData(result.data)
  }

  useEffect(() => {
    getInterest()
  }, [])

  const handleEdit = row => {
    setEditRow(row)
    setPreview(row.image || '')
    setOpen(true)
  }

  const handleDelete = async rowId => {
    const id = rowId._id
    try {
      const result = await Interest.deleteInterest(id)

      toast.success(result.message)
    } catch (err) {
      toast.error('Failed to delete interest')
    }
  }

  const uploadImages = async file => {
    setImageLoader(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const imageUrls = await Image.uploadImage(formData)

      if (imageUrls?.data?.url) {
        setImageUrl(imageUrls.data.url)

        setEditRow(prev => ({
          ...prev,
          image: imageUrls.data.url
        }))
      }
    } catch (error) {
      console.error("Image upload failed:", error)
    } finally {
      setImageLoader(false)
    }
  }


  const handleSave = async () => {
    console.log(editRow, "editRoweditRow");

    const result = await Interest.updateInterest(editRow)
    setOpen(false)
    getInterest()
    toast.success(result.message)
  }

  const handleChange = (field, value) => {
    setEditRow(prev => ({ ...prev, [field]: value }))
  }

  const columns = [
    columnHelper.accessor('image', {
      header: 'Image',
      cell: info => <img src={info.getValue()} alt='avatar' width={40} height={40} style={{ borderRadius: '50%' }} />
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const statusValue = row.original.status
        const status = statusValue ? productStatusObj[statusValue] : null
        if (!status) return null

        return <Chip label={status.title} variant='tonal' color={status.color} size='small' />
      }
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          {hasPermission('user_user_master:edit') && (
            <Tooltip title='Edit' placement='top-end'>
              <i
                className='tabler-edit text-blue-600 text-2xl cursor-pointer'
                onClick={() => handleEdit(row.original)}
              />
            </Tooltip>
          )}
          {hasPermission('user_user_master:delete') && (
            <Tooltip title='Delete' placement='top-end'>
              <i
                className='tabler-trash text-red-500 text-2xl cursor-pointer'
                onClick={() => handleDelete(row.original)}
              />
            </Tooltip>
          )}
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
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton disableRipple onClick={() => setOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogContent className='w-[400px]'>
          <Grid item xs={12} className='text-center mb-3'>
            {preview && (
              <img
                src={preview}
                alt='Preview'
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
          </Grid>

          <CustomTextField
            fullWidth
            type='file'
            label='Image'
            inputProps={{ accept: 'image/*' }}
            onChange={e => {
              const file = e.target.files?.[0] || null
              if (file) {
                setPreview(URL.createObjectURL(file)) // instant preview
                uploadImages(file)
              }
            }}
            helperText='Choose Image'
          />

          <TextField
            margin='dense'
            label='Name'
            fullWidth
            value={editRow.name}
            placeholder='Interest'
            onChange={e => handleChange('name', e.target.value)}
          />

          <FormControl fullWidth style={{ marginTop: '1rem' }}>
            <InputLabel>Status</InputLabel>
            <Select value={editRow.status} label='Status' onChange={e => handleChange('status', e.target.value)}>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
              <MenuItem value='ACTIVE'>Active</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='contained' disabled={imageLoader || !editRow.name || !editRow.status} onClick={handleSave}>
            {imageLoader ? 'Uploading...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ColumnVisibility
