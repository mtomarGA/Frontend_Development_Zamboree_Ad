import { ProtectedRoute } from '@/utils/ProtectedRoute'
import MainLeaderBoard from '@/views/apps/quiz/contest/LeaderBoard/MainLeaderBoard'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={"quiz_contest:view"}>

            <MainLeaderBoard />
        </ProtectedRoute>
    )
}

export default page
