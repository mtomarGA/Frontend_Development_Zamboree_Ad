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

const ShowModal = ({ Showopen, ShowData, handleShowClose, handleShowOpen }) => {


    return (
        <>
            {/* <Button variant='outlined' onClick={handleShowOpen}>
                Open dialog
            </Button> */}
            <Dialog
                onClose={handleShowClose}
                aria-labelledby='customized-dialog-title'
                open={Showopen}
                fullWidth
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Withdraw Information
                    </Typography>
                    <DialogCloseButton onClick={handleShowClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>


                    <div className='m-2'>
                        <div className='m-2'>

                            <strong>Total Payment Amount:</strong> <p className='inline'>{ShowData?.req_amount}</p>
                        </div>
                        <div className='m-2'>

                            <strong>Bank Name: </strong><p className='inline'>{ShowData?.bank?.name} </p>
                        </div>
                        <div className='m-2'>

                            <strong>IFSC Code: </strong><p className='inline'>{ShowData?.ifsc} </p>
                        </div>
                        <div className='m-2'>

                            <strong>Account No.</strong> <p className='inline'>{ShowData?.accountNo} </p>
                        </div>

                        <div className='m-2'>

                            <strong>Contact No.</strong>  <p className='inline'>{ShowData?.contactNo}</p>
                        </div>
                    </div>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleShowClose} variant='tonal' color='secondary'>
                        Close
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default ShowModal
