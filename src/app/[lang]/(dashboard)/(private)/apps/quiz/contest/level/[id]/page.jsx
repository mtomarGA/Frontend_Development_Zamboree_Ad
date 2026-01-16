import React from 'react'
import LevelsMain from '@/views/apps/quiz/contest/Levels/LevelsMain'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <ProtectedRoute permission={"quiz_contest:view"}>
            <LevelsMain />
        </ProtectedRoute>
    )
}

export default page
