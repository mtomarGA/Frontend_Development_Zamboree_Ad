import React from 'react'
import MainQues from '@/views/apps/quiz/contest/Question/MainQues'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_contest:view"}>
                <MainQues />
            </ProtectedRoute>
        </div>
    )
}

export default page
