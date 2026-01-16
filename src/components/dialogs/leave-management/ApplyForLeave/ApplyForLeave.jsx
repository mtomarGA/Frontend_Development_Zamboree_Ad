'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  MenuItem,
  Paper,
  List,
  ListItem,
  Typography
} from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

// Form Imports
import { useForm, Controller, useWatch } from 'react-hook-form'

// Services
import LeaveMagmentService from '@/services/leave-management/ApplyForLeave'
import EmployeeService from '@/services/employee/EmployeeService'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast
import { toast } from 'react-toastify'
import leaveManegmentService from '@/services/leave-management/ApplyForLeave'
import leaveSetupService from '@/services/leave-management/leaveSetup'

const ApplyForLeaveForm = ({ setModalOpen, EditSelectedLeaveType, getLeave }) => {
  const [leaveSetup, setLeaveSetup] = useState('')
  const [leaveOptions, setLeaveOptions] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeGender, setSelectedEmployeeGender] = useState(null)

  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const [leaveBalance, setLeaveBalance] = useState(null)
  const [loadingBalance, setLoadingBalance] = useState(false)


  const [disableSave, setDisableSave] = useState(false)
  const [usedLeave, setUsedLeave] = useState()

  console.log(leaveSetup, "employeeLeaveSetupID")

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      employee: "",
      leaveType: '',
      leaves: '',
      startDate: null,
      endDate: null,
      totalLeave: 0,
      reason: '',
    }
  })

  const startDate = useWatch({ control, name: 'startDate' })
  const endDate = useWatch({ control, name: 'endDate' })
  const totalLeave = watch('totalLeave')

  // Autofill details when editing
  useEffect(() => {
    if (EditSelectedLeaveType) {
      reset({
        employee: EditSelectedLeaveType.employee?._id,
        leaveType: EditSelectedLeaveType.leaveType?._id || '',
        leaves: EditSelectedLeaveType.leaves || '',
        startDate: EditSelectedLeaveType.startDate
          ? dayjs(EditSelectedLeaveType.startDate).format("YYYY-MM-DD")
          : '',
        endDate: EditSelectedLeaveType.endDate
          ? dayjs(EditSelectedLeaveType.endDate).format("YYYY-MM-DD")
          : '',
        totalLeave: EditSelectedLeaveType.totalLeave || 0,
        reason: EditSelectedLeaveType.reason || '',
      })

      if (EditSelectedLeaveType.employee) {
        setInputValue(EditSelectedLeaveType.employee.name)
      }
    }
  }, [EditSelectedLeaveType, reset])


  const handleEmployeeSearch = async (value) => {
    setInputValue(value)
    if (value.length > 2) {
      try {
        const res = await EmployeeService.getEmployeeDetailsByMobile(value)
        console.log(res.data, "employeeeeeeeeeeeee")
        setEmployees(res.data)
        setShowDropdown(true)
      } catch (error) {
        console.error('Failed to fetch employee data:', error)
        setEmployees([])
        setShowDropdown(false)
      }
    } else {
      setEmployees([])
      setShowDropdown(false)
    }
  }



  const getLeaveSetupById = async (id) => {
    if (!id) return
    try {
      const res = await leaveSetupService.getLeaveSetupById(id)
      console.log(res.data, "getLeaveSetupById result")

      const setup = res.data

      //  Filter only selected leaves from unified field
      const selectedLeaves = (setup.leaves || []).filter(item => item.selected)

      setLeaveOptions(selectedLeaves)
    } catch (error) {
      console.error("Error fetching leave setup:", error)
    }
  }

  useEffect(() => {
    if (leaveSetup) {
      getLeaveSetupById(leaveSetup)
    }
  }, [leaveSetup])



  const handleSelectEmployee = (employee) => {
  setValue('employee', employee._id)
  setInputValue(employee.name)
  setLeaveSetup(employee.leave)
  setSelectedEmployeeGender(employee.gender) 
  setShowDropdown(false)
}


  const getLeftLeave = async (employeeId, leaveTypeId) => {
    if (!employeeId || !leaveTypeId) return
    setLoadingBalance(true)
    try {
      console.log("Calling getLeftLeave with:", { employeeId, leaveTypeId })

      const res = await leaveManegmentService.getLeftLeave(employeeId, leaveTypeId)
      console.log("Leave balance:", res.data)
      setLeaveBalance(res.data)
    } catch (error) {
      console.error("Error fetching leave balance:", error)
      setLeaveBalance(null)
    } finally {
      setLoadingBalance(false)
    }
  }

  const employee = watch('employee')
  const leaveType = watch('leaveType')

  useEffect(() => {
    if (employee && leaveType) {
      getLeftLeave(employee, leaveType)
    }
  }, [employee, leaveType])



  useEffect(() => {
    if (startDate && endDate) {
      const diff = dayjs(endDate).diff(dayjs(startDate), 'day') + 1
      const total = diff > 0 ? diff : 0
      setValue('totalLeave', total)
    } else {
      setValue('totalLeave', 0)
    }
  }, [startDate, endDate, setValue])

  const onSubmit = async (data) => {
    const formData = {
      employee: data.employee,
      leaveType: data.leaveType,
      leaves: data.leaves,
      startDate: data.startDate ? dayjs(data.startDate).format("YYYY-MM-DD") : '',
      endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : '',
      totalLeave: data.totalLeave,
      reason: data.reason,
    }

    try {
      if (EditSelectedLeaveType?._id) {
        const id = EditSelectedLeaveType._id
        const result = await LeaveMagmentService.updateLeaveApply(id, formData)
        toast.success(result.message)
      } else {
        const result = await LeaveMagmentService.createLeaveApply(formData)
        console.log(result.data, "applyfor leave")
        toast.success(result.message)
      }

      getLeave()
      reset()
      setModalOpen(false)
    } catch (error) {
      console.log('Something went wrong.', error)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" className="mb-4" gutterBottom>
          {EditSelectedLeaveType?.employee?._id ? "Edit Leave" : "Apply Leave"}
        </Typography>
        <DialogContent>
          <Grid container spacing={5}>
            {/* Employee Name Search */}
            <Grid item xs={12} sx={{ position: 'relative' }}>
              <Controller
                name="employee"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Employee Name"
                    placeholder="Search Employee Name"
                    error={!!errors.employee}
                    helperText={errors.employee && 'This field is required.'}
                    value={inputValue}
                    onChange={(e) => handleEmployeeSearch(e.target.value)}
                    onBlur={() => setShowDropdown(false)}
                    onFocus={() => {
                      if (employees.length > 0) setShowDropdown(true)
                    }}
                    inputProps={{
                      role: 'combobox',
                      'aria-expanded': showDropdown,
                      'aria-haspopup': 'listbox',
                      'aria-controls': 'employee-listbox'
                    }}
                  />
                )}
              />

              {showDropdown && employees.length > 0 && (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    zIndex: 2,
                    left: 0,
                    width: '100%',
                    maxHeight: 200,
                    overflowY: 'auto',
                    mt: 1,
                    borderRadius: 1,
                  }}
                >
                  <List id="employee-listbox" dense role="listbox">
                    {employees.map((employee) => (
                      <ListItem
                        key={employee._id}
                        role="option"
                        onMouseDown={() => handleSelectEmployee(employee)}
                      >
                        <span className='text-sm cursor-pointer'>{employee.name}</span>
                        <span className='text-sm cursor-pointer'>{employee.employee_id}</span>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>

            {/* Leave Type */}
<Grid item xs={12}>
  <Controller
    name='leaveType'
    control={control}
    rules={{ required: true }}
    render={({ field }) => (
      <CustomTextField
        {...field}
        select
        fullWidth
        label='Leave Type'
        error={!!errors.leaveType}
        helperText={errors.leaveType && 'This field is required.'}
        InputProps={{
          sx: { textAlign: 'left' },
        }}
      >
        <MenuItem value='' disabled hidden>
          Select Leave Type
        </MenuItem>

        {leaveOptions
          .filter((item) => {
            if (!selectedEmployeeGender) return true

            const genderName = selectedEmployeeGender?.name?.toLowerCase()

            // Gender-based leave filtering
            if (item.code === 'ML' && genderName === 'male') return false // Male ko Maternity Leave hide
            if (item.code === 'PL' && genderName === 'female') return false // Female ko Paternity Leave hide

            return true
          })
          .map((item) => (
            <MenuItem key={item.code} value={item.leaveNameID}>
              {item.name}
            </MenuItem>
          ))}
      </CustomTextField>
    )}
  />
</Grid>


            <Grid item xs={12}>
              {loadingBalance ? (
                <Typography className="text-left text-sm">Fetching leave balance...</Typography>
              ) : leaveBalance ? (
                <Typography
                  className="text-left text-sm"
                  sx={{ whiteSpace: 'pre', fontWeight: 600 }}
                >
                  {`${leaveBalance.totalAllocated || 0}  (Total Leaves)  -  ${leaveBalance.totalTaken || 0} (Used Leave)  =  ${leaveBalance.remaining >= 0 ? leaveBalance.remaining : 0} (Left Leaves)`}
                </Typography>
              ) : (
                <Typography className="text-left text-sm text-gray-500">
                  Select Employee & Leave Type to view balance
                </Typography>
              )}
            </Grid>



            {/* <Grid item xs={12}>
              {usedLeave && usedLeave.leaveType ? (
                <Typography className='text-left' sx={{ whiteSpace: 'pre' }}>
                  {`${usedLeave.leaveType.allowLeave} (Total Leaves)  -  ${usedLeave.totalLeave} (Used Leave)  =  ${leftleave} (Left Leaves)`}
                </Typography>
              ) : null}
            </Grid> */}


            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'Start Date is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type="date"
                    fullWidth
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                )}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'End Date is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type="date"
                    fullWidth
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Total Leave Days */}
            <Grid item xs={12}>
              <Typography className='text-left'>
                Total Leave Days: {watch('totalLeave')}
              </Typography>
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <Controller
                name="reason"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={2}
                    label="Reason"
                    placeholder="Reason for leave"
                    error={!!errors.reason}
                    helperText={errors.reason && 'This field is required.'}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {!disableSave && (
            <Button type='submit' variant='contained'>
              Save
            </Button>
          )}
          <Button onClick={() => setModalOpen(false)} variant='outlined'>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </LocalizationProvider>
  )
}

export default ApplyForLeaveForm
