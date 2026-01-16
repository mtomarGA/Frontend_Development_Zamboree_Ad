'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardHeader, Typography, Box, MenuItem, Tooltip, Grid, Button, IconButton } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
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
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import RoomIcon from '@mui/icons-material/Room'
import html2canvas from 'html2canvas'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import punchService from '@/services/attendance/punchInOut.service'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import { toast } from 'react-toastify'
import styles from '@core/styles/table.module.css'
import { useAuth } from '@/contexts/AuthContext'

// Column Helper
const columnHelper = createColumnHelper()

// Fuzzy filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DailyAttendance = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const { hasPermission } = useAuth()

  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [form, setForm] = useState({ branch: '', department: '', designation: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Fetch master data
  useEffect(() => {
    BranchService.get().then(res => Array.isArray(res?.data) && setBranchList(res.data))
    DepartmentService.get().then(res => Array.isArray(res?.data) && setDepartmentList(res.data))
    DesignationService.get().then(res => Array.isArray(res?.data) && setDesignationList(res.data))
  }, [])

  // Fetch attendance data
  const handleGetData = () => {
    if (!form.branch || !form.department || !form.designation || !selectedDate) {
      toast.error('Please select Branch, Department, Designation, and Date')
      return
    }

    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')

    punchService.dailyAttendance({
      branch_id: form.branch,
      department_id: form.department,
      designation_id: form.designation,
      date: formattedDate
    })
      .then(res => {
        if (!res.data || res.data.length === 0) {

          toast.error(`No attendance found for ${dayjs(selectedDate).format('DD/MM/YYYY')}`)
          setData([])
          setFilteredData([])
          return
        }
        const formattedData = res.data.map(item => {
          const parsedDate = dayjs(item.date, ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
          return {
            ...item,
            date: parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : item.date
          }
        })

        setData(res.data)
        setFilteredData(res.data)
      })
      .catch(() => {
        toast.error('Attendance data not found')
        setData([])
        setFilteredData([])
      })
  }

  // ✅ Updated columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('employeeName', { header: 'Employee Name' }),
      columnHelper.accessor('date', { header: 'Date' }),
      columnHelper.accessor('clockIn', {
        header: 'In Time',
        cell: info => {
          const value = info.getValue()
          if (!value) return '—' // handle null or undefined

          const date = new Date(value)
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        },
      }),


      // ✅ In Location
      columnHelper.accessor('inLocation', {
        header: 'In Location',
        cell: info => {
          const address = info.getValue()
          const handleClick = () => {
            if (address && address !== '-') {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
              window.open(mapUrl, '_blank')
            }
          }

          return address && address !== '-' ? (
            <Tooltip title={address}>
              <Button
                variant='text'
                onClick={handleClick}
                startIcon={<RoomIcon color='primary' />}
                sx={{ textTransform: 'none' }}
              >
                Location
              </Button>
            </Tooltip>
          ) : (
            <span>-</span>
          )
        }
      }),

      columnHelper.accessor('late', { header: 'Late' }),
      // columnHelper.accessor('clockOut', { header: 'Out Time' }),
      columnHelper.accessor('clockOut', {
  header: 'Out Time',
  cell: info => {
    const value = info.getValue()
    if (!value || value === '—') return '—' // handle missing or placeholder

    const date = new Date(value)
    if (isNaN(date.getTime())) return '—' // handle invalid date string

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  },
}),

      // ✅ Out Location
      columnHelper.accessor('outLocation', {
        header: 'Out Location',
        cell: info => {
          const address = info.getValue()
          const handleClick = () => {
            if (address && address !== '-') {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
              window.open(mapUrl, '_blank')
            }
          }

          return address && address !== '-' ? (
            <Tooltip title={address}>
              <Button
                variant='text'
                onClick={handleClick}
                startIcon={<RoomIcon />}
                sx={{ textTransform: 'none' }}
              >
                Location
              </Button>
            </Tooltip>
          ) : (
            <span>-</span>
          )
        }
      }),

      columnHelper.accessor('earlyLeave', { header: 'Early Leave' }),
      columnHelper.accessor('workingHours', { header: 'Working Hours' })
    ],

  )


  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance')
    XLSX.writeFile(wb, 'attendance.xlsx')
  }

  // Export PDF
  const handleExportPDF = () => {
    const input = document.getElementById('report-table-only')
    if (!input) return

    html2canvas(input, { scale: 2, useCORS: true, allowTaint: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.setFontSize(16)
      pdf.text('Daily Attendance Report', 20, 20)
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight)
      pdf.save('attendance-report.pdf')
    })
  }

  // Print only the table
  const handlePrint = () => window.print()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* PRINT CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-table-only,
          #report-table-only * {
            visibility: visible;
          }
          #report-table-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Optional: hide pagination when printing */
          .MuiTablePagination-root {
            display: none !important;
          }
        }
      `}</style>

      <Card>
        <CardHeader
          title={<Typography variant='h4'>Daily Attendance</Typography>}
          action={
            <Box>
              <Tooltip title='Print Report'>
                <IconButton size='small' onClick={handlePrint}>
                  <i className='tabler-printer' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Export to PDF'>
                <IconButton size='small' onClick={handleExportPDF}>
                  <i className='tabler-file-type-pdf' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Export to Excel'>
                <IconButton size='small' onClick={handleExportExcel}>
                  <i className='tabler-file-type-xls' />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                select
                fullWidth
                label='Department'
                name='department'
                value={form.department}
                onChange={handleChange}
              >
                <MenuItem value=''>Select Department</MenuItem>
                {departmentList.map(dep => (
                  <MenuItem key={dep._id} value={dep._id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomTextField
                select
                fullWidth
                label='Designation'
                name='designation'
                value={form.designation}
                onChange={handleChange}
              >
                <MenuItem value=''>Select Designation</MenuItem>
                {designationList.map(des => (
                  <MenuItem key={des._id} value={des._id}>
                    {des.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <CustomTextField
                select
                fullWidth
                label='Branch'
                name='branch'
                value={form.branch}
                onChange={handleChange}
              >
                <MenuItem value=''>Select Branch</MenuItem>
                {branchList.map(branch => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={4} mt={5}>
              <Box display='flex' alignItems='center' gap={1}>
                <DatePicker
                  label='Select Date'
                  value={selectedDate}
                  onChange={newValue => setSelectedDate(newValue)}
                  format='DD/MM/YYYY'
                  slotProps={{ textField: { size: 'small' } }}
                />

                {selectedDate && hasPermission('attendance_daily_Attendance:add') && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleGetData}
                    sx={{
                      height: 36,
                      minWidth: 110,
                      textTransform: 'none',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Get Data
                  </Button>
                )}


              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Only this section will print */}
        <div className='overflow-x-auto' id='report-table-only'>
          <table className={styles.table}>
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
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePaginationComponent table={table} />
      </Card>
    </LocalizationProvider>
  )
}

export default DailyAttendance
