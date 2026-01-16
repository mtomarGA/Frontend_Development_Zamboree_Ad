// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import GstTurnoverTable from '@/views/apps/listing/masters/gst-turnover/GstTurnoverTable'

/* const getUserData = async () => {
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }
  return res.json()
} */
const GstTurnoverApp = async () => {
  // Vars
  const data = await getUserData()

  return <GstTurnoverTable userData={data} />
}

export default GstTurnoverApp
