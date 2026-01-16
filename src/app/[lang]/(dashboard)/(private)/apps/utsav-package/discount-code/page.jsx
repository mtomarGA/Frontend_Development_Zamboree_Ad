import { ProtectedRoute } from "@/utils/ProtectedRoute"
import DiscountCode from "@/views/apps/utsav-package/DiscountCode"

const DiscountCodePage = () => {
    return <ProtectedRoute permission={"utsav_package_discount_List:view"}><DiscountCode /></ProtectedRoute>
     
    
}

export default DiscountCodePage
