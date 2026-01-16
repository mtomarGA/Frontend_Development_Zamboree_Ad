// MUI Imports

'use client'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs';

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const CustomerDetailHeader = ({ customerId, singleuser }) => {
  // Vars
  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })


  return (
    <div className='flex flex-wrap justify-between max-sm:flex-col sm:items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <Typography variant='h4'>{`User Detail`} </Typography>
        <Typography> 
          {`User Id : ${singleuser?.userId}`}
        </Typography>
      </div>
      {/* <OpenDialogOnElementClick
        element={Button}
        elementProps={buttonProps('Delete Customer', 'error', 'tonal')}
        dialog={ConfirmationDialog}
        dialogProps={{ type: 'delete-customer' }}
      /> */}
    </div>
  )
}

export default CustomerDetailHeader
