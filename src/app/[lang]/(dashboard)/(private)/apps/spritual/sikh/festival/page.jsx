'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import HinduismFestival from '@/views/apps/spritual/hinduism/festival'
import SikhFestival from '@/views/apps/spritual/sikh/festival'
import React, { useState } from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_sikh_festival:view"} >
            <SikhFestival />
        </ProtectedRoute>
    )
}

export default page
