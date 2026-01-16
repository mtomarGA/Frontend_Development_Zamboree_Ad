// MUI Imports
'use client'
import Grid from '@mui/material/Grid2'

// Component Imports
import ChangePassword from './ChangePassword'
import TwoStepVerification from './TwoStapVerification'
import RecentDevice from './RecentDevice'

const SecurityTab = ({selectedUser}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ChangePassword />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <TwoStepVerification />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <RecentDevice selectedUser={selectedUser} />
      </Grid>
    </Grid>
  )
}

export default SecurityTab
