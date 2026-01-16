'use client'
import React, { useEffect, useState } from 'react'
import AddModal from './AddModal'
import ArtistService from '@/services/event/masters/artistService'
import ArtistTable from './ArtistTable'

function ArtistPage() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [Data, setData] = useState([])
    const GetCategoryFun = async () => {
        const res = await ArtistService.Get();
        setData(res?.data);
    }

    useEffect(() => {
        GetCategoryFun()
    }, [])
    return (
        <div>

            <AddModal open={open} handleClose={handleClose} getdata={GetCategoryFun} handleClickOpen={handleClickOpen} />
            <ArtistTable handleClickOpen={handleClickOpen} GetCategoryFun={GetCategoryFun} quizType={Data} />
        </div>
    )
}

export default ArtistPage
