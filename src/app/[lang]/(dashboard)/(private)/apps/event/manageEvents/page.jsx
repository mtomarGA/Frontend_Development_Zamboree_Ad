import React from 'react'
import ManageEvents from '@/views/apps/event/ManageEvent/ManageEvents'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <ProtectedRoute permission={"event_manageEvents:view"}>
            <ManageEvents />
        </ProtectedRoute>
    )
}

export default page
