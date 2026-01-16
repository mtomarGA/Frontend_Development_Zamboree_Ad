import { ProtectedRoute } from '@/utils/ProtectedRoute'
import FunAndLearn from '@/views/apps/quiz/funAndLearn/Category/FunAndLearn'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"quiz_funAndLearn:view"}>
                <FunAndLearn />
            </ProtectedRoute>
        </div>
    )
}

export default page
