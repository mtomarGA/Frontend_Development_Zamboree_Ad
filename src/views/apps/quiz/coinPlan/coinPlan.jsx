'use client'
import React, { useState } from 'react'

import AddModal from './AddModal'

import { useEffect } from 'react';

import CoinTable from './coinTable';

import PlanService from '@/services/quiz/coinPlan/planServices';
function CoinPlan() {

    const [GetCategory, setGetCategory] = useState([]);
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const GetCategoryFun = async () => {
        const res = await PlanService.Get();
        setGetCategory(res.data);
    }

    useEffect(() => { GetCategoryFun() }, []);

    return (
        <div>

            <AddModal open={open} handleClose={handleClose} GetCategoryFun={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <CoinTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={GetCategory} />
        </div>
    )
}

export default CoinPlan
