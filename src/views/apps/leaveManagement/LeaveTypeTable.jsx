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
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import LeaveType from "@/services/leave-management/leaveType"
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import LeaveTypeForm from '@/components/dialogs/leave-management/LeaveType'

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

const LeaveTypeTable = () => {
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

  const { hasPermission } = useAuth()

  useEffect(() => {
    getLeave()
  }, [])

  const getLeave = async () => {
    const res = await LeaveType.getLeaveType()
    setData(res.data)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await LeaveType.deleteLeaveType(deleteId)
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
      columnHelper.accessor('name', {
        header: 'name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('code', {
        header: 'code',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.code}
          </Typography>
        ),
      }),
      columnHelper.accessor('deductValues', {
        header: 'Deduct Leave Value',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.deductValues}
          </Typography>
        ),
      }),
      columnHelper.accessor('allowLeave', {
        header: 'Allow Leave in Year',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.allowLeave}
          </Typography>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
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
            {hasPermission("leave management_master:edit")&&<IconButton
              onClick={() => {
                setEditModalMode('edit')
                setEditSelectedLeaveType(row.original)
                setModalOpen(true)
              }}
            >
              <Tooltip title="Edit" placement="top-end">
                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}
            {hasPermission("leave management_master:delete")&&<IconButton
              onClick={() => {
                setDeleteId(row.original._id)
                setConfirmDeleteOpen(true)
              }}
            >
              <Tooltip title="Delete" placement="top-end">
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
      <Typography variant='h3' className='px-7 py-2'>Leave Type</Typography>

      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Leave Name'
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
          {hasPermission("leave management_master:add")&&<Button
            variant='contained'
            className='max-sm:is-full is-auto text-white'
            onClick={handleAdd}
          >
            Add Leave Type
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

      {/* Add/Edit Dialog */}
      <Dialog fullWidth open={ModalOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <LeaveTypeForm setModalOpen={setModalOpen} EditSelectedLeaveType={EditSelectedLeaveType} getLeave={getLeave} />
        </DialogTitle>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <div className="px-6 pb-4">
          <Typography>Are you sure you want to delete this leave type?</Typography>
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
    </Card>
  )
}

export default LeaveTypeTable
