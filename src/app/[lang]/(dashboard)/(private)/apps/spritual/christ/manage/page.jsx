'use client'
import { ChristFormProvider } from '@/contexts/ChristFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ChristManage from '@/views/apps/spritual/christ/manage'
import AddChurch from '@/views/apps/spritual/christ/manage/AddTemple'
import React, { useState } from 'react'

const page = () => {
    const [addTemple, setaddTemple] = useState(false)
    return (
       <ProtectedRoute permission={"spiritual_christ_manage_temple:view"} >
        <ChristFormProvider onSuccess={() => setaddTemple(false)}>
            {addTemple ? <AddChurch handleAddView={() => setaddTemple(false)} /> : <ChristManage handleAddEmployee={() => setaddTemple(true)} />}
        </ChristFormProvider>
    </ProtectedRoute>
    )
}

export default page
