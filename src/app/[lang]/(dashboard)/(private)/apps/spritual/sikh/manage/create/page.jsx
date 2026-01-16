'use client'
import { GurudwaraFormProvider } from '@/contexts/GurudwaraFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddGurudwara from '@/views/apps/spritual/sikh/manage/AddGurudwara'
import React from 'react'

const page = () => {
    return (
       <ProtectedRoute permission={"spiritual_sikh_manage_gurudwara:add"} >
        <GurudwaraFormProvider onSuccess={() => router.push(`en/apps/spritual/sikh/manage`)}>
           <AddGurudwara />
        </GurudwaraFormProvider>
    </ProtectedRoute>
    )
}

export default page
