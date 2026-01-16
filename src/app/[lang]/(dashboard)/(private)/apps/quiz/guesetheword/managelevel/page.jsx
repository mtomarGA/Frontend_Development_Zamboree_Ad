import Main from '@/views/apps/quiz/guesetheword/ManageLevel/Main'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_guesstheword:view"}>
                <Main />
            </ProtectedRoute>
        </div>
    )
}

export default page
