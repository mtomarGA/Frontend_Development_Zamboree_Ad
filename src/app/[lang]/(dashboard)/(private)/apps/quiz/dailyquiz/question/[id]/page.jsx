import Main from '@/views/apps/quiz/dailyQuiz/AddQuestion/Main'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_dailyquiz:view"}>
                <Main />
            </ProtectedRoute>
        </div>
    )
}

export default page
