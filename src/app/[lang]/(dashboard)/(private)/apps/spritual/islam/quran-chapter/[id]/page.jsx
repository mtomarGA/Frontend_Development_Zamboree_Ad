import { ProtectedRoute } from "@/utils/ProtectedRoute"
import QuranVerses from "@/views/apps/spritual/islam/quran-chapter/verse"

const QuranVersePage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_quran_chapters:edit"} >
      <QuranVerses />
    </ProtectedRoute>
  )
}

export default QuranVersePage
