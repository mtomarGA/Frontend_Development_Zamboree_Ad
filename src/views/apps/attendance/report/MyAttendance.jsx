'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Button,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Tooltip,
  CardHeader,
  Grid
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
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import ChevronRight from '@menu/svg/ChevronRight'
import classnames from 'classnames'
import styles from '@core/styles/table.module.css'
import punchService from '@/services/attendance/punchInOut.service'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import workShiftService from '@/services/attendance/workShift.service'
import EmployeeService from '@/services/employee/EmployeeService'
import { useAuth } from '@/contexts/AuthContext'
import dayjs from 'dayjs'
import RoomIcon from '@mui/icons-material/Room'


// 🔹 Fuzzy search
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// 🔹 Debounced input for search
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// 🔹 Convert decimal hours -> HH:MM
const formatHours = hours => {
  if (!hours || isNaN(hours)) return '00:00'
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const AttendanceReport = () => {
  const [employee, setEmployee] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [summary, setSummary] = useState({})
  const [empList, setEmpList] = useState([])
  const { user } = useAuth()
  const { hasPermission } = useAuth()

  // Fetch work shifts (if needed)
  useEffect(() => {
    const getShift = async () => {
      await workShiftService.getWorkShift()
    }
    getShift()
  }, [])

  // Fetch employee list
  const fetchEmpList = async () => {
    const response = await EmployeeService.getList()
    setEmpList(response)
  }

  useEffect(() => {
    fetchEmpList()
  }, [])

  // ✅ Fixed handleFilter function
  const handleFilter = async () => {
    const id = employee || user?.userId?._id
    const body = { fromDate, toDate }
    const result = await punchService.EmployAttendance(id, body)
    const rows = result?.data || []
    setData(rows)

    // 🟢 Fixed summary calculations
    const totalDays = rows.length
    const presentDays = rows.filter(r => r.status === 'Present').length
    const absentDays = rows.filter(r => r.status === 'Absent').length
    const lateDays = rows.filter(r => r.isLate).length
    const totalHours = rows.reduce((sum, r) => sum + (r.totalMinutes || 0) / 60, 0)

    // ✅ FIXED: Include both "Leave" and "On Leave" statuses
    const leaveDays = rows.filter(r =>
      r.status?.toLowerCase().includes('leave')
    ).length

    // ✅ Fixed summary object — using correct variable
    setSummary({ totalDays, presentDays, absentDays, lateDays, totalHours, leaveDays })
  }

  // Reset filters
  const handleReset = () => {
    setFromDate('')
    setToDate('')
    setEmployee('')
    setData([])
    setSummary({})
  }

  // Columns
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()

    return [
      columnHelper.accessor('employee_id', {
        header: 'Employee Name',
        cell: ({ row, table }) => {
          const currentName = row.original?.employee_id?.name
          const fallbackName = table
            .getRowModel()
            .rows.map(r => r.original?.employee_id?.name)
            .find(name => !!name)
          return <Typography>{currentName || fallbackName || ''}</Typography>
        }
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => {
          const dateValue = info.getValue()
          const formatted = dayjs(dateValue).isValid()
            ? dayjs(dateValue).format('DD/MM/YYYY')
            : dateValue
          return <Typography>{formatted}</Typography>
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Typography>{row.original.status}</Typography>
      }),
      columnHelper.accessor('punchIn', {
        header: 'Clock In',
        cell: ({ row }) => {
          const time = row.original?.punchIn?.time
          return <Typography>{time ? dayjs(time).format('hh:mm A') : 'N/A'}</Typography>
        }
      }),
      columnHelper.accessor('punchIn', {
        header: 'In Location',
        cell: ({ row }) => {
          const lat = row.original?.punchIn?.lat
          const lng = row.original?.punchIn?.lng
          const handleClick = () => {
            if (lat && lng) {
              window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
            } else {
              alert('In location coordinates not available')
            }
          }
          return (
            <Button
              variant='text'
              onClick={handleClick}
              startIcon={<RoomIcon sx={{ color: '#5A36CC' }} />}
              sx={{
                textTransform: 'none',
                color: '#5A36CC',
                fontWeight: 500,
                '&:hover': { background: 'transparent', textDecoration: 'underline' }
              }}
            >
              Location
            </Button>
          )
        }
      }),
      columnHelper.accessor('punchOut', {
        header: 'Clock Out',
        cell: ({ row }) => {
          const time = row.original?.punchOut?.time
          return <Typography>{time ? dayjs(time).format('hh:mm A') : 'N/A'}</Typography>
        }
      }),
      columnHelper.accessor('punchOut', {
        header: 'Out Location',
        cell: ({ row }) => {
          const lat = row.original?.punchOut?.lat
          const lng = row.original?.punchOut?.lng
          const handleClick = () => {
            if (lat && lng) {
              window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
            } else {
              alert('Out location coordinates not available')
            }
          }
          return (
            <Button
              variant='text'
              onClick={handleClick}
              startIcon={<RoomIcon sx={{ color: '#5A36CC' }} />}
              sx={{
                textTransform: 'none',
                color: '#5A36CC',
                fontWeight: 500,
                '&:hover': { background: 'transparent', textDecoration: 'underline' }
              }}
            >
              Location
            </Button>
          )
        }
      }),
      columnHelper.accessor('isLate', {
        header: 'Late',
        cell: ({ row }) => <Typography>{row.original.isLate ? 'Yes' : 'No'}</Typography>
      }),
      columnHelper.accessor('earlyLeave', {
        header: 'Early Leaving'
      }),
      columnHelper.accessor('totalMinutes', {
        header: 'Working Time',
        cell: ({ row }) => {
          const total = row.original.totalMinutes
          if (total == null) return <Typography>00h:00m</Typography>
          const hours = Math.floor(total / 60)
          const minutes = total % 60
          return <Typography>{`${hours}h ${minutes}m`}</Typography>
        }
      })
    ]
  }, [])

  // React Table instance
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

  // File download handlers (unchanged)
  const handleDownloadPDF = async () => {
    const element = document.getElementById('attendance-report')
    if (!element) return
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('Attendance_Report.pdf')
  }

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')
    XLSX.writeFile(workbook, 'Attendance_Report.xlsx')
  }

  const handlePrint = () => {
    const printContents = document.getElementById('attendance-report')?.innerHTML
    if (!printContents) return
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ✅ Responsive Header */}
      <CardHeader
        title={<Typography variant='h4'>My Attendance</Typography>}
        sx={{
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' }, // ✅ same line from medium screens
          justifyContent: 'space-between',            // ✅ separates title & icons nicely

        }}
        action={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              flexDirection: 'row',
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <Tooltip title='Print Report'>
              <IconButton size='small' onClick={handlePrint}>
                <i className='tabler-printer' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Export to PDF'>
              <IconButton size='small' onClick={handleDownloadPDF}>
                <i className='tabler-file-type-pdf' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Export to Excel'>
              <IconButton size='small' onClick={handleDownloadExcel}>
                <i className='tabler-file-type-xls' />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />


      {/* ✅ Filter Section */}
      <Box >
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
          <Grid item xs={12} sm={6} md={3}>
            {user?.userType === 'ADMIN' ? (
              <CustomTextField
                select
                fullWidth
                label='Employee'
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                {empList?.data?.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            ) : (
              <CustomTextField
                fullWidth
                label='Employee'
                value={employee || `${user?.firstName} ${user?.lastName}`}
                disabled
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CustomTextField
              type='date'
              label='From Date'
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CustomTextField
              type='date'
              label='To Date'
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} mt={4} sm={6} md={3} sx={{ display: 'flex', gap: 2 }}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder='Search...'
              fullWidth
            />
            {hasPermission('attendance_my_Attendance:add') && (
              <Button variant='contained' onClick={handleFilter}>Filter</Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* ✅ Table Section */}
      <Box id='attendance-report' sx={{ overflowX: 'auto', }}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {!header.isPlaceholder && (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronRight className='-rotate-90' />}
                        {header.column.getIsSorted() === 'desc' && <ChevronRight className='rotate-90' />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

     
        <TablePaginationComponent table={table} />
      

      {/* ✅ Summary Section */}
      <Box >
        <Grid container justifyContent='flex-end' spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
              <Typography>Total Working days: {summary.totalDays || 0} Days</Typography>
              <Typography>Total Present: {summary.presentDays || 0} Days</Typography>
              <Typography>Total Absence: {summary.absentDays || 0} Days</Typography>
              <Typography>Total Leave: {summary.leaveDays || 0} Days</Typography>
              <Typography>Total Late: {summary.lateDays || 0} Days</Typography>
              <Typography fontWeight='bold'>
                Total Hours: {formatHours(summary.totalHours || 0)}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )


}

export default AttendanceReport
