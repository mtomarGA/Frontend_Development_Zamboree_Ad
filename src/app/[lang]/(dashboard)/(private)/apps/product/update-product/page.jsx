// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UpdateProduct from '@views/apps/product/update-product'

const UpdateProductPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <UpdateProduct />
            </Grid>
        </Grid>
    )
}

export default UpdateProductPage
