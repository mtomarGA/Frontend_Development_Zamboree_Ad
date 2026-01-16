'use client'
import React from 'react'
import { ChristFormProvider } from '@/contexts/ChristFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddChurch from '@/views/apps/spritual/christ/manage/AddTemple'

const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_christ_manage_temple:view"} >
        <ChristFormProvider onSuccess={() => router.push(`en/apps/spritual/christ/manage`)} >
           <AddChurch  /> 
        </ChristFormProvider>
    </ProtectedRoute>
    )
}

export default page
