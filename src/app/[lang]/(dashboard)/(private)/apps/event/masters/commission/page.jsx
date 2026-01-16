import React from 'react'
import Index from "@views/apps/event/Event-Commission/index";
import { ProtectedRoute } from '@/utils/ProtectedRoute';
function page() {
    return (
        <div>
            <ProtectedRoute permission="event_masters:view">
                <Index />
            </ProtectedRoute>
        </div>
    )
}

export default page
