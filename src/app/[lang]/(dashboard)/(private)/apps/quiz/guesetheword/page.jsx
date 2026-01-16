import React from 'react'
import GuesTheWord from '@/views/apps/quiz/guesetheword/Category/Main'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_guesstheword:view"}>
                <GuesTheWord />
            </ProtectedRoute>
        </div>
    )
}

export default page
