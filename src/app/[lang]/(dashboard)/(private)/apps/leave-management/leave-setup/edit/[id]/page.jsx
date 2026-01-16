'use client'
import LeaveSetupForm from '@/views/apps/leaveManagement/LeaveSetupForm'
import { useParams } from 'next/navigation'

const LeaveSetup = () => {
  const { id } = useParams()
  return <LeaveSetupForm id={id} />
}
export default LeaveSetup
