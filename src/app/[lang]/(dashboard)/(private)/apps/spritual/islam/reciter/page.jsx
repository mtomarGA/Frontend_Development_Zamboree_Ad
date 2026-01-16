import { ProtectedRoute } from "@/utils/ProtectedRoute"
import ReciterList from "@/views/apps/spritual/islam/reciter"

const ReciterPage = () => {
    return (
        <ProtectedRoute permission={"spiritual_islam_reciter_list:view"} >
            <ReciterList />
        </ProtectedRoute>
    )
}

export default ReciterPage
