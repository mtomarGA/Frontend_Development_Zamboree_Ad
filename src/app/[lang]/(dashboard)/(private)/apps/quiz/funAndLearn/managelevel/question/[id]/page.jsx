import QuesTable from '@/views/apps/quiz/funAndLearn/ManageLevel/Question/QuesTable'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_funAndLearn:view"}>
                <QuesTable />
            </ProtectedRoute>
        </div>
    )
}

export default page
