import Main from '@/views/apps/quiz/trueAndfalse/Category/Main'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_trueAndFalse:view"}>
                <Main />
            </ProtectedRoute>
        </div>
    )
}

export default page
