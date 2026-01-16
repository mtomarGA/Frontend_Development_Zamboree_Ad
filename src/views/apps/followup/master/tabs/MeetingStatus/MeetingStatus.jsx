import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import MeetingStatusTable from './MeetingStatusTable'

const MeetingStatus = () => {
  return (
    <Grid className='' container>
      <div className='flex flex-col md:flex-row w-full justify-between items-center'>
        <div>
          <Typography variant='h4' className='mbe-1'>
          Meeting Status
          </Typography>
        </div>
      </div>
      <Grid className='w-full' item xs={12}>
        <MeetingStatusTable />
      </Grid>
    </Grid>
  )
}

export default MeetingStatus
