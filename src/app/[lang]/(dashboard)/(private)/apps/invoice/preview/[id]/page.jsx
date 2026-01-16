'use client'
import EventInvoiceService from '@/services/event/invoice/EventInvoiceService';
import Preview from '@/views/apps/invoice/preview'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function page() {

  const { id } = useParams();
  const [data, setdata] = useState([]);
  const Getdatabyid = async () => {
    const res = await EventInvoiceService.getbyid(id);
    setdata(res.data || {});
  }

  useEffect(() => {
    if (id) {
      Getdatabyid();
    }
  }, [id]);

  return (
    <div>
      {data ? <Preview invoiceData={data} id={data?.invoiceid} /> : null}

    </div>
  )
}

export default page


