'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  Tooltip
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import Chip from '@mui/material/Chip'
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import LeaveType from "@/services/leave-management/leaveType"
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

import ApplyForLeave from '@/services/leave-management/ApplyForLeave'
import ApplyForLeaveForm from '@/components/dialogs/leave-management/ApplyForLeave/ApplyForLeave'
import ApplyLeaveDetail from '@/components/dialogs/leave-management/ApplyForLeave/ApplyLeaveDetail'
import ApproveForm from '@/components/dialogs/leave-management/ApplyForLeave/Approve'


const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const ApplyForLeaveTable = () => {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const [modalMode, setModalMode] = useState('view')
  const [selectedUser, setSelectedUser] = useState(null)
  const [ModalOpen, setModalOpen] = useState(false)
  const [EditModalMode, setEditModalMode] = useState('edit')
  const [EditSelectedLeaveType, setEditSelectedLeaveType] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [showData, setShowData] = useState(false)
  const [empData, setempData] = useState()

  const [showApprove, setShowApprove] = useState(false)

  const { hasPermission } = useAuth()

  const productStatusObj = {
    APPROVED: { title: 'APPROVED', color: 'success' },
    PENDING: { title: 'PENDING', color: 'warning' },
    REJECTED: { title: 'REJECTED', color: 'error' },
  }

  useEffect(() => {
    getLeave()
  }, [])

  const getLeave = async () => {
    const res = await ApplyForLeave.getLeaveApply()
    console.log(res.data, " getApplyLEaveTable")
    setData(res.data)
  }

  
  const confirmDelete = async () => {
    if (deleteId) {
      const result = await ApplyForLeave.deleteLeaveApply(deleteId)
      toast.success(result.message)
      getLeave()
      setConfirmDeleteOpen(false)
      setDeleteId(null)
    }
  }

  const handleAdd = () => {
    setEditSelectedLeaveType("")
    setModalOpen(true)
  }

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()
    return [
      columnHelper.accessor('employee.name', {
        header: 'Employee Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.employee.name}
          </Typography>
        )
      }),
      columnHelper.accessor('employee.employee_id', {
        header: 'Emp. No',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.employee.employee_id}
          </Typography>
        ),

      }),
      columnHelper.accessor('leaveType.name', {
        header: 'Leave Type',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.leaveType?.name}
          </Typography>
        ),

      }),
      columnHelper.accessor('date range', {
        header: 'Date Range',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {dayjs(row.original.startDate).format('DD MMM YYYY')}  <span >-</span>  {dayjs(row.original.endDate).format('DD MMM YYYY')}
          </Typography>
        ),
      }),
      columnHelper.accessor('totalLeave', {
        header: 'Apply Days',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.totalLeave}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={productStatusObj[row.original.status].title}
            variant='tonal'
            color={productStatusObj[row.original.status].color}
            size='small'
          />
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Apply Date',
        cell: ({ row }) => (
          <Typography>
            {dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Typography>
        ),
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>

            {hasPermission("leave management_leaveApplication:edit") && <IconButton
              onClick={() => {
                setempData(row.original)
                setShowApprove(true)
              }}
            >
              <Tooltip placement="top-end" title="Status">
                <i className='tabler-copy-check text-blue-500 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}

            {hasPermission("leave management_leaveApplication:view") && <IconButton onClick={() => {
              setempData(row.original)
              setShowData(true)
            }}>
              <Tooltip placement="top-end" title="View">
                <i className='tabler-eye text-green-500' />
              </Tooltip>
            </IconButton>}

            {hasPermission("leave management_leaveApplication:edit") && <IconButton
              onClick={() => {
                setEditModalMode('edit')
                setEditSelectedLeaveType(row.original)
                setModalOpen(true)
              }}
            >
              <Tooltip placement="top-end" title="Edit">
                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}

            {hasPermission("leave management_leaveApplication:delete") && <IconButton
              onClick={() => {
                setDeleteId(row.original._id)
                setConfirmDeleteOpen(true)
              }}
            >
              <Tooltip placement="top-end" title="Delete">
                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}
          </div>
        ),
      })
    ]
  }, [])

  const table = useReactTable({
    data,
    columns,
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

  return (
    <Card>
      <Typography variant='h3' className='px-7 py-2'>Apply For Leave</Typography>

      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Name'
          className='max-sm:is-full'
        />
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='flex-auto is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          {hasPermission("leave management_leaveApplication:add") && <Button
            variant='contained'
            className='max-sm:is-full is-auto text-white'
            onClick={handleAdd}
          >
            Apply Leave Application
          </Button>}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />

      {/* ApproveForm Dialog */}
      <Dialog fullWidth open={showApprove} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setShowApprove(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <ApproveForm
            empData={empData}
            getLeave={getLeave}
            setShowApprove={setShowApprove}
          />
        </DialogTitle>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog fullWidth open={ModalOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <ApplyForLeaveForm setModalOpen={setModalOpen} EditSelectedLeaveType={EditSelectedLeaveType} getLeave={getLeave} />
        </DialogTitle>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <div className="px-6 pb-4">
          <Typography>Are you sure you want to delete</Typography>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Apply Leave Details Dialog */}
      <Dialog fullWidth open={showData} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setShowData(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <ApplyLeaveDetail
            empData={empData}
          />
        </DialogTitle>
      </Dialog>

    </Card>
  )
}

export default ApplyForLeaveTable
