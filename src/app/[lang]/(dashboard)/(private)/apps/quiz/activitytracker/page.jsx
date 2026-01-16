import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ActivityTracker from '@/views/apps/quiz/activityTracker/ActivityTracker'
function page() {
  return (
    <div>
      <ProtectedRoute permission={"quiz_activity_tracker:view"}>
        <ActivityTracker />
      </ProtectedRoute>
    </div>
  )
}

export default page
