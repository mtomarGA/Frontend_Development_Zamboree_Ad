import React from 'react'
import CoinPlan from '@/views/apps/quiz/coinPlan/coinPlan'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
  return (
    <div>
      <ProtectedRoute permission={"quiz_coin_plan:view"}>

        <CoinPlan />
      </ProtectedRoute>
    </div>
  )
}

export default page
