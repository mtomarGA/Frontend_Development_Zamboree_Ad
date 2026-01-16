'use client'
// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'


import CategoryTable from './CategoryTable'


const CategoryBug = () => {

  return (
    <Grid className='' container spacing={6}>
      <div size={{ xs: 12 }} className='flex flex-col md:flex-row w-full justify-between items-center'>
        <div>
          <Typography variant='h4' className='mbe-1'>
            Bug Category
          </Typography>
        </div>
      </div>
      <Grid size={{ xs: 12 }}>
          <CategoryTable  />
      </Grid>
    </Grid>
  )
}

export default CategoryBug
