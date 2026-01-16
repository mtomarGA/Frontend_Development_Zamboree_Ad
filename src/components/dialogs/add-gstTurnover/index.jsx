import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { toast } from 'react-toastify'

// Component Imports
import { MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import gstTurnoverService from '@/services/business/gstTurnover.service'

const GstTurnoverDialog = ({ open, setOpen, data, onSuccess }) => {
  const [form, setForm] = useState({ name: '', status: 'INACTIVE' })

  useEffect(() => {
    if (data) {
      setForm({ name: data.name || '', status: data.status || 'INACTIVE' })
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
    try {
      if (!form.name.trim()) {
        toast.error('GST Turnover is required.')
        return
      }

      let res
      if (data?._id) {
        res = await gstTurnoverService.updateGstTurnover(data._id, form)
      } else {
        res = await gstTurnoverService.addGstTurnover(form)
      }

      if (res) {
        toast.success(`GST Turnover ${data ? 'updated' : 'created'} successfully.`)
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
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h3' className='flex flex-col gap-2 text-start sm:pbs-16 sm:pbe-2 sm:pli-16'>
        {data ? 'Edit GST Turnover' : 'Add GST Turnover'}
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <CustomTextField
          fullWidth
          name='name'
          label='GST Turnover'
          placeholder='Enter GST Turnover'
          value={form.name}
          onChange={handleChange}
          className='mbe-4'
        />

        <CustomTextField select fullWidth label='Status' name='status' value={form.status} onChange={handleChange}>
          <MenuItem value='ACTIVE'>Active</MenuItem>
          <MenuItem value='INACTIVE'>Inactive</MenuItem>
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
export default GstTurnoverDialog
