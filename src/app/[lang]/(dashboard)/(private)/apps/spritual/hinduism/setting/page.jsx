'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import HinduSetting from '@/views/apps/spritual/hinduism/setting'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_hinduism_setting:view"} >
            <HinduSetting />
        </ProtectedRoute>
    )
}

export default page
