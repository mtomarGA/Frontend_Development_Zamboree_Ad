// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AttributeSet from '@views/apps/listing/service/attribute-set/index'

const ServiceAttributeSetPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <AttributeSet />
            </Grid>
        </Grid>
    )
}

export default ServiceAttributeSetPage
