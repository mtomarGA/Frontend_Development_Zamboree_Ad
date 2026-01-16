// import TodoBoard from '@/views/apps/todo/TodoBoard'
"use client"
import React from 'react'

import dynamic from 'next/dynamic'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

// Disable SSR to avoid hydration mismatches
const TodoBoard = dynamic(() => import('@/views/apps/todo/TodoBoard'), { ssr: false })


const Todo = () => {
  return (
    <ProtectedRoute permission="todos_all_todo:view">
      <TodoBoard />
    </ProtectedRoute>
  )
}

export default Todo
