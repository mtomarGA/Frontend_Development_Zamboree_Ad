import Promotional from '@/views/apps/utsav/banner/Promotional'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"utsav_promotional_banner:view"}>
                <Promotional />

            </ProtectedRoute>
        </div>
    )
}

export default page
