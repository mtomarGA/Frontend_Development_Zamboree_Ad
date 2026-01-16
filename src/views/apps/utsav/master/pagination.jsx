'use client'
import Pagination from '@mui/material/Pagination'

const PaginationRounded = ({ count, page, onChange }) => {
  return (
    <div className='flex flex-col gap-4'>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant='outlined'
        shape='rounded'
        color='primary'
      />
    </div>
  )
}

export default PaginationRounded;

