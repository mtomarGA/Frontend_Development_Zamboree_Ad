'use client'
import React, { useEffect, useState } from 'react'
import PromotionalTable from './PromotionalTable'
import AddModal from './AddModal'
import EditModal from './EditModal'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices'

function HomeMain() {

    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    // 
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = () => setEditOpen(true)
    const handleEditClose = () => setEditOpen(false)

    // 
    const [PromotionalData, setPromotionalData] = useState([]);
    const getdata = async () => {
        const response = await HomeBannerRoute.getBanner();
        console.log(response.data);
        setPromotionalData(response.data);
    }

    useEffect(() => {
        getdata();
    }, []);


    return (
        <div>
          

            <EditModal Editopen={Editopen} handleEditClose={handleEditClose} handleEditOpen={handleClickOpen} />
            {/*  */}
            <AddModal getdata={getdata} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} />
            <PromotionalTable PromotionalData={PromotionalData} handleClickOpen={handleClickOpen} getdata={getdata} handleEditOpen={handleEditOpen} />
        </div>
    )
}

export default HomeMain
