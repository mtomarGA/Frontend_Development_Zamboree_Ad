//create edit page and find the id route the param
'use client'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import BuddhismService from '@/services/spritual/buddhaService'
import AddBuddhaTemple from '@/views/apps/spritual/buddha/manage/AddTemple'
import {  BuddhismFormProvider, useBuddhism } from '@/contexts/BuddhaFormContext'


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
        <BuddhismFormProvider>
            <EditTemple id={id} />
        </BuddhismFormProvider>
        // </ProtectedRoute>
    )
}
export default page

//create a component for add temple
const EditTemple = ({ id }) => {
    const [loading, setloading] = useState(false)
    const {handleLoadData} = useBuddhism()
    const getTempleData = async () => {
        setloading(true)
        if (!id) {
            return
        }
        try {
            const response = await BuddhismService.getById(id)
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
        <AddBuddhaTemple handleAddView={() => router.push("/en/apps/spritual/buddha/manage")} />
    )
}
