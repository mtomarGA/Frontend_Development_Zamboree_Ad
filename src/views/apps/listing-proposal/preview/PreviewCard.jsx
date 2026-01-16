// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import companyData from "@/services/premium-listing/banner.service"
// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'
import { useEffect, useState } from 'react'

const PreviewCard = ({ invoiceData }) => {
  const [data, setData] = useState([])
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

  // console.log(invoiceData, "Hellooo");


  const OurCopmanyDeta = async () => {
    const result = await companyData.CompanyDetails()
    console.log(result, "resultresult");

    setData(result?.data[0])
  }
  useEffect(() => {
    OurCopmanyDeta()
  }, [])


  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-4 flex-col sm:flex-row '>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'>{`Address🏢: ${data?.address}`}</Typography>
                    <Typography color='text.primary'>{`Phone📞: ${data?.contact_no}`}</Typography>
                    <Typography color='text.primary'>{`Email✉️: ${data?.email}`}</Typography>
                    <Typography color='text.primary'>{`GST No.🧾: ${data?.company_gst_number}`}</Typography>
                   
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Proposal  Id # ${invoiceData?.PROPOSALId}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Date Issued: ${formatDate(invoiceData?.invoiceDate)}`}</Typography>
                    <Typography color='text.primary'>{`Status: ${invoiceData?.status}`}</Typography>
                    <Typography
                      sx={{
                        color: 'white',
                        px: 1,            // horizontal padding
                        py: 0.5,          // vertical padding
                        borderRadius: 1,
                        width: 'fit-content',
                        // border: '1px solid',
                        backgroundColor: invoiceData?.status === "PAID" ? 'success.main' : 'error.main'
                      }}
                    >
                      {invoiceData?.status === "PAID" ? "Paid" : "Unpaid"}
                    </Typography>

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
                    Proposal To:
                  </Typography>
                  <div>
                    <Typography>{invoiceData?.basicDetails && `${invoiceData?.basicDetails?.vendor?.companyInfo?.companyName}`}</Typography>
                    <Typography>{invoiceData?.basicDetails && `Phone📞:${invoiceData?.basicDetails?.vendor?.contactInfo?.phoneNo}`}</Typography>
                    <Typography>{invoiceData?.basicDetails?.invoiceData?.basicDetails?.vendor?.contactInfo?.email && `Email✉️:${invoiceData?.basicDetails?.vendor?.contactInfo?.email}`}</Typography>
                    <Typography>{`Business ID: ${invoiceData?.basicDetails?.vendor?.vendorId}`}</Typography>
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Proposal By:
                  </Typography>
                  <div>
                    <Typography>
                      {invoiceData?.proposalBy
                        ? `${invoiceData.proposalBy.employee_id || 'Admin'} `
                        : invoiceData?.proposalBy
                          ? `${invoiceData.proposalBy.employee_id || 'Admin'}`
                          : ''}
                    </Typography>

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
                    <th className='!bg-transparent'>Package</th>
                    <th className='!bg-transparent'>Validity</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {invoiceData?.ticketdetails?.map((ticket, index) => ( */}
                  <tr key={''}>
                    <td>
                      <Typography color='text.primary'>
                        {invoiceData?.basicDetails?.bannerPackage || invoiceData?.basicDetails?.FixedListing || invoiceData?.basicDetails?.paidListingPackage || '—'}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        color="text.primary"
                        sx={{
                          whiteSpace: 'normal', // allow wrapping
                          wordBreak: 'break-word', // break long words if needed
                        }}
                      >
                        {invoiceData?.basicDetails?.validity || '—'}
                      </Typography>

                    </td>
                 
                    <td>
                      <Typography color='text.primary'>
                        ₹ {invoiceData?.amount?.EstimateTotal}
                      </Typography>
                    </td>
                  </tr>
                  {/* ))} */}
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
                    ₹ {invoiceData?.amount?.Subtotal}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>GST:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹ {invoiceData?.amount?.TAX18}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Round OFF:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹ {invoiceData?.amount?.RoundOFF}
                  </Typography>
                </div>

                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹ {invoiceData?.amount?.EstimateTotal}
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className="font-medium" color="text.primary">
                    {invoiceData?.discountType === '%'
                      ? `${invoiceData?.descount}%`
                      : invoiceData?.discountType === 'fixed'
                        ? `₹ ${invoiceData?.descount}`
                        : invoiceData?.discount
                    }
                  </Typography>

                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Grand Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ₹ {(() => {
                      const value = invoiceData?.amount?.totalPriceWithDiscount ?? 0;
                      const decimal = value % 1;

                      let rounded;
                      if (decimal <= 0.4) {
                        rounded = Math.floor(value);
                      } else {
                        rounded = Math.ceil(value);
                      }

                      return rounded.toFixed(2); // 2 digits after decimal
                    })()}
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
              <Typography component="span" className="font-medium" color="text.primary">
                Terms & Conditions:
              </Typography>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {invoiceData?.termsAndConditions?.map((term, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <Typography component="span" color="text.primary">
                      {term}
                    </Typography>
                  </li>
                ))}
              </ul>

            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              <Typography component="span" className="font-medium" color="text.primary">
                Client Notes:
              </Typography>

              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {invoiceData?.clientNote?.map((note, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <Typography component="span" color="text.primary">
                      {note}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
