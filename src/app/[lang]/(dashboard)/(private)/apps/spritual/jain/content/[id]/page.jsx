'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import JainContentEdit from '@/views/apps/spritual/jain/content/jainContentEdit'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_jain_manage_content:edit"} >
            <JainContentEdit />
        </ProtectedRoute>
    )
}

export default page
