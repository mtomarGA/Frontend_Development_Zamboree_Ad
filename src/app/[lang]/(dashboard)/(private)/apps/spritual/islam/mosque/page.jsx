import { ProtectedRoute } from "@/utils/ProtectedRoute"
import MosqueList from "@/views/apps/spritual/islam/mosque"

const MosquePage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_mosque:view"} >
      <MosqueList />
    </ProtectedRoute>
  )
}

export default MosquePage
