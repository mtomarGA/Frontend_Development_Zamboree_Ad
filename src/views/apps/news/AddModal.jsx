import React from 'react'
// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import NewsService from '@/services/newsletter/newsServices'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

function AddModal({ AddNews, onchangeAdd, open, handleClickOpen, handleClose, GetNewsFun }) {
    const { hasPermission } = useAuth();

    const [formErrors, setFormErrors] = useState({});

    const validateFields = (data) => {
        let errors = {};
        if (!data.email) errors.email = 'Email is required';
        return errors;
    };



    const Submit = async () => {
        try {


            const errors = validateFields(AddNews);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }

            setFormErrors({});

            const addSubscriber = await NewsService.PostNews(AddNews);
            // console.log(addSubscriber)
            if (!addSubscriber.success) {
                toast.error("Email already Added");
                return;
            }
            handleClose();
            GetNewsFun();
            toast.success("Newsletter Added");

        } catch (error) {
            toast.error("Something went Wrong");
        }

    }
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
                        Add Newsletter
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        <div className='m-4'>
                            <CustomTextField
                                name='email'
                                className='w-96'
                                placeholder='Enter Email Id'
                                label='Email Id'
                                onChange={onchangeAdd}
                                multiline
                                rows={1}
                                variant='outlined'

                                error={!!formErrors.email}
                                helperText={formErrors.email}

                            />
                        </div>

                    </Typography>
                </DialogContent>
                <DialogActions>
                    {hasPermission('newsletter:add') && (
                        <Button onClick={Submit} variant='contained'>
                            Add Newsletter
                        </Button>
                    )}

                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddModal
