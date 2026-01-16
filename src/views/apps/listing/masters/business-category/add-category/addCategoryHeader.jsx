// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const ListAddHeader = () => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-2'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Add Category
        </Typography>
      </div>
    </div>
  )
}

export default ListAddHeader
