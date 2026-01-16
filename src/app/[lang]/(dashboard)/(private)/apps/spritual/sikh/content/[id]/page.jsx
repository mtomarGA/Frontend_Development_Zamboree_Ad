'use client'

import React from 'react'

import HinduContentEdit from '@/views/apps/spritual/hinduism/content/hinduContentEdit'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import SikhContentEdit from '@/views/apps/spritual/sikh/content/hinduContentEdit'


const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_sikh_manage_content:edit"} >
            <SikhContentEdit />
        </ProtectedRoute>
    )
}

export default page
