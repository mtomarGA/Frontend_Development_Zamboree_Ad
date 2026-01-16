import Main from '@/views/apps/quiz/funAndLearn/ManageLevel/Main'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_funAndLearn:view"}>
                <Main />
            </ProtectedRoute>
        </div>
    )
}

export default page
