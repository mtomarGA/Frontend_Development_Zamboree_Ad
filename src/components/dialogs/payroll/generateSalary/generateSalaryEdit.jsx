'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider
} from '@mui/material'
import { format } from 'date-fns'
import generateSalaryServices from '@/services/payroll/generateSalaryService'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

// Utility for safe date formatting
function formatDate(dateInput) {
  if (!dateInput) return '—'
  const date = new Date(dateInput)
  if (isNaN(date)) return 'Invalid date'
  return format(date, 'dd MMM yyyy')
}

export default function GenerateSalaryView({ salaryData, getAllGenerateSalary, setEditModalOpen }) {
  const snapshot = salaryData.salarySetupSnapshot || {}
  const basic = Number(snapshot.basicSalary || 0)
  const earningsList = snapshot.earnings || []
  const deductionsList = snapshot.deductions || []

  // Initialize editable earnings & deductions
  const [earningValues, setEarningValues] = useState(() =>
    Object.fromEntries(
      earningsList.map(e => [
        e.earning._id,
        Number(e.value ?? 0)
      ])
    )
  )

  const [deductionValues, setDeductionValues] = useState(() =>
    Object.fromEntries(
      deductionsList.map(d => [
        d.deduction._id,
        Number(d.value ?? 0)
      ])
    )
  )


  useEffect(() => {
    const snapshot = salaryData.salarySetupSnapshot || {}

    const newEarnings = Object.fromEntries(
      (snapshot.earnings || []).map(e => [e.earning._id, Number(e.value ?? 0)])
    )

    const newDeductions = Object.fromEntries(
      (snapshot.deductions || []).map(d => [d.deduction._id, Number(d.value ?? 0)])
    )

    setEarningValues(newEarnings)
    setDeductionValues(newDeductions)
  }, [salaryData])


  // Totals recalculated automatically when values change
  const totalEarnings = useMemo(
    () => Object.values(earningValues).reduce((a, b) => a + Number(b || 0), 0),
    [earningValues]
  )

  const totalDeductions = useMemo(
    () => Object.values(deductionValues).reduce((a, b) => a + Number(b || 0), 0),
    [deductionValues]
  )

  //  Salary calculations
  const attendance = salaryData?.attendanceSummary || {}
  const monthSalary = basic + totalEarnings - totalDeductions
  const netPerDay = attendance?.workingDays ? monthSalary / attendance.workingDays : 0
  const netSalary = (netPerDay * Number(attendance?.payable || 0)).toFixed(2)

  //  Lock control
  const isInitiallyLocked = salaryData?.status === 'LOCKED'
  const [checked, setChecked] = useState(isInitiallyLocked)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCheckboxChange = () => {
    if (checked) return
    setDialogOpen(true)
  }

  const confirmLock = async () => {
    try {
      await generateSalaryServices.updateSalaryStatus(salaryData._id, { status: 'LOCKED' })
      setChecked(true)
      setDialogOpen(false)
      setEditModalOpen(false)
      getAllGenerateSalary?.()
    } catch (error) {
      console.error(error)
    }
  }

  const cancelLock = () => {
    setChecked(false)
    setDialogOpen(false)
  }

  //  Save updated salary details
  const handleSaveChanges = async () => {
  try {
    const updatedPayload = {
      earnings: earningsList.map(e => ({
        earningId: e.earning._id,
        value: Number(earningValues[e.earning._id] || 0)
      })),
      deductions: deductionsList.map(d => ({
        deductionId: d.deduction._id,
        value: Number(deductionValues[d.deduction._id] || 0)
      })),
      totalEarnings: Number(totalEarnings),
      totalDeductions: Number(totalDeductions),
      netSalary: Number(netSalary)
    }

    await generateSalaryServices.updateGenerateSalary(salaryData._id, updatedPayload)
    await getAllGenerateSalary?.()
    setEditModalOpen(false)
  } catch (error) {
    console.error("Update error:", error)
  }
}


  return (
    <Container maxWidth='md'>
      <Typography variant='h4' className='mb-6'>
        Generate Salary
      </Typography>

      {/* Employee & Salary Info */}
      <Grid container spacing={2} className='mb-4'>
        {[
          { label: 'Employee Name', value: salaryData?.employee?.name },
          { label: 'Branch', value: salaryData?.salarySetup?.branch?.name },
          { label: 'Employee ID', value: salaryData?.employee?.employee_id },
          { label: 'Department', value: salaryData?.salarySetup?.department?.name },
          { label: 'Basic Salary', value: basic },
          { label: 'Designation', value: salaryData?.salarySetup?.designation?.name },
          {
            label: 'Month',
            value:
              salaryData?.month && salaryData?.year
                ? format(new Date(salaryData.year, salaryData.month - 1, 1), 'MMM yyyy')
                : '—'
          },
          { label: 'Created At', value: formatDate(salaryData?.createdAt) },
          { label: 'Total Working Days', value: attendance?.workingDays },
          { label: 'Total Present Days', value: attendance?.present },
          { label: 'Total Holidays', value: attendance?.holiday },
          { label: 'Total Leaves', value: attendance?.leave },
          { label: 'Total Late Days', value: attendance?.late },
          { label: 'Total Payable Days', value: attendance?.payable }
        ].map((item, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6} md={3}>
              <Typography variant='h6' sx={{ textAlign: 'left' }}>
                {item.label}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant='body2' className='font-medium'>
                {item.label === 'Basic Salary'
                  ? (item.value ? Number(item.value).toFixed(2) : '0.00')
                  : item.value ?? '—'}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

      <Divider sx={{ my: 4, backgroundColor: 'text.primary' }} />

      {/* Earnings & Deductions */}
      <Grid container spacing={4} className='mb-10'>
        {/* Earnings */}
        <Grid item xs={12} md={6}>
          <Typography variant='h4' sx={{ mb: 2, textAlign: 'left' }}>
            Earnings
          </Typography>
          <Grid container spacing={1}>
            {earningsList.map(e => (
              <React.Fragment key={e.earning._id}>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'left' }}>{e.earning.earningName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    size='small'
                    type='number'
                    value={earningValues[e.earning._id] ?? ''}
                    onChange={evt => {
                      const val = evt.target.value
                      setEarningValues(prev => ({
                        ...prev,
                        [e.earning._id]: val === '' ? '' : Number(val)
                      }))
                    }}
                    fullWidth
                    disabled={checked}
                  />

                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>

        {/* Deductions */}
        <Grid item xs={12} md={6}>
          <Typography variant='h4' sx={{ mb: 2, textAlign: 'left' }}>
            Deductions
          </Typography>
          <Grid container spacing={1}>
            {deductionsList.map(d => (
              <React.Fragment key={d.deduction._id}>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'left' }}>{d.deduction.deductionName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    size='small'
                    type='number'
                    value={deductionValues[d.deduction._id] ?? ''}
                    onChange={evt => {
                      const val = evt.target.value
                      setDeductionValues(prev => ({
                        ...prev,
                        [d.deduction._id]: val === '' ? '' : Number(val)
                      }))
                    }}
                    fullWidth
                    disabled={checked}
                  />

                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ backgroundColor: 'text.primary', my: 6 }} />

      <Grid container spacing={4} className='mb-10'>
        <Grid item xs={6} md={3}>
          <Typography variant='h5' sx={{ fontWeight: 600, textAlign: 'left' }}>
            Total Earnings
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>₹{totalEarnings.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant='h5' sx={{ fontWeight: 600, textAlign: 'left' }}>
            Total Deductions
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>₹{totalDeductions.toFixed(2)}</Typography>
        </Grid>
      </Grid>



      {/* Net Salary */}
      <Grid container className='mb-8'>
        <Typography variant='h5'>Net Salary: ₹{netSalary}</Typography>
      </Grid>

      {/* Lock Checkbox */}
      <Box className='flex gap-3 mb-4'>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: checked ? 'not-allowed' : 'pointer',
            fontSize: '1.3rem',
            opacity: checked ? 0.6 : 1
          }}
        >
          <span>Is Salary Locked</span>
          <input
            type='checkbox'
            checked={checked}
            disabled={checked}
            onChange={handleCheckboxChange}
            style={{ transform: 'scale(1.5)', marginLeft: '10px' }}
          />
        </label>
      </Box>

      {/* Confirm Lock Dialog */}
      <Dialog open={dialogOpen} onClose={cancelLock} maxWidth='xs' fullWidth>
        <DialogTitle>Confirm Lock</DialogTitle>
        <Box className='px-6 pb-4'>
          <Typography>Are you sure you want to lock this salary?</Typography>
          <Box className='flex justify-end gap-2 mt-4'>
            <Button variant='outlined' onClick={cancelLock}>
              Cancel
            </Button>
            <Button variant='contained' color='success' onClick={confirmLock}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Action Buttons */}
      <DialogActions>
        <Button variant='contained' color='primary' onClick={handleSaveChanges} disabled={checked}>
          Save
        </Button>
        <Button onClick={() => setEditModalOpen(false)} variant='outlined'>
          Cancel
        </Button>
      </DialogActions>
    </Container>
  )
}
