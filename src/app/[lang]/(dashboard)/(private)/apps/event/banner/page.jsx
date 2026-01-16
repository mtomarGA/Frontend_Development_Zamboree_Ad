import { BannerProvider } from '@/services/event/Banner/BannerService'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import BannerMain from '@/views/apps/event/HomeBanner/BannerMain'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={'event_masters:view'}>
                <BannerProvider>

                    < BannerMain />
                </BannerProvider>

            </ProtectedRoute>
        </div>
    )
}

export default page
