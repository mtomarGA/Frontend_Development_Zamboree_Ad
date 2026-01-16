'use client'
import React, { useState } from 'react'
import GuesTheWordTable from './GueseTable'
import AddModal from './AddModal'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices';
import { useEffect } from 'react';
import GuesTheWordCategoryRoute from '@/services/quiz/guesstheword/CategoryService';

function GuesTheWord() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await GuesTheWordCategoryRoute.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <GuesTheWordTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default GuesTheWord
