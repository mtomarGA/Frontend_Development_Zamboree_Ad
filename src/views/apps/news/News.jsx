'use client'
import React, { useEffect } from 'react'
import NewsTable from './NewsTable'

import { useState } from 'react'


import AddModal from './AddModal'
import NewsService from '@/services/newsletter/newsServices'

function News() {
    // States
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)



    const [AddNews, setAddNews] = useState({});

    const onchangeAdd = (e) => {
        setAddNews({ ...AddNews, [e.target.name]: e.target.value })
        // console.log(AddNews);
    }

    // get news
    const [NewsData, setNewsData] = useState([]);

    const GetNewsFun = async () => {
        const data = await NewsService.getNews();
        // console.log(data);
        setNewsData(data?.data || []);
    }

    useEffect(() => { GetNewsFun() }, []);









    return (
        <div>


            <AddModal AddNews={AddNews} onchangeAdd={onchangeAdd} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} GetNewsFun={GetNewsFun} />




            <div className='m-1'>
                <h3>Newsletter</h3>
            </div>

            <NewsTable NewsData={NewsData} setNewsData={setNewsData} GetNewsFun={GetNewsFun} handleClickOpen={handleClickOpen} />

        </div>
    )
}

export default News
