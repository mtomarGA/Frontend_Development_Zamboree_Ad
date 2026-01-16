// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UrlCard from './UrlCard'

const UrlCardPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UrlCard />
      </Grid>
    </Grid>
  )
}

export default UrlCardPage
