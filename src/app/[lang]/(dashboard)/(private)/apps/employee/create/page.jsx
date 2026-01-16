'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EmployeeFormProvider } from '@/contexts/EmployeeFormContext'
import AddEmployee from '@/views/apps/employee/all-employees/AddEmployee'
import AllEmployee from '@/views/apps/employee/all-employees/AllEmployee'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Employee = () => {
    const router = useRouter();
  return (
    <ProtectedRoute permission="employees_all_employees:add">
      <EmployeeFormProvider >
        <AddEmployee handleAddView={() => router.push('/en/apps/employee/all-employees')} />
      </EmployeeFormProvider>
    </ProtectedRoute>
  )
}


export default Employee
