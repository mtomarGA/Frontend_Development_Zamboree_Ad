'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import punchService from '@/services/attendance/punchInOut.service'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import EmployeeService from '@/services/employee/EmployeeService'

const initialForm = {
  branch: '',
  department: '',
  designation: '',
  employee: '',
  date: '',
  inTime: '',
  outTime: '',
  punchInLongitude: '',
  punchInLatitude: '',
  punchOutLongitude: '',
  punchOutLatitude: ''
}

const AddAttendanceDialog = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm)
  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [employeeList, setEmployeeList] = useState([])
  const [existingAttendance, setExistingAttendance] = useState(null)
  const [isPunchOutOnly, setIsPunchOutOnly] = useState(false)

  useEffect(() => {
    BranchService.get().then(res => Array.isArray(res?.data) && setBranchList(res.data))
    DepartmentService.get().then(res => Array.isArray(res?.data) && setDepartmentList(res.data))
    DesignationService.get().then(res => Array.isArray(res?.data) && setDesignationList(res.data))
  }, [])

  useEffect(() => {
    if (form.branch && form.department && form.designation) {
      const query = {
        branch: form.branch,
        department: form.department,
        designation: form.designation
      }
      EmployeeService.getSearchEmployee(query).then(res => setEmployeeList(res?.data || []))
    } else {
      setEmployeeList([])
    }
  }, [form.branch, form.department, form.designation])

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      if (form.employee && form.date) {
        try {
          const query = {
            employee_id: form.employee,
            date: form.date
          }
          const response = await punchService.getEntry(query)

          if (response?.data && response.data.length > 0) {
            const attendance = response.data[0]
            setExistingAttendance(attendance)

            if (attendance.punchIn && !attendance.punchOut) {
              setIsPunchOutOnly(true)

              const punchInTime = new Date(attendance.punchIn.time)
              const hours = punchInTime.getHours().toString().padStart(2, '0')
              const minutes = punchInTime.getMinutes().toString().padStart(2, '0')

              setForm(prev => ({
                ...prev,
                inTime: `${hours}:${minutes}`,
                punchInLatitude: attendance.punchIn.lat?.toString() || '',
                punchInLongitude: attendance.punchIn.lng?.toString() || ''
              }))

              toast.info('Punch In data loaded. Please add Punch Out details.')
            } else if (attendance.punchIn && attendance.punchOut) {
              toast.warning('Attendance already exists for this date')
              setIsPunchOutOnly(false)
            }
          } else {
            setExistingAttendance(null)
            setIsPunchOutOnly(false)

            setForm(prev => ({
              ...prev,
              inTime: '',
              punchInLatitude: '',
              punchInLongitude: ''
            }))
          }
        } catch (err) {
          setExistingAttendance(null)
          setIsPunchOutOnly(false)
        }
      }
    }

    fetchExistingAttendance()
  }, [form.employee, form.date])

  const handleClose = () => {
    setForm(initialForm)
    setExistingAttendance(null)
    setIsPunchOutOnly(false)
    if (onClose) onClose()
  }

  const buildPayload = () => {
    if (isPunchOutOnly && existingAttendance) {
      return {
        punchOut: form.outTime
          ? {
              time: new Date(`${form.date}T${form.outTime}`),
              lat: parseFloat(form.punchOutLatitude),
              lng: parseFloat(form.punchOutLongitude)
            }
          : null
      }
    }

    return {
      employee_id: form.employee,
      date: form.date ? new Date(form.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      punchIn: form.inTime
        ? {
            time: new Date(`${form.date}T${form.inTime}`),
            lat: parseFloat(form.punchInLatitude),
            lng: parseFloat(form.punchInLongitude)
          }
        : null,
      punchOut: form.outTime
        ? {
            time: new Date(`${form.date}T${form.outTime}`),
            lat: parseFloat(form.punchOutLatitude),
            lng: parseFloat(form.punchOutLongitude)
          }
        : null,
      status: 'Present'
      // notes: ''
    }
  }

  const handleSave = async () => {
    if (!form.employee) {
      toast.error('Please select an employee')
      return
    }

    try {
      const payload = buildPayload()

      if (isPunchOutOnly && existingAttendance) {
        await punchService.updateEntry(existingAttendance._id, payload)
        toast.success('Punch Out added successfully!')
      } else {
        await punchService.addEntry(payload)
        toast.success('Attendance added successfully!')
      }

      if (onSave) onSave()
      handleClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance')
    }
  }

  const handleGetLocation = type => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude?.toFixed(6)
        const lng = pos.coords.longitude?.toFixed(6)
        if (type === 'in') setForm(prev => ({ ...prev, punchInLatitude: lat, punchInLongitude: lng }))
        else setForm(prev => ({ ...prev, punchOutLatitude: lat, punchOutLongitude: lng }))
        toast.success(type === 'in' ? 'Punch In location fetched!' : 'Punch Out location fetched!')
      },
      () => toast.error('Please allow location access')
    )
  }
  const isDisabled =
    !form.date ||
    !form.employee ||
    (!isPunchOutOnly &&
      (!form.inTime ||
        !form.outTime ||
        !form.punchInLongitude ||
        !form.punchInLatitude ||
        !form.punchOutLongitude ||
        !form.punchOutLatitude)) ||
    (isPunchOutOnly && (!form.outTime || !form.punchOutLongitude || !form.punchOutLatitude))

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add Attendance
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Date */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='date'
              label='Date'
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
            />
          </Grid>

          {/* Branch */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Branch'
              value={form.branch}
              onChange={e => setForm(prev => ({ ...prev, branch: e.target.value }))}
              disabled={isPunchOutOnly}
            >
              <MenuItem value=''>Select Branch</MenuItem>
              {branchList.map(b => (
                <MenuItem key={b._id} value={b._id}>
                  {b.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Department */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Department'
              value={form.department}
              onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
              disabled={isPunchOutOnly}
            >
              <MenuItem value=''>Select Department</MenuItem>
              {departmentList.map(d => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Designation */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Designation'
              value={form.designation}
              onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
              disabled={isPunchOutOnly}
            >
              <MenuItem value=''>Select Designation</MenuItem>
              {designationList.map(d => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Employee */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Employee'
              value={form.employee}
              onChange={e => setForm(prev => ({ ...prev, employee: e.target.value }))}
              disabled={employeeList.length === 0 || isPunchOutOnly}
            >
              <MenuItem value=''>Select Employee</MenuItem>
              {employeeList.map(e => (
                <MenuItem key={e._id} value={e._id}>
                  {e.name} ({e.employee_id})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* In Time */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='time'
              label='In Time'
              InputLabelProps={{ shrink: true }}
              value={form.inTime}
              onChange={e => setForm(prev => ({ ...prev, inTime: e.target.value }))}
              disabled={isPunchOutOnly}
            />
          </Grid>

          {/* Out Time */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='time'
              label='Out Time'
              InputLabelProps={{ shrink: true }}
              value={form.outTime}
              onChange={e => setForm(prev => ({ ...prev, outTime: e.target.value }))}
            />
          </Grid>

          {/* Punch In Location */}
          <Grid item xs={6}>
            <Typography>Punch In Coordinate</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Longitude'
                  value={form.punchInLongitude}
                  onChange={e => setForm(prev => ({ ...prev, punchInLongitude: e.target.value }))}
                  disabled={isPunchOutOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Latitude'
                  value={form.punchInLatitude}
                  onChange={e => setForm(prev => ({ ...prev, punchInLatitude: e.target.value }))}
                  disabled={isPunchOutOnly}
                />
              </Grid>
              <Grid item xs={12} marginTop={2}>
                <Button fullWidth variant='outlined' onClick={() => handleGetLocation('in')} disabled={isPunchOutOnly}>
                  Current Location
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Punch Out Location */}
          <Grid item xs={6}>
            <Typography>Punch Out Coordinate</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Longitude'
                  value={form.punchOutLongitude}
                  onChange={e => setForm(prev => ({ ...prev, punchOutLongitude: e.target.value }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Latitude'
                  value={form.punchOutLatitude}
                  onChange={e => setForm(prev => ({ ...prev, punchOutLatitude: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} marginTop={2}>
                <Button fullWidth variant='outlined' onClick={() => handleGetLocation('out')}>
                  Current Location
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant='contained' onClick={handleSave} disabled={isDisabled}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAttendanceDialog
