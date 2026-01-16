//create edit page and find the id route the param
'use client'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { ChristFormProvider, useChrist } from '@/contexts/ChristFormContext'
import ChristService from '@/services/spritual/christService'
import AddChurch from '@/views/apps/spritual/christ/manage/AddTemple'


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
        <ChristFormProvider>
            <EditTemple id={id} />
        </ChristFormProvider>
        // </ProtectedRoute>
    )
}
export default page

//create a component for add temple
const EditTemple = ({ id }) => {
    const [loading, setloading] = useState(false)
    const {handleLoadData} = useChrist()
    const getTempleData = async () => {
        setloading(true)
        if (!id) {
            return
        }
        try {
            const response = await ChristService.getById(id)
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
        <AddChurch handleAddView={() => router.push("/en/apps/spritual/christ/manage")} />
    )
}
