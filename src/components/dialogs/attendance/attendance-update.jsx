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
  MenuItem
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

const EditAttendanceDialog = ({ open, onClose, onSave, editData }) => {
  const [form, setForm] = useState(initialForm)
  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [employeeList, setEmployeeList] = useState([])

  // Load master data
  useEffect(() => {
    BranchService.get().then(res => Array.isArray(res?.data) && setBranchList(res.data))
    DepartmentService.get().then(res => Array.isArray(res?.data) && setDepartmentList(res.data))
    DesignationService.get().then(res => Array.isArray(res?.data) && setDesignationList(res.data))
  }, [])

  // Prefill data when dialog opens
  useEffect(() => {
    if (open && editData) {
      const emp = editData.employee_id || {}

      const formatTime = (timeString) => {
        if (!timeString) return ''
        const d = new Date(timeString)
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      }

      const formattedDate = editData.date
        ? new Date(editData.date).toISOString().split('T')[0]
        : ''

      setForm({
        branch: emp.branch || '',
        department: emp.department || '',
        designation: emp.designation || '',
        employee: emp._id || '',
        date: formattedDate,
        inTime: formatTime(editData.punchIn?.time),
        outTime: formatTime(editData.punchOut?.time),
        punchInLongitude: editData.punchIn?.lng?.toString() || '',
        punchInLatitude: editData.punchIn?.lat?.toString() || '',
        punchOutLongitude: editData.punchOut?.lng?.toString() || '',
        punchOutLatitude: editData.punchOut?.lat?.toString() || ''
      })
    }
  }, [editData, open])

  // Load employee list dynamically
  useEffect(() => {
    if (form.branch && form.department && form.designation) {
      const query = {
        branch: form.branch,
        department: form.department,
        designation: form.designation
      }
      EmployeeService.getSearchEmployee(query).then(res => {
        const list = res?.data || []
        setEmployeeList(list)

        if (form.employee && !list.some(e => e._id === form.employee)) {
          setForm(prev => ({ ...prev, employee: '' }))
        }
      })
    } else {
      setEmployeeList([])
    }
  }, [form.branch, form.department, form.designation])

  const handleClose = () => {
    if (onClose) onClose()
    setTimeout(() => setForm(initialForm), 300)
  }

  const buildPayload = () => ({
    employee_id: form.employee,
    date: form.date || new Date().toISOString().split('T')[0],
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
  })

  // Update handler
  const handleUpdate = async () => {
    if (!form.employee) {
      toast.error('Please select an employee')
      return
    }
    try {
      const payload = buildPayload()
      await punchService.updateEntry(editData._id, payload)
      toast.success('Attendance updated successfully!')
      if (onSave) onSave()
      handleClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update attendance')
    }
  }

  // Get location
  const handleGetLocation = (type) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude?.toFixed(6)
        const lng = pos.coords.longitude?.toFixed(6)
        if (type === 'in')
          setForm(prev => ({ ...prev, punchInLatitude: lat, punchInLongitude: lng }))
        else
          setForm(prev => ({ ...prev, punchOutLatitude: lat, punchOutLongitude: lng }))
        toast.success(`${type === 'in' ? 'Punch In' : 'Punch Out'} location fetched!`)
      },
      () => toast.error('Please allow location access')
    )
  }

  // ---------- NEW DISABLE LOGIC ----------
  const punchInAlreadyFilled = !!editData?.punchIn?.time
  const punchOutNotFilledYet = !editData?.punchOut?.time

  const punchOutMissing =
    !form.outTime ||
    !form.punchOutLatitude ||
    !form.punchOutLongitude

  const isDisabled =
    !form.date ||
    !form.employee ||
    (punchInAlreadyFilled && punchOutNotFilledYet && punchOutMissing)
  // ---------------------------------------

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Attendance
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
              disabled={employeeList.length === 0}
            >
              <MenuItem value=''>Select Employee</MenuItem>
              {employeeList.map(e => (
                <MenuItem key={e._id} value={e._id}>
                  {e.name} ({e.employee_id})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* In / Out Time */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='time'
              label='In Time'
              InputLabelProps={{ shrink: true }}
              value={form.inTime}
              onChange={e => setForm(prev => ({ ...prev, inTime: e.target.value }))}
            />
          </Grid>
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

          {/* Punch In */}
          <Grid item xs={6}>
            <Typography>Punch In</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Longitude'
                  value={form.punchInLongitude}
                  onChange={e => setForm(prev => ({ ...prev, punchInLongitude: e.target.value }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Latitude'
                  value={form.punchInLatitude}
                  onChange={e => setForm(prev => ({ ...prev, punchInLatitude: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Button fullWidth variant='outlined' onClick={() => handleGetLocation('in')}>
                  Get Location
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Punch Out */}
          <Grid item xs={6}>
            <Typography>Punch Out</Typography>
            <Grid container spacing={1}>
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
              <Grid item xs={12} mt={2}>
                <Button fullWidth variant='outlined' onClick={() => handleGetLocation('out')}>
                  Get Location
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant='contained' onClick={handleUpdate} disabled={isDisabled}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAttendanceDialog
