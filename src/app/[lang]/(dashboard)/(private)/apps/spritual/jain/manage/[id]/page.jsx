//create edit page and find the id route the param
'use client'
import { TempleFormProvider, useTempleContext } from '@/contexts/TempleFormContext'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import AddTemple from '@/views/apps/spritual/hinduism/manage/AddTemple'

import HinduService from '@/services/spritual/hinduService'
import { CircularProgress } from '@mui/material'
import { JainismFormProvider, useJainism } from '@/contexts/JainFormContext'
import JainService from '@/services/spritual/jainService'
import AddJainTemple from '@/views/apps/spritual/jain/manage/AddTemple'


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
        <JainismFormProvider>
            <EditTemple id={id} />
        </JainismFormProvider>
        // </ProtectedRoute>
    )
}
export default page

//create a component for add temple
const EditTemple = ({ id }) => {
    const [loading, setloading] = useState(false)
    const {handleLoadData} = useJainism()
    const getTempleData = async () => {
        setloading(true)
        if (!id) {
            return
        }
        try {
            const response = await JainService.getById(id)
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
        <AddJainTemple handleAddView={() => router.push("/en/apps/spritual/jain/manage")} />
    )
}
