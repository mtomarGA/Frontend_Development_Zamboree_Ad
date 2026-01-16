'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import NewContent from '@/views/apps/spritual/christ/content/newContent'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_christ_manage_content:add"} >
            <NewContent />
        </ProtectedRoute>
    )
}

export default page
