import React from 'react'
import LanguagePage from '@/views/apps/event/Master/Language/LanguagePage'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
  return (
    <div>
      <ProtectedRoute permission='event_masters:view'>
        <LanguagePage />
      </ProtectedRoute>
    </div>
  )
}

export default page
