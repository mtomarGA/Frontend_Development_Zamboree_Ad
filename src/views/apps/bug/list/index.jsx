'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports

import CategoryTable from './ListTable'

const dummyData = [{name:"Error" , status:"INACTIVE"} , {"UI Error" : "ACTIVE"} , {"Server Error" : "ACTIVE"}]

const ListBug = ({ userData }) => {
  return (
    <Grid className='' container spacing={6}>
      <div size={{ xs: 12 }} className='flex flex-col md:flex-row w-full justify-between items-center'>
        <div>
          <Typography variant='h4' className='mbe-1'>
            Bug List
          </Typography>

          {/* <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography> */}
        </div>
      </div>
      <Grid size={{ xs: 12 }}>
        <CategoryTable tableData={dummyData} />
      </Grid>
    </Grid>
  )
}

export default ListBug
