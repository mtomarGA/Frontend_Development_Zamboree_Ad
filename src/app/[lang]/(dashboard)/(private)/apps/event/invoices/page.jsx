import { ProtectedRoute } from '@/utils/ProtectedRoute'
import InvoiceMain from '@/views/apps/event/invoices/InvoiceMain'

import React from 'react'

function page() {
    return (

        <ProtectedRoute permission={'event_invoices:view'}>
            <div>
                <InvoiceMain />
            </div>
        </ProtectedRoute>
    )
}

export default page
