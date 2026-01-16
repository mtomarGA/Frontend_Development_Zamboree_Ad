import { ProtectedRoute } from "@/utils/ProtectedRoute";
import DuaList from "@/views/apps/spritual/islam/dua";

const DuaPage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_dua:view"} >
      <DuaList />
    </ProtectedRoute>
  )
}

export default DuaPage;
