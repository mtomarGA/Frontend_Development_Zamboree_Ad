import { ProtectedRoute } from "@/utils/ProtectedRoute"
import PrayerTimes from "@/views/apps/spritual/islam/prayer"

const PrayerPage = () => {
  return (
    <ProtectedRoute permission={"spiritual_islam_prayer_times:view"} >
      <PrayerTimes />
    </ProtectedRoute>
  )
}

export default PrayerPage

