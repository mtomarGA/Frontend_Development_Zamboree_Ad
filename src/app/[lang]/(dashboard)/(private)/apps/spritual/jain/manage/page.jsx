'use client'
import { JainismFormProvider } from '@/contexts/JainFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import JainismManage from '@/views/apps/spritual/jain/manage'
import AddJainTemple from '@/views/apps/spritual/jain/manage/AddTemple'
import React, { useState } from 'react'

const page = () => {
    const [addTemple, setaddTemple] = useState(false)
    return (
       <ProtectedRoute permission={"spiritual_jain_manage_temple:view"} >
        <JainismFormProvider onSuccess={() => setaddTemple(false)}>
            {addTemple ? <AddJainTemple handleAddView={() => setaddTemple(false)} /> : <JainismManage handleAddEmployee={() => setaddTemple(true)} />}
        </JainismFormProvider>
    </ProtectedRoute>
    )
}

export default page
