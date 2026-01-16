'use client'
import React, { use, useEffect, useState } from 'react'
import { useInvoiceContext } from '@/contexts/invoiceSetting/SettingContextService'
import { toast } from 'react-toastify'
import InvoiceSettingform from './InvoiceSettingform'

function Index() {
  // context
  const { addInvoice, getdatafun, data, setdata, deleteSetting, updateSetting } = useInvoiceContext();

  useEffect(() => {
    getdatafun();
  }, []);


  const deletefun = async (id) => {
    const res = await deleteSetting(id);
    if (res.success === true) {
      toast.success(res?.message);
      getdatafun();
    }
  }


  return (
    <div>
      <InvoiceSettingform addInvoice={addInvoice} fetcheddata={data} updateSetting={updateSetting} />
    </div>
  )
}

export default Index
