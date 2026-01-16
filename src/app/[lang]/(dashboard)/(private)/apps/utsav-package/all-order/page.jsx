import { ProtectedRoute } from "@/utils/ProtectedRoute";
import AllOrders from "@/views/apps/utsav-package/AllOrders";

const AllOrdersPage = () => {
return <ProtectedRoute permission={"utsav_package_All_orders:view"}><AllOrders /></ProtectedRoute>
}

export default AllOrdersPage
