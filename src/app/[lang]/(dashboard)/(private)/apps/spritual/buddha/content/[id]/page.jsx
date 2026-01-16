'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ContentEdit from '@/views/apps/spritual/buddha/content/ContentEdit'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_buddhism_manage_content:edit"} >
            <ContentEdit />
        </ProtectedRoute>
    )
}

export default page
