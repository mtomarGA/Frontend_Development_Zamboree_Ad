'use client'
import React, { useEffect } from 'react'
import PrizeTable from './PrizeTable'
import { useState } from 'react'
import quizRoute from '@/services/quiz/quiztypeServices';
import { useParams } from 'next/navigation';
function PrizeMain() {

    const [data, setdata] = useState([]);
    const { id } = useParams();
    const Getdatafun = async () => {
        const response = await quizRoute.contestScore(id);
        setdata(response.data || []);
    }

    useEffect(() => {
        if (data.length === 0 && id) {
            Getdatafun();
        }
    }, []);

    return (
        <div>
            <PrizeTable data={data} />
        </div>
    )
}

export default PrizeMain
