// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProductCategory from '@views/apps/product1/product-category'

const ProductCategoryPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ProductCategory />
            </Grid>
        </Grid>
    )
}

export default ProductCategoryPage
