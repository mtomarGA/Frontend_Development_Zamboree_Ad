// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ListingApproval from '@views/apps/approval/listing-approval/index'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const ListingApprove = async () => {

    const data = await getEcommerceData()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ListingApproval reviewsData={data?.reviews} />
            </Grid>
        </Grid>
    )
}

export default ListingApprove
