'use client'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import PermissionView from '@/views/apps/permission'
import AddRole from '@/views/apps/permission/addRole'
import React from 'react'
import { useState } from 'react'

const PermissionManagement = () => {
  const [viewAddRole, setviewAddRole] = useState(false)
  return (
    <ProtectedRoute permission="role:view">
      <div>{viewAddRole ? <AddRole setviewAddRole={setviewAddRole} /> : <PermissionView setviewAddRole={setviewAddRole} />}</div>
    </ProtectedRoute>
  )
}

export default PermissionManagement
