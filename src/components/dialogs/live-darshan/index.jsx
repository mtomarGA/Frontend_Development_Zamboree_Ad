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
import BuddhismService from '@/services/spritual/buddhaService'
import JainService from '@/services/spritual/jainService'
import ChristService from '@/services/spritual/christService'
import spritualServices from '@/services/posts/spritual.service'
import FileUploader from '@/components/FileUploader'


const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const AddContent = ({ handleClose, handleAdd, title, serviceName, folderName }) => {
  const [data, setData] = useState({ embeddedLink: '', temple: '', title: '', status: 'ACTIVE', web_image: '', mobile_image: '' })
  const [errors, setErrors] = useState({ embeddedLink: '', temple: '', title: '', web_image: '', mobile_image: '' })
  const [templeData, setTempleData] = useState()
  const [loading, setLoading] = useState(true)
  console.log('templeData', templeData);

  const [templeDetails, setTempleDetails] = useState([])
  const [inputValue, setInputValue] = useState('')



  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!data.temple) newErrors.temple = `${title} temple is required'`
    if (!data.embeddedLink) newErrors.embeddedLink = `${title} embed link is required'`
    if (!data.title) newErrors.title = `${title} title is required'`
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    setLoading(true)
    if (validate()) {
      console.log('Submitting data:', data);

      handleAdd(data)
    } else {
      setLoading(false)
    }
  }
  const fetchTemples = async (query) => {
    setLoading(true)
    let templeData;
    switch (serviceName) {
      case 'Jainism':
        templeData = await spritualServices.SearchJain(query);
        break;
      // Add cases for other services if needed
      case 'Buddhism':
        templeData = await spritualServices.SearchChaitya(query);
        break;
      case 'Sikhism':
        templeData = await spritualServices.SearchGurudwara(query);
        break;
      case 'Christian':
        templeData = await spritualServices.SearchChurch(query);
        break;
      default:
        templeData = [];
        break;
    }
    //set only name and _id from templeData
    setTempleDetails(templeData.data)

    setLoading(false)
  }
  // useEffect(() => {

  //   fetchTemples()
  // }, [])

  const debouncedSearch = useCallback(debounce(fetchTemples, 500), [])

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6 '>
        {/* create a select */}
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

        {['web_image', 'mobile_image'].map((imageType) => (
          <FileUploader
            key={imageType}
            label={imageType === 'web_image' ? 'Web Image' : 'Mobile Image'}
            initialFile={data[imageType]}
            error_text={errors[imageType]}
            name={imageType}
            folderName={folderName}
            cropSize={{ width: 800, height: 600 }}
            onFileSelect={(e) => handleChange(e.target.name, e.target.value)}
          />
        ))}

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
        <Button disabled={loading} type='submit' variant='contained' onClick={handleSubmit}>
          Create
        </Button>
        <Button onClick={handleClose} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate, title, serviceName, folderName }) => {
  const [editData, setEditData] = useState({ embeddedLink: data.embeddedLink, temple: serviceName === 'Sikhism' ? data.gurudwara._id : data.temple.temple_id, title: data.title, status: data.status, web_image: data.web_image, mobile_image: data.mobile_image })
  const [errors, setErrors] = useState({ embeddedLink: '', temple: '', title: '', web_image: '', mobile_image: '' })
  const [templeData, setTempleData] = useState()
  const [loading, setLoading] = useState(true)
  console.log('templeData', templeData);

  const [templeDetails, setTempleDetails] = useState([])
  const [inputValue, setInputValue] = useState('')



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

  const fetchTemples = async (query) => {
    setLoading(true)
    let templeData;
    switch (serviceName) {
      case 'Jainism':
        templeData = await spritualServices.SearchJain(query);
        break;
      // Add cases for other services if needed
      case 'Buddhism':
        templeData = await spritualServices.SearchChaitya(query);
        break;
      case 'Sikhism':
        templeData = await spritualServices.SearchGurudwara(query);
        break;
      case 'Christian':
        templeData = await spritualServices.SearchChurch(query);
        break;
      default:
        templeData = [];
        break;
    }
    //set only name and _id from templeData
    setTempleDetails(templeData.data)

    setLoading(false)
  }

  useEffect(() => {

    fetchTemples(serviceName === "Sikhism" ? data.gurudwara.gurudwara_id : data.temple.temple_id)
  }, [])
  const debouncedSearch = useCallback(debounce(fetchTemples, 500), [])

  const handleSubmit = () => {
    setLoading(true)
    if (validate()) {
      console.log('Updating data:', editData);
      handleUpdate(editData)
    } else {
      setLoading(false)
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

        {['web_image', 'mobile_image'].map((imageType) => (
          <FileUploader
            key={imageType}
            label={imageType === 'web_image' ? 'Web Image' : 'Mobile Image'}
            initialFile={data[imageType]}
            error_text={errors[imageType]}
            name={imageType}
            folderName={folderName}
            cropSize={{ width: 800, height: 600 }}
            onFileSelect={(e) => handleChange(e.target.name, e.target.value)}
          />
        ))}

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
        <Button disabled={loading} variant='contained' onClick={handleSubmit}>
          Update
        </Button>
        <Button variant='outlined' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const LiveDarshanModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, serviceName, folderName="Other" }) => {


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
        <EditContent scrollable handleClose={handleClose} handleUpdate={handleUpdate} data={data} title={title} serviceName={serviceName} folderName={folderName} />
      ) : (
        <AddContent scrollable handleClose={handleClose} handleAdd={handleAdd} title={title} serviceName={serviceName} folderName={folderName} />
      )}
    </Dialog>
  )
}

export default LiveDarshanModal
