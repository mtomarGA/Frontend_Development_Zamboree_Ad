'use client'

import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Button, MenuItem, Typography, Checkbox, List, ListItem, ListItemText } from '@mui/material'
import { useEditor, EditorContent } from '@tiptap/react'

import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import EmployeeService from '@/services/employee/EmployeeService'
import goalService from '@/services/performance/goal'
import { useRouter } from 'next/navigation'
import CustomTextField from '@/@core/components/mui/TextField'
import StarterKit from '@tiptap/starter-kit'

const goalTypes = [
'Enroll Fresh Business',
'Update Existing Business',
'Convert Free Business To Paid',
'Paid Banner Listing',
'Enroll Fresh Temple',
'Enroll Fresh Mosque',
'Enroll Fresh Gurudwara'
];

const goalModels = ['Paid', 'Unpaid']

const NewGoal = () => {
  const router = useRouter()

  const [form, setForm] = useState({
    subject: '',
    goalModel: '',
    goalType: '',
    targetGoalValue: '',
    startDate: '',
    endDate: '',
    branch: '',
    department: '',
    designation: '',
    points: '',
    inactiveAmount: ''
  })

  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [description, setDescription] = useState('')
  const [employeeList, setEmployeeList] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your goal description here...' })
    ],
    content: '',
    onUpdate: ({ editor }) => setDescription(editor.getHTML())
  })

  useEffect(() => {
    BranchService.get().then(res => Array.isArray(res?.data) && setBranchList(res.data))
    DepartmentService.get().then(res => Array.isArray(res?.data) && setDepartmentList(res.data))
    DesignationService.get().then(res => Array.isArray(res?.data) && setDesignationList(res.data))
  }, [])

  const handleChange = async e => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }
    setForm(updatedForm)

   
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    if (
      (name === 'branch' || name === 'department' || name === 'designation') &&
      updatedForm.branch &&
      updatedForm.department &&
      updatedForm.designation
    ) {
      try {
        const query = {
          branch: updatedForm.branch,
          department: updatedForm.department,
          designation: updatedForm.designation
        }
        const res = await EmployeeService.getSearchEmployee(query)
        setEmployeeList(res?.data || [])
        setSelectedEmployees([])
        setSelectAll(false)
      } catch (err) {
        console.error('Failed to fetch employees', err)
      }
    }
  }

  const handleToggleEmployee = empId => {
    let updated = selectedEmployees.includes(empId)
      ? selectedEmployees.filter(id => id !== empId)
      : [...selectedEmployees, empId]
    setSelectedEmployees(updated)
    setSelectAll(updated.length === employeeList.length && updated.length > 0)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([])
      setSelectAll(false)
    } else {
      setSelectedEmployees(employeeList.map(emp => emp._id))
      setSelectAll(true)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validations
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.goalModel) newErrors.goalModel = 'Goal Model is required'
    if (!form.goalType) newErrors.goalType = 'Goal Type is required'
    if (!form.targetGoalValue.trim()) newErrors.targetGoalValue = 'Target Goal Value is required'
    if (!form.startDate) newErrors.startDate = 'Start Date is required'
    if (!form.endDate) newErrors.endDate = 'End Date is required'

    // Date validation
    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate)
      const endDate = new Date(form.endDate)
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (form.targetGoalValue && isNaN(Number(form.targetGoalValue))) {
      newErrors.targetGoalValue = 'Target Goal Value must be a valid number'
    }

    if (form.targetGoalValue && Number(form.targetGoalValue) <= 0) {
      newErrors.targetGoalValue = 'Target Goal Value must be greater than 0'
    }

    // Points validation if provided
    if (form.points && isNaN(Number(form.points))) {
      newErrors.points = 'Points must be a valid number'
    }

    // Incentive amount validation for Paid goals
    if (form.goalModel === 'Paid' && !form.inactiveAmount.trim()) {
      newErrors.inactiveAmount = 'Incentive amount is required for Paid goals'
    }

    if (form.inactiveAmount && isNaN(Number(form.inactiveAmount))) {
      newErrors.inactiveAmount = 'Incentive amount must be a valid number'
    }

    // Employee selection validation
    if (employeeList.length > 0 && selectedEmployees.length === 0) {
      newErrors.employees = 'At least one employee must be selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const payload = {
        subject: form.subject,
        goalModel: form.goalModel,
        goalType: form.goalType,
        targetGoalValue: form.targetGoalValue ? [Number(form.targetGoalValue)] : [],
        startDate: form.startDate,
        endDate: form.endDate,
        description,
        branch: form.branch,
        department: form.department,
        designation: form.designation,
        assignedEmployees: selectedEmployees,
        inactiveAmount: form.inactiveAmount,
        points: form.points
      }
      
      const response = await goalService.createGoal(payload)
      
      // Only navigate if the goal was created successfully
      if (response) {
        router.push('/en/apps/goal/manage-goal')
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h4' gutterBottom>
        New Goal
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Subject'
                name='subject'
                value={form.subject}
                onChange={handleChange}
                required
                error={!!errors.subject}
                helperText={errors.subject}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Goal Model'
                name='goalModel'
                value={form.goalModel}
                onChange={handleChange}
                required
                error={!!errors.goalModel}
                helperText={errors.goalModel}
              >
                <MenuItem value='' disabled>
                  Select Goal Model
                </MenuItem>
                {goalModels.map(model => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Incentive (Amount)'
                name='inactiveAmount'
                value={form.inactiveAmount}
                onChange={handleChange}
                disabled={form.goalModel !== 'Paid'}
                error={!!errors.inactiveAmount}
                helperText={errors.inactiveAmount}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Goal Type'
                name='goalType'
                value={form.goalType}
                onChange={handleChange}
                required
                error={!!errors.goalType}
                helperText={errors.goalType}
              >
                <MenuItem value='' disabled>
                  Select Goal Type
                </MenuItem>
                {goalTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.replaceAll('_', ' ')}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Target Goal Value'
                name='targetGoalValue'
                value={form.targetGoalValue}
                onChange={handleChange}
                required
                error={!!errors.targetGoalValue}
                helperText={errors.targetGoalValue}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Start Date'
                type='date'
                name='startDate'
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={handleChange}
                required
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='End Date'
                type='date'
                name='endDate'
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={handleChange}
                required
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>Description</Typography>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  minHeight: '150px',
                  '& .ProseMirror': { outline: 'none', minHeight: '100px' }
                }}
              >
                <EditorContent editor={editor} />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Target Assign to Branch'
                name='branch'
                value={form.branch}
                onChange={handleChange}
              >
                <MenuItem value='' disabled>
                  Select Branch
                </MenuItem>
                {branchList.map(branch => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Target Assign to Department'
                name='department'
                value={form.department}
                onChange={handleChange}
              >
                <MenuItem value='' disabled>
                  Select Department
                </MenuItem>
                {departmentList.map(dep => (
                  <MenuItem key={dep._id} value={dep._id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Target Assign to Designation'
                name='designation'
                value={form.designation}
                onChange={handleChange}
              >
                <MenuItem value='' disabled>
                  Select Designation
                </MenuItem>
                {designationList.map(des => (
                  <MenuItem key={des._id} value={des._id}>
                    {des.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <Typography>Points Get On Successfully Goal</Typography>
              <CustomTextField
                fullWidth
                name='points'
                value={form.points}
                onChange={handleChange}
                placeholder='Enter point(s) awarded'
                error={!!errors.points}
                helperText={errors.points}
              />
            </Grid>
            {employeeList.length > 0 && (
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Select Employees</Typography>
                {errors.employees && (
                  <Typography color='error' variant='caption' sx={{ display: 'block', mb: 1 }}>
                    {errors.employees}
                  </Typography>
                )}
                <List dense>
                  <ListItem disablePadding key='select-all'>
                    <Checkbox
                      edge='start'
                      checked={selectAll}
                      indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < employeeList.length}
                      onChange={handleSelectAll}
                    />
                    <ListItemText primary='Select All Employees' />
                  </ListItem>
                  {employeeList.map(emp => (
                    <ListItem key={emp._id} disablePadding>
                      <Checkbox
                        edge='start'
                        checked={selectedEmployees.includes(emp._id)}
                        onChange={() => handleToggleEmployee(emp._id)}
                      />
                      <ListItemText primary={`${emp.name} (${emp.employee_id})`} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} textAlign='right' sx={{ mt: 'auto', pt: 4 }}>
        <Box display='flex' gap={2} justifyContent='flex-end'>
          <Button variant='contained' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating Goal...' : 'Create Goal'}
          </Button>
        </Box>
      </Grid>
    </Card>
  )
}

export default NewGoal
