'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Festival from '@/views/apps/spritual/buddha/festival'
import React, { useState } from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_buddhism_festival:view"} >
            <Festival />
        </ProtectedRoute>
    )
}

export default page
