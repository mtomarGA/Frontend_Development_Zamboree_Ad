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
import FileUploader from './FileUploader'
import ImageService from '@/services/imageService'
import { set } from 'date-fns'

const AddContent = ({ handleClose, handleAdd, title, folderName }) => {
  const [data, setData] = useState({ name: '', date: '', image: '', status: 'ACTIVE' })
  const [errors, setErrors] = useState({ name: '', date: '', image: '' })
  //image upload state
  const [imageUploading, setImageUploading] = useState(false)
  const [imageId, setImageId] = useState('')

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!data.name.trim()) newErrors.name = `${title} is required'`
    if (!data.date) newErrors.date = 'Date is required'
    if (!data.image) newErrors.image = 'Image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    setImageUploading(true)
    if (validate()) {
      console.log('Submitting data:', data);
      handleAdd(data)
    }else {
      setImageUploading(false)
    }

  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          label={title}
          variant='outlined'
          value={data.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder={`Enter ${title}`}
          className='mb-4'
          error={!!errors.name}
          helperText={errors.name}
        />
        <CustomTextField
          fullWidth
          label={'Date'}
          variant='outlined'
          value={data.date}
          onChange={e => handleChange('date', e.target.value)}
          placeholder={`Select Date`}
          className='mb-4'
          type='date'
          error={!!errors.date}
          helperText={errors.date}
        />

        <FileUploader
          onFileSelect={async (file) => {
            setImageUploading(true)
            if (file) {
              const url = URL.createObjectURL(file)
              const formData = new FormData()
              formData.append('image', file)
              const uploadedFile = await ImageService.uploadImage(formData, {folder: folderName} )
              const imageUrl = uploadedFile.data.url
              setImageId(uploadedFile.data.public_id)
              handleChange('image', imageUrl)
              setImageUploading(false)
            }
            setImageUploading(false)
          }}
          imageUploading={imageUploading}
          error_text={errors.main_image}
          initialFile={data.image}
          imageId={imageId}
          setImageUploading={setImageUploading}
        />

        <CustomTextField
          fullWidth
          select
          label='Status'
          value={data.status}
          onChange={e => handleChange('status', e.target.value)}
          className='mb-4'
        >
          <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
          <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
        </CustomTextField>
      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button disabled={imageUploading} type='submit' variant='contained' onClick={handleSubmit}>
          Create
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate, title , folderName }) => {
  console.log('EditContent data:', data);
  const [editData, setEditData] = useState(data)
  const [errors, setErrors] = useState({ name: '', date: '', image: '' })
  const [imageId, setImageId] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!editData.name.trim()) newErrors.name = `${title} is required'`
    if (!editData.date) newErrors.date = 'Date is required'
    if (!editData.image) newErrors.image = 'Image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    setImageUploading(true)
    if (validate()) {
      console.log('Updating data:', editData);
      handleUpdate(editData)
    }else {
      setImageUploading(false)
    }
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          size='small'
          variant='outlined'
          label={title}
          value={editData.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder={`Enter ${title}`}
          className='mb-4'
          error={!!errors.name}
          helperText={errors.name}
        />
        <CustomTextField
          fullWidth
          label={'Date'}
          variant='outlined'
          value={new Date(editData.date).toISOString().split('T')[0]}
          onChange={e => handleChange('date', e.target.value)}
          placeholder={`Select Date`}
          className='mb-4'
          type='date'
          error={!!errors.date}
          helperText={errors.date}
        />

        <FileUploader
          onFileSelect={async (file) => {
            setImageUploading(true)
            if (file) {
              const url = URL.createObjectURL(file)
              const formData = new FormData()
              formData.append('image', file)
              const uploadedFile = await ImageService.uploadImage(formData , { folder: folderName })
              const imageUrl = uploadedFile.data.url
              setImageId(uploadedFile.data.public_id)
              handleChange('image', imageUrl)
              setImageUploading(false)
            }
            setImageUploading(false)
          }}
          imageUploading={imageUploading}
          error_text={errors.image}
          initialFile={data.image}
          imageId={imageId}
          setImageUploading={setImageUploading}
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
        <Button disabled={imageUploading} variant='contained' onClick={handleSubmit}>
          Update
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const HinduFestivalModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, folderName ="Other" }) => {
  // console.log('HinduFestivalModal data:', data, 'title:', title);
  if (data) {
    console.log('HinduFestivalModal data: ', data);
  }

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
        {data ? `Edit ${title}` : `Add ${title}`}
      </DialogTitle>
      {data ? (
        <EditContent handleClose={handleClose} handleUpdate={handleUpdate} data={data} title={title} folderName={folderName} />
      ) : (
        <AddContent handleClose={handleClose} handleAdd={handleAdd} title={title} folderName={folderName} />
      )}
    </Dialog>
  )
}

export default HinduFestivalModal
