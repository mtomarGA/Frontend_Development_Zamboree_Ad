// // MUI Imports
// import Pagination from '@mui/material/Pagination'
// import { useState } from 'react';




// const PaginationRounded = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 5; // Change as needed

//   return (
//     <div className='flex flex-col gap-4'>
//       {/* <Pagination count={10} shape='rounded' color='primary' /> */}
//       <Pagination count={10} variant='outlined' shape='rounded' color='primary' />
//       {/* <Pagination count={10} variant='tonal' shape='rounded' color='primary' /> */}
//     </div>
//   )
// }

// export default PaginationRounded;

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

