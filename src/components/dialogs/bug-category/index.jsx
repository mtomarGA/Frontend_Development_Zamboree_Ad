// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useState } from 'react'
import { MenuItem } from '@mui/material'

const AddContent = ({ handleClose, handleAddCategory }) => {
  const [categoryData, setCategoryData] = useState({ name: '', status: 'ACTIVE' })
  const [errors, setErrors] = useState({ name: '', status: '' })
  const validate = () => {
    const newErrors = {}
    if (!categoryData.name.trim()) newErrors.name = 'Category name is required'
    if (!categoryData.status) newErrors.status = 'Status is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleChange = (name, value) => {
    setCategoryData({ ...categoryData, [name]: value })
  }
  const handleAdd = () => {
    if (validate()) {
      handleAddCategory(categoryData)
      setCategoryData({ name: '', status: 'ACTIVE' }) // Reset form after adding
    }
  }
  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          label='Category Name'
          variant='outlined'
          value={categoryData.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder='Enter Category Name'
          className='mb-4'
        />
        <CustomTextField
          fullWidth
          select
          label='Status'
          value={categoryData.status}
          onChange={e => handleChange('status', e.target.value)}
          className='mb-4'
        >
          <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
          <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
        </CustomTextField>
      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button variant='contained' onClick={() => handleAdd()} color='primary'>
          Create Category
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate }) => {
  const [editData, setEditData] = useState(data)

  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value })
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          size='small'
          variant='outlined'
          label='Category Name'
          value={editData.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder='Enter Category Name'
          className='mb-4'
        />
        <CustomTextField
          fullWidth
          select
          label='Status'
          value={editData.status || 'ACTIVE'}
          onChange={e => handleChange('status', e.target.value)}
          className='mb-4'
        >
          <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
          <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
        </CustomTextField>
      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button variant='contained' onClick={() => handleUpdate(editData)}>
          Update
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const BugCategoryModal = ({ open, setOpen, data, handleUpdate, handleAddCategory }) => {
  const handleClose = () => setOpen(false)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='text-left px-4 pt-6 sm:px-6'>
        {data ? 'Edit Category' : 'Add New Category'}
      </DialogTitle>
      {data ? (
        <EditContent handleClose={handleClose} handleUpdate={handleUpdate} data={data} />
      ) : (
        <AddContent handleClose={handleClose} handleAddCategory={handleAddCategory} />
      )}
    </Dialog>
  )
}

export default BugCategoryModal
