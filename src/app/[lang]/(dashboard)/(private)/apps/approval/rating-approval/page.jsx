// MUI Imports
import Grid from '@mui/material/Grid2'
import RatingApproval from '@views/apps/approval/rating-approval/index'

const RatingApprove = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <RatingApproval />
            </Grid>
        </Grid>
    )
}

export default RatingApprove
