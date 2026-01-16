// MUI Imports
import Grid from '@mui/material/Grid2'
import ImageApproval from '@views/apps/approval/image-approval/index'

const ImageApprove = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ImageApproval />
            </Grid>
        </Grid>
    )
}

export default ImageApprove
