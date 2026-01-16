'use client'
import React, { useEffect, useState } from 'react'

import AddModal from './AddModal'

import QuestionTable from './QuestionTable'
import { useParams } from 'next/navigation'
import DailyQuizQuesRoute from '@/services/quiz/dailyquizQuesService'

function Main() {

    const { id } = useParams();

    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [GetData, setGetData] = useState([]);

    const GetQuesFun = async () => {
        const response = await DailyQuizQuesRoute.Getbyid(id);
        setGetData(response.data);
    }

    useEffect(() => { GetQuesFun() }, []);


    return (
        <div>

            <AddModal open={open} handleClose={handleClose} id={id} handleClickOpen={handleClickOpen} GetQuesFun={GetQuesFun} GetData={GetData} />
            <QuestionTable handleClickOpen={handleClickOpen} GetQuesFun={GetQuesFun} GetData={GetData} />
        </div>
    )
}

export default Main
