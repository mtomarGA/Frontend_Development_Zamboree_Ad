import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AnnounceTable from '@/views/apps/announce/list/AnnouceMain'
import React from 'react'


function page() {
  return (<ProtectedRoute permission={"announce:view"}><AnnounceTable /> </ProtectedRoute>

  )
}

export default page
