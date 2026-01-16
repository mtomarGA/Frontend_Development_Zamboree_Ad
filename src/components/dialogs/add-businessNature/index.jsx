'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Components
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Services
import businessNatureService from '@/services/business/businessNature.service'
import { toast } from 'react-toastify'

const AddBusinessNature = ({ open, setOpen, data, onSuccess }) => {
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
        toast.error('Business Nature name is required.')
        return
      }

      let res
      if (data?._id) {
        res = await businessNatureService.updateBusinessNature(data._id, form)
      } else {
        res = await businessNatureService.addBusinessNature(form)
      }

      if (res?.statusCode === 200) {
        toast.success(`Business Nature ${data ? 'updated' : 'created'} successfully.`)
        onSuccess?.()
        setForm({ name: '', status: 'INACTIVE' })
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
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h5'>{data ? 'Edit Business Nature' : 'Add Business Nature'}</DialogTitle>

      <DialogContent className='overflow-visible'>
        <CustomTextField
          fullWidth
          label='Business Nature Name'
          placeholder='Enter Business Nature'
          name='name'
          value={form.name}
          onChange={handleChange}
          className='mbe-4'
        />
        <CustomTextField select fullWidth label='Status' name='status' value={form.status} onChange={handleChange}>
          <MenuItem value='ACTIVE'>Active</MenuItem>
          <MenuItem value='INACTIVE'>Inactive</MenuItem>
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

export default AddBusinessNature
