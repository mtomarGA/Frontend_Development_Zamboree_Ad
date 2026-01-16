'use client'


import { ProtectedRoute } from '@/utils/ProtectedRoute'
import LateNdConfig from '@/views/apps/attendance/master/LatendConfig'

const LateNdConfigs = async () => {
  return  <ProtectedRoute permission={"attendance_master_config:view"} ><LateNdConfig /></ProtectedRoute>

}

export default LateNdConfigs

