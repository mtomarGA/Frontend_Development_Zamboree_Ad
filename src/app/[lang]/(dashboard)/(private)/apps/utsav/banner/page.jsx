import HomeBanner from '@/views/apps/utsav/banner/HomeBanner'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import React from 'react'

function page() {
    return (
        <div> <ProtectedRoute permission={"utsav_banner:view"}>
            <HomeBanner />
        </ProtectedRoute>
        </div>
    )
}

export default page
