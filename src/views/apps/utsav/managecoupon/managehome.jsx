'use client'
import React, { useEffect, useState } from 'react'
import CouponTable from './table'
import { Button } from '@mui/material'
import AddcouponModal from './addcouponmodal'
import Link from 'next/link'
import CouponRoute from '@/services/utsav/managecoupon/manage'

const statusStyles = {
  ACTIVE: 'success',
  PENDING: 'warning',
  REJECTED: 'error'
}

function Managehome() {

  // States
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [coupondata, setcoupondata] = useState([]);


  // fetch coupon

  const getcoupon = async () => {

    const response = await CouponRoute.getCoupon();
    // console.log(response.data);
    setcoupondata(response.data);

  }

  useEffect(() => {
    getcoupon()
  }, []);



  return (
    <>

      {/* add modal */}

      <div className=' mx-4 my-2'>
        <h3>Manage Utsav</h3>
      </div>



      {/* table  */}
      <CouponTable coupondata={coupondata} getcoupon={getcoupon} setcoupondata={setcoupondata} statusStyles={statusStyles} />
    </>
  )
}

export default Managehome
