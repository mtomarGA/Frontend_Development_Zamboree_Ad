// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UpdateSubCategoryHeader from '@views/apps/listing/masters/business-category/add-subcategory/updateSubCategoryHeader'
import UpdateSubCategory from '@views/apps/listing/masters/business-category/add-subcategory/updateSubCategory'

const listingAddSubCategory = () => {
  return (
    <Grid container spacing={12}>
      <Grid size={{ xs: 12 }}>{/* <UpdateSubCategoryHeader /> */}</Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={12}>
          <Grid size={{ xs: 12 }}>
            <UpdateSubCategory />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default listingAddSubCategory
