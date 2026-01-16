'use client'
import React, { useEffect, useState } from 'react'
import Tabtable from './tab'
import { Button } from '@mui/material'
import AddvoucherModal from './addvoucherModal'
import { handleClickNode } from '@formkit/drag-and-drop'
import voucherRoute from '@/services/utsav/voucher'
import { toast } from 'react-toastify'

import Image from '@/services/imageService';

function Utsavmaster() {


  const [formErrors, setFormErrors] = useState({})
  const validateFields = data => {
    let errors = {}
    if (!data.icon) errors.icon = 'Icon is required'
    if (!data.vouchertype) errors.vouchertype = 'voucher Type is required'
    if (!data.status) errors.status = 'Status is required'

    return errors
  }



  const [getVoucherdata, SetgetVoucherdata] = useState([]);

  // addVouchermodal
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => { setOpen(true) }
  const handleClose = () => setOpen(false)


  // onchange voucher
  const [voucher, setvoucher] = useState({ status: "INACTIVE" });
  const OnchangeVoucher = (e) => {
    setvoucher({ ...voucher, [e.target.name]: e.target.value });
    console.log(voucher);
  }

  // post voucher
  // const SubmitVoucher=async()=>{
  //   let response= await voucherRoute.PostVoucher(voucher);
  //   console.log(response);
  //   handleClose();
  //   fetchData();
  // }

  const SubmitVoucher = async () => {
    const errors = validateFields(voucher);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      let response = await voucherRoute.PostVoucher(voucher);

      if (response?.success == true) {
        toast.success(response.message || "Failed to add voucher");
        handleClose();
        fetchData();
        return;
      }

      toast.success("Voucher Added");
      handleClose();
      setvoucher({});
    } catch (error) {
      console.error("Voucher submission error:", error);
      toast.error("Something went wrong while adding the voucher");
    }
  };



  const [isloading, setIsLoading] = useState(false)
  const onchangeimage = async (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const result = await Image.uploadImage({ image: file });

      if (result.data.url) {
        setvoucher(prev => ({
          ...prev,
          [name]: result.data.url
        }));

        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
      setImageData(prev => ({
        ...prev,
        [name]: { ...prev[name], loading: false }
      }));
    } finally {
      setIsLoading(false);
    }
  };



  const fetchData = async () => {
    let response = await voucherRoute.getVoucher()
    console.log(response.data)
    SetgetVoucherdata(response.data)
  }

  useEffect(() => {

    fetchData();
  }, []);


  // console.log(getVoucherdata);






  return (
    <div className='p-6'>
      <div className='flex mb-5 mt-0'><h3 >Masters</h3></div>



      {/* Voucher modal */}
      <AddvoucherModal open={open} SubmitVoucher={SubmitVoucher} handleClickOpen={handleClickOpen} voucher={voucher} OnchangeVoucher={OnchangeVoucher} onchangeimage={onchangeimage} isloading={isloading} formErrors={formErrors} handleClose={handleClose} />






      {/* master tab */}
      <div>
        <Tabtable getVoucherdata={getVoucherdata} handleClickOpen={handleClickOpen} fetchData={fetchData} SetgetVoucherdata={SetgetVoucherdata} seticonloading={setIsLoading} iconloading={isloading} />

      </div>


    </div>
  )
}

export default Utsavmaster
