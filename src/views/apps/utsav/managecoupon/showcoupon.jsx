'use client'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import Link from '@/components/Link'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import Historytable from '../redeemcoupon/historytable'

function Showcoupon() {
  // modal

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)


  // tab


  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [showcoupon, setshowcoupon] = useState([])
  const { id } = useParams()





  useEffect(() => {
    const editid = async () => {
      const result = await CouponRoute.getdatabyid(id)
      const data = result.data

      setshowcoupon({
        ...data
      })
    }

    editid()
  }, [])

  console.log(showcoupon)

  // formate date
  const expiryDateFun = ExpiryDate => {
    const date = new Date(ExpiryDate)
    const formattedDate = date.toLocaleDateString('en-GB') // This formats it as dd/mm/yyyy
    return formattedDate
    // console.log(formattedDate)
  }




  // const days=expiry-created;
  // console.log(days)
  return (

    // modal

    <>
      {/* <Button variant='outlined' onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Create Redeem
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          {/* <Typography> */}



          {/* </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained'>
            Redeem
          </Button>
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>







      <div className='p-6 shadow overflow'>
        <div>
          {/* heading */}
          <div className='text-center '>
            <h3>Coupon Details</h3>
          </div>

          <div className='p-2'>
            <TabContext value={value}>
              <div className='flex h-full'>
                {/* Tabs */}
                <div className='flex flex-col border-r border-gray-300 pr-4 min-w-[180px]'>
                  <CustomTabList
                    pill='true'
                    orientation='vertical'
                    onChange={handleChange}
                    aria-label='customized vertical tabs example'
                  >
                    <Tab value='1' label='Overview' className='items-start text-left' />
                    {/* <Tab value='2' label='Location' className='items-start text-left' /> */}
                    <Tab value='3' label='Validity' className='items-start text-left' />
                    {/* <Tab value='4' label='Discounts' className='items-start text-left' /> */}
                    <Tab value='5' label='Redeem History' className='items-start text-left' />
                    <Tab value='6' label='Vendor Detail' className='items-start text-left' />
                  </CustomTabList>
                </div>

                {/* Tab Panels */}
                <div className='pl-6 w-full'>

                  {/* overview */}
                  <TabPanel value='1'>
                    <Typography className='flex mx-6 mt-0 flex-col' component={'div'}>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Coupon ID:</span>
                        {showcoupon.couponId}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Created Date:</span> {expiryDateFun(showcoupon.createdAt)}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Title:</span> {showcoupon.title}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Utsav Category:</span> {showcoupon.category?.categoryname}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Voucher Type:</span> {showcoupon.vouchertype?.vouchertype}
                      </p>


                      <div className="m-2 mx-4">
                        <span className="font-bold">Heading:</span>
                        <ol className="list-decimal list-inside ml-6">
                          {showcoupon.description?.map((step, idx) => (
                            <div key={idx}>
                              {/* <li key={idx}>{step?.title}</li> */}
                              <h2>{step?.title}</h2>
                              {step?.desc.map((item, i) => {
                                return (
                                  <li key={i} className='list-disc'>{item}</li>
                                )
                              })}


                            </div>
                          ))}
                        </ol>
                      </div>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Days Valid:</span>
                        {(() => {
                          if (!showcoupon.createdAt || !showcoupon.expiryDate) return 'Invalid dates'

                          const created = new Date()
                          const expiry = new Date(showcoupon.expiryDate)

                          // If either date is invalid
                          if (isNaN(created) || isNaN(expiry)) return 'Invalid date format'

                          const diffTime = expiry.getTime() - created.getTime()
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                          return diffDays >= 0 ? `${diffDays} day(s)` : 'Expired'
                        })()}
                      </p>


                    </Typography>
                  </TabPanel>


                  {/* location */}
                  {/* <TabPanel value='2'>
                    <Typography className='flex mx-6 mt-0 flex-col'>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Country:</span> {showcoupon.country?.name}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>State:</span> {showcoupon.state?.name}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>City:</span> {showcoupon.city?.name}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Area:</span> {showcoupon.area?.name}
                      </p>
                    </Typography>
                  </TabPanel> */}


                  {/* Validity */}
                  <TabPanel value='3'>
                    <Typography className='flex mx-6 mt-0 flex-col' component={'div'}>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Expiry Date:</span> {expiryDateFun(showcoupon?.expiryDate)}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Redeem Days:</span>
                        {showcoupon.redeemdays?.join(', ')}
                      </p>

                      <div className="m-2 mx-4">
                        <span className="font-bold">How To Redeem:</span>
                        <ol className="list-decimal list-inside ml-6">
                          {showcoupon.how_to_redeem?.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>



                      <div className="m-2 mx-4">
                        <span className="font-bold">Terms and Conditions:</span>
                        <ol className="list-decimal list-inside ml-6">
                          {showcoupon.terms?.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                    </Typography>
                  </TabPanel>


                  {/* Discounts */}
                  {/* <TabPanel value='4'>
                    <Typography className='flex mx-6 mt-0 flex-col' component={'div'}>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Discount Type:</span> {showcoupon.discountType}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>
                          {(showcoupon?.percentage) ? "Percentage Value:" : "Discount Value:"}</span> {(showcoupon?.fixedvalue) || (`${showcoupon?.percentage}%`) || ""}
                      </p>
                    </Typography>
                  </TabPanel> */}
                  {/* Redeem */}

                  <TabPanel value='5'>
                    <Typography className='flex mx-6 mt-0 flex-col' component={'div'}>





                      <Historytable id={showcoupon?._id} />
                      {/* <Link href={`/apps/utsav/managecoupon/${id}`}><button>click</button></Link> */}





                    </Typography>
                  </TabPanel>
                  {/* vendor Detail */}

                  <TabPanel value='6'>
                    <Typography className='flex mx-6 mt-0 flex-col' component={'div'}>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>ID:</span> {showcoupon?.BusinessId?.vendorId}
                      </p>

                      <p className='m-2'>
                        <span className='font-bold mx-2'>Name:</span> {showcoupon?.BusinessId?.companyInfo?.companyName}
                      </p>

                      <p className='m-2'>
                        <span className='font-bold mx-2'>Country:</span>{showcoupon?.BusinessId?.locationInfo?.country}
                      </p>

                      {/* </p> */}
                      <p className='m-2'>
                        <span className='font-bold mx-2'>State:</span> {showcoupon?.BusinessId?.locationInfo?.state}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>City:</span> {showcoupon?.BusinessId?.locationInfo?.city}
                      </p>
                      <p className='m-2'>
                        <span className='font-bold mx-2'>Area:</span> {showcoupon?.BusinessId?.locationInfo?.area}
                      </p>
                    </Typography>
                  </TabPanel>
                </div>
              </div>
            </TabContext>
          </div>
        </div >
      </div >
    </>
  )
}
export default Showcoupon
