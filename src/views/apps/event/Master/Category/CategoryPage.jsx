'use client'
import React, { useEffect, useState } from 'react'
import CategoryTable from './CategoryTable'
import AddModal from './AddModal'
import EventCategory from '@/services/event/masters/categoryService'

function CategoryPage() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [Data, setData] = useState([])
    const GetCategoryFun = async () => {
        const res = await EventCategory.Get();
        setData(res?.data);
    }

    useEffect(() => {
        GetCategoryFun()
    }, [])
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} getdata={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <CategoryTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={Data} />
        </div>
    )
}

export default CategoryPage
