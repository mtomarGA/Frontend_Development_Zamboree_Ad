'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ManageContent from '@/views/apps/spritual/hinduism/content'
import React from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_hinduism_manage_content:view"} >
            <ManageContent />
        </ProtectedRoute>
    )
}

export default page
