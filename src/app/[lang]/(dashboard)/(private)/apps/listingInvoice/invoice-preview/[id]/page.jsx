'use client'
import AllproposalDetailsById from '@/services/premium-listing/banner.service';
import Preview from '@/views/apps/listing-proposal/invoice-preview'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function page() {

  const { id } = useParams();
  console.log(id, "Id Hai ye");

  const [data, setdata] = useState([]);






  const Getdatabyid = async () => {
    const res = await AllproposalDetailsById.getAllproposalDetailsById(id);
    console.log(res.data,"sasasasas");
    
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


