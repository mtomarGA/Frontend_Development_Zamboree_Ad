'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import JainSetting from '@/views/apps/spritual/jain/setting'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_jain_setting:view"} >
            <JainSetting />
        </ProtectedRoute>
    )
}

export default page
