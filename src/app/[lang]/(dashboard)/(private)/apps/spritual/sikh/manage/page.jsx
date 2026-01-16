'use client'
import { GurudwaraFormProvider } from '@/contexts/GurudwaraFormContext'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'
import SikhismManage from '@/views/apps/spritual/sikh/manage'
import AddGurudwara from '@/views/apps/spritual/sikh/manage/AddGurudwara'
import React, { useState } from 'react'

const page = () => {
    const [addGurudwara, setaddGurudwara] = useState(false)
    return (
       <ProtectedRoute permission={"spiritual_sikh_manage_gurudwara:view"} >
        <GurudwaraFormProvider onSuccess={() => setaddGurudwara(false)}>
            {addGurudwara ? <AddGurudwara handleAddView={() => setaddGurudwara(false)} /> : <SikhismManage handleAddEmployee={() => setaddGurudwara(true)} />}
        </GurudwaraFormProvider>
    </ProtectedRoute>
    )
}

export default page
