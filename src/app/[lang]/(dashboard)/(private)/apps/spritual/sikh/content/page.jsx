'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ManageContent from '@/views/apps/spritual/hinduism/content'
import ManageSikhContent from '@/views/apps/spritual/sikh/content'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_sikh_manage_content:view"} >
            <ManageSikhContent />
        </ProtectedRoute>
    )
}

export default page
