import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Main from '@/views/apps/quiz/quizzone/Category/main'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_quiz_zone:view"}>
                <Main />
            </ProtectedRoute>
        </div>
    )
}

export default page
