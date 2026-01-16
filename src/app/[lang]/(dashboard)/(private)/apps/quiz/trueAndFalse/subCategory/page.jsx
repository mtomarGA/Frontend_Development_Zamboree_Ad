import SubCategory from '@/views/apps/quiz/trueAndfalse/SubCategory/SubCategory'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_trueAndFalse:view"}>
                <SubCategory />
            </ProtectedRoute>
        </div>
    )
}

export default page
