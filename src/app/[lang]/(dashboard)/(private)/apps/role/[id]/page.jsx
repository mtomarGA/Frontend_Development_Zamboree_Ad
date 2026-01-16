'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import EditRole from '@/views/apps/permission/editRole'
import { useParams } from 'next/navigation'
import React from 'react'

const EditRolePage = () => {
  //get the id from the url
  const { id } = useParams()
  return (
    <ProtectedRoute permission="role:edit">
      <EditRole id={id} />
    </ProtectedRoute>
  )
}

export default EditRolePage
