"use-client"

import { ProtectedRoute } from "@/utils/ProtectedRoute"
import MonthAttendance from "@/views/apps/attendance/report/MonthAttendance"

const monthAttendance = async () => {
  return <ProtectedRoute permission={"attendance_monthly_Attendance:view"}><MonthAttendance /></ProtectedRoute>
}

export default monthAttendance
