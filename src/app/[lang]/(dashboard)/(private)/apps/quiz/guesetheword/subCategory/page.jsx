import SubCategory from '@/views/apps/quiz/guesetheword/SubCategory/SubCategory'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_guesstheword:view"}>
                <SubCategory />
            </ProtectedRoute>
        </div>
    )
}

export default page
