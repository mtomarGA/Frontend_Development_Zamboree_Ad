// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ServiceCategory from '@views/apps/listing/service/service-category'

const ServiceCategoryPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ServiceCategory />
            </Grid>
        </Grid>
    )
}

export default ServiceCategoryPage
