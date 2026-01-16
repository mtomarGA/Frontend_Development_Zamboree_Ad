//create edit page and find the id route the param
'use client'
import { TempleFormProvider, useTempleContext } from '@/contexts/TempleFormContext'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'

import HinduService from '@/services/spritual/hinduService'
import { CircularProgress } from '@mui/material'


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
        <TempleFormProvider>
            <EditTemple id={id} />
        </ TempleFormProvider>
        // </ProtectedRoute>
    )
}
export default page

//create a component for add temple
const EditTemple = ({ id }) => {
    const [loading, setloading] = useState(false)
    const {handleLoadData} = useTempleContext()
    const getTempleData = async () => {
        setloading(true)
        if (!id) {
            return
        }
        try {
            const response = await HinduService.getTempleById(id)
            console.log("temple data", response.data);
            handleLoadData(response.data)
        } catch (error) {
            console.error("error in temple edit" + error);
        } finally {
            setloading(false)
        }
    }
    const router = useRouter()

    useEffect(() => {
        getTempleData()
    }, [id])

    if (loading) {
        return <CircularProgress />
    }

    return (
        <AddTemple handleAddView={() => router.push("/en/apps/spritual/hinduism/manage")} />
    )
}
