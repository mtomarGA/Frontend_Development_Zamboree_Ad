import React from 'react'
import Edit from '@/views/apps/event/ManageEvent/Edit'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (

        <ProtectedRoute permission={'event_event_approval:edit'} >
            <Edit />
        </ProtectedRoute>
    )
}

export default page
