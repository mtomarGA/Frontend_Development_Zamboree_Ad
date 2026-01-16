'use client'

import React from 'react'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import CategoryBug from '@/views/apps/bug/category'

const BugCategory = () => {
  return (
    <ProtectedRoute permission="bug_category:view">
      <CategoryBug />
    </ProtectedRoute>
  )
}

export default BugCategory
