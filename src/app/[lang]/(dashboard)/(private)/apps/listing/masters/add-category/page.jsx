// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AddCategoryHeader from '@views/apps/listing/masters/business-category/add-category/addCategoryHeader'
import AddCategory from '@views/apps/listing/masters/business-category/add-category/addCategory'

const listingAddCategory = () => {
  return (
    <Grid container spacing={12}>
      <Grid size={{ xs: 12 }}>
        <AddCategoryHeader />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={12}>
          <Grid size={{ xs: 12 }}>
            <AddCategory />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default listingAddCategory
