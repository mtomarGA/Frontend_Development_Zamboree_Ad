'use client'
import React, { useEffect, useState } from 'react'
import PurchaseTable from './PurchaseTable'
import quizRoute from '@/services/quiz/quiztypeServices';
function InAppPurchase() {

    const [data, setdata] = useState([]);
    const GetTransaction = async () => {
        const response = await quizRoute.CoinTransaction();
        setdata(response.data || []);
    }

    useEffect(() => {
        if (data.length === 0) {
            GetTransaction();
        }
    }, [])

    return (
        <div>
            <PurchaseTable data={data} GetTransaction={GetTransaction} />
        </div>
    )
}

export default InAppPurchase
