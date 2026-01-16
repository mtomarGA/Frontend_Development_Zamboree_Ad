'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  Checkbox,
  Paper,
  List,
  ListItem,
  Stack,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { toast } from 'react-toastify'

import EmployeeService from '@/services/employee/EmployeeService'
import EarningService from '@/services/payroll/earningServices'
import DeductionService from '@/services/payroll/deductionServices'
import salarySetupServices from '@/services/payroll/salarySetupServices'

const SalarySetupForm = ({ setModalOpen, getAllSalary, salaryData }) => {
  const [employees, setEmployees] = useState([])
  const [inputValue, setInputValue] = useState({
    employee: '',
    branch: '',
    department: '',
    designation: ''
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [earnings, setEarnings] = useState([])
  const [deductions, setDeductions] = useState([])

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      employee: '',
      branch: '',
      department: '',
      designation: '',
      basicSalary: '',
      earnings: [],
      deductions: []
    }
  })

  const formValues = watch()

  // Fetch earnings and deductions
  useEffect(() => {
    const fetchEarningsAndDeductions = async () => {
      try {
        const earnRes = await EarningService.getAllEarnings()
        setEarnings(earnRes.data)

        const dedRes = await DeductionService.getAllDeduction()
        setDeductions(dedRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchEarningsAndDeductions()
  }, [])

  // Auto-fill if editing

  useEffect(() => {
    if (salaryData) {
      const defaultFormValues = {
        employee: salaryData?.employee?._id || '',
        branch: salaryData?.branch?._id || '',
        department: salaryData?.department?._id || '',
        designation: salaryData?.designation?._id || '',
        basicSalary: salaryData?.basicSalary || '',
        earnings: salaryData?.earnings?.map(e => e.earning._id || e.earning) || [],
        deductions: salaryData?.deductions?.map(d => d.deduction._id || d.deduction) || []
      };

      reset(defaultFormValues);

      setInputValue({
        employee: salaryData?.employee?.name || '',
        branch: salaryData?.branch?.name || '',
        department: salaryData?.department?.name || '',
        designation: salaryData?.designation?.name || ''
      });
    }
  }, [salaryData, reset]);





  // Employee search
  const handleEmployeeSearch = async (value) => {
    setInputValue(prev => ({ ...prev, employee: value }))
    if (value.length > 2) {
      try {
        const res = await EmployeeService.getEmployeeDetailsByMobile(value)
        setEmployees(res.data)
        setShowDropdown(true)
      } catch (err) {
        console.error(err)
        setEmployees([])
        setShowDropdown(false)
      }
    } else {
      setEmployees([])
      setShowDropdown(false)
    }
  }


  const handleSelectEmployee = (employee) => {
    setValue('employee', employee._id)
    setValue('branch', employee.branch._id)
    setValue('department', employee.department._id)
    setValue('designation', employee.designation._id)

    setInputValue({
      employee: employee.name,
      branch: employee.branch.name,
      department: employee.department.name,
      designation: employee.designation.name
    })

    setShowDropdown(false)
  }


  // Calculate totals
  const totalEarnings = formValues.earnings.reduce((sum, id) => {
    const e = earnings.find(earn => earn._id === id)
    if (!e || !e.monthField || e.monthField.length < 12) return sum
    const isPercentage = e.earningType === 'Percentage on Basic'
    const actualValue = isPercentage
      ? (Number(formValues.basicSalary) * Number(e.value)) / 100
      : Number(e.value)
    return sum + actualValue
  }, 0)

  const totalDeductions = formValues.deductions.reduce((sum, id) => {
    const d = deductions.find(ded => ded._id === id)
    if (!d || !d.monthField || d.monthField.length < 12) return sum
    const isPercentage = d.deductionType === 'Percentage on Basic'
    const actualValue = isPercentage
      ? (Number(formValues.basicSalary) * Number(d.value)) / 100
      : Number(d.value)
    return sum + actualValue
  }, 0)

  const monthlyFinalSalary =
    Number(formValues.basicSalary || 0) + totalEarnings - totalDeductions


  // For FinalCTC 
  const totalEarning = formValues.earnings.reduce((sum, id) => {
    const e = earnings.find(earn => earn._id === id)
    if (!e || e.monthField.length === 12) return sum
    const isPercentage = e.earningType === 'Percentage on Basic'
    const actualValue = isPercentage
      ? (Number(formValues.basicSalary) * Number(e.value)) / 100
      : Number(e.value)
    return sum + actualValue
  }, 0)

  const totalDeduction = formValues.deductions.reduce((sum, id) => {
    const d = deductions.find(ded => ded._id === id)
    if (!d || d.monthField.length === 12) return sum
    const isPercentage = d.deductionType === 'Percentage on Basic'
    const actualValue = isPercentage
      ? (Number(formValues.basicSalary) * Number(d.value)) / 100
      : Number(d.value)
    return sum + actualValue
  }, 0)

  console.log(totalEarning, totalDeduction)

  const finalCTC = (monthlyFinalSalary * 12) + totalEarning - totalDeduction

  const onSubmit = async (data) => {
    if (!data.employee || !data.basicSalary) {
      toast.error('Please fill all required fields correctly.')
      return
    }

    const payload = {
      ...data,
      earnings: data.earnings.map(id => {
        const e = earnings.find(earn => earn._id === id)
        const value = e.earningType === 'Percentage on Basic'
          ? (Number(data.basicSalary) * Number(e.value)) / 100
          : Number(e.value)
        return { earning: id, value }
      }),
      deductions: data.deductions.map(id => {
        const d = deductions.find(ded => ded._id === id)
        const value = d.deductionType === 'Percentage on Basic'
          ? (Number(data.basicSalary) * Number(d.value)) / 100
          : Number(d.value)
        return { deduction: id, value }
      }),
      totalEarnings,
      totalDeductions,
      monthlyFinalSalary,
      finalCTC
    }

    try {
      if (salaryData?._id) {
        await salarySetupServices.updateSalarySetup(salaryData._id, payload)
      } else {
        await salarySetupServices.createSalarySetup(payload)

      }

      getAllSalary()
      setModalOpen(false)
    } catch (err) {
      console.log(err, 'Submission failed!')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Typography variant="h4" mb={4}>Salary Setup</Typography>

        <Grid container spacing={8} mb={8}>
          {/* Employee */}
          <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            <CustomTextField
              fullWidth
              label="Employee"
              placeholder="Search Employee"
              value={inputValue.employee}
              onChange={(e) => handleEmployeeSearch(e.target.value)}
              error={!!errors.employee}
              helperText={errors.employee && 'Employee is required'}
              onBlur={() => setShowDropdown(false)}
              onFocus={() => employees.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && employees.length > 0 && (
              <Paper sx={{ position: 'absolute', top: '100%', zIndex: 2, left: 0, width: '100%', maxHeight: 200, overflowY: 'auto', mt: 1 }}>
                <List dense>
                  {employees.map(emp => (
                    <ListItem
                      key={emp._id}
                      onMouseDown={() => handleSelectEmployee(emp)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {emp.name} - {emp.employee_id}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          {/* Branch */}
          <Grid item xs={12} md={6}>
            <Controller
              name="branch"
              control={control}
              render={() => (
                <CustomTextField
                  fullWidth
                  label="Branch"
                  value={inputValue.branch}
                  disabled
                />
              )}
            />

          </Grid>

          {/* Department */}
          <Grid item xs={12} md={6}>
            <Controller
              name="department"
              control={control}
              render={() => (
                <CustomTextField
                  fullWidth
                  label="Department"
                  value={inputValue.department}
                  disabled
                />
              )}
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12} md={6}>
            <Controller
              name="designation"
              control={control}
              render={() => (
                <CustomTextField
                  fullWidth
                  label="Designation"
                  value={inputValue.designation}
                  disabled
                />
              )}
            />

          </Grid>

          {/* Basic Salary */}
          <Grid item xs={12} md={6}>
            <Controller
              name="basicSalary"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Basic Salary"
                  placeholder="Enter Basic Salary"
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                    field.onChange(val)
                  }}
                  error={!!errors.basicSalary}
                  helperText={errors.basicSalary && 'Basic Salary is required'}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={10}>
          {/* Earnings */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              limitTags={2}
              disableCloseOnSelect
              options={earnings}
              getOptionLabel={(option) => option.earningName || ''}
              value={earnings.filter(e => formValues.earnings.includes(e._id))}
              onChange={(event, newValue) => setValue('earnings', newValue.map(n => n._id))}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.earningName}
                </li>
              )}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Earnings"
                  placeholder="Search earnings"
                  error={!!errors.earnings}
                  helperText={errors.earnings}
                />
              )}
            />

            {formValues.earnings.length > 0 && (
              <Stack direction="column" spacing={1} mt={2}>
                {formValues.earnings.map(id => {
                  const e = earnings.find(earn => earn._id === id)
                  if (!e) return null

                  const isPercentage = e.earningType === 'Percentage on Basic'
                  const actualValue = isPercentage
                    ? (Number(formValues.basicSalary) * Number(e.value)) / 100
                    : Number(e.value)

                  return (
                    <Stack key={id} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography >
                        {e.earningName}
                      </Typography>
                      <Typography >
                        {isPercentage ? `${e.value}%` : e.value}
                      </Typography>
                      <Typography >
                        {actualValue.toFixed(2)}
                      </Typography>
                    </Stack>
                  )
                })}

                <Stack direction="row" justifyContent="space-between" alignItems="center"
                  sx={{ borderTop: '1px solid #ccc', mt: 1, pt: 1 }}>
                  <Typography>
                    Total Earnings
                  </Typography>
                  <Typography >
                    {totalEarnings.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Grid>

          {/* Deductions */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              limitTags={2}
              disableCloseOnSelect
              options={deductions}
              getOptionLabel={(option) => option.deductionName || ''}
              value={deductions.filter(d => formValues.deductions.includes(d._id))}
              onChange={(event, newValue) => setValue('deductions', newValue.map(n => n._id))}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.deductionName}
                </li>
              )}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Deductions"
                  placeholder="Search deductions"
                  error={!!errors.deductions}
                  helperText={errors.deductions}
                />
              )}
            />

            {formValues.deductions.length > 0 && (
              <Stack direction="column" spacing={1} mt={2}>
                {formValues.deductions.map(id => {
                  const d = deductions.find(ded => ded._id === id)
                  if (!d) return null

                  const isPercentage = d.deductionType === 'Percentage on Basic'
                  const actualValue = isPercentage
                    ? (Number(formValues.basicSalary) * Number(d.value)) / 100
                    : Number(d.value)

                  return (
                    <Stack key={id} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography>
                        {d.deductionName}
                      </Typography>
                      <Typography >
                        {isPercentage ? `${d.value}%` : d.value}
                      </Typography>
                      <Typography >
                        {actualValue.toFixed(2)}
                      </Typography>
                    </Stack>
                  )
                })}

                <Stack direction="row" justifyContent="space-between" alignItems="center"
                  sx={{ borderTop: '1px solid #ccc', mt: 1, pt: 1 }}>
                  <Typography>
                    Total Deductions
                  </Typography>
                  <Typography>
                    {totalDeductions.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Grid>
        </Grid>

        {/* Monthly Final Salary & Final CTC */}
        <Grid container spacing={3} mt={10}>
          <Grid item xs={12}>
            <Paper sx={{ boxShadow: 'none' }}>
              <Stack direction="column" spacing={2}>
                <Stack direction="row" alignItems="center">
                  <Typography>
                    Monthly Final Salary
                  </Typography>
                  <Typography ml={3} >
                    {monthlyFinalSalary.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Typography >
                    Final CTC (Yearly)
                  </Typography>
                  <Typography ml={6} >
                    {finalCTC.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained">Save</Button>
        <Button onClick={() => setModalOpen(false)} variant="outlined">Cancel</Button>
      </DialogActions>
    </form>
  )
}

export default SalarySetupForm
