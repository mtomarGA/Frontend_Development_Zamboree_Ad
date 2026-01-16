import QuesTable from '@/views/apps/quiz/guesetheword/ManageLevel/Question/QuesTable'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <ProtectedRoute permission={"quiz_guesstheword:view"}>
            <div>
                <QuesTable />
            </div>
        </ProtectedRoute>
    )
}

export default page
