'use client'
// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { MenuItem } from '@mui/material'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { Grid } from '@mui/material'
import Image from '@/services/imageService'
import contestRoute from '@/services/quiz/quiz-contest/contestService'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

// import Quiztype from '../quiztype/quiztype'

// Helper for ordinal suffixes
function getOrdinal(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

const AddModal = ({ open, handleClose, handleClickOpen, getdata }) => {
    const { hasPermission } = useAuth();
    const [date, setDate] = useState(new Date());
    const [Adddata, setAdddata] = useState({
        sortingNo: '',
        name: '',
        startDate: '',
        endDate: '',
        entryFee: '',
        status: 'INACTIVE',
        terms: '',
        numWinners: 0,
        winnerPrizes: []
    });
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null, name: '' })

    const validateFields = (data) => {
        let errors = {}
        if (!data.name) errors.name = 'Name is required'
        if (!data.icon) errors.icon = 'Image is required'
        if (!data.startDate) errors.startDate = 'Contest Start Date is required'
        if (!data.endDate) errors.endDate = 'Contest End Date is required'
        if (!data.entryFee) errors.entryFee = 'Entry Fee Points is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.terms) errors.terms = 'Terms and Condition is required'
        return errors
    }

    // // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // image upload handler
    const onchangeimage = async (e) => {
        const { name, files } = e.target
        const file = files[0]
        const result = await Image.uploadImage({ image: file })
        if (result.data.url) {
            setAdddata(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            setImage({ icon: result.data.url, name: file.name })
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }

    // console.log(Adddata, 'dd')

    useEffect(() => {
        if (open) {
            setAdddata({
             
                name: '',
                startDate: '',
                endDate: '',
                entryFee: '',
                status: 'INACTIVE',
                terms: '',
                numWinners: 0,
                winnerPrizes: [] // ✅ Ensure it's always an array
            });
            setFormErrors({});
            setImage({ icon: null, name: '' });
        }
    }, [open]);



    // handle submit
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }


        try {
            const response = await contestRoute.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleClose()
            }
        } catch (error) {
            toast.error("Failed to add banner")
            console.error(error)
        }
    }

    // console.log(Adddata, 'dd')
    return (
        <>

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Add Contest
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
              
                      
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='name'
                                label='Name'
                                onChange={handleChange}
                                value={Adddata.name || ''}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </div>

                        {Adddata.icon && (
                            <div className='m-2'>
                                <img src={Adddata?.icon} alt="" className='w-96 h-36 rounded-md' />
                            </div>

                        )}


                        <div className='m-2'>
                            <label htmlFor='icon' className='text-sm'>
                                Image
                            </label>
                            <div>
                                <Button
                                    variant='outlined'
                                    component='label'
                                    className='w-96'
                                >
                                    Upload File
                                    <input
                                        type='file'
                                        hidden
                                        name='icon'
                                        onChange={onchangeimage}
                                        key={Adddata.icon ? 'file-selected' : 'file-empty'}
                                    />
                                </Button>
                                {image.name && (
                                    <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {image.name}
                                    </Typography>
                                )}
                                {formErrors.icon && (
                                    <Typography variant='body2' color="error">
                                        {formErrors.icon}
                                    </Typography>
                                )}
                            </div>
                        </div>
                        <div>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <AppReactDatepicker
                                    selected={Adddata.startDate ? new Date(Adddata.startDate) : null}
                                    id='basic-input'
                                    className='w-96 mx-2'
                                    minDate={new Date()}
                                    onChange={date => setAdddata({ ...Adddata, startDate: date })}
                                    placeholderText='Click to select a date'
                                    customInput={<CustomTextField label='Start Date' error={!!formErrors.startDate} helperText={formErrors.startDate} fullWidth />}
                                />
                            </Grid>

                        </div>
                        <div className='my-2'>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <AppReactDatepicker
                                    selected={Adddata.endDate ? new Date(Adddata.endDate) : null}
                                    id='basic-input'
                                    className='w-96 mx-2'
                                    minDate={new Date()}
                                    onChange={date => setAdddata({ ...Adddata, endDate: date })}
                                    placeholderText='Click to select a date'
                                    customInput={<CustomTextField label='End Date' error={!!formErrors.endDate} helperText={formErrors.endDate} fullWidth />}
                                />
                            </Grid>
                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='entryFee'
                                label='Entry Fee Points'
                                type='number'
                                onChange={handleChange}
                                value={Adddata.entryFee || ''}
                                onWheel={e => e.target.blur()}
                                variant='outlined'
                                error={!!formErrors.entryFee}
                                helperText={formErrors.entryFee}
                            />
                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='numWinners'
                                label='Distribute Prize To Top Users'
                                type='number'
                                value={Adddata.numWinners}
                                onChange={e => {
                                    const value = parseInt(e.target.value, 10) || 0;
                                    setAdddata(prev => ({
                                        ...prev,
                                        numWinners: value,
                                        winnerPrizes: Array.from({ length: value }, (_, i) => prev.winnerPrizes[i] || '')
                                    }));
                                }}
                                onWheel={e => e.target.blur()}
                                variant='outlined'
                            />
                        </div>
                        {Array.from({ length: Adddata.numWinners }).map((_, idx) => (
                            <div className='m-2' key={idx}>
                                <CustomTextField
                                    className='w-96'
                                    label={`${idx + 1}${getOrdinal(idx + 1)} Winner Prize`}
                                    value={Adddata.winnerPrizes[idx] || ''}
                                    onChange={e => {
                                        const newPrizes = [...Adddata.winnerPrizes];
                                        newPrizes[idx] = e.target.value;
                                        setAdddata(prev => ({
                                            ...prev,
                                            winnerPrizes: newPrizes
                                        }));
                                    }}
                                    variant='outlined'
                                />
                            </div>
                        ))}
                        <div className='m-2'>
                            <CustomTextField
                                select
                                className='w-96'
                                name='status'
                                label='Status'
                                value={Adddata.status}
                                onChange={handleChange}
                                error={!!formErrors.status}
                                helperText={formErrors.status}
                            >
                                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                                <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                            </CustomTextField>
                        </div>
                        <div className='m-2'>
                            <CustomTextField
                                className='w-96'
                                name='terms'
                                label='Terms and Condition'
                                onChange={handleChange}
                                value={Adddata.terms || ''}
                                multiline
                                rows={4}
                                variant='outlined'
                                error={!!formErrors.terms}
                                helperText={formErrors.terms}
                            />
                        </div>
                  
                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_contest:add') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Add Contest
                        </Button>
                    }
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddModal
