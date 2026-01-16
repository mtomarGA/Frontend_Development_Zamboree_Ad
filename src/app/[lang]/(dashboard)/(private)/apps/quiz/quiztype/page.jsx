import Quiztype from '@/views/apps/quiz/quiztype/quiztype'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_quiz_type:view"}>
                <Quiztype />
            </ProtectedRoute>
        </div>
    )
}

export default page
