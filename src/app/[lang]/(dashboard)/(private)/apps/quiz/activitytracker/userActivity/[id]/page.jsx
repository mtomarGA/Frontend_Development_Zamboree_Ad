import { ProtectedRoute } from '@/utils/ProtectedRoute'
import UserActivity from '@/views/apps/quiz/activityTracker/userActivity'
import React from 'react'

function page() {
    return (
        // <ProtectedRoute permission={"quiz_activity_tracker:view"}>
            

            <UserActivity />

        // </ProtectedRoute>
    )
}

export default page
