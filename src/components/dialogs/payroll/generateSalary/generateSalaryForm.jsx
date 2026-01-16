'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Grid, MenuItem, Autocomplete, Checkbox, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import EmployeeService from '@/services/employee/EmployeeService'
import generateSalaryServices from '@/services/payroll/generateSalaryService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import BranchService from '@/services/employee/Master/BranchService'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const GenerateSalaryForm = ({ setModalOpen, getAllGenerateSalary }) => {
  const [departmentList, setDepartmentList] = useState([])
  const [branchList, setBranchList] = useState([])
  const [designationList, setDesignationList] = useState([])

  const [departmentId, setDepartmentId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [designationId, setDesignationId] = useState('')

  const [employeeOptions, setEmployeeOptions] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [month, setMonth] = useState(new Date())
  console.log(month, "monthMonth")

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      department: '',
      branch: '',
      designation: '',
      monthYear: new Date()
    }
  })

  useEffect(() => {
    getDepartments()
    getBranches()
    getDesignations()
  }, [])

  const getDepartments = async () => {
    try {
      const res = await DepartmentService.get()
      setDepartmentList(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch departments')
    }
  }

  const getBranches = async () => {
    try {
      const res = await BranchService.get()
      setBranchList(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch branches')
    }
  }
  const getDesignations = async () => {
    try {
      const res = await DesignationService.get()
      setDesignationList(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch designations')
    }
  }

  const fetchEmployees = async (deptId, brId, desigId) => {
    if (!deptId && !brId && !desigId) {
      setEmployeeOptions([])
      setSelectedEmployees([])
      return
    }
    try {
      const res = await EmployeeService.getSearchEmployee({
        department: deptId,
        branch: brId,
        designation: desigId
      })
      setEmployeeOptions(res.data)
      setSelectedEmployees([])
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch employees')
      setEmployeeOptions([])
      setSelectedEmployees([])
    }
  }

  const handleDepartmentChange = (id) => {
    setValue('department', id)
    setDepartmentId(id)
    fetchEmployees(id, branchId, designationId)
  }

  const handleBranchChange = (id) => {
    setValue('branch', id)
    setBranchId(id)
    fetchEmployees(departmentId, id, designationId)
  }

  const handleDesignationChange = (id) => {
    setValue('designation', id)
    setDesignationId(id)
    fetchEmployees(departmentId, branchId, id)
  }

  const onSubmit = async () => {
    if (!selectedEmployees.length) {
      toast.error('Please select at least one employee')
      return
    }

    const payload = {
      employees: selectedEmployees,
      month: month ? month.getMonth() + 1 : null,
      year: month ? month.getFullYear() : null
    }
    console.log(payload, "payload")

    try {
      await generateSalaryServices.generateSalary(payload)
      getAllGenerateSalary()
      reset()
      setSelectedEmployees([])
      setDepartmentId('')
      setBranchId('')
      setDesignationId('')
      setModalOpen(false)
    } catch (err) {
      console.error(err, 'Failed to generate salary')
    }
  }
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Generate Salary
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Department */}
          <Grid item xs={12}>
            <Controller
              name="department"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  label="Department"
                  value={field.value || ''}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  error={!!errors.department}
                  helperText={errors.department && 'Department is required'}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  {departmentList.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
          {/* Branch */}
          <Grid item xs={12}>
            <Controller
              name="branch"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  label="Branch"
                  value={field.value || ''}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  error={!!errors.branch}
                  helperText={errors.branch && 'Branch is required'}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  {branchList.map((b) => (
                    <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12}>
            <Controller
              name="designation"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  label="Designation"
                  value={field.value || ''}
                  onChange={(e) => handleDesignationChange(e.target.value)}
                  error={!!errors.designation}
                  helperText={errors.designation && 'Designation is required'}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  {designationList.map((d) => (
                    <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Employee Multi-Select */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              limitTags={2}
              disableCloseOnSelect
              options={
                employeeOptions.length > 0
                  ? [{ _id: 'all', name: 'Select All' }, ...employeeOptions]
                  : []
              }
              getOptionLabel={(option) => option.name || ''}
              value={employeeOptions.filter(emp => selectedEmployees.includes(emp._id))}
              onChange={(event, newValue) => {
                const isSelectAll = newValue.some(opt => opt._id === 'all')
                if (isSelectAll) {
                  if (selectedEmployees.length === employeeOptions.length) {
                    setSelectedEmployees([]) // deselect all
                  } else {
                    setSelectedEmployees(employeeOptions.map(emp => emp._id)) // select all
                  }
                } else {
                  setSelectedEmployees(newValue.map(emp => emp._id))
                }
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Checkbox
                    checked={
                      option._id === 'all'
                        ? employeeOptions.length > 0 && selectedEmployees.length === employeeOptions.length
                        : selected
                    }
                    style={{ marginRight: 8 }}
                  />
                  <span>{option.name}</span>
                  {option._id !== 'all' && <span>({option.employee_id})</span>}
                </li>
              )}
              renderInput={(params) => <CustomTextField {...params} label="Select Employees" />}
            />
          </Grid>
          {/* Month-Year Picker */}
          <Grid item xs={4}>
            <Controller
              name="monthYear"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AppReactDatepicker
                  selected={month}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  onChange={(date) => {
                    setMonth(date)
                    field.onChange(date)
                  }}
                  customInput={
                    <CustomTextField
                      label="Month"
                      fullWidth
                      error={!!errors.monthYear}
                      helperText={errors.monthYear && 'Month & Year is required'}
                    />
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        {/* Action Buttons */}
        <Grid container spacing={2} justifyContent="flex-end" marginTop={2}>
          <Grid item>
            <Button type="submit" variant="contained">Generate</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default GenerateSalaryForm
