import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Withdraw from '@/views/apps/event/Withdraw_requests/Withdraw'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_withdraw_requests:view"}>
                <Withdraw />
            </ProtectedRoute>
        </div>
    )
}

export default page
