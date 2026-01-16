'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import BugService from '@/services/bugService'
import { CircularProgress, styled, Typography } from '@mui/material'
import ImageService from '@/services/imageService'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Grid } from '@mui/system'
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const AddContent = ({ handleClose, handleAddBug, activeCategories }) => {
  const [bugData, setBugData] = useState({
    bugTitle: '',
    bugDescription: '',
    status: 'ACTIVE',
    bugCategory: '',
    screenShot: ''
  })


  const handleChange = (field, value) => {

    setBugData(prev => ({ ...prev, [field]: value }))
    // clear error if any
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  //image uplpoad loader
  const [imageLoader, setImageLoader] = useState(false)



  const handleScreenshotChange = async e => {
    setImageLoader(true)
    try {
      const file = e.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await ImageService.uploadImage(formData)

        handleChange('screenShot', uploadRes.data.url)
      }
    } catch (error) {
      console.log('Error uploading image:', error);

    } finally {
      setImageLoader(false)
    }


  }
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!bugData.bugTitle.trim()) errors.bugTitle = 'Bug title is required'
    if (!bugData.bugDescription.trim()) errors.bugDescription = 'Bug description is required'
    if (!bugData.bugCategory) errors.bugCategory = 'Bug category is required'
    // if (!bugData.screenShot) errors.screenShot = 'Screenshot is required'
    if (!bugData.status) errors.status = 'Status is required'
    setErrors(errors)
    return Object.keys(errors).length === 0
  }


  const handleSubmit = () => {
    console.log('Submitting bugData:', validate());

    if (!validate()) {
      return
    }
    handleAddBug(bugData)
  }

  return (
    <>
      <DialogContent dividers className='overflow-auto flex flex-col gap-4'>
        <CustomTextField
          fullWidth
          label='Bug Title *'
          value={bugData.bugTitle}
          onChange={e => handleChange('bugTitle', e.target.value)}
          error={!!errors.bugTitle}
          helperText={errors.bugTitle || ''}
        />
        <CustomTextField
          fullWidth
          select
          label='Category *'
          value={bugData.bugCategory || ''}
          onChange={e => handleChange('bugCategory', e.target.value)}
          error={!!errors.bugCategory}
          helperText={errors.bugCategory || ''}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: selected => {
                if (selected === '') {
                  return <p>Select Category</p>
                }
                const selectedItem = activeCategories.find(item => item.id === selected)
                return selectedItem ? selectedItem.name : 'Select Category'
              }
            }
          }}
        >
          {activeCategories.map((category, index) => (
            <MenuItem key={index} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          fullWidth
          label='Bug Description *'
          value={bugData.bugDescription}
          onChange={e => handleChange('bugDescription', e.target.value)}
          multiline
          rows={4}
          error={!!errors.bugDescription}
          helperText={errors.bugDescription || ''}
        />

        <div>
          {/* <label className='block font-medium mb-1'>Screenshot</label> */}
          {/* <CustomTextField
            fullWidth
            label='Upload Screenshot'
            variant='outlined'
            type='file'
            accept='image/*'
            onChange={handleScreenshotChange}
            error={!!errors.screenShot}
            helperText={errors.screenShot || ''}
          /> */}

          <Grid className='mb-4 flex flex-row justify-around flex-wrap '  >
            {/* Mobile Image Upload */}
            <div className="mb-4">
              {!bugData.screenShot && !imageLoader && <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                className='mb-2'
              >
                Upload Screenshot
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                />
              </Button>}
              {bugData.screenShot && (
                <div className="flex items-center mt-2">
                  <img src={bugData.screenShot}  alt='Screenshot Preview' className='mt-2 max-h-32 max-w-32 rounded border'/>
                  <Button
                    variant="text"
                    onClick={() => handleChange('screenShot', '')}
                    className='ml-2 tabler-trash'
                  >
                  </Button>
                </div>
              )}
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>
      </Grid>

      {/* {bugData.screenShot && (
        <img src={bugData.screenShot} alt='Screenshot Preview' className='mt-2 max-h-32 rounded border' />
        
      )} */}
      {/* show loader */}
      {imageLoader && (
        <div className='flex justify-center items-center'>
          <CircularProgress size={24} color='primary' />
        </div>
      )}
    </div >
      <CustomTextField
        fullWidth
        select
        label='Status *'
        value={bugData.status}
        onChange={e => handleChange('status', e.target.value)}
        error={!!errors.status}
        helperText={errors.status || ''}
      >
        <MenuItem value='ACTIVE'>Unsolved</MenuItem>
        <MenuItem value='INACTIVE'>Solved</MenuItem>
      </CustomTextField>
      </DialogContent >
  <DialogActions className='flex justify-center gap-2 p-2 m-2'>
    <Button disabled={imageLoader} variant='contained' onClick={handleSubmit}>
      Add Bug
    </Button>
    <Button variant='outlined' onClick={handleClose}>
      Cancel
    </Button>
  </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, handleUpdate, data, activeCategories }) => {
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'ACTIVE',
    image: '',
    category: '', // will hold the category ID (_id)
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!editData.title.trim()) errors.title = 'Bug title is required'
    if (!editData.description.trim()) errors.description = 'Bug description is required'
    if (!editData.category) errors.category = 'Bug category is required'
    if (!editData.status) errors.status = 'Status is required'
    setErrors(errors)

    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    if (data) {
      setEditData({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'ACTIVE',
        image: data.image || '',
        category: data.category?._id || '', // store just the _id
      })
    }
  }, [data])



  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    // clear error if any
    setErrors(prev => ({ ...prev, [field]: '' }))
  }
  const [imageLoader, setImageLoader] = useState(false)

  const handleScreenshotChange = async e => {
    setImageLoader(true)
    try {
      const file = e.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await ImageService.uploadImage(formData)

        handleChange('image', uploadRes.data.url)
        setErrors(prev => ({ ...prev, image: '' })) // clear error if any
      }
    } catch (error) {
      console.log('Error uploading image:', error);

    } finally {
      setImageLoader(false)
    }

  }

  const handleSubmit = () => {
    if (!validate()) {
      return
    }
    handleUpdate({
      ...data,
      ...editData,
      category: editData.category,
      image: editData.image
    })
  }

  return (
    <>
      <DialogContent dividers className='overflow-auto flex flex-col gap-4'>
        <CustomTextField
          fullWidth
          label='Bug Title *'
          value={editData.title}
          onChange={e => handleChange('title', e.target.value)}
          error={!!errors.title}
          helperText={errors.title || ''}
        />
        <CustomTextField
          fullWidth
          select
          label='Category *'
          value={editData.category}
          onChange={e => handleChange('category', e.target.value)}
          error={!!errors.category}
          helperText={errors.category || ''}
        >
          {activeCategories.map((category, index) => (
            <MenuItem key={index} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          fullWidth
          label='Bug Description *'
          value={editData.description}
          multiline
          rows={4}
          onChange={e => handleChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description || ''}
        />
        <div>
          {/* <label className='block font-medium mb-1'>Screenshot</label>
          <input type='file' accept='image/*' onChange={handleScreenshotChange} /> */}
          <Grid className='mb-4 flex flex-row justify-around flex-wrap '  >
            {/* Mobile Image Upload */}
            <div className="mb-4">
              {!editData.image && !imageLoader && <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                className='mb-2'
              >
                Upload Screenshot
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                />
              </Button>}
              {editData.image && (
                <div className="flex items-center mt-2">
                  <img src={editData.image}  alt='Screenshot Preview' className='mt-2 max-h-32 max-w-32 rounded border'/>
                  <Button
                    variant="text"
                    onClick={() => handleChange('image', '')}
                    className='ml-2 tabler-trash'
                  >
                  </Button>
                </div>
              )}
            </div>
      </Grid>
          {/* show loader */}
          {imageLoader && (
            <div className='flex justify-center items-center'>
              <CircularProgress size={24} color='primary' />
            </div>
          )}
        </div>
        <CustomTextField
          fullWidth
          select
          label='Status *'
          value={editData.status}
          onChange={e => handleChange('status', e.target.value)}
          error={!!errors.status}
          helperText={errors.status || ''}
        >
          <MenuItem value='ACTIVE'>Unsolved</MenuItem>
          <MenuItem value='INACTIVE'>Solved</MenuItem>
        </CustomTextField>
      </DialogContent>
      <DialogActions className='flex justify-center gap-2 p-2 m-2'>
        <Button variant='contained' disabled={imageLoader} onClick={handleSubmit}>
          Update Bug
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const AddBugModal = ({ open, setOpen, data, handleUpdate, handleAddBug }) => {
  const handleClose = () => setOpen(false)
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchCategoryList = async () => {
    try {
      const response = await BugService.getAllBugCategories()
      const activeCategories = response.data
        .filter(category => category.status === 'ACTIVE')
        .map(category => ({ id: category._id, name: category.name }))
      setCategoryList(activeCategories)
    } catch (error) {
      console.log('Error fetching category list:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCategoryList()
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      scroll='paper'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='text-start'>
        {data ? 'Edit Bug' : 'Add New Bug'}
      </DialogTitle>
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <Typography variant='h6'>Loading...</Typography>
        </div>
      ) : (
        <>
          {data ? (
            <EditContent
              handleClose={handleClose}
              handleUpdate={handleUpdate}
              data={data}
              activeCategories={categoryList}
            />
          ) : (
            <AddContent handleClose={handleClose} handleAddBug={handleAddBug} activeCategories={categoryList} />
          )}
        </>
      )}
    </Dialog>
  )
}

export default AddBugModal
