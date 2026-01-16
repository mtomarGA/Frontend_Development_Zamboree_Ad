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
import { CircularProgress, Menu, MenuItem, styled, Typography } from '@mui/material'
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

const AddContent = ({ handleClose, handleAdd, title }) => {
    const [data, setData] = useState({ dikhr_name_arabic: '', dikhr_name_english: '', dikhr_meaning: '', audio_url: null })
    const [errors, setErrors] = useState({ dikhr_name_arabic: '', dikhr_name_english: '', dikhr_meaning: '', audio_url: '' })
    const [loading, setLoading] = useState(false)



    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.dikhr_name_arabic.trim()) newErrors.dikhr_name_arabic = 'Arabic name is required'
        if (!data.dikhr_name_english.trim()) newErrors.dikhr_name_english = 'English name is required'
        if (!data.dikhr_meaning.trim()) newErrors.dikhr_meaning = 'Meaning is required'
        if (!data.audio_url) newErrors.audio_url = 'Audio is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async () => {
        setLoading(true);
        console.log(validate());

        if (validate()) {
            console.log('Submitting data:', data);

            await handleAdd(data)
        }
        setLoading(false);
    }


    return (
        <>
            <DialogContent className='px-4 pt-0 sm:px-6 scrollable-content'>
                
                <CustomTextField
                    fullWidth
                    label={'Dikhr Name Arabic'}
                    variant='outlined'
                    value={data.dikhr_name_arabic}
                    onChange={e => handleChange('dikhr_name_arabic', e.target.value)}
                    placeholder={`Enter Dikhr Name Arabic`}
                    className='mb-4'
                    error={!!errors.dikhr_name_arabic}
                    helperText={errors.dikhr_name_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Dikhr Name English'}
                    variant='outlined'
                    value={data.dikhr_name_english}
                    onChange={e => handleChange('dikhr_name_english', e.target.value)}
                    placeholder={`Enter Dikhr Name English`}
                    className='mb-4'
                    error={!!errors.dikhr_name_english}
                    helperText={errors.dikhr_name_english}
                />
                <CustomTextField
                    fullWidth
                    label={'Dikhr Meaning'}
                    variant='outlined'
                    value={data.dikhr_meaning}
                    onChange={e => handleChange('dikhr_meaning', e.target.value)}
                    placeholder={`Enter Dikhr Meaning`}
                    className='mb-4'
                    error={!!errors.dikhr_meaning}
                    helperText={errors.dikhr_meaning}
                    rows={4}
                    multiline
                />
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Audio
                    {data.audio_url && <Typography variant="body2" color="text.secondary" className='ml-2'>
                        {data.audio_url.name}
                    </Typography>}
                    {errors.audio_url && <Typography variant="body2" color="error.main" className='ml-2'>
                        {errors.audio_url}
                    </Typography>}
                    <VisuallyHiddenInput
                        type="file"
                        accept="audio/*"
                        onChange={e => handleChange('audio_url', e.target.files[0])}
                    />
                </Button>

                {data.audio_url && <MusicPlayerSlider audioUrl={URL.createObjectURL(data.audio_url)} />}


            </DialogContent>
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button type='submit' variant='contained' onClick={handleSubmit} disabled={loading}>
                    {loading && <CircularProgress color='inherit' size={24} />} Create
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
    const [data, setData] = useState({ sorting_no: editData.sorting_no, dikhr_name_arabic: editData.dikhr_name_arabic, dikhr_name_english: editData.dikhr_name_english, dikhr_meaning: editData.dikhr_meaning, audio_url: editData.audio_url })
    const [errors, setErrors] = useState({ sorting_no: '', dikhr_name_arabic: '', dikhr_name_english: '', dikhr_meaning: '', audio_url: '' })
    console.log('EditContent data:', data);
    const [loading, setLoading] = useState(false)


    const handleChange = (name, value) => {


        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.sorting_no) newErrors.sorting_no = `Sorting number is required`
        if (!data.dikhr_name_arabic) newErrors.dikhr_name_arabic = 'Dikhr name (Arabic) is required'
        if (!data.dikhr_name_english) newErrors.dikhr_name_english = 'Dikhr name (English) is required'
        if (!data.dikhr_meaning) newErrors.dikhr_meaning = 'Dikhr meaning is required'
        if (!data.audio_url) newErrors.audio_url = 'Audio URL is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async () => {
        setLoading(true)
        if (validate()) {
            console.log('Updating data:', data);
            await handleUpdate(data)
        }
        setLoading(false)
    }

    return (
        <>
            <DialogContent className='px-4 pt-0 sm:px-6 scrollable-content'>
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
                    label={'Dikhr Name Arabic'}
                    variant='outlined'
                    value={data.dikhr_name_arabic}
                    onChange={e => handleChange('dikhr_name_arabic', e.target.value)}
                    placeholder={`Enter Dikhr Name Arabic`}
                    className='mb-4'
                    error={!!errors.dikhr_name_arabic}
                    helperText={errors.dikhr_name_arabic}
                />
                <CustomTextField
                    fullWidth
                    label={'Dikhr Name English'}
                    variant='outlined'
                    value={data.dikhr_name_english}
                    onChange={e => handleChange('dikhr_name_english', e.target.value)}
                    placeholder={`Enter Dikhr Name English`}
                    className='mb-4'
                    error={!!errors.dikhr_name_english}
                    helperText={errors.dikhr_name_english}
                />
                <CustomTextField
                    fullWidth
                    label={'Dikhr Meaning'}
                    variant='outlined'
                    value={data.dikhr_meaning}
                    onChange={e => handleChange('dikhr_meaning', e.target.value)}
                    placeholder={`Enter Dikhr Meaning`}
                    className='mb-4'
                    error={!!errors.dikhr_meaning}
                    helperText={errors.dikhr_meaning}
                    rows={4}
                    multiline
                />
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Audio
                    {data.audio_url && <Typography variant="body2" color="text.secondary" className='ml-2'>
                        {data.audio_url.name}
                    </Typography>}
                    {errors.audio_url && <Typography variant="body2" color="error.main" className='ml-2'>
                        {errors.audio_url}
                    </Typography>}
                    <VisuallyHiddenInput
                        type="file"
                        accept="audio/*"
                        onChange={e => handleChange('audio_url', e.target.files[0])}
                    />
                </Button>

                {data.audio_url && <MusicPlayerSlider audioUrl={typeof data.audio_url === 'string' ? data.audio_url : URL.createObjectURL(data.audio_url)} />}

            </DialogContent>
            <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
                <Button disabled={loading} variant='contained' onClick={handleSubmit}>
                   {loading && <CircularProgress color='inherit' size={24} />} Update
                </Button>
                <Button variant='outlined' onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

const IslamDikhrasModal = ({ open, data, handleUpdate, handleAdd, handleClose, title, loading }) => {
    // console.log('IslamDikhras data:', data, 'title:', title);
    if (data) {
        console.log('IslamDikhras data: ', data);
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
                <EditContent loading={loading} handleClose={handleClose} handleUpdate={handleUpdate} editData={data} title={title} />
            ) : (
                <AddContent loading={loading} handleClose={handleClose} handleAdd={handleAdd} title={title} />
            )}
        </Dialog>
    )
}

export default IslamDikhrasModal
