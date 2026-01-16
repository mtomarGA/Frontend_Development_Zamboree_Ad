'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ContentEdit from '@/views/apps/spritual/christ/content/ContentEdit'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_christ_manage_content:edit"} >
            <ContentEdit />
        </ProtectedRoute>
    )
}

export default page
