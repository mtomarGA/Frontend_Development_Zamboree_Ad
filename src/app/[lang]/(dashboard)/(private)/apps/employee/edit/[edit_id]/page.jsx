'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EmployeeFormProvider, useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
import AddEmployee from '@/views/apps/employee/all-employees/AddEmployee'
import AllEmployee from '@/views/apps/employee/all-employees/AllEmployee'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Employee = () => {
  const router = useRouter();
  const params = useParams();
  const { edit_id } = params;
  return (
    <ProtectedRoute permission="employees_all_employees:add">
      <EmployeeFormProvider >
        <EditEmployee edit_id={edit_id} />
      </EmployeeFormProvider>
    </ProtectedRoute>
  )
}

export default Employee


const EditEmployee = ({ edit_id }) => {
  const router = useRouter();
  const { handleLoadData } = useEmployeeFormContext();
  useEffect(() => {
    if (edit_id) {
      handleLoadData(edit_id);
    }
  }, [edit_id]);
  return (
    <AddEmployee handleAddView={() => router.push('/en/apps/employee/all-employees')} />
  )
}

