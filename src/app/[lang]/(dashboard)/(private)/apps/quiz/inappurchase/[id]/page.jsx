import { ProtectedRoute } from '@/utils/ProtectedRoute'
import UserPurchaseTable from '@/views/apps/quiz/inAppPurchase/UserPurchaseTable'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={"quiz_in_app_purchase:view"}>
            <div>
                <UserPurchaseTable />
            </div>
        </ProtectedRoute>
    )
}

export default page
