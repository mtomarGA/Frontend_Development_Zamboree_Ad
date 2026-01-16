'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import NewContent from '@/views/apps/spritual/buddha/content/newContent'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_buddha_manage_content:add"} >
            <NewContent />
        </ProtectedRoute>
    )
}

export default page
