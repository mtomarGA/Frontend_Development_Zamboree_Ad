"use-client"

import { ProtectedRoute } from "@/utils/ProtectedRoute"
import MyAttendanceReport from "@/views/apps/attendance/report/MyAttendance"




const monthAttendance = async () => {
  return  <ProtectedRoute permission={"attendance_my_Attendance:view"}><MyAttendanceReport/></ProtectedRoute>
}

export default monthAttendance
