import { ProtectedRoute } from '@/utils/ProtectedRoute'
import TransactionTable from '@/views/apps/event/Transaction/TransactionTable'
import React from 'react'

function page() {
    return (
        <div>
            <ProtectedRoute permission={"event_manageEvents:view"}>

                <TransactionTable />
            </ProtectedRoute>
        </div>
    )
}

export default page
