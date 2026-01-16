'use client'
import { BuddhismFormProvider } from '@/contexts/BuddhaFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddBuddhaTemple from '@/views/apps/spritual/buddha/manage/AddTemple'
import React, { useState } from 'react'

const page = () => {
    
    return (
       <ProtectedRoute permission={"spiritual_buddhism_manage_temple:add"} >
        <BuddhismFormProvider onSuccess={() => router.push(`en/apps/spritual/buddha/manage`)} >
           <AddBuddhaTemple  /> 
        </BuddhismFormProvider>
    </ProtectedRoute>
    )
}

export default page
