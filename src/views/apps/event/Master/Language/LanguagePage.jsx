'use client'
import React, { useEffect, useState } from 'react'
import AddModal from './AddModal'
import LanguageService from '@/services/event/masters/languageService'
import LanguageTable from './LanguageTable'

function LanguagePage() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [Data, setData] = useState([])
    const GetCategoryFun = async () => {
        const res = await LanguageService.Get();
        setData(res?.data);
    }

    useEffect(() => {
        GetCategoryFun()
    }, [])
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} getdata={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <LanguageTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={Data} />
        </div>
    )
}

export default LanguagePage
