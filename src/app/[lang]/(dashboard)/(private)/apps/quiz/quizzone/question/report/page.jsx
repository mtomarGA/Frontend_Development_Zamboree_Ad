import ReportTable from '@/views/apps/quiz/quizzone/ManageLevel/Question/ReportTable'
import React from 'react'
import { ProtectedRoute } from '@/utils/ProtectedRoute'


function page() {
  return (

    <ProtectedRoute permission={"quiz_question_report:view"}>

      <ReportTable />
    </ProtectedRoute>

  )
}

export default page
