'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Chip,
  Divider,
  Box
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import { useAuth } from '@/contexts/AuthContext'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import generateSalaryServices from '@/services/payroll/generateSalaryService'
import { Grid } from '@mui/system'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

//  Fuzzy search
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

//  Debounced search input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const LockedSalaryTable = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [transactionNo, setTransactionNo] = useState('')
  const [confirmPayOpen, setConfirmPayOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedPayId, setSelectedPayId] = useState(null)
  const [selectedPayStatus, setSelectedPayStatus] = useState(null)
  const [viewDetails, setViewDetails] = useState(null)
  const { hasPermission } = useAuth()

  const statusObj = {
    PAID: { title: 'PAID', color: 'success' },
    UNPAID: { title: 'UNPAID', color: 'warning' }
  }

  //  Fetch salaries
  const getAllGenerateSalary = async () => {
    try {
      const res = await generateSalaryServices.getLockedSalary()
      setData(res.data)
    } catch (error) {
      toast.error('Failed to fetch salaries')
    }
  }

  useEffect(() => {
    getAllGenerateSalary()
  }, [])

  //  Handle Pay click → open dialog
  const handlePayClick = (id, currentStatus) => {
    setSelectedPayId(id)
    setSelectedPayStatus(currentStatus)
    setConfirmPayOpen(true)
  }

  //  Confirm payment
  const confirmPay = async () => {
    if (selectedPayId && selectedPayStatus) {
      try {
        await generateSalaryServices.updatePaymentStatus(selectedPayId, {
          paymentStatus: selectedPayStatus === 'PAID' ? 'UNPAID' : 'PAID',
          transactionNo
        })
        getAllGenerateSalary()
        setConfirmPayOpen(false)
        setSelectedPayId(null)
        setSelectedPayStatus(null)
        setTransactionNo('')
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to update payment')
      }
    }
  }

  //  Table Columns
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()
    return [
      columnHelper.accessor('employee.name', {
        header: 'Employee Name',
        cell: ({ row }) => (
          <Box>
            <Typography>{row.original.employee?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {row.original.employee?.employee_id}
            </Typography>
          </Box>
        )
      }),
      columnHelper.accessor('salarySetup.department.name', {
        header: 'Department',
        cell: ({ row }) => <Typography>{row.original.salarySetup?.department?.name}</Typography>
      }),
      columnHelper.accessor('netSalary', {
        header: 'Net Salary',
        cell: ({ row }) => (
          <Typography variant="body2">
            ₹{Number(row.original.netSalary).toLocaleString('en-IN')}
          </Typography>
        )
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'Payment Status',
        cell: ({ row }) => {
          const currentStatus = row.original.paymentStatus
          return (
            <Chip
              label={statusObj[currentStatus]?.title || 'UNKNOWN'}
              variant="tonal"
              color={statusObj[currentStatus]?.color || 'default'}
              size="small"
            />
          )
        }
      }),
      columnHelper.accessor(row => dayjs(`${row.year}-${row.month}-01`).format('MMM YYYY'), {
        id: 'month',
        header: 'Month',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('paymentDate', {
        header: 'Payment Date',
        cell: ({ getValue }) => {
          const date = getValue()
          return (
            <Typography>
              {date ? dayjs(date).format('DD MMM YYYY, hh:mm A') : '—'}
            </Typography>
          )
        }
      }),

      //  Actions
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => {
          const currentStatus = row.original.paymentStatus

          //  View if PAID
          if (currentStatus === 'PAID')
            return (
              <Tooltip title="View" placement="top-end">
                <IconButton
                  onClick={() => {
                    setViewDetails(row.original)
                    setViewOpen(true)
                  }}
                >
                  <i className="tabler-eye text-green-500 text-2xl cursor-pointer" />
                </IconButton>
              </Tooltip>
            )

          //  Pay if UNPAID
          return (
            <Tooltip title="Pay" placement="top-end">
              <IconButton onClick={() => handlePayClick(row.original._id, currentStatus)}>
                <i className="tabler-cash text-green-500 text-2xl cursor-pointer" />
              </IconButton>
            </Tooltip>
          )
        }
      })
    ]
  }, [hasPermission])

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      <Typography variant="h3" className="px-7 py-2">
        Payment History
      </Typography>

      {/* 🔍 Search + Page size */}
      <div className="flex flex-wrap justify-between gap-4 p-6">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder="Search "
        />
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="is-[70px]"
        >
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="50">50</MenuItem>
        </CustomTextField>
      </div>

      {/*  Table */}
      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Pagination */}
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />

      {/* 💳 Pay Confirmation Dialog */}
      <Dialog open={confirmPayOpen} onClose={() => setConfirmPayOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Payment</DialogTitle>
        <div className="px-6 pb-4">
          <CustomTextField
            fullWidth
            label="Transaction No"
            value={transactionNo}
            onChange={e => setTransactionNo(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={() => setConfirmPayOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={confirmPay}
              disabled={!transactionNo.trim()}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>

      {/*  View Salary Details Dialog */}
      <Dialog open={viewOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setViewOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant="h4">Payment Details</DialogTitle>
        <DialogContent>
          {viewDetails ? (
            <Grid container spacing={3}>
              {[
                { label: 'Paid Amount', value: `₹${Number(viewDetails.netSalary || 0).toLocaleString('en-IN')}` },
                { label: 'Transaction No', value: viewDetails.transactionNo || '—' },
                { label: 'Payment Date', value: viewDetails.paymentDate ? dayjs(viewDetails.paymentDate).format('DD MMM YYYY, hh:mm A') : '—' },
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Typography variant="body1" className="font-medium">
                      {item.label}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Box
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '150px',
                        overflowY: 'auto',
                      }}
                    >
                      <Typography variant="body2">{item.value}</Typography>
                    </Box>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          ) : (
            <Typography>No details available.</Typography>
          )}
        </DialogContent>

      </Dialog>

    </Card>
  )
}

export default LockedSalaryTable
