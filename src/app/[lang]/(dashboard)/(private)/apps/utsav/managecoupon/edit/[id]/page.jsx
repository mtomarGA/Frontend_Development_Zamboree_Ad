import Editcoupon from '@/views/apps/utsav/managecoupon/editcoupon'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
  return (
    <ProtectedRoute permission={"utsav_manage_utsav:edit"}>
      <Editcoupon />
    </ProtectedRoute>

  )
}

export default page
