import React from 'react'
import VendorCouponhome from '@/views/apps/utsav/vendorWiseCoupon/home'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <ProtectedRoute permission={'utsav_vendor_wise_utsav:view'}>
            <VendorCouponhome />

        </ProtectedRoute>
    )
}

export default page
