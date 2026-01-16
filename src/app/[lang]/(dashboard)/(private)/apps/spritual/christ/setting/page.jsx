'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Setting from '@/views/apps/spritual/christ/setting'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_christ_setting:view"} >
            <Setting />
        </ProtectedRoute>
    )
}

export default page
