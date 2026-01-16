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
import { Grid } from '@mui/system'

const AddContent = ({ handleClose, handleAdd, title }) => {
    const [data, setData] = useState({ date: '', fajr: '', sunrise: '', zuhur: '', asr: '', maghrib: '', imsak: '', isha: '', status: 'ACTIVE' })
    const [errors, setErrors] = useState({ date: '', fajr: '', sunrise: '', zuhur: '', asr: '', maghrib: '', imsak: '', isha: '' })
    const [templeData, setTempleData] = useState()
    const [loading, setLoading] = useState(true)
    console.log('templeData', data);



    const handleChange = (name, value) => {
        setData({ ...data, [name]: value })
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!data.date) newErrors.date = `${title} date is required'`
        if (!data.fajr) newErrors.fajr = `${title} fajr time is required'`
        if (!data.sunrise) newErrors.sunrise = `${title} sunrise time is required'`
        if (!data.zuhur) newErrors.zuhur = `${title} zuhur time is required'`
        if (!data.asr) newErrors.asr = `${title} asr time is required'`
        if (!data.maghrib) newErrors.maghrib = `${title} maghrib time is required'`
        if (!data.imsak) newErrors.imsak = `${title} imsak time is required'`
        if (!data.isha) newErrors.isha = `${title} isha time is required'`

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
                {/* create a select */}
                <Grid className='grid grid-cols-2 gap-2  mb-4'>

                    <CustomTextField
                        fullWidth
                        label={`Date`}
                        variant='outlined'
                        value={data.date}
                        onChange={e => handleChange('date', e.target.value)}
                        type='date'
                        className='mb-4'
                        error={!!errors.date}
                        helperText={errors.date}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Sunrise Time`}
                        variant='outlined'
                        value={data.sunrise}
                        type='time'
                        onChange={e => handleChange('sunrise', e.target.value)}
                        className='mb-4'
                        error={!!errors.sunrise}
                        helperText={errors.sunrise}
                    />
                </Grid>
                <Grid className='grid grid-cols-3 gap-2  mb-4'>

                    <CustomTextField
                        fullWidth
                        label={`Fajr Time`}
                        variant='outlined'
                        value={data.fajr}
                        type='time'
                        onChange={e => handleChange('fajr', e.target.value)}
                        placeholder={`Enter ${title} fajr time`}
                        className='mb-4'
                        error={!!errors.fajr}
                        helperText={errors.fajr}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Zuhur Time`}
                        variant='outlined'
                        value={data.zuhur}
                        type='time'
                        onChange={e => handleChange('zuhur', e.target.value)}
                        className='mb-4'
                        error={!!errors.zuhur}
                        helperText={errors.zuhur}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Iftar Time`}
                        variant='outlined'
                        value={data.imsak}
                        type='time'
                        onChange={e => handleChange('imsak', e.target.value)}
                        className='mb-4'
                        error={!!errors.imsak}
                        helperText={errors.imsak}
                    />
                </Grid>
                <Grid className='grid grid-cols-3 gap-2  mb-4'>
                    <CustomTextField
                        fullWidth
                        label={`Asr Time`}
                        variant='outlined'
                        value={data.asr}
                        type='time'
                        onChange={e => handleChange('asr', e.target.value)}
                        className='mb-4'
                        error={!!errors.asr}
                        helperText={errors.asr}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Maghrib Time`}
                        variant='outlined'
                        value={data.maghrib}
                        type='time'
                        onChange={e => handleChange('maghrib', e.target.value)}
                        className='mb-4'
                        error={!!errors.maghrib}
                        helperText={errors.maghrib}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Isha Time`}
                        variant='outlined'
                        value={data.isha}
                        type='time'
                        onChange={e => handleChange('isha', e.target.value)}
                        className='mb-4'
                        error={!!errors.isha}
                        helperText={errors.isha}
                    />
                </Grid>
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
    const [editData, setEditData] = useState({
        date: data.date,
        fajr: data.fajr,
        sunrise: data.sunrise,
        zuhur: data.zuhur,
        asr: data.asr,
        maghrib: data.maghrib,
        imsak: data.imsak,
        isha: data.isha
    })
    const [errors, setErrors] = useState({
        date: '',
        fajr: '',
        sunrise: '',
        zuhur: '',
        asr: '',
        maghrib: '',
        imsak: '',
        isha: ''
    })
    const [loading, setLoading] = useState(true)



    const handleChange = (name, value) => {
        setEditData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' })) // clear error
    }

    const validate = () => {
        const newErrors = {}
        if (!editData.date) newErrors.date = `${title} date is required'`
        if (!editData.fajr) newErrors.fajr = `${title} fajr time is required'`
        if (!editData.sunrise) newErrors.sunrise = `${title} sunrise time is required'`
        if (!editData.zuhur) newErrors.zuhur = `${title} zuhur time is required'`
        if (!editData.asr) newErrors.asr = `${title} asr time is required'`
        if (!editData.maghrib) newErrors.maghrib = `${title} maghrib time is required'`
        if (!editData.imsak) newErrors.imsak = `${title} imsak time is required'`
        if (!editData.isha) newErrors.isha = `${title} isha time is required'`

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
                <Grid className='grid grid-cols-2 gap-2  mb-4'>

                    <CustomTextField
                        fullWidth
                        label={`Date`}
                        variant='outlined'
                        value={editData.date ? editData.date.slice(0, 10) : ''}
                        onChange={e => handleChange('date', e.target.value)}
                        type='date'
                        className='mb-4'
                        error={!!errors.embeddedLink}
                        helperText={errors.embeddedLink}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Sunrise Time`}
                        variant='outlined'
                        value={editData.sunrise}
                        type='time'
                        onChange={e => handleChange('sunrise', e.target.value)}
                        className='mb-4'
                        error={!!errors.sunrise}
                        helperText={errors.sunrise}
                    />
                </Grid>
                <Grid className='grid grid-cols-3 gap-2  mb-4'>

                    <CustomTextField
                        fullWidth
                        label={`Fajr Time`}
                        variant='outlined'
                        value={editData.fajr}
                        type='time'
                        onChange={e => handleChange('fajr', e.target.value)}
                        placeholder={`Enter ${title} fajr time`}
                        className='mb-4'
                        error={!!errors.fajr}
                        helperText={errors.fajr}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Zuhur Time`}
                        variant='outlined'
                        value={editData.zuhur}
                        type='time'
                        onChange={e => handleChange('zuhur', e.target.value)}
                        className='mb-4'
                        error={!!errors.zuhur}
                        helperText={errors.zuhur}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Iftar Time`}
                        variant='outlined'
                        value={editData.imsak}
                        type='time'
                        onChange={e => handleChange('imsak', e.target.value)}
                        className='mb-4'
                        error={!!errors.imsak}
                        helperText={errors.imsak}
                    />
                </Grid>
                <Grid className='grid grid-cols-3 gap-2  mb-4'>
                    <CustomTextField
                        fullWidth
                        label={`Asr Time`}
                        variant='outlined'
                        value={editData.asr}
                        type='time'
                        onChange={e => handleChange('asr', e.target.value)}
                        className='mb-4'
                        error={!!errors.asr}
                        helperText={errors.asr}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Maghrib Time`}
                        variant='outlined'
                        value={editData.maghrib}
                        type='time'
                        onChange={e => handleChange('maghrib', e.target.value)}
                        className='mb-4'
                        error={!!errors.maghrib}
                        helperText={errors.maghrib}
                    />
                    <CustomTextField
                        fullWidth
                        label={`Isha Time`}
                        variant='outlined'
                        value={editData.isha}
                        type='time'
                        onChange={e => handleChange('isha', e.target.value)}
                        className='mb-4'
                        error={!!errors.isha}
                        helperText={errors.isha}
                    />
                </Grid>
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

const IslamPrayerModal = ({ open, data, handleUpdate, handleAdd, handleClose, title }) => {


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

export default IslamPrayerModal
