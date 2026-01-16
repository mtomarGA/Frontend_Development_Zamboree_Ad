'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import MenuItem from '@mui/material/MenuItem'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Import Services
import employeeNoService from '@/services/business/employeeNo.service'

// Toast (Assuming toast is available globally)
import { toast } from 'react-toastify'

const statusOptions = ['ACTIVE', 'INACTIVE']

const EmployeeNumberDialog = ({ open, setOpen, data, onSuccess }) => {
  const [form, setForm] = useState({ name: '', status: 'INACTIVE' })

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        status: data.status || 'INACTIVE'
      })
    } else {
      setForm({ name: '', status: 'INACTIVE' })
    }
  }, [data])

  const handleClose = () => setOpen(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Employees Number is required.')
      return
    }

    try {
      let res
      if (data?._id) {
        res = await employeeNoService.updateEmpoyeeNo(data._id, form)
      } else {
        res = await employeeNoService.addEmpoyeeNo(form)
      }

      toast.success(`Employee number ${data ? 'updated' : 'created'} successfully.`)
      onSuccess?.()
      setForm({ name: '', status: 'ACTIVE' })
      handleClose()
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
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h5'>{data ? 'Edit Employee Number' : 'Add Employee Number'}</DialogTitle>

      <DialogContent className='overflow-visible'>
        <CustomTextField
          fullWidth
          label='Employee Number '
          placeholder='Enter Employee Number'
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

export default EmployeeNumberDialog
