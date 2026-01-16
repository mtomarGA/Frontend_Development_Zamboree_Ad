'use client'
// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const CustomerDetails = ({ customerData, selectedUser }) => {
  
  // Vars
  const buttonProps = {
    // variant: 'contained',
    // children: 'Edit Details '
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-8 gap-6 '>
        {/* <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={customerData?.avatar} variant='rounded' alt='Customer Avatar' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{customerData?.customer}</Typography>
              <Typography>Customer ID #{customerData?.customerId}</Typography>
            </div>
          </div>
          <div className='flex items-center justify-around gap-4 flex-wrap is-full'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-shopping-cart' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{customerData?.order}</Typography>
                <Typography>Orders</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-currency-dollar' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>${customerData?.totalSpent}</Typography>
                <Typography>Spent</Typography>
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col gap-4">
          <Typography variant="h5">All Details</Typography>
          <Divider />
          <div className="flex flex-col gap-4">
            {[
              {
                label: 'User Id',
                value:
                  selectedUser?.userId &&
                  selectedUser.userId.charAt(0).toUpperCase() + selectedUser.userId.slice(1).toLowerCase(),
              },
              { label: 'Created At', value: selectedUser?.createdAt && new Date(selectedUser.createdAt).toLocaleDateString() },
              { label: 'Updated At', value: selectedUser?.updatedAt && new Date(selectedUser.updatedAt).toLocaleDateString() },
              { label: 'Gender', value: selectedUser?.gender?.name },
              { label: 'Date of Birth', value: selectedUser?.dateOfBirth && new Date(selectedUser.dateOfBirth).toLocaleDateString() },


              {
                label: 'Marital Status',
                value:
                  selectedUser?.maritalStatus?.name &&
                  selectedUser?.maritalStatus?.name.charAt(0).toUpperCase() +
                  selectedUser?.maritalStatus?.name.slice(1).toLowerCase(),
              },
              {
                label: 'Occupation',
                value:
                  selectedUser?.occupation?.name &&
                  selectedUser?.occupation?.name.charAt(0).toUpperCase() +
                  selectedUser?.occupation?.name.slice(1).toLowerCase(),
              },
              {
                label: 'Referral Code',
                value: selectedUser?.referralCode,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 px-4 sm:px-6 md:px-10"
              >
                <Typography color="text.primary" className="font-medium min-w-[120px] text-start">
                  {label}:
                </Typography>
                <Typography className="text-sm break-words">{value || '-'}</Typography>
              </div>
            ))}

            {/* Interest Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-4 sm:px-6 md:px-10">
              <Typography color="text.primary" className="font-medium min-w-[120px] text-start">
                Interest:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedUser?.interest?.length > 0 ? (
                  selectedUser.interest.map((item, index) => (
                    <span key={index} className="text-sm px-2 py-1">
                      {item.name}
                    </span>
                  ))
                ) : (
                  <Typography className="text-sm">-</Typography>
                )}
              </div>
            </div>
          </div>
        </div>

        <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={EditUserInfo} />
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
