'use client'
import React, { useState } from 'react'
import ZoneTable from './zoneTable'
import AddModal from './AddModal'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices';
import { useEffect } from 'react';
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService';

function Main() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await QuizSubCategoryRoute.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <ZoneTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default Main
