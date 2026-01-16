import { ProtectedRoute } from '@/utils/ProtectedRoute'
import TicketDetail from '@/views/apps/event/TicketBooking/TicketDetail'
import { Ticket } from 'lucide-react'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>
                <TicketDetail />
            </ProtectedRoute>
        </div>
    )
}

export default page
