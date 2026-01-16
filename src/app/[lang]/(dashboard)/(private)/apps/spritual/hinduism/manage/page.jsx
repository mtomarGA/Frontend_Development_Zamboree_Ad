'use client'
import { EmployeeFormProvider } from '@/contexts/EmployeeFormContext'
import { TempleFormProvider } from '@/contexts/TempleFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import HinduismManage from '@/views/apps/spritual/hinduism/manage'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'
import React, { useState } from 'react'

const page = () => {
    const [addTemple, setaddTemple] = useState(false)
    return (
       <ProtectedRoute permission={"spiritual_hinduism_manage_temple:view"} >
        <TempleFormProvider onSuccess={() => setaddTemple(false)}>
            {addTemple ? <AddTemple handleAddView={() => setaddTemple(false)} /> : <HinduismManage handleAddEmployee={() => setaddTemple(true)} />}
        </ TempleFormProvider>
    </ProtectedRoute>
    )
}

export default page
