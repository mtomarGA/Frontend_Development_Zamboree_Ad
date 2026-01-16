import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'

// Component Imports
import { MenuItem } from '@mui/material'

// import services
import bankService from '@/services/business/bank.service'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

const BankDialog = ({ open, setOpen, data, onSuccess }) => {
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
        toast.error('Bank name is required.')
        return
      }

      let res
      if (data?._id) {
        res = await bankService.updateBank(data._id, form)
      } else {
        res = await bankService.addBank(form)
      }

      if (res) {
        toast.success(`Bank Name ${data ? 'updated' : 'created'} successfully.`)
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
        {data ? 'Edit Bank Detail' : 'Add Bank Detail'}
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <CustomTextField
          fullWidth
          name='name'
          label='Bank Name'
          placeholder='Enter Bank Name'
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
export default BankDialog
