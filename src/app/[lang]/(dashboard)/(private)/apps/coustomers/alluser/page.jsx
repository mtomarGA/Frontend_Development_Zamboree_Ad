import AllUser from '@/views/apps/coustomers/AllUser'
import { getAllUser } from '@/app/server/actions'

import { Typography } from '@mui/material'
const AllUsers = async () => {
  const data = await getAllUser()

  return <div>
    
    <AllUser productData={data?.products} />
  </div>

}

export default AllUsers
