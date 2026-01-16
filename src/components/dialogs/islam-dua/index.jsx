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
import { CircularProgress, Menu, MenuItem, styled } from '@mui/material'
import { useParams } from 'next/navigation'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Grid } from '@mui/system'
import { CrossIcon, Trash } from 'lucide-react'
import IslamDuaCategoryService from '@/services/spritual/islamduacategory'
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
    const [data, setData] = useState({  dua_title_arabic: '', dua_title_english: '', category_id: '', english_dua: '', arabic_dua: '', reference_book: '' })
    const [errors, setErrors] = useState({ dua_title_arabic: '', dua_title_english: '', category_id: '', english_dua: '', arabic_dua: '', reference_book: '' })
    const [categoryList, setCategoryList] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await IslamDuaCategoryService.getAll()
            setCategoryList(response.data)
        })();
    }, []);

    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.dua_title_arabic) newErrors.dua_title_arabic = 'Dua title (Arabic) is required'
        if (!data.dua_title_english) newErrors.dua_title_english = 'Dua title (English) is required'
        if (!data.category_id) newErrors.category_id = 'Category is required'
        if (!data.arabic_dua) newErrors.arabic_dua = 'Arabic text is required'
        if (!data.english_dua) newErrors.english_dua = 'English text is required'
        if (!data.reference_book) newErrors.reference_book = 'Reference book is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        setSubmitLoading(true)
        console.log(validate());

        if (validate()) {
            console.log('Submitting data:', data);

            handleAdd(data)
        } else {
            setSubmitLoading(false)
        }
    }
    console.log('AddContent data:', data);


    return (
        <>
            <DialogContent className=' px-4 pt-0 sm:px-6 scrollable-content'>
                
                <CustomTextField
                    fullWidth
                    label={'Dua Title (Arabic)'}
                    variant='outlined'
                    value={data.dua_title_arabic}
                    onChange={e => handleChange('dua_title_arabic', e.target.value)}
                    placeholder={`Enter Dua Title (Arabic)`}
                    className='mb-4'
                    error={!!errors.dua_title_arabic}
                    helperText={errors.dua_title_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Dua Title (English)'}
                    variant='outlined'
                    value={data.dua_title_english}
                    onChange={e => handleChange('dua_title_english', e.target.value)}
                    placeholder={`Enter Dua Title (English)`}
                    className='mb-4'
                    error={!!errors.dua_title_english}
                    helperText={errors.dua_title_english}
                />
                <CustomTextField
                    fullWidth
                    select
                    label='Category'
                    value={data.category_id}
                    onChange={e => handleChange('category_id', e.target.value)}
                    className='mb-4'
                    error={!!errors.category_id}
                    helperText={errors.category_id}
                >
                    {categoryList.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                            {category.english_category_name} ({category.arabic_category_name})
                        </MenuItem>
                    ))}
                </CustomTextField>
                <CustomTextField
                    fullWidth
                    label={'Arabic Dua'}
                    variant='outlined'
                    value={data.arabic_dua}
                    onChange={e => handleChange('arabic_dua', e.target.value)}
                    placeholder={`Enter Arabic Dua`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.arabic_dua}
                    helperText={errors.arabic_dua}
                />
                <CustomTextField
                    fullWidth
                    label={'English Dua'}
                    variant='outlined'
                    value={data.english_dua}
                    onChange={e => handleChange('english_dua', e.target.value)}
                    placeholder={`Enter English Dua`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.english_dua}
                    helperText={errors.english_dua}
                />
                <CustomTextField
                    fullWidth
                    label={'Reference Book'}
                    variant='outlined'
                    value={data.reference_book}
                    onChange={e => handleChange('reference_book', e.target.value)}
                    placeholder={`Enter Reference Book`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.reference_book}
                    helperText={errors.reference_book}
                />

            </DialogContent>
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button startIcon={submitLoading && <CircularProgress color='inherit' size={20} />} disabled={submitLoading} type='submit' variant='contained' onClick={handleSubmit}>
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
    const [data, setData] = useState({ sorting_no: editData.sorting_no, dua_title_arabic: editData.dua_title_arabic, dua_title_english: editData.dua_title_english, category_id: editData.category_id._id, english_dua: editData.english_dua, arabic_dua: editData.arabic_dua, reference_book: editData.reference_book })
    const [errors, setErrors] = useState({ sorting_no: '', dua_title_arabic: '', dua_title_english: '', category_id: '', english_dua: '', arabic_dua: '', reference_book: '' })
    const [categoryList, setCategoryList] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    useEffect(() => {
        (async () => {
            const response = await IslamDuaCategoryService.getAll()
            setCategoryList(response.data)
        })();
    }, []);

    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.sorting_no) newErrors.sorting_no = `Sorting number is required`
        if (!data.dua_title_arabic) newErrors.dua_title_arabic = 'Dua title (Arabic) is required'
        if (!data.dua_title_english) newErrors.dua_title_english = 'Dua title (English) is required'
        if (!data.category_id) newErrors.category_id = 'Category is required'
        if (!data.arabic_dua) newErrors.arabic_dua = 'Arabic text is required'
        if (!data.english_dua) newErrors.english_dua = 'English text is required'
        if (!data.reference_book) newErrors.reference_book = 'Reference book is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = () => {
        setSubmitLoading(true)
        if (validate()) {
            console.log('Updating data:', data);
            handleUpdate(data)

        } else {
            setSubmitLoading(false)
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
                    label={'Dua Title (Arabic)'}
                    variant='outlined'
                    value={data.dua_title_arabic}
                    onChange={e => handleChange('dua_title_arabic', e.target.value)}
                    placeholder={`Enter Dua Title (Arabic)`}
                    className='mb-4'
                    error={!!errors.dua_title_arabic}
                    helperText={errors.dua_title_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Dua Title (English)'}
                    variant='outlined'
                    value={data.dua_title_english}
                    onChange={e => handleChange('dua_title_english', e.target.value)}
                    placeholder={`Enter Dua Title (English)`}
                    className='mb-4'
                    error={!!errors.dua_title_english}
                    helperText={errors.dua_title_english}
                />
                <CustomTextField
                    fullWidth
                    select
                    label='Category'
                    value={data.category_id}
                    onChange={e => handleChange('category_id', e.target.value)}
                    className='mb-4'
                    error={!!errors.category_id}
                    helperText={errors.category_id}
                >
                    {categoryList.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                            {category.english_category_name} ({category.arabic_category_name})
                        </MenuItem>
                    ))}
                </CustomTextField>
                <CustomTextField
                    fullWidth
                    label={'Arabic Dua'}
                    variant='outlined'
                    value={data.arabic_dua}
                    onChange={e => handleChange('arabic_dua', e.target.value)}
                    placeholder={`Enter Arabic Dua`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.arabic_dua}
                    helperText={errors.arabic_dua}
                />
                <CustomTextField
                    fullWidth
                    label={'English Dua'}
                    variant='outlined'
                    value={data.english_dua}
                    onChange={e => handleChange('english_dua', e.target.value)}
                    placeholder={`Enter English Dua`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.english_dua}
                    helperText={errors.english_dua}
                />
                <CustomTextField
                    fullWidth
                    label={'Reference Book'}
                    variant='outlined'
                    value={data.reference_book}
                    onChange={e => handleChange('reference_book', e.target.value)}
                    placeholder={`Enter Reference Book`}
                    className='mb-4'
                    multiline
                    rows={4}
                    error={!!errors.reference_book}
                    helperText={errors.reference_book}
                />

            </DialogContent>
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button disabled={submitLoading} startIcon={submitLoading && <CircularProgress color='inherit' size={20} />} variant='contained' onClick={handleSubmit}>
                    Update
                </Button>
                <Button variant='outlined' onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

const IslamDuaModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
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

export default IslamDuaModal
