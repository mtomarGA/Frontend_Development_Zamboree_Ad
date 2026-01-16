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
  Tooltip,
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import { useAuth } from '@/contexts/AuthContext'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import EarningForm from '@/components/dialogs/payroll/earning/earningForm'
import earningServices from '@/services/payroll/earningServices'

// fuzzy filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// debounce search
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

const EarningTable = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [ModalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [earningData, setEarningData] = useState()
  const { hasPermission } = useAuth()

  // get all earnings
  const getAllEarnings = async () => {
    try {
      const res = await earningServices.getAllEarnings()
      setData(res.data)
    } catch (error) {
      toast.error('Failed to fetch earnings')
    }
  }

  useEffect(() => {
    getAllEarnings()
  }, [])

  // delete
  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await earningServices.deleteEarning(deleteId)
        getAllEarnings()
      } catch (error) {
        toast.error('Delete failed')
      }
      setConfirmDeleteOpen(false)
      setDeleteId(null)
    }
  }

  const handleAdd = () => {
    setEarningData(null)
    setModalOpen(true)
  }

  // columns
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()
    return [
      columnHelper.accessor('earningName', {
        header: 'Earning Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.earningName}
          </Typography>
        ),
      }),
      columnHelper.accessor('earningType', {
        header: 'Earning Type',
        cell: ({ row }) => (
          <Typography>{row.original.earningType}</Typography>
        ),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: ({ row }) => {
          const { earningType, value } = row.original
          if (!value && earningType === 'Any Value') return <Typography>-</Typography>

          return (
            <Typography>
              {earningType === 'Percentage on Basic' ? `${value}%` : value ?? '-'}
            </Typography>
          )
        },
      }),


      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography>{dayjs(row.original.createdAt).format('DD MMM YYYY')}</Typography>
        ),
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {hasPermission('payroll_earning:edit') && (
              <IconButton
                onClick={() => {
                  setEarningData(row.original)
                  setModalOpen(true)
                }}
              >
                <Tooltip placement='top-end' title='Edit'>
                  <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                </Tooltip>
              </IconButton>
            )}

            {hasPermission('payroll_earning:delete') && (
              <IconButton
                onClick={() => {
                  setDeleteId(row.original._id)
                  setConfirmDeleteOpen(true)
                }}
              >
                <Tooltip placement='top-end' title='Delete'>
                  <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
                </Tooltip>
              </IconButton>
            )}
          </div>
        ),
      }),
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
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card>
      <Typography variant='h3' className='px-7 py-2'>
        Earning List
      </Typography>

      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Earning'
          className='max-sm:is-full'
        />
        <div className='flex flex-wrap items-center gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          {hasPermission('payroll_earning:add') && (
            <Button
              variant='contained'
              className='text-white'
              onClick={handleAdd}
            >
              Add Earning
            </Button>
          )}
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
                          'cursor-pointer select-none': header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && (
                          <i className='tabler-chevron-up text-xl' />
                        )}
                        {header.column.getIsSorted() === 'desc' && (
                          <i className='tabler-chevron-down text-xl' />
                        )}
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
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
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
      <Dialog
        fullWidth
        open={ModalOpen}
        maxWidth='sm'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle
          variant='h4'
          className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'
        >
          <EarningForm
            setModalOpen={setModalOpen}
            getAllEarnings={getAllEarnings}
            earningData={earningData}
          />
        </DialogTitle>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <div className='px-6 pb-4'>
          <Typography>Are you sure you want to delete?</Typography>
          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='outlined' onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant='contained' color='error' onClick={confirmDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  )
}

export default EarningTable
