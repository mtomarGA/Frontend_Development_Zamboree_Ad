'use client'
import React, { useEffect, useState } from 'react'
import LevelTable from './LevelTable'
import AddModal from './AddModal'
import LevelRoute from '@/services/quiz/quiz-contest/LevelService'
import contestRoute from '@/services/quiz/quiz-contest/contestService'
import { useParams } from 'next/navigation'

function LevelsMain() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [contest, setcontest] = useState([]);
    const [GetLevel, setGetLevel] = useState([]);

    const { id } = useParams();
    const GetLevelFun = async () => {
        const res = await LevelRoute.Getbyid(id);
        setGetLevel(res?.data);
        // console.log(res.data, "res");
    }

    useEffect(() => {
        GetLevelFun()
    }, [])


    // fetch contest
    const fetchContest = async () => {
        const res = await contestRoute.Get();
        setcontest(res.data);
    }

    useEffect(() => {
        fetchContest()
    }, []);



    return (
        <div>

            <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} GetLevelFun={GetLevelFun} contest={contest} contestid={id} />
            <LevelTable handleClickOpen={handleClickOpen} contest={contest} GetLevelFun={GetLevelFun} GetLevel={GetLevel} />
        </div>
    )
}

export default LevelsMain
