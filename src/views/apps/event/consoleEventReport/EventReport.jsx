'use client'
import React, { useEffect, useState } from 'react'
import EventReportTable from './EventReportTable'
import BookedTicket from '@/services/event/event_mgmt/BookedTicket';

function EventReport() {
    const [data, setdata] = useState([]);
    const allTransaction = async () => {
        const response = await BookedTicket.getbyEventid();
        console.log(response, "sss");
        setdata(response?.data || [])
    }

    useEffect(() => {
        allTransaction()
    }, [])

    return (
        <div>
            <EventReportTable data={data} />
        </div>

    )
}

export default EventReport
