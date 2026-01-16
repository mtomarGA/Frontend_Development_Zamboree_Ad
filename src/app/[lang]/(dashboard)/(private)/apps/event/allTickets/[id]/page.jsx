import { ProtectedRoute } from '@/utils/ProtectedRoute'
import TicketBooking from '@/views/apps/event/TicketBooking/TicketBooking'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>

                <TicketBooking />
            </ProtectedRoute>
        </div>
    )
}

export default page
