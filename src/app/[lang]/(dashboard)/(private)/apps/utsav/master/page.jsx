import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Utsavmaster from '@/views/apps/utsav/master/Mainpage'
import React from 'react'


function page() {
  return (
    // <div>page</div>
    <>
      <ProtectedRoute permission={'utsav_master:view'}>
        <Utsavmaster />

      </ProtectedRoute>
    </>
  )
}

export default page
