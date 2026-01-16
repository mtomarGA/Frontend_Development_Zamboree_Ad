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
import { MenuItem } from '@mui/material'
import HinduService from '@/services/spritual/hinduService'
import { set } from 'date-fns'
import SikhService from '@/services/spritual/sikhService'

const AddContent = ({ handleClose, handleAdd, title }) => {
  const [data, setData] = useState({ embeddedLink: '', gurudwara: '', title: '', status: 'ACTIVE' })
  const [errors, setErrors] = useState({ embeddedLink: '', gurudwara: '', title: '' })
  const [gurudwaraData, setGurudwaraData] = useState()
  const [loading, setLoading] = useState(true)
  console.log('gurudwaraData', gurudwaraData);



  const handleChange = (name, value) => {
    setData({ ...data, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!data.gurudwara) newErrors.gurudwara = `${title} gurudwara is required'`
    if (!data.embeddedLink) newErrors.embeddedLink = `${title} embed link is required'`
    if (!data.title) newErrors.title = `${title} title is required'`
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('Submitting data:', data);

      handleAdd(data)
    }
  }
  useEffect(() => {
    const fetchGurudwaras = async () => {
      setLoading(true)
      const gurudwaraData = await SikhService.getAllGurudwaraList();
      //set only name and _id from gurudwaraData
      const formattedData = gurudwaraData.data.map(gurudwara => ({
        label: gurudwara.name,
        value: gurudwara._id
      }))
      setGurudwaraData(formattedData)
      setLoading(false)
    }
    fetchGurudwaras()
  }, [])

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-0 sm:px-6'>
        {/* create a select */}
        <CustomTextField
          fullWidth
          select
          label='Gurudwara'
          value={data.gurudwara || ''}
          onChange={e => handleChange('gurudwara', e.target.value)}
          className='mb-4'
          error={!!errors.gurudwara}
          helperText={errors.gurudwara}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: selected => {
                if (selected === '') {
                  return <p>Select Gurudwara</p>
                }
                const selectedItem = gurudwaraData.find(item => item.value === selected)
                return selectedItem ? selectedItem.label : ''
              }
            }
          }}
        >
          {loading ? (
            <MenuItem disabled>Loading gurudwaras...</MenuItem>
          ) : (
            gurudwaraData.map(gurudwara => (
              <MenuItem key={gurudwara.value} value={gurudwara.value}>
                {gurudwara.label}
              </MenuItem>
            ))
          )}
        </CustomTextField>

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
  const [editData, setEditData] = useState({embeddedLink: data.embeddedLink, gurudwara: data.gurudwara._id, title: data.title, status: data.status}) 
  const [errors, setErrors] = useState({ embeddedLink: '', gurudwara: '', title: '' })
  const [gurudwaraData, setGurudwaraData] = useState()
  const [loading, setLoading] = useState(true)
  console.log('gurudwaraData', gurudwaraData);



  const handleChange = (name, value) => {
    setEditData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' })) // clear error
  }

  const validate = () => {
    const newErrors = {}
    if (!editData.gurudwara) newErrors.gurudwara = `${title} gurudwara is required'`
    if (!editData.embeddedLink) newErrors.embeddedLink = `${title} embed link is required'`
    if (!editData.title) newErrors.title = `${title} title is required'`
    setErrors(newErrors)
    console.log('newErrors', newErrors);
    
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    const fetchGurudwaras = async () => {
      setLoading(true)
      const gurudwaraData = await SikhService.getAllGurudwaraList();
      //set only name and _id from gurudwaraData
      const formattedData = gurudwaraData.data.map(gurudwara => ({
        label: gurudwara.name,
        value: gurudwara._id
      }))
      setGurudwaraData(formattedData)
      setLoading(false)
    }
    fetchGurudwaras()
  }, [])

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
          select
          label='Gurudwara'
          value={editData.gurudwara}
          onChange={e => handleChange('gurudwara', e.target.value)}
          className='mb-4'
          error={!!errors.gurudwara}
          helperText={errors.gurudwara}

        >
          {loading ? (
            <MenuItem disabled>Loading gurudwaras...</MenuItem>
          ) : (
            gurudwaraData.map(gurudwara => (
              <MenuItem key={gurudwara.value} value={gurudwara.value}>
                {gurudwara.label}
              </MenuItem>
            ))
          )}
        </CustomTextField>

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

const SikhLiveDarshanModal = ({ open, data, handleUpdate, handleAdd, handleClose, title }) => {


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

export default SikhLiveDarshanModal
