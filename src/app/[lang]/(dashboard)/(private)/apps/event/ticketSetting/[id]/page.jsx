import { ProtectedRoute } from '@/utils/ProtectedRoute'
import TicketSetting from '@/views/apps/event/TicketSetting/TicketSetting'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"} >
                <TicketSetting />
            </ProtectedRoute>
        </div>
    )
}

export default page
