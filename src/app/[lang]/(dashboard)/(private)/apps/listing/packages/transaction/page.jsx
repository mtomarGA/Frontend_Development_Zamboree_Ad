import { ProtectedRoute } from '@/utils/ProtectedRoute'
import ListingTransactionTable from '@/views/apps/listing/listingTransaction/TransactionTable'
import React from 'react'

function page() {
    return (

        <ProtectedRoute permission={'partner_packages_transaction:view'}>

            <ListingTransactionTable />
        </ProtectedRoute>

    )
}

export default page
