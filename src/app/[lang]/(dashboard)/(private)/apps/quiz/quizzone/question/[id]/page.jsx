import QuesTable from '@/views/apps/quiz/quizzone/ManageLevel/Question/QuesTable'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_quiz_zone:view"}>
                <QuesTable />
            </ProtectedRoute>
        </div>
    )
}

export default page
