import React from 'react'
import Managehome from '@/views/apps/utsav/managecoupon/managehome'
import { ProtectedRoute } from '@/utils/ProtectedRoute'


function page() {
  return (
    <ProtectedRoute permission={'utsav_manage_utsav:view'}>
      <Managehome />

    </ProtectedRoute>

  )
}

export default page
