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
import { Menu, MenuItem, styled } from '@mui/material'
import { useParams } from 'next/navigation'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Grid } from '@mui/system'
import { CrossIcon, Trash } from 'lucide-react'
import IslamDuaCategoryService from '@/services/spritual/islamduacategory'


const AddContent = ({ open, handleClose, handleAdd, title, loading }) => {
    const [data, setData] = useState({ name_arabic:'', name_english:'', meaning:'' , benefits:'' })
    const [errors, setErrors] = useState({ name_arabic: '', name_english: '', meaning: '', benefits: '' })


    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.name_arabic) newErrors.name_arabic = 'Name (Arabic) is required'
        if (!data.name_english) newErrors.name_english = 'Name (English) is required'
        if (!data.meaning) newErrors.meaning = 'Meaning is required'
        if (!data.benefits) newErrors.benefits = 'Benefits are required'
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
            <DialogContent className=' px-4 pt-0 sm:px-6 scrollable-content'>
                
                <CustomTextField
                    fullWidth
                    label={'Name (Arabic)'}
                    variant='outlined'
                    value={data.name_arabic}
                    onChange={e => handleChange('name_arabic', e.target.value)}
                    placeholder={`Enter Name (Arabic)`}
                    className='mb-4'
                    error={!!errors.name_arabic}
                    helperText={errors.name_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Name (English)'}
                    variant='outlined'
                    value={data.name_english}
                    onChange={e => handleChange('name_english', e.target.value)}
                    placeholder={`Enter Name (English)`}
                    className='mb-4'
                    error={!!errors.name_english}
                    helperText={errors.name_english}
                />
                
                <CustomTextField
                    fullWidth
                    label={'Meaning'}
                    variant='outlined'
                    value={data.meaning}
                    onChange={e => handleChange('meaning', e.target.value)}
                    placeholder={`Enter Meaning`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.meaning}
                    helperText={errors.meaning}
                />
                <CustomTextField
                    fullWidth
                    label={'Benefits'}
                    variant='outlined'
                    value={data.benefits}
                    onChange={e => handleChange('benefits', e.target.value)}
                    placeholder={`Enter Benefits`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.benefits}
                    helperText={errors.benefits}
                />
                
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

const EditContent = ({ handleClose, editData, handleUpdate, title, open }) => {
    console.log('EditContent editData:', editData);
     const [data, setData] = useState({ sorting_no: editData.sorting_no, name_arabic: editData.name_arabic, name_english: editData.name_english, meaning: editData.meaning, benefits: editData.benefits })
    const [errors, setErrors] = useState({ sorting_no: '', name_arabic: '', name_english: '', meaning: '', benefits: '' })



    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.sorting_no) newErrors.sorting_no = `Sorting number is required`
        if (!data.name_arabic) newErrors.name_arabic = 'Name (Arabic) is required'
        if (!data.name_english) newErrors.name_english = 'Name (English) is required'
        if (!data.meaning) newErrors.meaning = 'Meaning is required'
        if (!data.benefits) newErrors.benefits = 'Benefits are required'
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
                    value={data.sorting_no}
                    type='number'
                    onChange={e => handleChange('sorting_no', e.target.value)}
                    placeholder={`Enter Sorting Number`}
                    className='mb-4'
                    error={!!errors.sorting_no}
                    helperText={errors.sorting_no}
                />
                <CustomTextField
                    fullWidth
                    label={'Name (Arabic)'}
                    variant='outlined'
                    value={data.name_arabic}
                    onChange={e => handleChange('name_arabic', e.target.value)}
                    placeholder={`Enter Name (Arabic)`}
                    className='mb-4'
                    error={!!errors.name_arabic}
                    helperText={errors.name_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Name (English)'}
                    variant='outlined'
                    value={data.name_english}
                    onChange={e => handleChange('name_english', e.target.value)}
                    placeholder={`Enter Name (English)`}
                    className='mb-4'
                    error={!!errors.name_english}
                    helperText={errors.name_english}
                />
                
                <CustomTextField
                    fullWidth
                    label={'Meaning'}
                    variant='outlined'
                    value={data.meaning}
                    onChange={e => handleChange('meaning', e.target.value)}
                    placeholder={`Enter Meaning`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.meaning}
                    helperText={errors.meaning}
                />
                <CustomTextField
                    fullWidth
                    label={'Benefits'}
                    variant='outlined'
                    value={data.benefits}
                    onChange={e => handleChange('benefits', e.target.value)}
                    placeholder={`Enter Benefits`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.benefits}
                    helperText={errors.benefits}
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

const AllahNameModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
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

export default AllahNameModal
