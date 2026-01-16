import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Index from '@/views/apps/event/Master/LocalArtist/index.jsx'
import React from 'react'

function page() {
    return (

        <ProtectedRoute permission="event_masters:view">
            <Index />
        </ProtectedRoute>
    )

}


export default page
