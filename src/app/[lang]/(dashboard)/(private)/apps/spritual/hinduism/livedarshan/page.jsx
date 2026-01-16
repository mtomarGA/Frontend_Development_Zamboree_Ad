'use client'

import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import LiveDarshan from '@/views/apps/spritual/hinduism/livedarshan'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_hinduism_live_darshan:view"} >
            <LiveDarshan />
        </ProtectedRoute>
    )
}

export default page
