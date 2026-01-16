import { ProtectedRoute } from '@/utils/ProtectedRoute'
import CategoryPage from '@/views/apps/event/Master/Category/CategoryPage'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={"event_masters:view"}>
            <CategoryPage />
        </ProtectedRoute>
    )
}

export default page
