'use client'
import React, { useEffect, useState } from 'react'
import IntrestedTable from './IntrestedTable'
import IntrestedService from '@/services/utsav_intrested/intrested.service';

function index() {

    const [data, setData] = useState([]);
    const fetchData = async () => {
        const res = await IntrestedService.getIntrest();
        setData(res.data || []);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
            <IntrestedTable data={data} fetchData={fetchData} setData={setData} />
        </div>
    )
}

export default index
