'use client'
// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Switch } from '@mui/material';

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const CustomerDetails = ({ customerData, user }) => {

  console.log('user', user)


  // Vars
  const buttonProps = {
    // variant: 'contained',
    // children: 'Edit Details '
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>

            <CustomAvatar
              src={user?.image || '/images/avatars/1.png'}
              variant="rounded"
              alt="Customer Avatar"
              size={120}
            >
              {`${process.env.NEXT_PUBLIC_URL}/${user?.image}` || ''}
            </CustomAvatar>

            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{user?.firstName} {user?.lastName}</Typography>

              <Typography>Customer ID:  {user?.userId}</Typography>
            </div>
          </div>
          <div className='flex items-center justify-around gap-4 flex-wrap is-full'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className="tabler-message-2" />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{customerData?.order}</Typography>
                <Typography>Enquiry</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                < i className="tabler tabler-coins" />
              </CustomAvatar>
              <div>
                {/* <Typography variant='h5'>${customerData?.totalSpent}</Typography> */}
                <Typography>Totale coins: {user?.coins}</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 '>
          <Typography variant='h5'>Details</Typography>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                UserId
              </Typography>
              <Typography className="text-right">{user?.lastName}</Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Name
              </Typography>
              <Typography className="text-right">
                {user?.firstName} {user?.lastName}
              </Typography>
            </div>

            <div className="flex justify-between items-center mb-2">
              <Typography color="text.primary" className="font-medium">
                Email
              </Typography>
              <Typography className="text-right text-sm ">
                {user?.email}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Email Verified
              </Typography>

              <div className="flex items-center gap-2 text-sm">
                {/* <Switch checked={Boolean(user?.emailVerified)} disabled color="success" /> */}
                <Typography className={user?.phoneVerified ? "text-green-600" : "text-red-600"}>
                  {user?.emailVerified ? "✅ Verified" : "❌ Not verified"}
                </Typography>
              </div>
            </div>


            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Contact
              </Typography>
              <Typography className="text-right">{user?.phone}</Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Phone Verified
              </Typography>

              <div className="flex items-center gap-2">
                {/* <Switch checked={Boolean(user?.phoneVerified)} disabled color="success" /> */}
                <Typography className={user?.phoneVerified ? "text-green-600" : "text-red-600"}>
                  {user?.phoneVerified ? '✅ Verified' : '❌ Inverified'}
                </Typography>
              </div>
            </div>



            <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Status
              </Typography>
              <Typography
                className={`px-2 py-1 rounded text-center ${user?.status === 'ACTIVE'
                  ? 'bg-[#d1fae5] text-[#10b981]'
                  : 'bg-[#fee2e2] text-[#ef4444]'
                  }`}
              >
                {user?.status}
              </Typography>
            </div>
            {/* <div className="flex justify-between items-center">
              <Typography color="text.primary" className="font-medium">
                Utsav Mamber
              </Typography>
              <Typography
                className={`px-2 py-1 rounded text-center ${user?.status === 'ACTIVE'
                  ? 'bg-[#d1fae5] text-[#10b981]'
                  : 'bg-[#fee2e2] text-[#ef4444]'
                  }`}
              >
                {user?.status}
              </Typography>
            </div> */}
          </div>
        </div>
        <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={EditUserInfo} />
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
