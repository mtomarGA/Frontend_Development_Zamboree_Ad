import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import InAppPurchase from '@/views/apps/quiz/inAppPurchase/InAppPurchase'
function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_in_app_purchase:view"}>
                <InAppPurchase />
            </ProtectedRoute>
        </div>
    )
}

export default page
