'use client'

import React from 'react'

import HinduContentEdit from '@/views/apps/spritual/hinduism/content/hinduContentEdit'
import { ProtectedRoute } from '@/utils/ProtectedRoute'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_hinduism_manage_content:edit"} >
            <HinduContentEdit />
        </ProtectedRoute>
    )
}

export default page
