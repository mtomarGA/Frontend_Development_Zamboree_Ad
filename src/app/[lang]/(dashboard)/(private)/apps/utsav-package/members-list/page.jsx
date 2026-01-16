import { ProtectedRoute } from "@/utils/ProtectedRoute"
import MembersList from "@/views/apps/utsav-package/MembersList"

const MemberListPage = () => {
    return  <ProtectedRoute permission={"utsav_package_members_list:view"}> <MembersList /></ProtectedRoute>
       
    
}

export default MemberListPage
