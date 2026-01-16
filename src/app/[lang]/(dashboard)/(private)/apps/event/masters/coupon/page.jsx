import { ProtectedRoute } from '@/utils/ProtectedRoute'
import CouponMain from '@/views/apps/event/Master/coupon/CouponMain'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute permission={"event_masters:view"}>
        <CouponMain />
      </ProtectedRoute>
    </div>
  )
}

export default page
