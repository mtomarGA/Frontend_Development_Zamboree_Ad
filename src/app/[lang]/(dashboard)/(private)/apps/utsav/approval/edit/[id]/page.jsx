import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ApprovalEdit from '@/views/apps/utsav/vendorWiseCoupon/ApprovalEdit'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={'utsav_approval:edit'}>
                <ApprovalEdit />

            </ProtectedRoute>
        </div>
    )
}

export default page
