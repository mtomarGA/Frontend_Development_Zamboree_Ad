'use client'

import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import LiveDarshan from '@/views/apps/spritual/christ/livedarshan'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_christ_live_darshan:view"} >
            <LiveDarshan />
        </ProtectedRoute>
    )
}

export default page
