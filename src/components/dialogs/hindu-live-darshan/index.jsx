// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useCallback, useEffect, useState } from 'react'
import { Autocomplete, MenuItem } from '@mui/material'
import HinduService from '@/services/spritual/hinduService'
import FileUploader from '@/components/FileUploader'
import spritualServices from '@/services/posts/spritual.service'


const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const AddContent = ({ handleClose, handleAdd, title }) => {
  const [data, setData] = useState({ embeddedLink: '', temple: '', title: '', web_image: '', mobile_image: '', status: 'ACTIVE' })
  const [errors, setErrors] = useState({ embeddedLink: '', temple: '', title: '' })
  const [templeData, setTempleData] = useState()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  console.log('templeData', templeData);



  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!data.temple) newErrors.temple = `${title} temple is required'`
    if (!data.embeddedLink) newErrors.embeddedLink = `${title} embed link is required'`
    if (!data.title) newErrors.title = `${title} title is required'`
    if (!data.web_image) newErrors.web_image = `${title} web image is required'`
    if (!data.mobile_image) newErrors.mobile_image = `${title} mobile image is required'`
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    setSubmitLoading(true)
    if (validate()) {
      console.log('Submitting data:', data);

      handleAdd(data)
    } else {
      setSubmitLoading(false)
    }
  }
  useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true)
      const templeData = await HinduService.getAllTempleList();
      //set only name and _id from templeData
      const formattedData = templeData.data.map(temple => ({
        label: temple.name,
        value: temple._id
      }))
      setTempleData(formattedData)
      setLoading(false)
    }
    fetchTemples()
  }, [])
  const [templeDetails, setTempleDetails] = useState([])
  const [inputValue, setInputValue] = useState('')

  const temple_search = async (query) => {
    if (!query) {
      setTempleDetails([]);
      return;
    }
    if (query.length < 3) {
      setTempleDetails([]);
      setErrors(prev => ({ ...prev, temple: 'Please type at least 3 characters' }));
      return;
    }
    const results = await spritualServices.searchHinduTabmple(query);
    setTempleDetails(results.data);
  }
  const debouncedSearch = useCallback(debounce(temple_search, 500), [])

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>

        <Autocomplete
          options={templeDetails}
          filterOptions={(x) => x}
          className='mb-4'
          getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name}` || option._id || ''}
          value={templeDetails.find(b => b._id === data.temple) || null}
          onChange={(e, newVal) => setData(prev => ({ ...prev, temple: newVal?._id || '' }))}
          inputValue={inputValue}
          onInputChange={(e, newInputValue, reason) => {
            setInputValue(newInputValue)
            if (reason === 'input') {
              setErrors(prev => ({ ...prev, temple: '' }))
              debouncedSearch(newInputValue)
            }
          }}
          renderInput={(params) => <CustomTextField {...params} label="Search Temple" placeholder="Type at least 3 characters" error={Boolean(errors.temple)} helperText={errors.temple} />}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.name}
            </li>
          )}
          noOptionsText={inputValue.length < 3 ? "Type at least 3 characters to search" : "No temples found"}
        />

        <CustomTextField
          fullWidth
          label={`${title} embedded link`}
          variant='outlined'
          value={data.embeddedLink}
          onChange={e => handleChange('embeddedLink', e.target.value)}
          placeholder={`Enter ${title} embedded link`}
          className='mb-4'
          error={!!errors.embeddedLink}
          helperText={errors.embeddedLink}
        />
        {['web_image', 'mobile_image'].map((imageType) => (
          <FileUploader
            key={imageType}
            label={imageType === 'web_image' ? 'Web Image' : 'Mobile Image'}
            initialFile={data[imageType]}
            error_text={errors[imageType]}
            name={imageType}
            cropSize={{ width: 800, height: 600 }}
            onFileSelect={(e) => handleChange(e.target.name, e.target.value)}
          />
        ))}
        <CustomTextField
          fullWidth
          label={`Enter Title`}
          variant='outlined'
          value={data.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder={`Enter ${title} title`}
          className='mb-4'
          error={!!errors.title}
          helperText={errors.title}
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
        <Button type='submit' disabled={submitLoading} variant='contained' onClick={handleSubmit}>
          Create
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate, title , folderName}) => {
  const [editData, setEditData] = useState({ embeddedLink: data.embeddedLink, temple: data.temple._id, title: data.title, status: data.status, web_image: data.web_image, mobile_image: data.mobile_image })
  const [errors, setErrors] = useState({ embeddedLink: '', temple: '', title: '', web_image: '', mobile_image: '' })
  const [templeData, setTempleData] = useState()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  console.log('templeData', templeData);

  const [templeDetails, setTempleDetails] = useState([])
  const [inputValue, setInputValue] = useState('')

  const temple_search = async (query) => {
    if (!query) {
      setTempleDetails([]);
      return;
    }
    if (query.length < 3) {
      setTempleDetails([]);
      setErrors(prev => ({ ...prev, temple: 'Please type at least 3 characters' }));
      return;
    }
    const results = await spritualServices.searchHinduTabmple(query);
    setTempleDetails(results.data);
  }
  const debouncedSearch = useCallback(debounce(temple_search, 500), [])


  const handleChange = (name, value) => {
    setEditData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!editData.temple) newErrors.temple = `${title} temple is required'`
    if (!editData.embeddedLink) newErrors.embeddedLink = `${title} embed link is required'`
    if (!editData.title) newErrors.title = `${title} title is required'`
    if (!editData.web_image) newErrors.web_image = `${title} web image is required'`
    if (!editData.mobile_image) newErrors.mobile_image = `${title} mobile image is required'`
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const fetchSelectedTemple = async () => {
      if (editData.temple) {
        try {
          const results = await spritualServices.searchHinduTabmple(data.temple?.temple_id);
          if (results?.data?.length > 0) {
            setTempleDetails(results.data);
            // pre-fill inputValue with the temple name
            setInputValue(results.data[0].name);
          }
        } catch (error) {
          console.error("Failed to fetch temple for edit:", error);
        }
      }
    };
    fetchSelectedTemple();
  }, [editData.temple]);


  const handleSubmit = () => {
    setSubmitLoading(true)
    if (validate()) {
      console.log('Updating data:', editData);
      handleUpdate(editData)

    } else {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        <Autocomplete
          options={templeDetails}
          filterOptions={(x) => x}
          className='mb-4'
          getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name}` || option._id || ''}
          value={templeDetails.find(b => b._id === editData.temple) || null}
          onChange={(e, newVal) => setData(prev => ({ ...prev, temple: newVal?._id || '' }))}
          inputValue={inputValue}
          onInputChange={(e, newInputValue, reason) => {
            setInputValue(newInputValue)
            if (reason === 'input') {
              setErrors(prev => ({ ...prev, temple: '' }))
              debouncedSearch(newInputValue)
            }
          }}
          renderInput={(params) => <CustomTextField {...params} label="Search Temple" placeholder="Type at least 3 characters" error={Boolean(errors.temple)} helperText={errors.temple} />}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.name}
            </li>
          )}
          noOptionsText={inputValue.length < 3 ? "Type at least 3 characters to search" : "No temples found"}
        />


        <CustomTextField
          fullWidth
          label={`${title} embedded link`}
          variant='outlined'
          value={editData.embeddedLink}
          onChange={e => handleChange('embeddedLink', e.target.value)}
          placeholder={`Enter ${title} embedded link`}
          className='mb-4'
          error={!!errors.embeddedLink}
          helperText={errors.embeddedLink}
        />
        {['web_image', 'mobile_image'].map((imageType) => (
          <FileUploader
            key={imageType}
            label={imageType === 'web_image' ? 'Web Image' : 'Mobile Image'}
            initialFile={data[imageType]}
            error_text={errors[imageType]}
            folderName={folderName}
            name={imageType}
            cropSize={{ width: 800, height: 600 }}
            onFileSelect={(e) => handleChange(e.target.name, e.target.value)}
          />
        ))}

        <CustomTextField
          fullWidth
          label={`Enter Title`}
          variant='outlined'
          value={editData.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder={`Enter ${title} title`}
          className='mb-4'
          error={!!errors.title}
          helperText={errors.title}
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
        <Button disabled={submitLoading} variant='contained' onClick={handleSubmit}>
          Update
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const HinduLiveDarshanModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, folderName="Other" }) => {


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      scroll='body'
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

export default HinduLiveDarshanModal
