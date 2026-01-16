import { ProtectedRoute } from '@/utils/ProtectedRoute'
import SubCategoryPage from '@/views/apps/event/Master/Artist/ArtistPage'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute permission={"event_masters:view"} >
        <SubCategoryPage />
        
      </ProtectedRoute>
    </div>
  )
}


export default page
