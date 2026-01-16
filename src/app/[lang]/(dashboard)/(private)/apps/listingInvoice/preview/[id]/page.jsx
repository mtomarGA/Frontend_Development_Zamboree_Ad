'use client'
import AllproposalDetailsById from '@/services/premium-listing/banner.service';
import Preview from '@/views/apps/listing-proposal/preview'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function page() {

  const { id } = useParams();
  const [data, setdata] = useState([]);
  const Getdatabyid = async () => {
    const res = await AllproposalDetailsById.getAllproposalDetailsById(id);
    setdata(res.data || {});
  }

  useEffect(() => {
    if (id) {
      Getdatabyid();
    }
  }, [id]);

  return (
    <div>
      {data ? <Preview invoiceData={data} id={data?.invoiceid} Getdatabyid={Getdatabyid}/> : null}
    </div>
  )
}

export default page


