import AddcouponModal from '@/views/apps/utsav/managecoupon/addcouponmodal'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function addcoupon() {
  return (
    <ProtectedRoute permission={"utsav_manage_utsav:add"}>
      <AddcouponModal />
    </ProtectedRoute>

  )
}

export default addcoupon
