'use client'

import { ProtectedRoute } from "@/utils/ProtectedRoute"
import OfficeShift from "@/views/apps/attendance/master/OfficeShift"


const officeShifts = async () => {
  return  <ProtectedRoute permission={"attendance_master_shift:view"} ><OfficeShift /></ProtectedRoute>
}
export default officeShifts

