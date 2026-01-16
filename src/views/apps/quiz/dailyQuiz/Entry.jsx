'use client'
import React, { useEffect, useState } from 'react'

import AddModal from './AddModal'
import DailyQuizTable from './DailyQuizTable'
import DailyQuizRoute from '@/services/quiz/dailyQuizServices'

function Entry() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [DailyQuizData, setDailyQuizData] = useState([]);
    const GetDailyQuizFun = async () => {
        const response = await DailyQuizRoute.Get();
        setDailyQuizData(response.data);
    }

    useEffect(() => { GetDailyQuizFun() }, [])


    return (
        <div>

            <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} GetDailyQuizFun={GetDailyQuizFun} />
            <DailyQuizTable handleClickOpen={handleClickOpen} setDailyQuizData={setDailyQuizData} GetDailyQuizFun={GetDailyQuizFun} DailyQuizData={DailyQuizData} />
        </div>
    )
}

export default Entry
