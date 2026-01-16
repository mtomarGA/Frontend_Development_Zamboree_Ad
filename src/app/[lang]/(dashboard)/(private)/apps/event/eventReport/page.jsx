import { ProtectedRoute } from '@/utils/ProtectedRoute'
import EventReport from '@/views/apps/event/consoleEventReport/EventReport'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_event_report:view"}>

            </ProtectedRoute>
            <EventReport />
        </div>
    )
}

export default page
