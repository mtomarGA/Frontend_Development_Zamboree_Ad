'use client'
import React, { useEffect, useState } from 'react'
import TicketTable from './TicketTable'
import AddModal from './AddModal'
import { useParams } from 'next/navigation'
import TicketService from '@/services/event/event_mgmt/ticketService'

function TicketPrice() {
    const { id } = useParams();

    const [TicketData, setTicketData] = useState([]);


    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const getdata = async () => {
        const response = await TicketService.getbyid(id);
        setTicketData(response?.data || []);
    }
    useEffect(() => { getdata() }, [])
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} getdata={getdata} Eventid={id} handleClickOpen={handleClickOpen} />
            <TicketTable handleClickOpen={handleClickOpen} getdata={getdata} Eventid={id}   quizType={TicketData} />
        </div>
    )
}

export default TicketPrice
