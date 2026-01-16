'use client'
import React, { useEffect, useState } from 'react'
import QuestionTable from './QuestionTable'
import AddModal from './AddModal'
import ContestQues from '@/services/quiz/quiz-contest/questionService'
import { useParams } from 'next/navigation'

function MainQues() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const { id } = useParams();

    const [QuesData, setQuesData] = useState([])
    const getdata = async () => {
        const response = await ContestQues.getdatabyid(id);
        setQuesData(response?.data || [])
    }
    useEffect(() => {
        getdata()
    }, [])
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} level={id} getdata={getdata} handleClickOpen={handleClickOpen} />
            <QuestionTable handleClickOpen={handleClickOpen} QuesData={QuesData} getdata={getdata} />
        </div>
    )
}

export default MainQues
