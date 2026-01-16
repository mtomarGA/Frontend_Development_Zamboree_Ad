'use client'

import React from 'react'
import Index from "@/views/apps/event/vendor-user/index"
import { ScannerProvider } from "@/contexts/scannerUser/ScannerContext"  // ✅ use curly braces
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function Page() {
    return (
        < ProtectedRoute permission={'event_scanner_app_user:view'} >
            <ScannerProvider>
                <Index />
            </ScannerProvider>
        </ProtectedRoute>
    )
}

export default Page
