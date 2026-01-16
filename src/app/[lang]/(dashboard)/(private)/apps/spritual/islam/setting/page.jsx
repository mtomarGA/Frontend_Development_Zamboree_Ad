import { ProtectedRoute } from "@/utils/ProtectedRoute"
import IslamSetting from "@/views/apps/spritual/islam/setting"

const IslamSettings = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_setting:view"} >
      <IslamSetting />
    </ProtectedRoute>
  )
}

export default IslamSettings
