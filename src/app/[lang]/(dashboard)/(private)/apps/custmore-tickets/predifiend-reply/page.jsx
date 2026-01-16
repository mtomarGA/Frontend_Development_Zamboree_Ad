

import { ProtectedRoute } from "@/utils/ProtectedRoute"
import PredefinedReplyPage from "@/views/apps/custmoer-care-ticket/all-tickets/Pre-Defined-Reply"

const PredefinedReply = () => {
    return (
        <ProtectedRoute permission={"customer_care_ticket_predefined_reply:view"} ><PredefinedReplyPage /></ProtectedRoute>
    )
}
export default PredefinedReply

