'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Setting from '@/views/apps/spritual/buddha/setting'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_buddhism_setting:view"} >
            <Setting />
        </ProtectedRoute>
    )
}

export default page
