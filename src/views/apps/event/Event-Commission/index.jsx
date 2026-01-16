'use client'
import React, { useCallback, useEffect, useState } from 'react'
import CommissionTable from './CommissionTable'
import AddModal from './AddModal'
import commissionService from '@/services/event/masters/commissionService'

function index() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false);

    const [data, setdata] = useState([]);
    const getdata = useCallback(async () => {
        try {
            const response = await commissionService.Get();
            setdata(response?.data || []);
        } catch (error) {
            console.error("Error fetching commission data:", error);
        }
    }, []);

    useEffect(() => {
        getdata();
    }, [getdata]);



    return (
        <div>

            <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} getdata={getdata} />
            <CommissionTable handleClickOpen={handleClickOpen} getdata={getdata} data={data} />
        </div>
    )
}

export default index
