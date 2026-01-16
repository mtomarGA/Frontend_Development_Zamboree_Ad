import { ProtectedRoute } from "@/utils/ProtectedRoute"
import TicketList from "@/views/apps/custmoer-care-ticket/all-tickets/TicketsList"

const TicketLists = async () => {
    return (
        <ProtectedRoute permission={"customer_care_ticket_all_tickets:view"} > <TicketList /></ProtectedRoute>
    )

}


export default TicketLists
