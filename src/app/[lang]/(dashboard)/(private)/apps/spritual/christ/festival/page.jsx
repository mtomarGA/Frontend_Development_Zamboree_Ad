'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Festival from '@/views/apps/spritual/christ/festival'
import React, { useState } from 'react'


const page = () => {
    return (
        <ProtectedRoute permission={"spiritual_christ_festival:view"} >
            <Festival />
        </ProtectedRoute>
    )
}

export default page
