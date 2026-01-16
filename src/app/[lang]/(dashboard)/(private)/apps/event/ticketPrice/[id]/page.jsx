import TicketPrice from '@/views/apps/event/TicketPrice/TicketPrice'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>
                <TicketPrice />
            </ProtectedRoute>
        </div>
    )
}

export default page
