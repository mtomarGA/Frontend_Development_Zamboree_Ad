'use client'
import { BuddhismFormProvider } from '@/contexts/BuddhaFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import BuddhismManage from '@/views/apps/spritual/buddha/manage'
import AddBuddhaTemple from '@/views/apps/spritual/buddha/manage/AddTemple'
import React, { useState } from 'react'

const page = () => {
    const [addTemple, setaddTemple] = useState(false)
    return (
       <ProtectedRoute permission={"spiritual_buddhism_manage_temple:view"} >
        <BuddhismFormProvider onSuccess={() => setaddTemple(false)}>
            {addTemple ? <AddBuddhaTemple handleAddView={() => setaddTemple(false)} /> : <BuddhismManage handleAddEmployee={() => setaddTemple(true)} />}
        </BuddhismFormProvider>
    </ProtectedRoute>
    )
}

export default page
