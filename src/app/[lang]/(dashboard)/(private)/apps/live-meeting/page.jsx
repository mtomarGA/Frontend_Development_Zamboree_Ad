import { ProtectedRoute } from "@/utils/ProtectedRoute"
import LiveMeeting from "@/views/apps/live-meeting/Live-Meetings"
const LiveMeetings  = () => {

    return <ProtectedRoute permission={"live_meeting_all_meetings:view"}><LiveMeeting /></ProtectedRoute>
       
}

export default LiveMeetings
