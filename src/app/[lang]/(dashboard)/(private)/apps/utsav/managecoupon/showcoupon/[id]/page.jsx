import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Showcoupon from '@/views/apps/utsav/managecoupon/showcoupon'
import React from 'react'

function page() {
  return (
    <ProtectedRoute permission={'utsav_manage_utsav:view'} >
      <Showcoupon />

    </ProtectedRoute>
  )
}

export default page
