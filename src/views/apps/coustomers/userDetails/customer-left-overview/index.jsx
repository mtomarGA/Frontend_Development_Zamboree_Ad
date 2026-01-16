'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserPlan from './UserPlan'
import UserDetails from './UserDetail'

const CustomerLeftOverview = ({ customerData  ,singleuser}) => {
  // console.log('singleuser',singleuser)
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails customerData={customerData} user={singleuser}  />
      </Grid>
      <Grid size={{ xs: 12 }}>
        {/* <UserPlan /> */}
      </Grid>
    </Grid>
  )
}

export default CustomerLeftOverview
