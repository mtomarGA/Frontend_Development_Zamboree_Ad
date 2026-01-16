'use client'
import React, { useEffect, useState } from 'react'
import EntryTable from './EntryTable'
import { useParams } from 'next/navigation'
import EventService from '@/services/event/event_mgmt/event'
import TicketService from '@/services/event/event_mgmt/ticketService'
import AttendeesService from '@/services/event/event_mgmt/AttendeesService'

function CheckIn() {
    const { id, arrayid } = useParams()

    const [eventData, setEventData] = useState(null)
    const [date, setDate] = useState('')
    const [AllTickets, setAllTickets] = useState([])

    // Step 1: Fetch Event and set selected date
    const fetchEvent = async () => {
        try {
            const response = await AttendeesService.GetEvent(id)
            const event = response?.data || null
            setEventData(event)

            const selectedRaw = event?.startDateTime?.[arrayid]
            if (selectedRaw) {
                // const formattedDate = new Date(selectedRaw).toISOString().split('T')[0]
                // setDate(formattedDate)
                setDate(selectedRaw)
            }
        } catch (error) {
            console.error('Error fetching event:', error)
        }
    }
    useEffect(() => {

        if (id && arrayid) fetchEvent()
    }, [id, arrayid])

    // Step 2: Fetch Tickets when `date` is ready


    const GetBookedUser = async () => {
        try {
            if (id && date) {
                const response = await TicketService.getBookedTicketByEventIdAttendees({ id, date })
                setAllTickets(response?.data || [])
            }
        } catch (error) {
            console.error('Error fetching tickets:', error)
        }
    }


    useEffect(() => {
        if (id && date) {
            GetBookedUser()

        }
    }, [id, date])

    console.log(date, "entry")
    return (
        <div>
            <EntryTable fetchEvent={fetchEvent} eventData={eventData} Selecteddate={date} AllTickets={AllTickets} arrayid={arrayid} GetBookedUser={GetBookedUser} />
        </div>
    )
}

export default CheckIn
