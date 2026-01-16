import React from 'react'
import ContestMain from '@/views/apps/quiz/contest/ContestMain'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_contest:view"}>
                <ContestMain />
            </ProtectedRoute>
        </div>
    )
}

export default page
