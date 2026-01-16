import { ProtectedRoute } from '@/utils/ProtectedRoute'
import PrizeMain from '@/views/apps/quiz/contest/DistributePrize/PrizeMain'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={"quiz_contest:edit"}>
            <PrizeMain />
        </ProtectedRoute>
    )
}

export default page
