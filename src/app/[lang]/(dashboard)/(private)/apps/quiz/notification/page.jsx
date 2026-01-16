import React from 'react'
import Notification from '@/views/apps/quiz/notification/Notification'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <ProtectedRoute permission={"quiz_notification:view"}>
            <Notification />
        </ProtectedRoute>
    )
}

export default page
