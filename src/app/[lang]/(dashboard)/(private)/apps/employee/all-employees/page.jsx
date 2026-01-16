'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EmployeeFormProvider } from '@/contexts/EmployeeFormContext'
import AddEmployee from '@/views/apps/employee/all-employees/AddEmployee'
import AllEmployee from '@/views/apps/employee/all-employees/AllEmployee'
import React, { useEffect, useState } from 'react'

const Employee = () => {
  const [addEmployee, setaddEmployee] = useState(false)
  return (
    <ProtectedRoute permission="employees_all_employees:view">
      <EmployeeFormProvider onSuccess={() => setaddEmployee(false)}>
        {addEmployee ? <AddEmployee handleAddView={() => setaddEmployee(false)} /> : <AllEmployee handleAddEmployee={() => setaddEmployee(true)} />}
      </ EmployeeFormProvider>
    </ProtectedRoute>
  )
}


export default Employee
