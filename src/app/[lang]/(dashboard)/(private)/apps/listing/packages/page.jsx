import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Index from '@/views/apps/listing/listing-package/index'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={'partner_packages:view'}>

                <Index />
            </ProtectedRoute>
        </div>
    )
}

export default page
