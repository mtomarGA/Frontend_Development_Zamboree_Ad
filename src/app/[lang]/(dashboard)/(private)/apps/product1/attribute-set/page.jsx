// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AttributeSet from '@views/apps/product1/attribute-set/index'

const AttributeSetPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <AttributeSet />
            </Grid>
        </Grid>
    )
}

export default AttributeSetPage
