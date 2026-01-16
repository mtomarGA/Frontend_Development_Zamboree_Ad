'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import JainContentNew from '@/views/apps/spritual/jain/content/newJainContent'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_jain_manage_content:add"} >
            <JainContentNew />
        </ProtectedRoute>
    )
}

export default page
