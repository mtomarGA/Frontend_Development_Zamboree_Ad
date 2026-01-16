import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Approval from '@/views/apps/utsav/vendorWiseCoupon/Approval'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={'utsav_approval:view'}>

            <Approval />
        </ProtectedRoute>
    )
}

export default page
