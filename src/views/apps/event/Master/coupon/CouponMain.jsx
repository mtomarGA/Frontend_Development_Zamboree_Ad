'use client'
import React, { useEffect, useState } from 'react'
import CouponTable from './CouponTable'
import AddModal from './AddModal'
import EventCouponService from '@/services/event/coupon/eventCouponService'
import { useParams } from 'next/navigation'
import EventService from '@/services/event/event_mgmt/event'

function CouponMain() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const { id } = useParams();


    const [data, setdata] = useState([]);

    const getdata = async () => {
        const response = await EventCouponService.Get();
        setdata(response?.data || []);
    }


    useEffect(() => {
        getdata()
    }, [])

    const [event, setevent] = useState([]);

    const EventSearch = async () => {
        const response = await EventService.Get()
        // console.log(response.data);
        setevent(response?.data || []);
    }

    useEffect(() => {
        EventSearch()
    }, [])


    return (
        <div>

            <AddModal open={open} event={event} getdata={getdata} Event={id} handleClose={handleClose} handleClickOpen={handleClickOpen} />
            <CouponTable handleClickOpen={handleClickOpen} event={event} quizType={data} getdata={getdata} />
        </div>
    )
}

export default CouponMain
