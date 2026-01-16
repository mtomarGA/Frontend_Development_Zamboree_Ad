// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import ViewCategory from '@/views/apps/listing/masters/business-category/view-category/ViewCategoryTable'

/* const getUserData = async () => {

  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */
const CategoryApp = async () => {
  // Vars
  const data = await getUserData()

  return <ViewCategory userData={data} />
}

export default CategoryApp
