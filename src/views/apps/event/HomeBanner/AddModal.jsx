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
import { Autocomplete, Avatar, CircularProgress, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'
import GoogleMapLocation from '../ManageEvent/GoogleMapLocation'
// import eventRoute from '@/services/event/eventServices'

// import Quiztype from '../quiztype/quiztype'



const AddModal = (props) => {

    const {
        // 
        open, handleClose, handleClickOpen,
        // event Search
        EventSearch, event, setevent, AddBanner, inputValueArtist,
        setInputValueArtist,
        setsearch,
        search,

        // fromError
        validateFields,
        formErrors,
        setFormErrors,

        // image Name and onchange for image
        imageName,
        setImageName,
        onchangeimage,
        // fetch banner
        FetchBanner,
        // add state
        Adddata,
        setAdddata,
        imageLoading
    } = props

    // console.log(imageName, "dd")

    // clear the previous data when open modal
    useEffect(() => {
        setAdddata([]);
        setInputValueArtist('')
    }, [open]);






    // Add Banner
    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
        try {
            const response = await AddBanner(Adddata)
            if (response.success === true) {
                toast.success(response?.message)
                FetchBanner();
                handleClose();
            }
        } catch (error) {
            toast.error("Failed to add banner")
            console.error(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAdddata(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleLocationSelect = (location) => {
        setAdddata(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
        }));
    };

    return (
        <>

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                fullWidth
                maxWidth='md'
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Add Home Banner
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-row justify-between items-center'>

                        <Autocomplete
                            options={event.filter(e => typeof e?.event_title === 'string')}
                            className="w-96 mx-2"
                            value={event.find(e => e._id === Adddata.event) || null}
                            inputValue={inputValueArtist}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason !== 'reset') {
                                    setInputValueArtist(newInputValue);
                                    setsearch(newInputValue); // <-- triggers useEffect
                                }
                            }}
                            onChange={(e, newValue) =>
                                setAdddata(prev => ({
                                    ...prev,
                                    event: newValue?._id || '',
                                }))
                            }
                            getOptionLabel={(option) => option?.event_title || ''}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            filterOptions={(options, { inputValue }) => options} // skip frontend filtering
                            renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                    {option.event_title}
                                </li>
                            )}
                            noOptionsText={
                                inputValueArtist.length < 3
                                    ? 'Type at least 3 characters to search'
                                    : 'No events found'
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label="Event"
                                    variant="outlined"
                                    className=""
                                    fullWidth
                                    placeholder="Type at least 3 characters..."
                                    error={!!formErrors.event}
                                    helperText={formErrors.event}
                                />
                            )}
                        />



                        <div className='m-2'>
                            <label htmlFor='icon' className='text-sm'>
                                WebBanner Image
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
                                        name='webBanner'
                                        onChange={onchangeimage}
                                        key={Adddata.webBanner ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                    />
                                </Button>
                                {Adddata.webBanner && (
                                    <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {imageName?.webBanner}
                                        {/* <Avatar src={Adddata?.webBanner} /> */}
                                    </Typography>
                                )}
                                {formErrors.icon && (
                                    <Typography variant='body2' color="error">
                                        {formErrors.webBanner}
                                    </Typography>
                                )}
                            </div>
                            {imageLoading.webBanner && (
                                <CircularProgress size={20} className='mt-2' />
                            )}
                        </div>

                    </div>


                    <div className='flex flex-row justify-between items-center flex-wrap'>

                        <div className='mx-2'>
                            <label htmlFor='icon' className='text-sm'>
                                MobBanner Image
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
                                        name='mobBanner'
                                        onChange={onchangeimage}
                                        key={Adddata.mobBanner ? 'file-selected' : 'file-empty'} // Add key to force re-render
                                    />
                                </Button>

                                {Adddata.mobBanner && (
                                    <Typography variant='body2' component={'div'} className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                        Selected: {imageName?.mobBanner}
                                        {/* <Avatar src={Adddata?.mobBanner} /> */}
                                    </Typography>
                                )}
                                {formErrors.mobBanner && (
                                    <Typography variant='body2' color="error">
                                        {formErrors?.mobBanner}
                                    </Typography>
                                )}
                            </div>
                            {imageLoading.mobBanner && (
                                <CircularProgress size={20} className='mt-2' />
                            )}
                        </div>

                        <div>

                            <CustomTextField
                                disabled
                                className='w-96 mx-2'
                                name='address'
                                label='Address'
                                value={Adddata?.address || ''}
                                onChange={handleChange}
                                error={!!formErrors.address}
                                helperText={formErrors.address}
                            />
                        </div>

                    </div>

                    <div className='flex flex-row justify-between items-center m-2 flex-wrap'>

                        <CustomTextField
                            className='w-96'
                            name='latitude'
                            label='Latitude'
                            value={Adddata?.latitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.latitude}
                            helperText={formErrors.latitude}
                            disabled
                        />

                        <CustomTextField
                            className='w-96'
                            name='longitude'
                            label='Longitude'
                            value={Adddata?.longitude || ''}
                            onChange={handleChange}
                            error={!!formErrors.longitude}
                            helperText={formErrors.longitude}
                            disabled
                        />

                    </div>
                    <div className=' my-4 mx-2'>

                        <GoogleMapLocation onSelect={handleLocationSelect} />
                    </div>




                    <div>
                        <CustomTextField
                            select
                            className='w-96 mx-2'
                            name='status'
                            label='Status'
                            value={Adddata.status || ''}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>

                        </CustomTextField>
                    </div>


                    {/* </Typography> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                    <Button onClick={handleSubmit} variant='contained'>
                        Add Banner
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddModal
