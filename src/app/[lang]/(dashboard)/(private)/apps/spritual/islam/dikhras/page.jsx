import { ProtectedRoute } from "@/utils/ProtectedRoute";
import DikhrasList from "@/views/apps/spritual/islam/dikhras";

const DikhrasPage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_dikhras:view"} >
      <DikhrasList />
    </ProtectedRoute>
  )
}

export default DikhrasPage;
