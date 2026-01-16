'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Services
import kycTypeService from '@/services/business/kycType.service'

// Toast
import { toast } from 'react-toastify'

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddDocumentType = ({ open, setOpen, data, onSuccess }) => {
  const [form, setForm] = useState({ name: '', status: 'ACTIVE' })

  useEffect(() => {
    if (data) {
      setForm({ name: data.name || '', status: data.status || 'ACTIVE' })
    } else {
      setForm({ name: '', status: 'ACTIVE' })
    }
  }, [data])

  const handleClose = () => setOpen(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        toast.error('Document Type is required.')
        return
      }

      let res
      if (data?._id) {
        res = await kycTypeService.updateKycType(data._id, form)
      } else {
        res = await kycTypeService.addKycType(form)
      }

      if (res) {
        toast.success(`Documemnt Type ${data ? 'updated' : 'created'} successfully.`)
        onSuccess?.()
        setForm({ name: '', status: 'ACTIVE' })
        handleClose()
      } else {
        throw new Error('Unexpected response')
      }
    } catch (err) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', width: '100%', maxWidth: 500 } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h5'>{data ? 'Edit Document Type' : 'Add Document Type'}</DialogTitle>

      <DialogContent className='overflow-visible'>
        <CustomTextField
          fullWidth
          label='Document Type '
          placeholder='Enter Document Type'
          name='name'
          value={form.name}
          onChange={handleChange}
          className='mbe-4'
        />
        <CustomTextField select fullWidth label='Status' name='status' value={form.status} onChange={handleChange}>
          {statusOptions.map(status => (
            <MenuItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </CustomTextField>
      </DialogContent>

      <DialogActions className='flex justify-start gap-3 p-4'>
        <Button onClick={handleSubmit} variant='contained'>
          {data ? 'Update' : 'Create'}
        </Button>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDocumentType
