// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import BusinessNatureTable from '@/views/apps/listing/masters/business-nature/BusinessNatureTable'

/* const getUserData = async () => {
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }
  return res.json()
} */
const BusinessNatureApp = async () => {
  // Vars
  const data = await getUserData()

  return <BusinessNatureTable userData={data} />
}

export default BusinessNatureApp
