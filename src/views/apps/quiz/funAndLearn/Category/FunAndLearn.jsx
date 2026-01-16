'use client'
import React, { useState } from 'react'
import FunAndLearnTable from './FunAndLearnTable'
import AddModal from './AddModal'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices';
import { useEffect } from 'react';
import FunCategoryRoute from '@/services/quiz/funAndLearn/CategoryService';

function FunAndLearn() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await FunCategoryRoute.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <FunAndLearnTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default FunAndLearn
