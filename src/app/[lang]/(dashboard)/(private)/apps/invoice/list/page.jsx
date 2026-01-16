// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InvoiceList from '@views/apps/invoice/list'

// Data Imports
import { getInvoiceData } from '@/app/server/actions'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/invoice` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
/* const getInvoiceData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/invoice`)

  if (!res.ok) {
    throw new Error('Failed to fetch invoice data')
  }

  return res.json()
} */
const InvoiceApp = async () => {
  // Vars
  const data = await getInvoiceData()
  // const data = [{
  //   id: 1,
  //   issuedDate: '2023-01-01',
  //   address: '123 Main St',
  //   company: 'Acme Corp',
  //   companyEmail: 'info@acme.com',
  //   country: 'USA',
  //   contact: 'John Doe',
  //   name: 'John Doe',
  //   service: 'Web Development',
  //   total: 100,
  //   avatar: 'https://i.pravatar.cc/150?img=1',
  //   avatarColor: 'blue'
  // }]

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ProtectedRoute permission={'event_invoices:view'}>
          <InvoiceList invoiceData={data} />
        </ProtectedRoute>
      </Grid>
    </Grid>
  )
}

export default InvoiceApp
