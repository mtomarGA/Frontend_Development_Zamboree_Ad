'use client'
import React, { use, useEffect, useState } from 'react'

import TicketService from '@/services/event/event_mgmt/ticketService';
import BookedTable from './BookedTable';
import { useParams } from 'next/navigation';


function TicketBooking() {


    const { id, lang } = useParams();



    const [data, setdata] = useState([]);


    const getdata = async () => {
        const response = await TicketService.getBookedTicketByEventIdAttendees({ id: id });
        setdata(response?.data || []);
    }

    useEffect(() => {
        getdata();
    }, [id]);

    return (
        <div>
            <BookedTable quizType={data} lang={lang} Eventid={id} />
        </div>
    )
}

export default TicketBooking
