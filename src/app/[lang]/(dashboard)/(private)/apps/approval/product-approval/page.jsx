// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProductApproval from '@views/apps/approval/product-approval'

const ProductApprove = async () => {


    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ProductApproval />
            </Grid>
        </Grid>
    )
}

export default ProductApprove
