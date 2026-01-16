'use client'
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import QuranAudio from "@/views/apps/spritual/islam/reciter/quranaudio";
const QuranAudioPage = () => {

  return (
    <ProtectedRoute permission={"spiritual_islam_reciter_list:edit"} >
      <QuranAudio />
    </ProtectedRoute>
  )
}

export default QuranAudioPage

