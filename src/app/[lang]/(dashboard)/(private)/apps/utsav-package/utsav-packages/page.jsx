import { ProtectedRoute } from "@/utils/ProtectedRoute"
import UtsavPackages from "@/views/apps/utsav-package/UtsavPackages"

const UtsavPackagePage = () => {
  return <ProtectedRoute permission={"utsav_package_utsav_packages_list:view"}><UtsavPackages /></ProtectedRoute>


}

export default UtsavPackagePage 
