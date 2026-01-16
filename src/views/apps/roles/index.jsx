// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports
import { Button } from '@mui/material'

import RoleCards from './RoleCards'
import RolesTable from './RolesTable'

const Roles = ({ userData }) => {
  
  return (
    <Grid  className="" container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='mbe-1'>
          Roles List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that depending on assigned role an administrator
          can have access to what he need
        </Typography>
      </Grid> */}
      {/* <Grid size={{ xs: 12 }}>
        <RoleCards />
      </Grid> */}
      <div  size={{ xs: 12 }} className='flex flex-col md:flex-row w-full justify-between items-center'>
       <div>
       <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>

        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
       </div>
         {/* <div className=' mr-0 md:mr-4'>
         <Button variant='contained' size='small'>
                        Add Role
                      </Button>
         </div> */}
      </div>
      <Grid size={{ xs: 12 }}>
        <RolesTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default Roles
