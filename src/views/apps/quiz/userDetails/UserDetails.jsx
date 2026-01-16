'use client'
import React, { useEffect, useState } from 'react'
import UserTable from './UserTable'
import UserDetailsService from '@/services/quiz/userDetails/UserDetailsService'
// import UserDetailsService from '@/services/quiz/'

function Main() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [quizType, setQuizType] = useState([])

    const fetchActivity = async () => {
        const response = await UserDetailsService.Get()
        setQuizType(response.data)
    }

    useEffect(() => {
        fetchActivity()
    }, [])


    return (
        <div>


            <UserTable handleClickOpen={handleClickOpen} getdata={fetchActivity} quizType={quizType} />
        </div>
    )
}

export default Main
