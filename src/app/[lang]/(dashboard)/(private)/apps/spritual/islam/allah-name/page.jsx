import { ProtectedRoute } from "@/utils/ProtectedRoute"
import AllahNameList from "@/views/apps/spritual/islam/allahname"

const AllahNamePage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_allah_name:view"} >
      <AllahNameList />
    </ProtectedRoute>
  )
}

export default AllahNamePage

