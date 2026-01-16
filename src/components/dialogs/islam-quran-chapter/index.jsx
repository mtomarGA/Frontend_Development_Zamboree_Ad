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

const AddContent = ({ handleClose, handleAdd, title }) => {
  const [data, setData] = useState({
    arabic_chapter_name: '',
    chapter_name_meaning: '',
    english_chapter_name: '',
  })
  const [errors, setErrors] = useState({ arabic_chapter_name: '', chapter_name_meaning: '', english_chapter_name: '' })


  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!data.arabic_chapter_name.trim()) newErrors.arabic_chapter_name = `Arabic chapter name is required`
    if (!data.chapter_name_meaning.trim()) newErrors.chapter_name_meaning = 'Chapter name meaning is required'
    if (!data.english_chapter_name.trim()) newErrors.english_chapter_name = 'English chapter name is required'
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
          label={'Arabic Chapter Name'}
          variant='outlined'
          value={data.arabic_chapter_name}
          onChange={e => handleChange('arabic_chapter_name', e.target.value)}
          placeholder={`Enter Arabic Chapter Name`}
          className='mb-4'
          error={!!errors.arabic_chapter_name}
          helperText={errors.arabic_chapter_name}
        />
        <CustomTextField
          fullWidth
          label={'English Chapter Name'}
          variant='outlined'
          value={data.english_chapter_name}
          onChange={e => handleChange('english_chapter_name', e.target.value)}
          placeholder={`Enter English Chapter Name`}
          className='mb-4'
          error={!!errors.english_chapter_name}
          helperText={errors.english_chapter_name}
        />
        <CustomTextField
          fullWidth
          label={'Chapter Name Meaning'}
          variant='outlined'
          value={data.chapter_name_meaning}
          onChange={e => handleChange('chapter_name_meaning', e.target.value)}
          placeholder={`Enter Chapter Name Meaning`}
          className='mb-4'
          error={!!errors.chapter_name_meaning}
          helperText={errors.chapter_name_meaning}
          multiline
          rows={4}
        />

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
  const [errors, setErrors] = useState({ sorting_no: '', arabic_chapter_name: '', chapter_name_meaning: '', english_chapter_name: '' })

  console.log('EditContent data:', data);


  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!editData.sorting_no) newErrors.sorting_no = 'Sorting number is required'
    if (!editData.arabic_chapter_name.trim()) newErrors.arabic_chapter_name = 'Arabic chapter name is required'
    if (!editData.chapter_name_meaning.trim()) newErrors.chapter_name_meaning = 'Chapter name meaning is required'
    if (!editData.english_chapter_name.trim()) newErrors.english_chapter_name = 'English chapter name is required'
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
          label={"Sorting Number"}
          value={editData.sorting_no}
          onChange={e => handleChange('sorting_no', e.target.value)}
          placeholder={`Enter Sorting Number`}
          className='mb-4'
          error={!!errors.sorting_no}
          helperText={errors.sorting_no}
        />
        <CustomTextField
          fullWidth
          label={'Arabic Chapter Name'}
          variant='outlined'
          value={editData.arabic_chapter_name}
          onChange={e => handleChange('arabic_chapter_name', e.target.value)}
          placeholder={`Enter Arabic Chapter Name`}
          className='mb-4'
          error={!!errors.arabic_chapter_name}
          helperText={errors.arabic_chapter_name}
        />
        <CustomTextField
          fullWidth
          label={'English Chapter Name'}
          variant='outlined'
          value={editData.english_chapter_name}
          onChange={e => handleChange('english_chapter_name', e.target.value)}
          placeholder={`Enter English Chapter Name`}
          className='mb-4'
          error={!!errors.english_chapter_name}
          helperText={errors.english_chapter_name}
        />
        <CustomTextField
          fullWidth
          label={'Chapter Name Meaning'}
          variant='outlined'
          value={editData.chapter_name_meaning}
          onChange={e => handleChange('chapter_name_meaning', e.target.value)}
          placeholder={`Enter Chapter Name Meaning`}
          className='mb-4'
          error={!!errors.chapter_name_meaning}
          helperText={errors.chapter_name_meaning}
          multiline
          rows={4}
        />


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

const QuranChapterModal = ({ open, data, handleUpdate, handleAdd, handleClose, title }) => {
  if (data) {
    console.log('QuranChapter data: ', data);
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

export default QuranChapterModal
