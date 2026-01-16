'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import HinduismFestival from '@/views/apps/spritual/hinduism/festival'
import React, { useState } from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_hinduism_festival:view"} >
            <HinduismFestival />
        </ProtectedRoute>
    )
}

export default page
