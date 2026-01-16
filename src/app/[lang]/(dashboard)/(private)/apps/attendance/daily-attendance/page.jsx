'use client'

import { ProtectedRoute } from "@/utils/ProtectedRoute"
import DailyAttendance from "@/views/apps/attendance/report/DailyAttendance"


const officeShifts = async () => {
 return <ProtectedRoute permission={"attendance_daily_Attendance:view"} >
    <DailyAttendance />
  </ProtectedRoute>
}

export default officeShifts

