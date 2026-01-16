import QuesTable from '@/views/apps/quiz/trueAndfalse/ManageLevel/Question/QuesTable'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_trueAndFalse:view"}>
                <QuesTable />
            </ProtectedRoute>
        </div>
    )
}

export default page
