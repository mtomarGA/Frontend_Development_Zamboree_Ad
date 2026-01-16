import React from 'react'
import SubCategory from '@/views/apps/quiz/funAndLearn/SubCategory/SubCategory.jsx'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_funAndLearn:view"}>
                <SubCategory />
            </ProtectedRoute>
        </div>
    )
}

export default page
