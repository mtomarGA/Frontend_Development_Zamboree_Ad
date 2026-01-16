import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Commission from '@/views/apps/event/Commission/Commission'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission="event_commission:view">
                <Commission />
            </ProtectedRoute>
        </div>
    )
}

export default page
