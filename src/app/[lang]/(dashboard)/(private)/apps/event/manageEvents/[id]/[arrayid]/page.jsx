import { ProtectedRoute } from '@/utils/ProtectedRoute'
import CheckIn from '@/views/apps/event/AttendeesCheckin/CheckIn'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>

                <CheckIn />
            </ProtectedRoute>
        </div>
    )
}

export default page
