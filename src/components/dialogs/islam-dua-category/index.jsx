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
import { styled } from '@mui/material'
import { useParams } from 'next/navigation'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Grid } from '@mui/system'
import { CrossIcon, Trash } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
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


const AddContent = ({ open, handleClose, handleAdd, title, loading }) => {
    const [data, setData] = useState({ arabic_category_name: '', english_category_name: '', web_image: '', mobile_image: '' })
    const [errors, setErrors] = useState({ arabic_category_name: '', english_category_name: '', web_image: '', mobile_image: '' })


    const handleChange = (name, value) => {

        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.arabic_category_name) newErrors.arabic_category_name = 'Arabic category name is required'
        if (!data.english_category_name) newErrors.english_category_name = 'English category name is required'
        if (!data.web_image) newErrors.web_image = 'Web image is required'
        if (!data.mobile_image) newErrors.mobile_image = 'Mobile image is required'
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
                    label={'Arabic Category Name'}
                    variant='outlined'
                    value={data.arabic_category_name}
                    onChange={e => handleChange('arabic_category_name', e.target.value)}
                    placeholder={`Enter Arabic Category Name`}
                    className='mb-4'
                    error={!!errors.arabic_category_name}
                    helperText={errors.arabic_category_name}
                />
                <CustomTextField
                    fullWidth
                    label={'English Category Name'}
                    variant='outlined'
                    value={data.english_category_name}
                    onChange={e => handleChange('english_category_name', e.target.value)}
                    placeholder={`Enter English Category Name`}
                    className='mb-4'
                    error={!!errors.english_category_name}
                    helperText={errors.english_category_name}
                />
                {['web_image', 'mobile_image'].map((field, index) => (
                    <FileUploader key={index} acceptedFiles={['image/*']} error_text={errors[field]} initialFile={data[field]} label={field.replace('_', ' ').replace('image', 'Image')} name={field} onFileSelect={e => handleChange(field, e.target.value)} cropSize={{ width: 800, height: 600 }} />
                ))}
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
    const { id } = useParams()
    const [data, setData] = useState({
        sorting_no: editData.sorting_no || '',
        arabic_category_name: editData.arabic_category_name || '',
        english_category_name: editData.english_category_name || '',
        web_image: editData.web_image || '',
        mobile_image: editData.mobile_image || '',
    })
    const [errors, setErrors] = useState({ sorting_no: '', arabic_category_name: '', english_category_name: '', web_image: '', mobile_image: '' })
    console.log('EditContent data:', data);

    useEffect(() => {
        if (open) {
            setData({
                sorting_no: editData.sorting_no || '',
                arabic_category_name: editData.arabic_category_name || '',
                english_category_name: editData.english_category_name || '',
                web_image: editData.web_image || '',
                mobile_image: editData.mobile_image || '',
            })
            setErrors({ sorting_no: '', arabic_category_name: '', english_category_name: '', web_image: '', mobile_image: '' })
        }
    }, [open]);

    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.sorting_no) newErrors.sorting_no = `Sorting number is required`
        if (!data.english_category_name) newErrors.english_category_name = 'English category name is required'
        if (!data.arabic_category_name) newErrors.arabic_category_name = 'Arabic category name is required'
        if (!data.web_image) newErrors.web_image = 'Web image is required'
        if (!data.mobile_image) newErrors.mobile_image = 'Mobile image is required'
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
                    label={'Arabic Category Name'}
                    variant='outlined'
                    value={data.arabic_category_name}
                    onChange={e => handleChange('arabic_category_name', e.target.value)}
                    placeholder={`Enter Arabic Category Name`}
                    className='mb-4'
                    error={!!errors.arabic_category_name}
                    helperText={errors.arabic_category_name}
                />
                <CustomTextField
                    fullWidth
                    label={'English Category Name'}
                    variant='outlined'
                    value={data.english_category_name}
                    onChange={e => handleChange('english_category_name', e.target.value)}
                    placeholder={`Enter English Category Name`}
                    className='mb-4'
                    error={!!errors.english_category_name}
                    helperText={errors.english_category_name}
                />

                {['web_image', 'mobile_image'].map((field, index) => (
                    <FileUploader key={index} acceptedFiles={['image/*']} error_text={errors[field]} initialFile={data[field]} label={field.replace('_', ' ').replace('image', 'Image')} name={field} onFileSelect={e => handleChange(field, e.target.value)} cropSize={{ width: 800, height: 600 }} />
                ))}


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

const IslamDuaCategoryModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
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

export default IslamDuaCategoryModal
