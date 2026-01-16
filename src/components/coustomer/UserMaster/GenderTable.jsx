'use client'

import { useEffect, useState } from 'react'
import gender from '@/services/customers/gender'

// MUI Imports
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Button
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

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import Tooltip from '@mui/material/Tooltip'
import Grid from '@mui/material/Grid2'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import CustomTextField from '@/@core/components/mui/TextField'
import Image from '@/services/imageService'


const columnHelper = createColumnHelper()

const ColumnVisibility = ({ genderData = [], onSuccess }) => {
  const [data, setData] = useState([])
  const { hasPermission } = useAuth()
  const [imageLoader, setImageLoader] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [editRow, setEditRow] = useState({
    name: '',
    status: '',
    image: ''
  })
  const [preview, setPreview] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(genderData)) {
      setData(genderData)
    }
  }, [genderData])

  // Handle image preview
  useEffect(() => {
    let url
    if (editRow.image && typeof editRow.image !== 'string') {
      url = URL.createObjectURL(editRow.image)
      setPreview(url)
    } else {
      setPreview(editRow.image || null)
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [editRow.image])

  const productStatusObj = {
    ACTIVE: { title: 'ACTIVE', color: 'success' },
    INACTIVE: { title: 'INACTIVE', color: 'error' }
  }

  const handleEdit = (row) => {
    setEditRow(row)
    setImageUrl(row.image || null) // keep existing image
    setOpen(true)
  }

  const handleDelete = async (rowId) => {
    const result = await gender.deleteGender(rowId)
    onSuccess()
    toast.success(result.message)
  }

  const handleChange = (field, value) => {
    setEditRow((prev) => ({ ...prev, [field]: value }))
  }

  const uploadImage = async (file) => {
    setImageLoader(true)
    const formData = new FormData()
    formData.append('image', file)
    const imageUrls = await Image.uploadImage(formData)
    if (imageUrls?.data?.url) {
      setImageUrl(imageUrls.data.url)
    }
    setImageLoader(false)
  }

  const handleSave = async () => {
    const formDataToSend = {
      ...editRow,
      image: imageUrl || editRow.image
    }

    const result = await gender.updategender(formDataToSend)
    setData((prev) =>
      prev.map((item) => (item._id === result._id ? result : item))
    )
    onSuccess()
    toast.success(result.message)

    setOpen(false)
  }

  const columns = [
    columnHelper.accessor('image', {
      header: 'Image',
      cell: (info) => (
        <img
          src={info.getValue()}
          alt='avatar'
          width={40}
          height={40}
          style={{ borderRadius: '50%' }}
        />
      )
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const statusValue = row.original.status
        const status = statusValue ? productStatusObj[statusValue] : null
        if (!status) return null
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
                onClick={() => handleDelete(row.original._id)}
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
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog
        open={open}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton disableRipple onClick={() => setOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle>Edit Gender</DialogTitle>

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
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              if (file) {
                handleChange('image', file)
                uploadImage(file)
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
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <FormControl fullWidth style={{ marginTop: '1rem' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editRow.status}
              label='Status'
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
              <MenuItem value='ACTIVE'>Active</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant='contained'
            disabled={imageLoader || !editRow.name || !editRow.status}
            onClick={handleSave}
          >
            {imageLoader ? 'Uploading...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ColumnVisibility
