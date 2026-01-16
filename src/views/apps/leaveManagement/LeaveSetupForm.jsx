'use client'

import { useEffect, useState } from 'react'
import {
  Button, Grid, DialogContent, DialogActions, Typography, Paper, Stack,
  RadioGroup, FormControlLabel, Radio, Checkbox, MenuItem
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import leaveNameService from '@/services/leave-management/leaveName'
import leaveSetupService from '@/services/leave-management/leaveSetup'
import fixedleaveNameService from '@/services/leave-management/fixedLeaveName'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const LeaveSetupForm = ({ id }) => {
  const router = useRouter()
  const { control, handleSubmit, formState: { errors }, setValue } = useForm()

  const [formData, setFormData] = useState({
    from: null,
    to: null,
    name: '',
    fixedLeaves: [],
    otherLeaves: []
  })

  //  Fetch Fixed Leaves
  const getFixedLeaves = async () => {
    try {
      const res = await fixedleaveNameService.getfixedLeaveName()
      const data = res.data.map(item => ({
        leaveNameID: item._id,
        code: item.code,
        name: item.name,
        mode: 'Calculate',
        maxLeaves: '',
        per: 'per Month',
        workedDays: '',
        earnedDays: '',
        cfNextMonth: false,
        nextYear: 'Lapse',
        selected: false
      }))
      setFormData(prev => ({ ...prev, fixedLeaves: data }))
    } catch (err) {
      toast.error('Failed to fetch fixed leaves')
      console.error(err)
    }
  }

  // ✅ Fetch Other Leaves
  const getOtherLeaves = async () => {
    try {
      const res = await leaveNameService.getLeaveName()
      const data = res.data.map(item => ({
        leaveNameID: item._id,
        code: item.code,
        name: item.name,
        mode: 'Calculate',
        maxLeaves: '',
        per: 'per Month',
        workedDays: '',
        earnedDays: '',
        cfNextMonth: false,
        nextYear: 'Lapse',
        selected: false
      }))
      setFormData(prev => ({ ...prev, otherLeaves: data }))
    } catch (err) {
      toast.error('Failed to fetch leave types')
      console.error(err)
    }
  }

  // ✅ Fetch existing Leave Setup for edit
  const fetchLeaveSetupById = async () => {
  try {
    // 1️⃣ Get setup data
    const res = await leaveSetupService.getLeaveSetupById(id)
    const setup = res.data

    // 2️⃣ Get all master leave lists
    const [fixedRes, otherRes] = await Promise.all([
      fixedleaveNameService.getfixedLeaveName(),
      leaveNameService.getLeaveName()
    ])

    const fixedMaster = fixedRes.data.map(item => ({
      leaveNameID: item._id,
      code: item.code,
      name: item.name,
      mode: 'Calculate',
      maxLeaves: '',
      per: 'per Month',
      workedDays: '',
      earnedDays: '',
      cfNextMonth: false,
      nextYear: 'Lapse',
      selected: false
    }))

    const otherMaster = otherRes.data.map(item => ({
      leaveNameID: item._id,
      code: item.code,
      name: item.name,
      mode: 'Calculate',
      maxLeaves: '',
      per: 'per Month',
      workedDays: '',
      earnedDays: '',
      cfNextMonth: false,
      nextYear: 'Lapse',
      selected: false
    }))

    // 3️⃣ Merge existing setup data into master lists
    const mergedFixed = fixedMaster.map(item => {
      const existing = setup.leaves.find(l => l.leaveNameID === item.leaveNameID)
      return existing ? { ...item, ...existing } : item
    })

    const mergedOther = otherMaster.map(item => {
      const existing = setup.leaves.find(l => l.leaveNameID === item.leaveNameID)
      return existing ? { ...item, ...existing } : item
    })

    // 4️⃣ Update form
    setFormData({
      from: new Date(setup.from),
      to: new Date(setup.to),
      name: setup.name,
      fixedLeaves: mergedFixed,
      otherLeaves: mergedOther
    })

    setValue('from', new Date(setup.from))
    setValue('to', new Date(setup.to))
    setValue('name', setup.name)
  } catch (err) {
    toast.error('Failed to fetch leave setup')
    console.error(err)
  }
}


  useEffect(() => {
    if (id) fetchLeaveSetupById()
    else {
      getFixedLeaves()
      getOtherLeaves()
    }
  }, [id])

  // ✅ Common change handler
  const handleLeaveChange = (type, index, field, value) => {
    const updated = [...formData[type]]
    updated[index][field] = value

    if (field === 'mode' && value === 'Fixed') {
      updated[index].workedDays = ''
      updated[index].earnedDays = ''
    }
    if (field === 'cfNextMonth' && value === false) {
      updated[index].nextYear = 'Lapse'
    }

    setFormData({ ...formData, [type]: updated })
  }

  // ✅ Submit merged data
  const onSubmit = async () => {
    try {
      const fromDate = new Date(formData.from)
      fromDate.setDate(1)
      const toDate = new Date(formData.to)
      toDate.setMonth(toDate.getMonth() + 1)
      toDate.setDate(0)

      const payload = {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        name: formData.name,
        // ✅ merge both tables before sending
        leaves: [...formData.fixedLeaves, ...formData.otherLeaves]
      }

      if (id) await leaveSetupService.updateLeaveSetup(id, payload)
      else await leaveSetupService.createLeaveSetup(payload)

      router.push('/en/apps/leave-management/leave-setup')
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ Reusable table render
  const renderLeaveTable = (title, leaves, type) => (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>{title}</Typography>
      <Paper variant="outlined" sx={{ p: 3, minWidth: 1150 }}>
        {/* Header */}
        <Grid container spacing={4} sx={{ mb: 3 }}>
          <Grid item xs={2}><Typography fontWeight={600} align="center">Leave</Typography></Grid>
          <Grid item xs={2.2}><Typography fontWeight={600} align="center">Leave Type</Typography></Grid>
          <Grid item xs={2.5}><Typography fontWeight={600} align="center">Leaves Allotted</Typography></Grid>
          <Grid item xs={1}><Typography fontWeight={600} align="center">Days Worked</Typography></Grid>
          <Grid item xs={1}><Typography fontWeight={600} align="center">Leave Earned</Typography></Grid>
          <Grid item xs={2.8}>
            <Typography fontWeight={600} align="center" mb={2}>Balance Leaves</Typography>
            <Grid container>
              <Grid item xs={6}><Typography fontWeight={600} align="right">CF Next Month</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight={600} align="center">To Next Year</Typography></Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Rows */}
        {leaves && leaves.length > 0 ? (
          leaves.map((leave, index) => (
            <Grid container spacing={4} key={leave.code} sx={{ mb: 2, pb: 2 }}>
              <Grid item xs={0.5}>
                <Checkbox
                  checked={leave.selected}
                  onChange={e => handleLeaveChange(type, index, 'selected', e.target.checked)}
                />
              </Grid>

              <Grid item xs={2} display="flex" gap={2} mt={2}>
                <Typography variant="h6">{leave.name}</Typography>
                <Typography variant="h6" color="text.secondary">{leave.code}</Typography>
              </Grid>

              <Grid item xs={2.2}>
                <RadioGroup
                  row
                  value={leave.mode}
                  onChange={e => handleLeaveChange(type, index, 'mode', e.target.value)}
                >
                  <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                  <FormControlLabel value="Calculate" control={<Radio />} label="Calculate" />
                </RadioGroup>
              </Grid>

              <Grid item xs={2.5}>
                <Stack direction="row" spacing={2}>
                  <CustomTextField
                    sx={{ width: '60%' }}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={leave.maxLeaves}
                    onChange={e =>
                      handleLeaveChange(type, index, 'maxLeaves', e.target.value ? e.target.value.replace(/[^0-9]/g, '') : '')
                    }
                    placeholder="0"
                  />
                  <CustomTextField
                    select
                    value={leave.per}
                    onChange={e => handleLeaveChange(type, index, 'per', e.target.value)}
                    sx={{ width: '110%' }}
                  >
                    <MenuItem value="per Month">Monthly</MenuItem>
                    <MenuItem value="per Year">Yearly</MenuItem>
                    <MenuItem value="per Half Year">Half Yearly</MenuItem>
                    <MenuItem value="per Quater">Quarterly</MenuItem>
                  </CustomTextField>
                </Stack>
              </Grid>

              <Grid item xs={1}>
                <CustomTextField
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  value={leave.workedDays}
                  onChange={e =>
                    handleLeaveChange(type, index, 'workedDays', e.target.value ? e.target.value.replace(/[^0-9]/g, '') : '')
                  }
                  disabled={leave.mode === 'Fixed'}
                  placeholder="0"
                />
              </Grid>

              <Grid item xs={1}>
                <CustomTextField
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  value={leave.earnedDays}
                  onChange={e =>
                    handleLeaveChange(type, index, 'earnedDays', e.target.value ? e.target.value.replace(/[^0-9]/g, '') : '')
                  }
                  disabled={leave.mode === 'Fixed'}
                  placeholder="0"
                />
              </Grid>

              <Grid item xs={1}>
                <Stack alignItems="center">
                  <Checkbox
                    checked={leave.cfNextMonth}
                    onChange={e => handleLeaveChange(type, index, 'cfNextMonth', e.target.checked)}
                  />
                </Stack>
              </Grid>

              <Grid item xs={1.8}>
                <CustomTextField
                  select
                  fullWidth
                  value={leave.nextYear}
                  onChange={e => handleLeaveChange(type, index, 'nextYear', e.target.value)}
                  disabled={!leave.cfNextMonth}
                >
                  <MenuItem value="Lapse">Lapse</MenuItem>
                  <MenuItem value="Carry Forward">Carry Forward</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No data available
          </Typography>
        )}
      </Paper>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        {/* Title */}
        <Typography variant="h4" mb={4} align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Leave Setup
        </Typography>

        {/* Top fields */}
        <Grid container spacing={6} mb={6}>
          <Grid item xs={12} md={3}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={e => {
                    field.onChange(e.target.value)
                    setFormData({ ...formData, name: e.target.value })
                  }}
                  error={!!errors.name}
                  helperText={errors.name && 'Name is required'}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="from"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AppReactDatepicker
                  selected={field.value}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  onChange={date => {
                    field.onChange(date)
                    setFormData({ ...formData, from: date })
                  }}
                  customInput={
                    <CustomTextField
                      label="From"
                      fullWidth
                      error={!!errors.from}
                      helperText={errors.from && 'From Month is required'}
                    />
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="to"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AppReactDatepicker
                  selected={field.value}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  onChange={date => {
                    field.onChange(date)
                    setFormData({ ...formData, to: date })
                  }}
                  customInput={
                    <CustomTextField
                      label="To"
                      fullWidth
                      error={!!errors.to}
                      helperText={errors.to && 'To Month is required'}
                    />
                  }
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Separate tables */}
        {renderLeaveTable('Fixed Leave Types', formData.fixedLeaves, 'fixedLeaves')}
        {renderLeaveTable('Other Leave Types', formData.otherLeaves, 'otherLeaves')}
      </DialogContent>

      <DialogActions sx={{ pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">Save</Button>
          <Button variant="outlined" onClick={() => router.push('/en/apps/leave-management/leave-setup')}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </form>
  )
}

export default LeaveSetupForm
