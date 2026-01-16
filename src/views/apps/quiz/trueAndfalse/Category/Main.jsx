'use client'
import React, { useState } from 'react';
import GuesTheWordTable from './GueseTable';
import AddModal from './AddModal'
import { useEffect } from 'react';
import TrueAndFalseCategoryRoute from '@/services/quiz/trueAndFalse/CategoryService';

function GuesTheWord() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await TrueAndFalseCategoryRoute.Get();
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
