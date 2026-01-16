'use client'
import React, { useState } from 'react'

import AddModal from './AddModal'
import QuizCategoryRoute from '@/services/quiz/quizCategoryServices';
import { useEffect } from 'react';
import QuizSubCategoryRoute from '@/services/quiz/quizSubCategoryService';
import SubCategoryTable from './SubCategoryTable';
import FunAndLearnSubCategoryRoute from '@/services/quiz/funAndLearn/SubCategoryService';
import SubCategoryTable1 from './SubCattegory';
function SubCategory() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await FunAndLearnSubCategoryRoute.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <SubCategoryTable1 handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default SubCategory
