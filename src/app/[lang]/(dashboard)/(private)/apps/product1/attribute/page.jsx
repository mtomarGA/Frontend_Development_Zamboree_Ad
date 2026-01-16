// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import Attribute from '@views/apps/product1/attribute/index'

const AttributePage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <Attribute />
            </Grid>
        </Grid>
    )
}

export default AttributePage
