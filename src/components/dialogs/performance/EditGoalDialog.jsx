'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton
} from '@mui/material'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import EmployeeService from '@/services/employee/EmployeeService'
import { toast } from 'react-toastify'

// ✅ Define goal types with label + value mapping
const goalTypes = [
  { value: 'ENROLL_FRESH_BUSINESS', label: 'Enroll Fresh Business' },
  { value: 'UPDATE_EXISTING_BUSINESS', label: 'Update Existing Business' },
  { value: 'CONVERT_FREE_BUSINESS_TO_PAID', label: 'Convert Free Business To Paid' },
  { value: 'PAID_BANNER_LISTING', label: 'Paid Banner Listing' },
  { value: 'ENROLL_FRESH_TEMPLE', label: 'Enroll Fresh Temple' },
  { value: 'ENROLL_FRESH_MOSQUE', label: 'Enroll Fresh Mosque' },
  { value: 'ENROLL_FRESH_GURUDWARA', label: 'Enroll Fresh Gurudwara' }
]

const goalModels = ['Paid', 'Unpaid']

const EditGoalDialog = ({ open, onClose, goalData, onSave }) => {
  const [form, setForm] = useState({})
  const [description, setDescription] = useState('')
  const [employeeList, setEmployeeList] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your goal description here...' })
    ],
    content: goalData?.description || '',
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    immediatelyRender: false
  })

  // ✅ Prefill form when editing
  useEffect(() => {
    if (goalData) {
      setForm({
        ...goalData,
        goalType: goalData?.goalType
          ? goalData.goalType.toUpperCase().replaceAll(' ', '_')
          : '',
        branch: goalData?.branch?._id || '',
        department: goalData?.department?._id || '',
        designation: goalData?.designation?._id || '',
        startDate: goalData?.startDate?.slice(0, 10) || '',
        endDate: goalData?.endDate?.slice(0, 10) || ''
      })
      setSelectedEmployees(goalData?.assignedEmployees?.map(emp => emp._id) || [])
      setDescription(goalData.description || '')
    }
  }, [goalData])

  // Load master lists
  useEffect(() => {
    BranchService.get().then(res => setBranchList(res?.data || []))
    DepartmentService.get().then(res => setDepartmentList(res?.data || []))
    DesignationService.get().then(res => setDesignationList(res?.data || []))
  }, [])

  // Load employees dynamically
  useEffect(() => {
    if (form.branch && form.department && form.designation) {
      EmployeeService.getSearchEmployee({
        branch: form.branch,
        department: form.department,
        designation: form.designation
      }).then(res => {
        const employees = res?.data || []
        setEmployeeList(employees)
        const allSelected = employees.every(emp => selectedEmployees.includes(emp._id))
        setSelectAll(allSelected)
      })
    }
  }, [form.branch, form.department, form.designation])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleEmployee = id => {
    const updated = selectedEmployees.includes(id)
      ? selectedEmployees.filter(i => i !== id)
      : [...selectedEmployees, id]
    setSelectedEmployees(updated)
    setSelectAll(updated.length === employeeList.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([])
      setSelectAll(false)
    } else {
      const allIds = employeeList.map(emp => emp._id)
      setSelectedEmployees(allIds)
      setSelectAll(true)
    }
  }

  const handleSubmit = () => {
    if (!form.subject?.trim()) return toast.error('Subject is required')
    if (!form.goalModel) return toast.error('Goal Model is required')
    if (!form.goalType) return toast.error('Goal Type is required')
    if (!form.targetGoalValue) return toast.error('Target value is required')
    if (!form.startDate) return toast.error('Start Date is required')
    if (!form.endDate) return toast.error('End Date is required')
    if (!form.branch || !form.department || !form.designation) return toast.error('Please select branch, department, and designation')

    const payload = {
      ...form,
      // ✅ Convert back to backend format if needed
      goalType: form.goalType,
      assignedEmployees: selectedEmployees,
      description,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString()
    }

    onSave(payload)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>
        Edit Goal
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme => theme.palette.grey[500] }}
        >
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Left Side */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Subject'
              name='subject'
              value={form.subject || ''}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Goal Model</InputLabel>
              <Select
                name='goalModel'
                value={form.goalModel || ''}
                label='Goal Model'
                onChange={handleChange}
              >
                {goalModels.map(model => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Incentive Amount'
              name='incentiveAmount'
              type='number'
              value={form.incentiveAmount || ''}
              onChange={handleChange}
              disabled={form.goalModel !== 'Paid'}
              sx={{ mt: 3 }}
            />

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Goal Type</InputLabel>
              <Select
                name='goalType'
                value={form.goalType || ''}
                onChange={handleChange}
                label='Goal Type'
              >
                {goalTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Target Goal Value'
              name='targetGoalValue'
              type='number'
              value={form.targetGoalValue || ''}
              onChange={handleChange}
              sx={{ mt: 3 }}
            />

            <TextField
              fullWidth
              label='Start Date'
              name='startDate'
              type='date'
              value={form.startDate || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 3 }}
            />

            <TextField
              fullWidth
              label='End Date'
              name='endDate'
              type='date'
              value={form.endDate || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 3 }}
            />
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Branch</InputLabel>
              <Select
                name='branch'
                value={form.branch || ''}
                onChange={handleChange}
                label='Branch'
              >
                {branchList.map(branch => (
                  <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name='department'
                value={form.department || ''}
                onChange={handleChange}
                label='Department'
              >
                {departmentList.map(dep => (
                  <MenuItem key={dep._id} value={dep._id}>{dep.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Designation</InputLabel>
              <Select
                name='designation'
                value={form.designation || ''}
                onChange={handleChange}
                label='Designation'
              >
                {designationList.map(des => (
                  <MenuItem key={des._id} value={des._id}>{des.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Points'
              name='points'
              type='number'
              value={form.points || ''}
              onChange={handleChange}
              sx={{ mt: 3 }}
            />

            {employeeList.length > 0 && (
              <Box mt={3}>
                <Typography>Select Employees</Typography>
                <ListItem dense disablePadding>
                  <ListItemIcon>
                    <Checkbox checked={selectAll} onChange={handleSelectAll} />
                  </ListItemIcon>
                  <ListItemText primary='Select All Employees' />
                </ListItem>
                <List dense>
                  {employeeList.map(emp => (
                    <ListItem key={emp._id} disablePadding>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedEmployees.includes(emp._id)}
                          onChange={() => handleToggleEmployee(emp._id)}
                        />
                      </ListItemIcon>
                      <ListItemText primary={`${emp.name} (${emp.employee_id})`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography>Description</Typography>
            <Box sx={{ border: '1px solid #ccc', minHeight: '150px' }}>
              {editor && <EditorContent editor={editor} />}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant='contained'>Update Goal</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditGoalDialog
