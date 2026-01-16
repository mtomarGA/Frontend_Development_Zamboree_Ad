'use client'
import React, { useState } from 'react'

import AddModal from './AddModal'

import { useEffect } from 'react';

import SubCategoryTable from './SubCategoryTable';

import TrueAndFalseSubCategoryRoute from '@/services/quiz/trueAndFalse/SubCategoryService';
function SubCategory() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await TrueAndFalseSubCategoryRoute.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <SubCategoryTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default SubCategory
