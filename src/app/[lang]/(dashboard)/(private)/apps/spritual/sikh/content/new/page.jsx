'use client'

import React from 'react'

import HinduContentNew from '@/views/apps/spritual/hinduism/content/newHinduContent'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import SikhContentNew from '@/views/apps/spritual/sikh/content/newHinduContent'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_sikh_manage_content:add"} >
            <SikhContentNew />
        </ProtectedRoute>
    )
}

export default page
