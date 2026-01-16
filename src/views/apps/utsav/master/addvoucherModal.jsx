'use client'


// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { BoxIcon } from 'lucide-react'
import { Avatar, Box, CircularProgress, FormHelperText, MenuItem, TextField } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { use, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const AddvoucherModal = ({ open, SubmitVoucher, handleClose, OnchangeVoucher, voucher, formErrors, onchangeimage, isloading }) => {

  const { hasPermission } = useAuth();



  return (

    <>

      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Coupon Type
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>




          <div className='flex flex-col m-2'>
            <div className='m-2'>

              <CustomTextField

                name='vouchertype'
                label='Coupon Type'
                value={voucher.vouchertype || ''}
                onChange={OnchangeVoucher}
                fullWidth
                // multiline
                rows={1} // Increase this for more height
                variant='outlined'
                error={!!formErrors.vouchertype}
                helperText={formErrors.vouchertype}

              />
            </div>
          </div>


          <div className='flex flex-col m-2'>
            <label htmlFor='icon' className='mx-2'>Icon</label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input type='file' name='icon' hidden onChange={onchangeimage} id='icon' accept='image/*' />
              </Button>
              {isloading ? (
                <CircularProgress size={20} />
              ) : (
                <Avatar src={voucher.icon} />
              )}
              <Typography variant="body2" className="mt-1 text-green-600 truncate inline-block w-96">
                {voucher.icon ? voucher.icon : "No file selected"}
              </Typography>

              {formErrors.icon && <FormHelperText error>{formErrors.icon}</FormHelperText>}

            </div>
          </div>

          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              value={voucher.status || ''}
              name='status'
              label='Status'
              id='controlled-select'
              error={!!formErrors.status}
              helperText={formErrors.status}
              slotProps={{
                select: {
                  onChange: OnchangeVoucher
                }
              }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>



        </DialogContent>
        <DialogActions>
          {hasPermission("utsav_master:add") &&
            <Button onClick={SubmitVoucher} variant='contained'>
              Add Coupon Type
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

export default AddvoucherModal
