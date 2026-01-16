'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Typography, Button, Card, CardContent, Chip, IconButton, Menu, MenuItem } from '@mui/material'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import TuneIcon from '@mui/icons-material/Tune'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues
} from '@tanstack/react-table'

import goalService from '@/services/performance/goal'
import { useRouter } from 'next/navigation'
import tableStyles from '@core/styles/table.module.css'
import classnames from 'classnames'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import PaidListing from '@/services/premium-listing/paidListing.service'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const GoalReport = ({ id }) => {
  const router = useRouter()

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [datas, setDatas] = useState(null)

  const [form, setForm] = useState({
    subject: '',
    goalType: '',
    startDate: '',
    endDate: '',
    targetGoalValue: '',
    branch: '',
    department: '',
    designation: ''
  })

  const [data, setData] = useState([])
  const [assignedEmployees, setAssignedEmployees] = useState([])
  const [selectedEmpIds, setSelectedEmpIds] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const [businessDetails, setBusinessDetails] = useState([])

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const statusMap = {
    PENDING: { label: 'Pending', color: 'warning' },
    ACTIVE: { label: 'Active', color: 'success' },
    INACTIVE: { label: 'Inactive', color: 'default' },
    FAILED: { label: 'Failed', color: 'error' },
    APPROVED: { label: 'Approved', color: 'success' }
  }

  const handleEmpSelection = empId => {
    setSelectedEmpIds(prev => {
      const newSelection = prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
      setFilteredData(newSelection.length > 0 ? data.filter(emp => newSelection.includes(emp.employee?.user_id)) : [])
      return newSelection
    })
  }

  const columns = useMemo(() => {
    if (form.goalType === 'Enroll Fresh Mosque') {
      return [
        columnHelper.accessor('name', {
          header: 'MOSQUE NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('mosque_id', {
          header: 'MOSQUE ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'CREATED DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Enroll Fresh Gurudwara') {
      return [
        columnHelper.accessor('name', {
          header: 'GURUDWARA NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('gurudwara_id', {
          header: 'GURUDWARA ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'CREATED DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Enroll Fresh Temple') {
      return [
        columnHelper.accessor('name', {
          header: 'TEMPLE NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('temple_id', {
          header: 'TEMPLE ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'CREATED DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Update Existing Business') {
      return [
        columnHelper.accessor(row => `${row.updatedBy?.firstName || ''} ${row.updatedBy?.lastName || ''}`.trim(), {
          id: 'updatedBy',
          header: 'UPDATED BY',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('vendorId', {
          header: 'VENDOR ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.companyInfo?.companyName || '', {
          id: 'companyName',
          header: 'COMPANY NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Paid Banner Listing') {
      return [
        columnHelper.accessor(row => `${row.createdBy?.firstName || ''} ${row.createdBy?.lastName || ''}`.trim(), {
          id: 'createdBy',
          header: 'CREATED BY',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.basicDetails?.vendorId, {
          header: 'Vendor ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.basicDetails?.companyName || '', {
          id: 'basicDetails.companyName',
          header: 'COMPANY NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Enroll Fresh Business') {
      return [
        columnHelper.accessor(row => `${row.createdBy?.firstName || ''} ${row.createdBy?.lastName || ''}`.trim(), {
          id: 'CreatedBy',
          header: 'CREATED BY',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('vendorId', {
          header: 'VENDOR ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.companyInfo?.companyName || '', {
          id: 'companyName',
          header: 'COMPANY NAME',
          cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
          header: 'DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
    if (form.goalType === 'Convert Free Business To Paid') {
      return [
        columnHelper.accessor(row => `${row.createdBy?.firstName || ''} ${row.createdBy?.lastName || ''}`.trim(), {
          id: 'CreatedBy',
          header: 'CREATED BY',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.basicDetails?.vendorId || '', {
          header: 'VENDOR ID',
          cell: info => info.getValue()
        }),
        columnHelper.accessor(row => row.basicDetails?.companyName || '', {
          id: 'companyName',
          header: 'COMPANY NAME',
          cell: info => info.getValue()
        }),

        columnHelper.accessor(row => row.createdAt, {
          header: 'DATE',
          cell: info => {
            const value = info.getValue()
            return value
              ? new Date(value).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ''
          }
        }),
        columnHelper.accessor('status', {
          header: 'STATUS',
          cell: info => {
            const status = info.getValue()
            const statusData = statusMap[status] || { label: status, color: 'default' }
            return <Chip label={statusData.label} color={statusData.color} variant='tonal' />
          }
        })
      ]
    }
  }, [form.goalType])

  const table = useReactTable({
    data: businessDetails || [],
    columns: columns || [],
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getGoal = async () => {
    try {
      const res = await goalService.getGoalById(id)
      if (res?.data) {
        const goal = res.data
        setForm({
          subject: goal.subject || '',
          goalType: goal.goalType || '',
          startDate: goal.startDate || '',
          endDate: goal.endDate || '',
          targetGoalValue: goal.targetGoalValue || '',
          branch: goal.branch || '',
          department: goal.department || '',
          designation: goal.designation || ''
        })
        setData(goal.employeeTargets || [])
        setAssignedEmployees(goal.assignedEmployees || [])
      }
    } catch (error) {
      toast.error('Failed to fetch goal data.')
    }
  }

  useEffect(() => {
    if (id) getGoal()
  }, [id])

  const getGoalTypeTitle = () => {
    switch (form.goalType) {
      case 'Enroll Fresh Mosque':
        return 'Mosque Enrollment'
      case 'Enroll Fresh Gurudwara':
        return 'Gurudwara Enrollment'
      case 'Enroll Fresh Temple':
        return 'Temple Enrollment'
      case 'Update Existing Business':
        return 'Business Update'
      case 'Enroll Fresh Business':
        return 'Fresh Business Enrollment'
      case 'Paid Banner Listing':
        return 'Paid Banner Listing'
      case 'Convert Free Business To Paid':
        return 'Convert Free Business To Paid'
      default:
        return 'Goal Report'
    }
  }

  // const handleSelectedReport = async () => {
  //   try {
  //     if (!selectedEmpIds.length) return

  //     let response

  //     if (form.goalType === 'Enroll Fresh Business') {
  //       response = await goalService.getFreshBusiness({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Paid Banner Listing') {
  //       response = await goalService.getPaidBannerListing({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Update Existing Business') {
  //       response = await goalService.getUpdateBusiness({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Enroll Fresh Temple') {
  //       response = await goalService.getFreshTemple({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Enroll Fresh Gurudwara') {
  //       response = await goalService.getGuruDwara({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Convert Free Business To Paid') {
  //       response = await goalService.ConvertFreeBusinessToPaid({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else if (form.goalType === 'Enroll Fresh Mosque') {
  //       response = await goalService.getMosque({
  //         start: form.startDate,
  //         end: form.endDate,
  //         employee: selectedEmpIds[0]
  //       })
  //     } else {
  //       toast.error('Unknown goal type. Please check the goal configuration.')
  //       return
  //     }

  //     setBusinessDetails(response?.data || [])
  //   } catch (error) {
  //     toast.error(error?.message || 'Failed to fetch report data.')
  //     setBusinessDetails([])
  //   }
  // }

  const handleSelectedReport = async () => {
  try {
    if (!selectedEmpIds.length) return

    let response

    if (form.goalType === 'Enroll Fresh Business') {
      response = await goalService.getFreshBusiness({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('No businesses found')
        return
      }
      toast.success('Fresh business report loaded successfully')
    } 
    
    else if (form.goalType === 'Paid Banner Listing') {
      response = await goalService.getPaidBannerListing({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('No paid banner listings found')
        return
      }
      toast.success('Paid banner listing report loaded successfully')
    } 
    
    else if (form.goalType === 'Update Existing Business') {
      response = await goalService.getUpdateBusiness({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('No updated businesses found')
        return
      }
      toast.success('Updated business report loaded successfully')
    } 
    
    else if (form.goalType === 'Enroll Fresh Temple') {
      response = await goalService.getFreshTemple({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('Temple not found')
        return
      }
      toast.success('Temple report loaded successfully')
    } 
    
    else if (form.goalType === 'Enroll Fresh Gurudwara') {
      response = await goalService.getGuruDwara({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('Gurudwara not found')
        return
      }
      toast.success('Gurudwara report loaded successfully')
    } 
    
    else if (form.goalType === 'Convert Free Business To Paid') {
      response = await goalService.ConvertFreeBusinessToPaid({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('No converted businesses found')
        return
      }
      toast.success('Converted business report loaded successfully')
    } 
    
    else if (form.goalType === 'Enroll Fresh Mosque') {
      response = await goalService.getMosque({
        start: form.startDate,
        end: form.endDate,
        employee: selectedEmpIds[0]
      })

      if (!response?.data || response.data.length === 0) {
        toast.error('Mosque not found')
        return
      }
      toast.success('Mosque report loaded successfully')
    } 
    
    else {
      toast.error('Unknown goal type. Please check the goal configuration.')
      return
    }

    // ✅ Finally set the data
    setBusinessDetails(response?.data || [])
  } catch (error) {
    toast.error(error?.message || 'Failed to fetch report data.')
    setBusinessDetails([])
  }
}


  const handlePrint = () => {
    const printContents = document.getElementById('report-table-only')
    const printWindow = window.open('', '', 'height=800,width=1000')
    if (printWindow && printContents) {
      const goalTypeTitle = getGoalTypeTitle()
      printWindow.document.write(`
        <html>
          <head>
            <title>${goalTypeTitle} Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>${goalTypeTitle} Report</h2>
            ${printContents.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExportPDF = async () => {
    const input = document.getElementById('report-table-only')
    if (!input) return
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true, allowTaint: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      const goalTypeTitle = getGoalTypeTitle()
      pdf.setFontSize(16)
      pdf.text(`${goalTypeTitle} Report`, 20, 20)
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight)
      pdf.save(`${goalTypeTitle.toLowerCase().replace(/\s+/g, '-')}-report.pdf`)
    } catch (error) {
      toast.error('Failed to generate PDF')
    }
  }

  const handleExportExcel = () => {
    const rows = table.getRowModel()?.rows || []
    const tableData = rows.map(row => {
      const obj = {}
      const visibleCells = row.getVisibleCells ? row.getVisibleCells() : []
      visibleCells.forEach(cell => {
        const columnName = cell.column?.columnDef?.header || 'Unknown'
        obj[columnName] = cell.getContext ? cell.getContext().getValue() : ''
      })
      return obj
    })

    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    const goalTypeTitle = getGoalTypeTitle()
    XLSX.utils.book_append_sheet(workbook, worksheet, `${goalTypeTitle} Report`)
    XLSX.writeFile(workbook, `${goalTypeTitle.toLowerCase().replace(/\s+/g, '-')}-report.xlsx`)
  }

  const formatDate = dateString =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : ''

  const safeBusinessDetails = businessDetails || []
  const totalConfirmed = safeBusinessDetails.filter(row => row.status === 'ACTIVE' || row.status === 'APPROVED').length
  const totalFailed = safeBusinessDetails.filter(row => row.status === 'FAILED').length
  const totalPending = safeBusinessDetails.filter(row => row.status === 'PENDING').length

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <Typography sx={{ p: { xs: 4 } }} variant='h4'>
          {getGoalTypeTitle()} Report
        </Typography>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label='Subject of Target'
                    value={form.subject}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>
                      <strong>Goal Type:</strong> {form.goalType}
                    </Typography>
                    <Typography>
                      <strong>Start Date:</strong> {formatDate(form.startDate)}
                    </Typography>
                    <Typography>
                      <strong>End Date:</strong> {formatDate(form.endDate)}
                    </Typography>
                    <Typography>
                      <strong>Target Goal Value:</strong> {form.targetGoalValue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>
                      <strong>Branch:</strong> {form.branch?.name || form.branch}
                    </Typography>
                    <Typography>
                      <strong>Department:</strong> {form.department?.name || form.department}
                    </Typography>
                    <Typography>
                      <strong>Designation:</strong> {form.designation?.name || form.designation}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Side: Employees */}
            <Grid item xs={12} md={6}>
              <Typography variant='h6'>Assigned Employees</Typography>
              <Box sx={{ maxHeight: '200px', overflowY: 'auto', mt: 2 }}>
                {assignedEmployees.map(emp => (
                  <Box
                    key={emp.user_id}
                    sx={{ display: 'flex', alignItems: 'center', p: 1, border: '1px solid #ccc' }}
                    onClick={() => handleEmpSelection(emp.user_id)}
                  >
                    <input
                      type='checkbox'
                      checked={selectedEmpIds.includes(emp.user_id)}
                      onClick={e => e.stopPropagation()}
                      onChange={() => handleEmpSelection(emp.user_id)}
                      style={{ marginRight: 8 }}
                    />
                    <Box>
                      <Typography fontWeight='bold'>{emp.name}</Typography>
                      <Typography variant='caption'>ID: {emp.employee_id}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 40 }}>
                <Button variant='outlined' onClick={() => router.push('/en/apps/goal/manage-goal')}>
                  Back
                </Button>
                <Button variant='contained' onClick={handleSelectedReport}>
                  Show Report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip label={`${totalConfirmed} Confirmed`} color='success' variant='outlined' />
              <Chip label={`${totalFailed} Failed`} color='error' variant='outlined' />
              <Chip label={`${totalPending} Pending`} color='warning' variant='outlined' />
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <CustomTextField
                select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                sx={{
                  width: '70px',
                  height: '40px',
                  '& .MuiInputBase-root': {
                    height: '40px',
                    fontSize: '14px',
                    padding: '0 8px'
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '8px'
                  }
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </CustomTextField>
            </Box>

            <Box>
              <IconButton onClick={handleMenuClick}>
                <TuneIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    handlePrint()
                    handleMenuClose()
                  }}
                >
                  Print Report
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleExportPDF()
                    handleMenuClose()
                  }}
                >
                  Export to PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleExportExcel()
                    handleMenuClose()
                  }}
                >
                  Export to Excel
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <div id='report-table-only'>
            <div className='overflow-x-auto max-h-[500px] overflow-y-auto'>
              <table className={tableStyles.table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
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
                              {header.column.getIsSorted() === 'asc' && <i className='tabler-chevron-up text-xl' />}
                              {header.column.getIsSorted() === 'desc' && <i className='tabler-chevron-down text-xl' />}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {!table.getFilteredRowModel()?.rows || table.getFilteredRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={table.getVisibleFlatColumns()?.length || 1} className='text-center'>
                        No data found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel()?.rows?.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel()?.rows?.length || 0}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => table.setPageIndex(page)}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default GoalReport
