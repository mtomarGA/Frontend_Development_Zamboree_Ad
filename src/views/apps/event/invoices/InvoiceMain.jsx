'use client'
import React, { useEffect, useState } from 'react'
import InvoiceTable from './InvoiceTable'
import EventInvoiceService from '@/services/event/invoice/EventInvoiceService'
import { set } from 'date-fns'
import { toast } from 'react-toastify'
// import AddModal from './AddModal'

function InvoiceMain() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(false);

    const FetchInvoice = async () => {
        setloading(true);
        const response = await EventInvoiceService.Get();
        setdata(response?.data || []);
        setloading(false);
    }


    const DeleteData = async (id) => {
        const response = await EventInvoiceService.deleteData(id);
        console.log(response, "sss")
        if (response?.statusCode === 200) {
            toast.success(response?.message || "Invoice deleted successfully");
            await FetchInvoice();
        } else {
            toast.error(response?.message || "Failed to delete invoice");
        }
    }

    useEffect(() => {
        FetchInvoice();
    }, []);


   

    return (
        <div>

            {/* <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} /> */}
            <InvoiceTable handleClickOpen={handleClickOpen} data={data} loading={loading} setdata={setdata} DeleteData={DeleteData} />
        </div>
    )
}

export default InvoiceMain
