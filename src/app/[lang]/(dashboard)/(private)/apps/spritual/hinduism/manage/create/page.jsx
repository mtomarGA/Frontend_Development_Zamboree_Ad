'use client'
import { EmployeeFormProvider } from '@/contexts/EmployeeFormContext'
import { TempleFormProvider } from '@/contexts/TempleFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import HinduismManage from '@/views/apps/spritual/hinduism/manage'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


const page = () => {
    const router = useRouter();
    return (
       <ProtectedRoute permission={"spiritual_hinduism_manage_temple:add"} >
        <TempleFormProvider onSuccess={() => router.push(`en/apps/spritual/hinduism/manage`)}>
            <AddTemple  /> 
        </TempleFormProvider>
    </ProtectedRoute>
    )
}

export default page
