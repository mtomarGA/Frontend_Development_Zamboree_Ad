// Next Imports
'use client'
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerDetailsHeader from './CustomerDetailHandlar'
import CustomerLeftOverview from './customer-left-overview'
import CustomerRight from './customer-right-overview'

//api Import

import SingleUser from '@/services/customers/createService'
import { useEffect, useState } from 'react'



const OverViewTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/userDetailRight/userDetailRight'),
  { ssr: false }
)

const SecurityTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/security'),
  { ssr: false }
)
const NotificationsTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/notifucation'),
  { ssr: false }
)

const AddressBillingTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/address-biling'),
  { ssr: false }
)

const FollowTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/follows/index'),
  { ssr: false }
)
const SavePostTab = dynamic(
  () => import('@/views/apps/coustomers/userDetails/customer-right-overview/savepost/index'),
  { ssr: false }
)

// Vars





const CustomerDetails = ({ customerData, customerId, selectedUser }) => {

 
  const Id=selectedUser?._id

  const tabContentList = () => ({

    overview: <OverViewTab selectedUser={selectedUser} />,
    security: <SecurityTab selectedUser={selectedUser} />,
    addressBilling: <AddressBillingTab  selectedUser={Id}/>,
    notifications: <NotificationsTab />,
    follow: <FollowTab  selectedUser={Id}/>,
    savepost:<SavePostTab selectedUser={Id}/>
  })


  const [singleuser, setsingleuser] = useState()
  

  const userid = selectedUser?._id

  const getSingleUser = async () => {
    const response = await SingleUser.getsingle(userid)
    setsingleuser(response.data)
  }

  useEffect(() => {
    getSingleUser()
  }, [])




  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerDetailsHeader customerId={customerId} singleuser={singleuser} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomerLeftOverview customerData={customerData} singleuser={singleuser} />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <CustomerRight tabContentList={tabContentList()} />
      </Grid>

    </Grid>
  )
}

export default CustomerDetails
