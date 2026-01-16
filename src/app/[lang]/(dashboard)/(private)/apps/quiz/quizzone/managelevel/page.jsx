import Main from '@/views/apps/quiz/quizzone/ManageLevel/Main'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
  return (
    <div>
      <ProtectedRoute permission={"quiz_quiz_zone:view"}>
        <Main />
      </ProtectedRoute>
    </div>
  )
}

export default page
