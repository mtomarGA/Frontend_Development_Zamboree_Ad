//create edit page and find the id route the param
'use client'
import { TempleFormProvider, useTempleContext } from '@/contexts/TempleFormContext'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'

import HinduService from '@/services/spritual/hinduService'
import { CircularProgress } from '@mui/material'
import { GurudwaraFormProvider, useGurudwara } from '@/contexts/GurudwaraFormContext'
import SikhService from '@/services/spritual/sikhService'
import AddGurudwara from '@/views/apps/spritual/sikh/manage/AddGurudwara'


const page = () => {
    const params = useParams()
    const [id, setid] = useState("")



    useEffect(() => {
        if (params.id) {
            setid(params.id)
            
        }
    }, [params.id])

    return (
        // <ProtectedRoute permission="employees_all_employees:view">
        <GurudwaraFormProvider>
            <EditGurudwara id={id} />
        </GurudwaraFormProvider>
        // </ProtectedRoute>
    )
}
export default page

//create a component for add temple
const EditGurudwara = ({ id }) => {
    const [loading, setloading] = useState(false)
    const {handleLoadData} = useGurudwara()
    console.log("gurudwara id", id);
    
    const getGurudwaraData = async () => {
        console.log("getGurudwaraData called with id:", id);
        
        setloading(true)
        if (!id) {
            return
        }
        try {
            const response = await SikhService.getGurudwaraById(id)
            console.log("sikh data", response.data);
            handleLoadData(response.data)
        } catch (error) {
            console.error("error in sikh edit" + error);
        } finally {
            setloading(false)
        }
    }
    const router = useRouter()

    useEffect(() => {
        getGurudwaraData()
    }, [id])

    if (loading) {
        return <CircularProgress />
    }

    return (
        <AddGurudwara handleAddView={() => router.push("/en/apps/spritual/sikh/manage")} />
    )
}
