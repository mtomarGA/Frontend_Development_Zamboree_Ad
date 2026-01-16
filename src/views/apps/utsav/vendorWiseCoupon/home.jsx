'use client'
import React, { useEffect, useState } from 'react'
import VendorTable from './vendorTable'
import VendorWiseCouponRoute from '@/services/utsav/managecoupon/vendor.services'

function home() {

    const [vendordata, setvendordata] = useState([]);
    const getvendor = async () => {
        const getvendor = await VendorWiseCouponRoute.getVendorCoupons();
        console.log(getvendor);
        setvendordata(getvendor.data)

    }

    useEffect(() => {
        getvendor()
    }, []);
    return (
        <>
            <VendorTable vendordata={vendordata} setvendordata={setvendordata} />

        </>
    )
}

export default home
