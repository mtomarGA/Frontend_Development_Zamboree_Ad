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
import Grid from '@mui/material/Grid2'
import CustomTextField from '@/@core/components/mui/TextField'
import { format } from 'date-fns'

const Show = ({ handleShowClose, handleShowOpen, ShowOpen, ModalShowdata }) => {

  const formattedDate = ModalShowdata.expiryDatetime
    ? format(new Date(ModalShowdata.expiryDatetime), 'dd/MM/yyyy')
    : ''


  return (
    <>

      <Dialog
        onClose={handleShowClose}
        aria-labelledby='customized-dialog-title'
        open={ShowOpen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Show Announcement
          </Typography>
          <DialogCloseButton onClick={handleShowClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>



          <div className='m-4'>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomTextField
                disabled
                className='w-full'
                id='form-props-disabled'
                label='Title'
                value={ModalShowdata.title}
                multiline
                maxRows={Infinity}


              />
            </Grid>

          </div>


          {/* <div className='m-2'>
              <label htmlFor='title'>Title</label>
              <input type='text' placeholder='Title'  value={ModalShowdata.title}  id='title' className='w-full border px-3 py-2 rounded' />
            </div> */}

          {/* message */}

          <div className='m-4'>
            <CustomTextField
              name='message'
              label='Message'
              value={ModalShowdata.message}
              disabled
              fullWidth
              multiline
              maxRows={Infinity}
              variant='outlined'
            />
          </div>





          {/* expiry time */}


          <div className='m-4'>
            <CustomTextField
              label='Expiry Date'
              value={formattedDate}
              disabled
              fullWidth
              multiline
              rows={1}
              variant='outlined'
            />
          </div>


          {/* branch */}


          <div className='m-4'>
            <CustomTextField

              label='Branch'
              value={ModalShowdata?.branch?.name}
              disabled
              fullWidth
              multiline
              rows={1} // Increase this for more height
              variant='outlined'
            />
          </div>



          <div className='flex'>

            {/* department */}
            <div className='m-4'>
              <CustomTextField

                label='Department'
                value={ModalShowdata?.department?.name}
                disabled
                fullWidth
                multiline
                rows={1} // Increase this for more height
                variant='outlined'
              />
            </div>


            {/* designation */}
            <div className='m-4'>
              <CustomTextField
                label='Designation'
                value={
                  Array.isArray(ModalShowdata?.designation)
                    ? ModalShowdata.designation.map(d => d.name).join(', ')
                    : ModalShowdata?.designation?.name || ''
                }
                disabled
                fullWidth
                multiline
                rows={4} // or increase if designations are long
                variant='outlined'
              />
            </div>




          </div>






        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Show
