// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import NumerOfEmployeeTable from '@/views/apps/listing/masters/number-of-employee/NumerOfEmployeeTable'

/* const getUserData = async () => {
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }
  return res.json()
} */
const NumberOfEmployeeApp = async () => {
  // Vars
  const data = await getUserData()

  return <NumerOfEmployeeTable userData={data} />
}

export default NumberOfEmployeeApp
