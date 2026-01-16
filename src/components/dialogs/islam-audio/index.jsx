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
import { Menu, MenuItem, styled } from '@mui/material'
import FileUploader from './FileUploader'
import ImageService from '@/services/imageService'
import { useParams } from 'next/navigation'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MusicPlayerSlider from '@/views/apps/spritual/components/MusicPlayer'

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

const AddContent = ({ handleClose, handleAdd, title, loading }) => {
  const { id } = useParams()
  const [data, setData] = useState({  duration: '', sura_name: '', reciter_id: id, revealed_place: '', audio: '' })
  const [errors, setErrors] = useState({  duration: '', sura_name: '', reciter_id: '', revealed_place: '', audio: '' })




  const handleChange = (name, value) => {

    if (name === 'audio' && value) {
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
    if (!data.sura_name) newErrors.sura_name = 'Sura name is required'
    if (!data.revealed_place) newErrors.revealed_place = 'Revealed place is required'
    if (!data.audio) newErrors.audio = 'Audio is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const revealedPlaces = [
    "mecca",
    "medina"
  ]

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
          label={title}
          variant='outlined'
          value={data.sura_name}
          onChange={e => handleChange('sura_name', e.target.value)}
          placeholder={`Enter Sura Name`}
          className='mb-4'
          error={!!errors.sura_name}
          helperText={errors.sura_name}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          className='mb-4'
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept="audio/*"
            onChange={e => handleChange('audio', e.target.files[0])}
          />
        </Button>
        {data.audio instanceof File && <MusicPlayerSlider audioUrl={URL.createObjectURL(data.audio)} />}
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

        <CustomTextField
          fullWidth
          select
          label={'Revealed Place'}
          value={data.revealed_place}
          onChange={e => handleChange('revealed_place', e.target.value)}
          className='mb-4'
          error={!!errors.revealed_place}
          helperText={errors.revealed_place}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: selected => {
                if (selected === '') {
                  return <p>Select Revealed Place</p>
                }
                const selectedItem = revealedPlaces.find(item => item === selected)
                return selectedItem ? selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1) : ''
              }
            }
          }}
        >
          {revealedPlaces.map((place, index) => (
            <MenuItem key={index} value={place}>{place.charAt(0).toUpperCase() + place.slice(1)}</MenuItem>
          ))}
        </CustomTextField>


      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button type='submit' variant='contained' onClick={handleSubmit} disabled={loading}>
          Create
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, editData, handleUpdate, title }) => {
  console.log('EditContent editData:', editData);
  const { id } = useParams()
  const [data, setData] = useState({ sura_number: editData.sura_number, duration: editData.duration, sura_name: editData.sura_name, reciter_id: id, revealed_place: editData.revealed_place, audio: editData.audio })
  const [errors, setErrors] = useState({ sura_number: '', duration: '', sura_name: '', reciter_id: '', revealed_place: '', audio: '' })
  console.log('EditContent data:', data);


  const handleChange = (name, value) => {

    if (name === 'audio' && value) {
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
    if (!data.sura_number) newErrors.sura_number = `${title} is required'`
    if (!data.duration) newErrors.duration = 'Duration is required'
    if (!data.sura_name) newErrors.sura_name = 'Sura name is required'
    if (!data.revealed_place) newErrors.revealed_place = 'Revealed place is required'
    if (!data.audio) newErrors.audio = 'Audio is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const revealedPlaces = [
    "mecca",
    "medina"
  ]


  const handleSubmit = () => {
    if (validate()) {
      console.log('Updating data:', data);
      handleUpdate(data)

    }
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <CustomTextField
          fullWidth
          label={title}
          variant='outlined'
          value={data.sura_name}
          onChange={e => handleChange('sura_name', e.target.value)}
          placeholder={`Enter Sura Name`}
          className='mb-4'
          error={!!errors.sura_name}
          helperText={errors.sura_name}
        />
        <CustomTextField
          fullWidth
          label={'Sura Number'}
          variant='outlined'
          type='number'
          value={data.sura_number}
          onChange={e => handleChange('sura_number', e.target.value)}
          placeholder={`Enter Sura Number`}
          className='mb-4'
          error={!!errors.sura_number}
          helperText={errors.sura_number}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          className='mb-4'
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept="audio/*"
            onChange={e => handleChange('audio', e.target.files[0])}
          />
        </Button>
        {/* check data.audio is string or not */}
        {typeof data.audio === 'string' && <MusicPlayerSlider audioUrl={data.audio} />}
        {data.audio instanceof File && <MusicPlayerSlider audioUrl={URL.createObjectURL(data.audio)} />}
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

        <CustomTextField
          fullWidth
          select
          label={'Revealed Place'}
          value={data.revealed_place}
          onChange={e => handleChange('revealed_place', e.target.value)}
          className='mb-4'
          error={!!errors.revealed_place}
          helperText={errors.revealed_place}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: selected => {
                if (selected === '') {
                  return <p>Select Revealed Place</p>
                }
                const selectedItem = revealedPlaces.find(item => item === selected)
                return selectedItem ? selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1) : ''
              }
            }
          }}
        >
          {revealedPlaces.map((place, index) => (
            <MenuItem key={index} value={place}>{place.charAt(0).toUpperCase() + place.slice(1)}</MenuItem>
          ))}
        </CustomTextField>

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

const IslamAudioModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
  // console.log('IslamAudio data:', data, 'title:', title);
  if (data) {
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
      {data ? (
        <EditContent handleClose={handleClose} handleUpdate={handleUpdate} editData={data} title={title} />
      ) : (
        <AddContent loading={loading} handleClose={handleClose} handleAdd={handleAdd} title={title} />
      )}
    </Dialog>
  )
}

export default IslamAudioModal
