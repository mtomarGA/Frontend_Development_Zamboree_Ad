'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import React from 'react'
import Mailpage from '@/views/apps/mail/Mailpage.jsx'
import { MailProvider } from '@/contexts/mail/MailService'

function Page() {
    return (
        <ProtectedRoute permission={'mail:view'}>
            <MailProvider>
                <Mailpage />
            </MailProvider>
        </ProtectedRoute>
    )
}

export default Page

