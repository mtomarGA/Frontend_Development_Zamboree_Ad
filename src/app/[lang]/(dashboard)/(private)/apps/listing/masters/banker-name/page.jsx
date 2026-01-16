// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import BankerNameTable from '@/views/apps/listing/masters/banker-name/BankerNameTable'

/* const getUserData = async () => {
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }
  return res.json()
} */
const BankerNameApp = async () => {
  // Vars
  const data = await getUserData()

  return <BankerNameTable userData={data} />
}

export default BankerNameApp
