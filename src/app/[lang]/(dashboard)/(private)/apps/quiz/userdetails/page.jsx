import React from 'react'
import UserDetails from '@/views/apps/quiz/userDetails/UserDetails'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
function page() {
  return (
    <div>
      <ProtectedRoute permission={'quiz_user_details:view'}>
        <UserDetails />
      </ProtectedRoute>
    </div>
  )
}

export default page
