import { ProtectedRoute } from "@/utils/ProtectedRoute"
import DuaCategory from "@/views/apps/spritual/islam/dua/category"

const DuaCategoryPage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_dua_category:view"} >
      <DuaCategory />
    </ProtectedRoute>
  )
}

export default DuaCategoryPage
