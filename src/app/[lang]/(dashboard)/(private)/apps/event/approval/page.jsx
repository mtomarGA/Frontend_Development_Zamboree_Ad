import { ProtectedRoute } from '@/utils/ProtectedRoute'
import EventApproval from '@/views/apps/event/Approval/EventApproval'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={'event_event_approval:view'}>

                <EventApproval />
            </ProtectedRoute>
        </div>
    )
}

export default page
