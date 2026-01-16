'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Button,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import CustomTextField from '@/@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import punchService from '@/services/attendance/punchInOut.service'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import EmployeeService from '@/services/employee/EmployeeService'
import BranchService from '@/services/employee/Master/BranchService'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronRight } from 'lucide-react'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const getDayName = (year, month, day) => {
  const date = new Date(year, month, day)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const getCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

const generateColumns = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month)
  const cols = [columnHelper.accessor('name', { header: 'Employee', size: 150 })]

  for (let day = 1; day <= daysInMonth; day++) {
    cols.push(
      columnHelper.accessor(`day${day}`, {
        header: `${day} ${getDayName(year, month, day)}`,
        size: 50,
        cell: info => {
          const value = info.getValue()
          const getStatusColor = status => {
            switch (status) {
              case 'P':
                return '#16a34a'
              case 'A':
                return '#dc2626'
              case 'L':
                return '#f59e0b'
              case 'H':
                return '#0ea5e9'
              case 'O':
                return '#6b7280'
              case 'HD':
                return '#eab308'
              case 'LT':
                return '#95c4b2'
              default:
                return '#9ca3af'
            }
          }
          return (
            <span style={{ color: getStatusColor(value), fontWeight: 'bold', fontSize: '12px' }}>{value || '-'}</span>
          )
        }
      })
    )
  }

  //  Stats columns (calendar ke baad)
  const statColumns = [
    { key: 'workingDays', label: 'T-Working' },
    { key: 'present', label: 'T-Present' },
    { key: 'absent', label: 'T-Absent' },
    { key: 'leave', label: 'T-Leave' },
    { key: 'holiday', label: 'T-Holidays' },
    { key: 'off', label: 'T-Off' },
    { key: 'half', label: 'T-Half' },
    { key: 'late', label: 'T-Late' },
    { key: 'payable', label: 'T-Payable' }
  ]

  statColumns.forEach(stat =>
    cols.push(
      columnHelper.accessor(row => row?.[stat.key] ?? 0, {
        id: stat.key,
        header: stat.label,
        size: 80,
        cell: info => <strong>{info.getValue()}</strong>
      })
    )
  )

  return cols
}

