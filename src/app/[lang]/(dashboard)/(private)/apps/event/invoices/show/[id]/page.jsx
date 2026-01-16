import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ShowInvoice from '@/views/apps/event/invoices/ShowInvoice'
import React from 'react'

function page() {
    return (
        <ProtectedRoute permission={'event_invoices:view'}>
            <ShowInvoice />
        </ProtectedRoute>
    )
}

export default page
