'use client'
import React, { useEffect, useState } from 'react'
import ZoneTable from './ManageTable'
import AddModal from './AddModal'
import QuizLevelRoute from '@/services/quiz/quizLevel.route'
import FunAndLearnLevelRoute from '@/services/quiz/funAndLearn/LevelServices'
import TrueAndFalseLevelRoute from '@/services/quiz/trueAndFalse/LevelServices'

function Main() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)



    const [getlevel, setgetlevel] = useState([]);

    const GetLevelFun = async () => {
        const res = await TrueAndFalseLevelRoute.Get();
        setgetlevel(res?.data || []);
    }

    useEffect(() => {
        GetLevelFun()
    }, []);


    console.log(getlevel, "amss")
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetLevelFun={GetLevelFun} handleClickOpen={handleClickOpen} />
            <ZoneTable handleClickOpen={handleClickOpen} GetLevelFun={GetLevelFun} getlevel={getlevel} />
        </div>
    )
}

export default Main
