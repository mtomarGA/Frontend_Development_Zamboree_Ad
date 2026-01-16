'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ListBug from '@/views/apps/bug/list'

const BugList = () => {
  return (
    <ProtectedRoute permission="bug_all_bugs:view">
      <ListBug />
    </ProtectedRoute>
  )
}

export default BugList
