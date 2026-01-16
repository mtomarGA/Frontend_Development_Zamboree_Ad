'use client'

import React from 'react'

import HinduContentNew from '@/views/apps/spritual/hinduism/content/newHinduContent'
import { ProtectedRoute } from '@/utils/ProtectedRoute'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_hinduism_manage_content:add"} >
            <HinduContentNew />
        </ProtectedRoute>
    )
}

export default page
