
import { ProtectedRoute } from "@/utils/ProtectedRoute"
import Master from "@/views/apps/utsav-package/master/Main"

const MasterPage = () => {
    return <ProtectedRoute permission={"utsav_package_master:view"}><Master /></ProtectedRoute>
}

// utsav_package_faqs
export default MasterPage
