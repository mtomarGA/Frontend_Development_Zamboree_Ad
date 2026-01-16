'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import JainFestival from '@/views/apps/spritual/jain/festival'
import React, { useState } from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_jain_festival:view"} >
            <JainFestival />
        </ProtectedRoute>
    )
}

export default page
