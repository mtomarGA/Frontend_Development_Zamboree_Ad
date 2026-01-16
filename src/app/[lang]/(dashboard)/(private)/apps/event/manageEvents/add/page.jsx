import Add from '@/views/apps/event/ManageEvent/Add'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

function page() {
    return (
        <ProtectedRoute permission={"event_manageEvents:add"}>
            <Add />
        </ProtectedRoute>
    )
}

export default page 
