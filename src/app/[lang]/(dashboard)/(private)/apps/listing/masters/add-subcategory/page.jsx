// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AddSubCategoryHeader from '@views/apps/listing/masters/business-category/add-subcategory/addSubCategoryHeader'
import AddSubCategory from '@views/apps/listing/masters/business-category/add-subcategory/addSubCategory'

const listingAddSubCategory = () => {
  return (
    <Grid container spacing={12}>
      <Grid size={{ xs: 12 }}>
        <AddSubCategoryHeader />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={12}>
          <Grid size={{ xs: 12 }}>
            <AddSubCategory />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default listingAddSubCategory
