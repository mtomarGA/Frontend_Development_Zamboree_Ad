import { ProtectedRoute } from "@/utils/ProtectedRoute";
import QuranChapter from "@/views/apps/spritual/islam/quran-chapter"

const QuranChapterPage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_quran_chapters:view"} >
      <QuranChapter />
    </ProtectedRoute>
  )
}

export default QuranChapterPage;
