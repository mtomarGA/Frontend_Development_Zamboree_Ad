// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'

const PreviewCard = ({ invoiceData }) => {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log(invoiceData, "invoiceData");
  // Calculate subtotal from ticket details
  // const subtotal = invoiceData?.ticketdetails?.reduce((sum, ticket) => sum + (ticket.amount), 0) || 0;

  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'>Event Management System</Typography>
                    <Typography color='text.primary'>123 Event Street, Venue City</Typography>
                    <Typography color='text.primary'>+1 (234) 567 8901</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Invoice #${invoiceData?.invoiceid}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Date Issued: ${formatDate(invoiceData?.createdAt)}`}</Typography>
                    <Typography color='text.primary'>{`Status: ${invoiceData?.status}`}</Typography>
                    <Typography color='text.primary'>{`Order ID: ${invoiceData?.orderid}`}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>{invoiceData?.user?.lastName ? `${invoiceData?.user?.firstName} ${invoiceData?.user?.lastName}` : `${invoiceData?.user?.firstName}`}</Typography>
                    <Typography>{`Customer ID: ${invoiceData?.user?.userId}`}</Typography>
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Event Details:
                  </Typography>
                  <div>
                    <Typography>{invoiceData?.eventid?.event_title}</Typography>
                    <Typography>{`Payment ID: ${invoiceData?.transaction_id?.transactionid ? invoiceData?.transaction_id?.transactionid : 'N/A'}`}</Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead className='border-bs-0'>
                  <tr>
                    <th className='!bg-transparent'>Ticket Type</th>
                    <th className='!bg-transparent'>Description</th>
                    <th className='!bg-transparent'>Quantity</th>
                    <th className='!bg-transparent'>Price</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.ticketdetails?.map((ticket, index) => (
                    <tr key={index}>
                      <td>
                        <Typography color='text.primary'>
                          {ticket._id?.ticket_name || '—'}
                        </Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>
                          {ticket._id?.description || '—'}
                        </Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>
                          {ticket.quantity || '—'}
                        </Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>
                          ₹{ticket?._id?.without_variation_price || 0}
                        </Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>
                          ₹{Number(ticket.amount || 0) +
                            Number(ticket.gst || 0) +
                            Number(ticket.commission_gst || 0)}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <Typography>Thank you for your purchase!</Typography>
                <Typography>Please contact support for any questions.</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹{invoiceData?.amount?.toFixed(2)}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Commission:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹{invoiceData?.gst?.toFixed(2)}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Commission GST:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹{invoiceData?.commission_gst?.toFixed(2)}
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹{Number(invoiceData?.amount?.toFixed(2) || 0) + Number(invoiceData?.commission_gst?.toFixed(2) || 0) + Number(invoiceData?.gst?.toFixed(2) || 0)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              This is an automated invoice for your event tickets. Your tickets will be sent to your registered email address.
              For any issues, please contact our support team with your invoice number.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
