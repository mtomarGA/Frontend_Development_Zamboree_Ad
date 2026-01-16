import React from 'react'
import Show from '@/views/apps/event/ManageEvent/Show'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>
                <Show />
            </ProtectedRoute>
        </div>
    )
}

export default page
