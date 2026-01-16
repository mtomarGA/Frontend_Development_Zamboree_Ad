'use client'
import { JainismFormProvider } from '@/contexts/JainFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddJainTemple from '@/views/apps/spritual/jain/manage/AddTemple'
import React from 'react'

const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_jain_manage_temple:view"} >
        <JainismFormProvider onSuccess={ () => router.push(`en/apps/spritual/jain/manage`)}>
            <AddJainTemple /> 
        </JainismFormProvider>
    </ProtectedRoute>
    )
}

export default page
