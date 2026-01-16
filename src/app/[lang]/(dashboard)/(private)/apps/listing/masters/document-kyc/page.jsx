// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import DocumentTypeTable from '@/views/apps/listing/masters/document-type/DocumentTypeTable'

/* const getUserData = async () => {
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }
  return res.json()
} */
const DocumentKycApp = async () => {
  // Vars
  const data = await getUserData()

  return <DocumentTypeTable userData={data} />
}

export default DocumentKycApp
