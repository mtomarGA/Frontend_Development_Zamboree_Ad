'use client'
import React, { useEffect, useState } from 'react'
import UserTable from './UserTable'
import AddUserModal from './addUserModel' // 👈 Capitalized import
import { useScannerContext } from '@/contexts/scannerUser/ScannerContext'

function Index() {
    const { getUser } = useScannerContext()
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [users, setusers] = useState([])
    const getUserFun = async () => {
        const res = await getUser()
        setusers(res.data || [])
    }

    useEffect(() => {
        getUserFun()
    }, [])

    return (
        <div>
            <AddUserModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} getUserFun={getUserFun} />
            <UserTable handleClickOpen={handleClickOpen} open={open} users={users} getUserFun={getUserFun} />
        </div>
    )
}

export default Index
