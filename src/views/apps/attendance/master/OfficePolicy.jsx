'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardHeader,
  Button,
  Typography,
  Box,
  Dialog,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Checkbox,
  MenuItem
} from '@mui/material'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import CustomTextField from '@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import DeleteConfirmationDialog from '../../deleteConfirmation'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import officePolicyService from '@/services/attendance/officePolicy.service'
import EditPolicyDialog from '@/components/dialogs/attendance-policy/update-attendance-policy'
import { toast } from 'react-toastify'

const columnHelper = createColumnHelper()

// Fuzzy search
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Debounced input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const OfficePolicy = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [group, setGroup] = useState('')
  const [weeklyOff, setWeeklyOff] = useState(['Sunday']) // Sunday always default checked
  const [data, setData] = useState([])
  const [dayOptions, setDayOptions] = useState({ Sunday: 'All Sunday' }) // Sunday default pattern
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    fetchPolicies()
  }, [])

  // Fetch all policies
  const fetchPolicies = async () => {
    try {
      const res = await officePolicyService.getPolicy()
      setData(res.data)
    } catch (error) {
      console.error('Error fetching policies:', error)
    }
  }

  const transformWeeklyOff = () => {
    const result = {}
    weekDays.forEach(day => {
      const lower = day.toLowerCase()
      const isClosed = weeklyOff.includes(day)

      let pattern = 'None'
      let days = []

      if (isClosed) {
        const option = dayOptions[day] || `All ${day}`
        if (option.includes('All')) pattern = 'All'
        else if (option.includes('First and Third')) pattern = '1st & 3rd'
        else if (option.includes('Second and Fourth')) pattern = '2nd & 4th'
        days = [day]
      }

      result[lower] = { isClosed, pattern, days }
    })
    return result
  }

  const createPolicy = async () => {
    try {
      const transformedWeeklyOff = transformWeeklyOff()
      await officePolicyService.addPolicy({ group, weeklyOff: transformedWeeklyOff })
      toast.success('Policy added successfully')
      setAddOpen(false)
      resetForm()
      fetchPolicies()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add policy')
    }
  }

  const resetForm = () => {
    setGroup('')
    setWeeklyOff(['Sunday']) // Always Sunday checked
    setDayOptions({ Sunday: 'All Sunday' })
    setSelectedPolicy(null)
  }

  // Delete Policy
  const handleDelete = async _id => {
    try {
      const res = await officePolicyService.deletePolicy(_id)
      setData(prev => prev.filter(item => item._id !== _id))
      toast.success(res.message || 'Policy deleted successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete policy')
    }
  }

  // Open Add Dialog
  const handleAddOpen = () => {
    resetForm()
    setAddOpen(true)
  }

  const handleEditClick = policy => {
    setSelectedPolicy(policy)
    setGroup(policy.group || '')

    const days = ['Sunday'] // Always include Sunday
    const options = { Sunday: 'All Sunday' }

    if (policy.weeklyOff && typeof policy.weeklyOff === 'object') {
      Object.entries(policy.weeklyOff).forEach(([day, val]) => {
        const formattedDay = day.charAt(0).toUpperCase() + day.slice(1)
        if (formattedDay !== 'Sunday' && val.isClosed) {
          days.push(formattedDay)
          let label = `All ${formattedDay}`
          if (val.pattern === '1st & 3rd') label = `First and Third ${formattedDay}`
          else if (val.pattern === '2nd & 4th') label = `Second and Fourth ${formattedDay}`
          options[formattedDay] = label
        }
      })
    }

    setWeeklyOff(days)
    setDayOptions(options)
    setEditOpen(true)
  }

  // Update Policy
  const handleUpdatePolicy = async () => {
    try {
      const transformedWeeklyOff = transformWeeklyOff()
      await officePolicyService.updatePolicy(selectedPolicy._id, { group, weeklyOff: transformedWeeklyOff })
      toast.success('Policy updated successfully')
      setEditOpen(false)
      resetForm()
      fetchPolicies()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update policy')
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('group', { header: 'Group', cell: info => info.getValue() }),
      columnHelper.accessor('weeklyOff', {
        header: 'Weekly Off',
        cell: info => {
          const w = info.getValue()
          if (w && typeof w === 'object') {
            return Object.entries(w)
              .filter(([, val]) => val.isClosed)
              .map(([day, val]) => `${val.pattern} (${val.days.join(', ')})`)
              .join(', ')
          } else {
            return '—'
          }
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button size='small' onClick={() => handleEditClick(row.original)}>
              <i className='tabler-edit' />
            </Button>
            <DeleteConfirmationDialog
              itemName='Office Policy'
              onConfirm={() => handleDelete(row.original._id)}
              icon={<i className='tabler-trash text-2xl text-error' />}
            />
          </Box>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card sx={{ overflowX: 'auto' }}>
      <CardHeader
        title={
          <Typography
            variant='h4'
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 0 }
            }}
          >
            Office Policy
          </Typography>
        }
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              gap: 2,
              width: '100%',
              flexWrap: 'wrap'
            }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
              sx={{ width: { xs: '80%', sm: 250, md: 200 } }}
            />
            <Button variant='contained' onClick={handleAddOpen}>
              Add Policy
            </Button>
          </Box>
        }
        sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3 } }}
      />

      {/* Table */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <table className={styles.table} style={{ minWidth: 600, width: '100%' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  {isLoading ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      {/* Add Policy Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth='sm' PaperProps={{ sx: { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setAddOpen(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <Box p={4}>
          <Typography marginBottom={4} variant='h4'>
            Add New Policy
          </Typography>

          <TextField label='Group' fullWidth value={group} onChange={e => setGroup(e.target.value)} />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold' }}>Weekly Off</FormLabel>
            <Box display='flex' flexDirection='column' gap={1} mt={1}>
              {weekDays.map(day => (
                <Box
                  key={day}
                  display='flex'
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent='space-between'
                  sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5, flexWrap: 'wrap' }}
                >
                  <Typography sx={{ width: { sm: '30%', xs: '100%' } }}>{day}</Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={weeklyOff.includes(day)}
                        disabled={day === 'Sunday'} // Sunday always checked and disabled
                        onChange={e => {
                          if (e.target.checked) setWeeklyOff([...weeklyOff, day])
                          else setWeeklyOff(weeklyOff.filter(d => d !== day))
                        }}
                      />
                    }
                    label='Closed'
                    sx={{ width: { sm: '30%', xs: '100%' } }}
                  />

                  {day === 'Sunday' ? (
                    <TextField
                      label='Pattern'
                      size='small'
                      value='All Sunday'
                      disabled
                      sx={{ width: { sm: '30%', xs: '100%' }, mt: { xs: 1, sm: 0 } }}
                    />
                  ) : (
                    <TextField
                      select
                      label='Pattern'
                      size='small'
                      sx={{ width: { sm: '30%', xs: '100%' }, mt: { xs: 1, sm: 0 } }}
                      value={dayOptions[day] || `All ${day}`}
                      onChange={e => setDayOptions({ ...dayOptions, [day]: e.target.value })}
                      disabled={!weeklyOff.includes(day)}
                    >
                      <MenuItem value={`All ${day}`}>All {day}</MenuItem>
                      <MenuItem value={`First and Third ${day}`}>First and Third {day}</MenuItem>
                      <MenuItem value={`Second and Fourth ${day}`}>Second and Fourth {day}</MenuItem>
                    </TextField>
                  )}
                </Box>
              ))}
            </Box>
          </FormControl>

          <Box display='flex' justifyContent='flex-end' marginTop={2} flexWrap='wrap'>
            <Button variant='contained' onClick={createPolicy}>
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Edit Dialog */}
      <EditPolicyDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={selectedPolicy}
        weeklyOff={weeklyOff}
        dayOptions={dayOptions}
        setWeeklyOff={setWeeklyOff}
        setDayOptions={setDayOptions}
        group={group}
        setGroup={setGroup}
        onSave={handleUpdatePolicy}
      />

      <TablePaginationComponent table={table} />
    </Card>
  )
}

export default OfficePolicy