const MonthlyAttendanceInfo = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [month, setMonth] = useState(getCurrentMonth())
  const [data, setData] = useState([])
  const [branchList, setBranchList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [employeeList, setEmployeeList] = useState([])
  const [form, setForm] = useState({ branch: '', department: '', designation: '', employee: '' })
  const [errors, setErrors] = useState({})
  const { hasPermission } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const monthData = async (opts = {}) => {
    try {
      setIsLoading(true)
      const nowParts = month.split('-')
      const qMonth = opts.month ?? nowParts[1]
      const qYear = opts.year ?? nowParts[0]

      const query = {
        month: String(qMonth).padStart(2, '0'),
        year: String(qYear),
        branch: opts.branch ?? form.branch ?? '',
        department: opts.department ?? form.department ?? '',
        designation: opts.designation ?? form.designation ?? ''
      }

      const res = await punchService.monthAttendance(query)
      let result = Array.isArray(res) ? res : (res?.data ?? [])

      if (result.length > 0) {
        setData(result)
        toast.success('Data fetched successfully!')
      } else {
        setData([])
        toast.error('No data found')
      }
    } catch (err) {
      setData([])
      toast.error('Failed to fetch data!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    BranchService.get().then(res => Array.isArray(res?.data) && setBranchList(res.data))
    DepartmentService.get().then(res => Array.isArray(res?.data) && setDepartmentList(res.data))
    DesignationService.get().then(res => Array.isArray(res?.data) && setDesignationList(res.data))
  }, [])

  const [year, monthIndex] = month.split('-').map(Number)
  const columns = useMemo(() => generateColumns(year, monthIndex - 1), [month, data])

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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      toast.warning('No data available to export!')
      return
    }

    const exportData = data.map(row => {
      const newRow = {
        'Employee ID': row.id || '',
        'Employee Name': row.name || ''
      }

      // Add all days of the month
      for (let day = 1; day <= getDaysInMonth(year, monthIndex - 1); day++) {
        newRow[`${day} ${getDayName(year, monthIndex - 1, day)}`] = row[`day${day}`] || '-'
      }

      // Add summary stats only once per row
      const summaryFields = ['workingDays', 'present', 'absent', 'leave', 'holiday', 'off', 'half', 'late', 'payable']

      summaryFields.forEach(key => {
        newRow[key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())] = row[key] ?? 0
      })

      return newRow
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'MonthlyAttendance')
    XLSX.writeFile(wb, `monthly_attendance_${month}.xlsx`)
  }

  const handleExportPDF = async () => {
    const element = document.getElementById('monthly-attendance-table')
    if (!element) return

    try {
      const clonedElement = element.cloneNode(true)
      clonedElement.style.maxHeight = 'none'
      clonedElement.style.overflow = 'visible'
      clonedElement.style.height = 'auto'
      clonedElement.style.width = '100%'
      clonedElement.style.background = '#fff'
      clonedElement.style.fontSize = '10px'

      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.top = '-9999px'
      container.appendChild(clonedElement)
      document.body.appendChild(container)

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight
      })

      document.body.removeChild(container)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = pdfHeight
      let position = 40

      pdf.setFontSize(16)
      pdf.text('Monthly Attendance Report', 10, 20)
      pdf.setFontSize(12)
      pdf.text(
        `Month: ${new Date(year, monthIndex - 1).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })}`,
        10,
        30
      )

      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight + 40
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }
      pdf.save(`monthly_attendance_${month}.pdf`)
    } catch (err) {
      toast.error('Failed to export PDF!')
    }
  }

  const handleChange = async e => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }
    setForm(updatedForm)
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))

    if (updatedForm.branch && updatedForm.department && updatedForm.designation) {
      try {
        const query = {
          branch: updatedForm.branch,
          department: updatedForm.department,
          designation: updatedForm.designation
        }
        const res = await EmployeeService.getSearchEmployee(query)
        setEmployeeList(res?.data || [])
      } catch { }
    } else {
      setEmployeeList([])
    }
  }

  const handleGetData = async () => {
    const { branch, department, designation } = form
    if (!branch || !department || !designation) {
      toast.warning('Please select Branch, Department, and Designation first!')
      return
    }

    const [y, m] = month.split('-')
    await monthData({ month: m, year: y, branch, department, designation })
  }

  const handlePrint = () => {
    const printSection = document.getElementById('monthly-attendance-table')
    if (!printSection) return

    // Get all rows (not only paginated)
    const allRows = table.getPrePaginationRowModel().rows

    // Build printable HTML
    const headerHtml = `
    <tr>
      ${table
        .getAllColumns()
        .map(col => `<th>${col.columnDef.header || ''}</th>`)
        .join('')}
    </tr>
  `
    const bodyHtml = allRows
      .map(
        row => `
    <tr>
      ${row
            .getVisibleCells()
            .map(cell => `<td>${cell.renderValue() ?? '-'}</td>`)
            .join('')}
    </tr>
  `
      )
      .join('')

    // Create printable section dynamically
    const printContainer = document.createElement('div')
    printContainer.innerHTML = `
    <div style="padding:30px;">
      <h2 style="text-align:center;margin-bottom:10px;">Monthly Attendance Report (${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })})</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead style="background:#f2f2f2;">
          ${headerHtml}
        </thead>
        <tbody>
          ${bodyHtml}
        </tbody>
      </table>
    </div>
  `

    // Apply print-specific styles
    const style = document.createElement('style')
    style.innerHTML = `
   @media print {
  body * {
    visibility: hidden;
  }
  #printable-area,
  #printable-area * {
    visibility: visible;
  }
  #printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  table, th, td {
    border: 1px solid #000;
    padding: 3px 6px;
    font-size: 10px;
    text-align: center;
  }
  @page {
    size: landscape; /* 👈 this makes page horizontal */
    margin: 10mm;
  }
}

  `

    printContainer.id = 'printable-area'
    document.body.appendChild(printContainer)
    document.head.appendChild(style)

    // Trigger print (no reload)
    window.print()

    // Cleanup after print (no reload)
    window.onafterprint = () => {
      document.body.removeChild(printContainer)
      document.head.removeChild(style)
      window.onafterprint = null
    }
  }

  return (
    <Card>
      {/* Header */}
      <CardHeader
        title={<Typography variant='h4'>Monthly Attendance</Typography>}
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

      {/* Filters Row */}
      <Box p={2}>
        <Grid container spacing={2} alignItems='center'>
          {/* Department */}
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

          {/* Designation */}
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

          {/* Branch */}
          <Grid item xs={12} sm={3}>
            <CustomTextField select fullWidth label='Branch' name='branch' value={form.branch} onChange={handleChange}>
              <MenuItem value=''>Select Branch</MenuItem>
              {branchList.map(branch => (
                <MenuItem key={branch._id} value={branch._id}>
                  {branch.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          {/* Month + Get Data */}
          <Grid item xs={12} sm={3}>
            <Box display='flex' alignItems='center' gap={1}>
              <CustomTextField
                type='month'
                label='Select Month'
                value={month}
                onChange={e => setMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size='small'
                fullWidth
              />
              {hasPermission('attendance_monthly_Attendance:add') && (
                <Button
                  variant='contained'
                  onClick={handleGetData}
                  sx={{ height: '40px', whiteSpace: 'nowrap', mt: 5 }}
                >
                  Get Data
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Legend */}
      <Typography variant='body2' sx={{p: 2 }}>
        <strong>Legend:</strong>
        Present = <span style={{ color: '#4caf50', fontWeight: 'bold' }}>P</span>,
        Absent ={' '}<span style={{ color: '#f44336', fontWeight: 'bold' }}>A</span>,
        Leave ={' '} <span style={{ color: '#ff9800', fontWeight: 'bold' }}>L</span>,
        Holiday ={' '} <span style={{ color: '#2196f3', fontWeight: 'bold' }}>H</span>,
        Sunday ={' '} <span style={{ color: '#ae002f', fontWeight: 'bold' }}>O</span>,
        Half Day ={' '}<span style={{ color: '#ffeb3b', fontWeight: 'bold' }}>HD</span>,
        Late Day ={' '} <span style={{ color: '#95c4b2', fontWeight: 'bold' }}>LT</span>
      </Typography>
      {/*  <div className='overflow-x-auto' id='monthly-attendance-table'> */}
      {/* Table */}
      <CardContent>
        {isLoading ? (

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

            }}
          >
            <CircularProgress size={10} />
          </Box>
        ) : (
          <>
          <Box id="monthly-attendance-table" sx={{ overflowX: 'auto', }}>
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
          </>
        )}
      </CardContent>

    </Card>
  )
}

export default MonthlyAttendanceInfo
