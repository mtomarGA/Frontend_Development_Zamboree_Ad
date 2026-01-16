'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import SikhSetting from '@/views/apps/spritual/sikh/setting'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_sikh_setting:view"} >
            <SikhSetting />
        </ProtectedRoute>
    )
}

export default page
