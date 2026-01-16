'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import Checkbox from '@mui/material/Checkbox'

import {
  Card,
  Divider,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
  Tabs,
  Tab
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
import Grid from '@mui/material/Grid2'
import classnames from 'classnames'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'
import EditUserDetail from '@/views/apps/coustomers/EditUserDetail'

import UserDetails from '@/views/apps/coustomers/userDetails'

import getAllusers from '@/services/customers/createService'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'


const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const productStatusObj = {
  // PENDING: { title: 'Pending', color: 'warning' },
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  INACTIVE: { title: 'INACTIVE', color: 'error' },
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

const ProductListTable = () => {
  useEffect(() => {
    getusers()
  }, [])
  const { hasPermission } = useAuth();

  const getusers = async () => {
    const res = await getAllusers.allusers()
    console.log(res,"resres");
    
    setData(res.data)
  }

  const handleDelete = async (id) => {
    const result = await getAllusers.deleteuser(id)
    toast.success(result.message)
    getusers()
  }

  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [selectedUser, setSelectedUser] = useState(null)

  const [EditModalOpen, setEditModalOpen] = useState(false)
  const [EditModalMode, setEditModalMode] = useState('edit')
  const [EditSelectedUser, setEditSelectedUser] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredData = useMemo(() => {
    if (statusFilter === 'ALL') return data
    if (statusFilter === 'INACTIVE') return data.filter(item => item.status === 'INACTIVE')
    if (statusFilter === 'ACTIVE') return data.filter(item => item.status === 'ACTIVE')
    return data
  }, [data, statusFilter])

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },


      columnHelper.accessor('userId', {
        header: 'Id',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.userId}
          </Typography>
        )
      }),

      columnHelper.accessor('userName', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.firstName} {row.original?.lastName}
          </Typography>
        )
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),

      columnHelper.accessor('mobile', {
        header: 'Mobile',
        cell: ({ row }) => <Typography>{row.original.phone}</Typography>
      }),

      columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ row }) => 
        <Typography>{row.original?.loginDevices[0]?.DeviceModel||"User Not Logged"}</Typography>
      }),

      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography>
            {dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Typography>
        )
      }),

      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => (
          <Typography>
            {dayjs(row.original.updatedAt).format('DD MMM YYYY, hh:mm A')}
          </Typography>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const statusValue = row.original.status;
          const status = statusValue ? productStatusObj[statusValue] : null;

          if (!status) return null; // or return some default component

          return (
            <Chip
              label={status.title}
              variant='tonal'
              color={status.color}
              size='small'
            />
          )
        }
      }),

      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <IconButton
              onClick={() => {
                setModalMode('view')
                setSelectedUser(row.original)
                setModalOpen(true)
              }}
            >
              <Tooltip title="View" placement="top-end">
                <i className='tabler-eye text-green-500 text-2xl cursor-pointer' />
              </Tooltip>

            </IconButton>
            {hasPermission("user_all_users:edit") && <IconButton
              onClick={() => {
                setEditModalMode('edit')
                setEditSelectedUser(row.original)
                getusers()
                setEditModalOpen(true)
              }}
            >
              <Tooltip title="Edit" placement="top-end">
                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
              </Tooltip>

            </IconButton>}
            {hasPermission("user_all_users:delete") && <IconButton onClick={() => handleDelete(row.original._id)}>
              <Tooltip title="Delete" placement="top-end">
                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}
          </div>
        ),
        enableSorting: false
      })
    ]
  }, [])

  const table = useReactTable({
    data: filteredData,
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

  const exportSelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows

    if (selectedRows.length === 0) {
      toast.warning('No rows selected for export')
      return
    }

    const csvRows = [
      ['Id', 'Name', 'Email', 'Mobile', 'Source', 'Created At', 'Updated At', 'Status'],
      ...selectedRows.map(row => [
        row.original._id,
        `${row.original.firstName} ${row.original.lastName}`,
        row.original.email,
        row.original.phone,
        'Website',
        dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A'),
        dayjs(row.original.updatedAt).format('DD MMM YYYY, hh:mm A'),
        row.original.status
      ])
    ]

    const csvContent = csvRows.map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'selected-users.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <Typography variant='h3' className='px-7 py-2'>All Users</Typography>
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search User'
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
          <Button
            variant='contained'
            className='max-sm:is-full is-auto  text-white'
            startIcon={<i className='tabler-upload' />}
            onClick={exportSelectedRows}
          >
            Export
          </Button>
        </div>
      </div>
      <Tabs
        value={statusFilter}
        onChange={(event, newValue) => setStatusFilter(newValue)}
        className="px-6 mb-4"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="All" value="ALL" />
        <Tab label="Active" value="ACTIVE" />
        <Tab label="Inactive" value="INACTIVE" />
      </Tabs>

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

      <Dialog fullWidth open={modalOpen} maxWidth='exlg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <UserDetails selectedUser={selectedUser} />
        </DialogTitle>
      </Dialog>

      <Dialog fullWidth open={EditModalOpen} maxWidth='exlg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <EditUserDetail EditSelectedUser={EditSelectedUser} onSuccess={getusers} setEditModalOpen={setEditModalOpen} />
        </DialogTitle>
      </Dialog>
    </Card>
  )
}

export default ProductListTable
