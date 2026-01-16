'use client'
import React, { useEffect, useState } from 'react'
import ContestTable from './ContestTable'
import AddModal from './AddModal'
import contestRoute from '@/services/quiz/quiz-contest/contestService'

function ContestMain() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [contestdata, setContestData] = useState([]);

    const getdata = async () => {
        const response = await contestRoute.Get()
        setContestData(response?.data || []);
        // console.log(response.data, 'response')
    }

    useEffect(() => {
        getdata()
    }, [])

    return (
        <div>

                <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} getdata={getdata} />
            <ContestTable handleClickOpen={handleClickOpen} contestdata={contestdata} getdata={getdata} />
        </div>
    )
}

export default ContestMain
