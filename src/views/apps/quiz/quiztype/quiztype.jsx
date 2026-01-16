'use client'
import React, { use, useEffect, useState } from 'react'
import QuizTable from './QuizTable'
import AddModal from './AddModal'
import quizRoute from '@/services/quiz/quiztypeServices'



function Quiztype() {
    const [quizType, setQuizType] = useState([])
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)



    const getdata = async () => {
        const response = await quizRoute.Get()
        setQuizType(response.data)
    }

    useEffect(() => {
        getdata()
    }
        , []);
    return (
        <div>



            <AddModal handleClose={handleClose} open={open} getdata={getdata} />
            <QuizTable open={open} getdata={getdata} handleClickOpen={handleClickOpen} quizType={quizType} />
        </div>
    )
}

export default Quiztype
