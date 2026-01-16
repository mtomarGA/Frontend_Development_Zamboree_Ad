import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Entry from '@/views/apps/quiz/dailyQuiz/Entry'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_dailyquiz:view"}>
                <Entry />
            </ProtectedRoute>
        </div>
    )
}

export default page
