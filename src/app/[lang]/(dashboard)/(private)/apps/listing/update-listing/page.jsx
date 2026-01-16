// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UpdateListing from '@views/apps/listing/update-listing'

import { getEcommerceData } from '@/app/server/actions'

const UpdateListingPage = async () => {
  // Vars
  const data = await getEcommerceData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        {/* <UpdateListing /> */}
        <UpdateListing reviewsData={data?.reviews} />
      </Grid>
    </Grid>
  )
}

export default UpdateListingPage
