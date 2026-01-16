// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useEffect, useState } from 'react'
import { duration, Menu, MenuItem, styled } from '@mui/material'
import FileUploader from './FileUploader'
import ImageService from '@/services/imageService'
import { useParams } from 'next/navigation'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MusicPlayerSlider from '@/views/apps/spritual/components/MusicPlayer'
import { set } from 'date-fns'

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

function getMediaDuration(file) {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      const audio = new Audio();

      audio.preload = 'metadata';
      audio.src = url;

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url); // clean up
        resolve(audio.duration); // duration in seconds
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load audio metadata."));
      };
    } catch (err) {
      reject(err);
    }
  });
}

const AddContent = ({ open, handleClose, handleAdd, title, loading }) => {
  const { id } = useParams()
  const [data, setData] = useState({  arabic_verse: '', english_verse: "", verses_meaning: '', audio_url: '', chapter_id: id, duration: '' })
  const [errors, setErrors] = useState({ sorting_no: '', arabic_verse: '', english_verse: '', verses_meaning: '', audio_url: '', chapter_id: '', duration: '' })


  useEffect(() => {
    if (open) {
      setData({  arabic_verse: '', english_verse: "", verses_meaning: '', audio_url: '', chapter_id: id, duration: '' })
      setErrors({  arabic_verse: '', english_verse: '', verses_meaning: '', audio_url: '', chapter_id: '', duration: '' })
    }
  }, [open]);

  const handleChange = (name, value) => {

    if (name === 'audio_url' && value) {
      getMediaDuration(value).then(duration => {
        setData(prev => ({ ...prev, duration: Math.floor(duration), [name]: value }))
      }).catch(err => {
        console.error('Error getting audio duration:', err);
      });
    } else {
      setData({ ...data, [name]: value })
      setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!data.duration) newErrors.duration = 'Duration is required'
    if (!data.arabic_verse) newErrors.arabic_verse = 'Arabic verse is required'
    if (!data.english_verse) newErrors.english_verse = 'English verse is required'
    if (!data.verses_meaning) newErrors.verses_meaning = 'Verses meaning is required'
    if (!data.audio_url) newErrors.audio_url = 'Audio is required'
    if (!data.chapter_id) newErrors.chapter_id = 'Chapter is required'
    if (!data.duration) newErrors.duration = 'Duration is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    console.log(validate());

    if (validate()) {
      console.log('Submitting data:', data);

      handleAdd(data)
    }
  }
  console.log('AddContent data:', data);


  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        
        <CustomTextField
          fullWidth
          label={'Arabic Verse'}
          variant='outlined'
          value={data.arabic_verse}
          onChange={e => handleChange('arabic_verse', e.target.value)}
          placeholder={`Enter Arabic Verse`}
          className='mb-4'
          error={!!errors.arabic_verse}
          helperText={errors.arabic_verse}
        />
        <CustomTextField
          fullWidth
          label={'English Verse'}
          variant='outlined'
          value={data.english_verse}
          onChange={e => handleChange('english_verse', e.target.value)}
          placeholder={`Enter English Verse`}
          className='mb-4'
          error={!!errors.english_verse}
          helperText={errors.english_verse}
        />
        <CustomTextField
          fullWidth
          label={'Verses Meaning'}
          variant='outlined'
          value={data.verses_meaning}
          onChange={e => handleChange('verses_meaning', e.target.value)}
          placeholder={`Enter Verses Meaning`}
          className='mb-4'
          error={!!errors.verses_meaning}
          helperText={errors.verses_meaning}
          multiline
          rows={4}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          className='mb-4'
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept="audio/*"
            onChange={e => handleChange('audio_url', e.target.files[0])}
          />
        </Button>
        <CustomTextField
          fullWidth
          label={'Duration'}
          variant='outlined'
          value={`${data.duration ? data.duration + 's' : ''}`}
          disabled
          placeholder={`Audio Duration`}
          className='mb-4'
          error={!!errors.duration}
          helperText={errors.duration}
        />


      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button type='submit' variant='contained' onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, editData, handleUpdate, title , open }) => {
  console.log('EditContent editData:', editData);
  const { id } = useParams()
  const [data, setData] = useState({
    sorting_no: editData.sorting_no || '',
    arabic_verse: editData.arabic_verse || '',
    english_verse: editData.english_verse || '',
    verses_meaning: editData.verses_meaning || '',
    audio_url: editData.audio_url || '',
    chapter_id: id,
    duration: editData.duration || ''
  })
  const [errors, setErrors] = useState({ sorting_no: '', arabic_verse: '', english_verse: '', verses_meaning: '', audio_url: '', chapter_id: '', duration: '' })
  console.log('EditContent data:', data);

  useEffect(() => {
    if (open) {
      setData({
        sorting_no: editData.sorting_no || '',
        arabic_verse: editData.arabic_verse || '',
        english_verse: editData.english_verse || '',
        verses_meaning: editData.verses_meaning || '',
        audio_url: editData.audio_url || '',
        chapter_id: id,
        duration: editData.duration || ''
      })
      setErrors({ sorting_no: '', arabic_verse: '', english_verse: '', verses_meaning: '', audio_url: '', chapter_id: '', duration: '' })
    }
  }, [open]);

  const handleChange = (name, value) => {

    if (name === 'audio_url' && value) {
      getMediaDuration(value).then(duration => {
        setData(prev => ({ ...prev, duration: Math.floor(duration), [name]: value }))
      }).catch(err => {
        console.error('Error getting audio duration:', err);
      });
    } else {
      setData({ ...data, [name]: value })
      setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!data.sorting_no) newErrors.sorting_no = `${title} is required'`
    if (!data.duration) newErrors.duration = 'Duration is required'
    if (!data.english_verse) newErrors.english_verse = 'English verse is required'
    if (!data.arabic_verse) newErrors.arabic_verse = 'Arabic verse is required'
    if (!data.verses_meaning) newErrors.verses_meaning = 'Verses meaning is required'
    if (!data.audio_url) newErrors.audio_url = 'Audio is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = () => {
    if (validate()) {
      console.log('Updating data:', data);
      handleUpdate(data)

    }
  }

  return (
    <>
      <DialogContent className='scrollable-content px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          label={"Sorting Number"}
          variant='outlined'
          type='number'
          value={data.sorting_no}
          onChange={e => handleChange('sorting_no', e.target.value)}
          placeholder={`Enter Sorting Number`}
          className='mb-4'
          error={!!errors.sorting_no}
          helperText={errors.sorting_no}
        />
        <CustomTextField
          fullWidth
          label={'Arabic Verse'}
          variant='outlined'
          value={data.arabic_verse}
          onChange={e => handleChange('arabic_verse', e.target.value)}
          placeholder={`Enter Arabic Verse`}
          className='mb-4'
          error={!!errors.arabic_verse}
          helperText={errors.arabic_verse}
        />
        <CustomTextField
          fullWidth
          label={'English Verse'}
          variant='outlined'
          value={data.english_verse}
          onChange={e => handleChange('english_verse', e.target.value)}
          placeholder={`Enter English Verse`}
          className='mb-4'
          error={!!errors.english_verse}
          helperText={errors.english_verse}
        />
        <CustomTextField
          fullWidth
          label={'Verses Meaning'}
          variant='outlined'
          value={data.verses_meaning}
          onChange={e => handleChange('verses_meaning', e.target.value)}
          placeholder={`Enter Verses Meaning`}
          className='mb-4'
          error={!!errors.verses_meaning}
          helperText={errors.verses_meaning}
          multiline
          rows={4}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept="audio/*"
            onChange={e => handleChange('audio_url', e.target.files[0])}
          />
        </Button>
        {/* check data.audio is string or not */}
        {typeof data.audio_url === 'string' && <MusicPlayerSlider audioUrl={data.audio_url} />}
        <CustomTextField
          fullWidth
          label={'Duration'}
          variant='outlined'
          value={`${data.duration ? data.duration + 's' : ''}`}
          disabled
          // onChange={e => handleChange('duration', e.target.value)}
          placeholder={`Audio Duration`}
          className='mb-4'
          error={!!errors.duration}
          helperText={errors.duration}
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

const IslamQuranVerseModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
  // console.log('IslamAudio data:', data, 'title:', title);
  if (data === null) {
    console.log('IslamAudio data: ', data);
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
      {data === null ? (
        <AddContent open={open} loading={loading} handleClose={handleClose} handleAdd={handleAdd} title={title} />
      ) : (
        <EditContent open={open} handleClose={handleClose} handleUpdate={handleUpdate} editData={data} title={title} />
      )}
    </Dialog>
  )
}

export default IslamQuranVerseModal
