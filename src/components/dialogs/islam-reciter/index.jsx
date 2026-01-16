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
// import FileUploader from './FileUploader'
import ImageService from '@/services/imageService'
import { position } from 'stylis'
import FileUploader from '@/components/FileUploader'

const AddContent = ({ handleClose, handleAdd, title }) => {
  const [data, setData] = useState({ name: '', profile_image: '' })
  const [errors, setErrors] = useState({ name: '', profile_image: '' })
  //image upload state
  const [imageUploading, setImageUploading] = useState(false)
  const [imageId, setImageId] = useState('')

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const handleImageChange = (e) => {
    const {name , value} = e.target
    if (name === 'profile_image' && value) {
      setData({ ...data, profile_image: value })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!data.name.trim()) newErrors.name = `${title} is required'`
    if (!data.profile_image) newErrors.profile_image = 'Profile image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('Submitting data:', data);

      handleAdd(data)
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

        <FileUploader acceptedFiles={['image/jpeg', 'image/png']} error_text={errors.profile_image} initialFile={data.profile_image} label={"Reciter Image"} name={"profile_image"} onFileSelect={handleImageChange} cropSize={{ width: 400, height: 400 }} isWatermark={false} />

      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button type='submit' variant='contained' onClick={handleSubmit}>
          Create
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate, title }) => {
  const [editData, setEditData] = useState(data)
  const [errors, setErrors] = useState({ name: '', position: '', profile_image: '' })
  const [imageId, setImageId] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  console.log('EditContent data:', data);


  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }
  const handleImageChange = (e) => {
    const { name, value } = e.target
    if (name === 'profile_image' && value) {
      setEditData({ ...editData, profile_image: value })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!editData.name.trim()) newErrors.name = `${title} is required'`
    if (!editData.position) newErrors.position = 'Position is required'
    if (!editData.profile_image) newErrors.profile_image = 'Profile image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('Updating data:', editData);
      handleUpdate(editData)

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
          label={'Position'}
          variant='outlined'
          type='number'
          value={editData.position}
          onChange={e => handleChange('position', e.target.value)}
          placeholder={`Select Position`}
          className='mb-4'
          error={!!errors.position}
          helperText={errors.position}
        />

        <FileUploader acceptedFiles={['image/jpeg', 'image/png']} error_text={errors.profile_image} initialFile={data.profile_image} label={"Reciter Image"} name={"profile_image"} onFileSelect={handleImageChange} cropSize={{ width: 400, height: 400 }} isWatermark={false} />

      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button variant='contained' onClick={handleSubmit}>
          Update
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const IslamReciterModal = ({ open, data, handleUpdate, handleAdd, handleClose, title }) => {
  // console.log('IslamReciter data:', data, 'title:', title);
  if (data) {
    console.log('IslamReciter data: ', data);
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
        <EditContent handleClose={handleClose} handleUpdate={handleUpdate} data={data} title={title} />
      ) : (
        <AddContent handleClose={handleClose} handleAdd={handleAdd} title={title} />
      )}
    </Dialog>
  )
}

export default IslamReciterModal
