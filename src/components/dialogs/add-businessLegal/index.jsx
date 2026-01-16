'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Service
import businessStatusService from '@/services/business/businessStatus.service'

const statusOptions = ['ACTIVE', 'INACTIVE']

const BusinessLegalDialog = ({ open, setOpen, data, onSuccess }) => {
  const [form, setForm] = useState({ name: '', status: 'ACTIVE' })

  useEffect(() => {
    if (data) {
      setForm({ name: data.name || '', status: data.status || 'ACTIVE' })
    } else {
      setForm({ name: '', status: 'ACTIVE' })
    }
  }, [data])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Business Legal Status name is required.')
      return
    }

    try {
      let res
      if (data?._id) {
        res = await businessStatusService.updateBusinessStatus(data._id, form)
      } else {
        res = await businessStatusService.addBusinessStatus(form)
      }

      if (res?.statusCode === 200) {
        toast.success(`Business Legal Status ${data ? 'updated' : 'created'} successfully.`)
        onSuccess?.()
        setForm({ name: '', status: 'ACTIVE' })
        handleClose()
      } else {
        throw new Error('Unexpected response')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', width: '100%', maxWidth: 500 } }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h3' className='flex flex-col gap-2 text-start sm:pbs-16 sm:pbe-2 sm:pli-16'>
        {data ? 'Edit Business Legal Status' : 'Add Business Legal Status'}
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <CustomTextField
          fullWidth
          name='name'
          label='Business Legal Status'
          placeholder='Enter Business Legal Status'
          value={form.name}
          onChange={handleChange}
          className='mbe-4'
        />

        <CustomTextField select fullWidth name='status' label='Status' value={form.status} onChange={handleChange}>
          {statusOptions.map((status, index) => (
            <MenuItem key={index} value={status}>
              {status}
            </MenuItem>
          ))}
        </CustomTextField>
      </DialogContent>

      <DialogActions className='flex max-sm:flex-col max-sm:items-start max-sm:gap-2 justify-start pbs-0 sm:pbe-16 sm:pli-16'>
        <Button type='submit' variant='contained' onClick={handleSubmit}>
          {data ? 'Update' : 'Create'}
        </Button>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BusinessLegalDialog
