// Component Imports
import Roles from '@views/apps/roles'

// Data Imports
import { getUserData } from '@/app/server/actions'
import BusinessLegalTable from '@/views/apps/listing/masters/business-legal/BusinessLegalTable'

const BusinessLegalApp = async () => {
  // Vars
  const data = await getUserData()

  return <BusinessLegalTable userData={data} />
}

export default BusinessLegalApp
