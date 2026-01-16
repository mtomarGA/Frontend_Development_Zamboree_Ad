// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import updateCategoryHeader from '@views/apps/listing/masters/business-category/add-category/updateCategoryHeader'
import UpdateCategory from '@views/apps/listing/masters/business-category/add-category/updateCategory'

const listingUpdateCategory = () => {
  return (
    <Grid container spacing={12}>
      {/* <Grid size={{ xs: 12 }}>
        <updateCategoryHeader />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={12}>
          <Grid size={{ xs: 12 }}>
            <UpdateCategory />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default listingUpdateCategory
