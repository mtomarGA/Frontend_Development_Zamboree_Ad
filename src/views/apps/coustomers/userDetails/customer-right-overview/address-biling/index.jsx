'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AddressBook from './AddressBookCard'
import PaymentMethod from './Payment'

const AddressBilling = (selectedUser) => {
  // console.log(selectedUser,"mmmmm");
  const id=selectedUser
  
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AddressBook  userId={id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PaymentMethod />
      </Grid>
    </Grid>
  )
}

export default AddressBilling
