'use client'

import { InvoiceSettingProvider } from '@/contexts/invoiceSetting/SettingContextService'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import Index from '@/views/apps/invoice_setting/index.jsx'


export default function Page() {
    return (
        <ProtectedRoute permission={'invoice_setting:view'}>
            <InvoiceSettingProvider>
                <Index />
            </InvoiceSettingProvider>
        </ProtectedRoute>
    )
}
