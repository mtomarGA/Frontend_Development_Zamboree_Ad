'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  flexRender
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { IconButton, Tooltip } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import { useAuth } from '@/contexts/AuthContext'
import tableStyles from '@core/styles/table.module.css'
import classnames from 'classnames'
import { useRouter } from 'next/navigation'
import goalService from '@/services/performance/goal'
import DeleteConfirmationDialog from '../deleteConfirmation'
import EditGoalDialog from '@/components/dialogs/performance/EditGoalDialog'
import ArticleIcon from '@mui/icons-material/Article'

// Fuzzy filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemValue = String(row.getValue(columnId) ?? '')
  const itemRank = rankItem(itemValue, value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

// Debounced Input
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

// Table column helper
const columnHelper = createColumnHelper()

const GoalManageList = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const { hasPermission } = useAuth()

  const getData = async () => {
    try {
      const res = await goalService.getGoal()
      if (Array.isArray(res)) {
        setData(res)
      } else if (res?.data && Array.isArray(res.data)) {
        setData(res.data)
      } else {
      }
    } catch (error) {}
  }

  useEffect(() => {
    getData()
  }, [])

  const handleDelete = async id => {
    try {
      const res = await goalService.deleteGoal(id)
      getData()
    } catch (error) {}
  }

  const handleEdit = rowData => {
    setSelectedGoal(rowData)
    setEditDialogOpen(true)
  }

  const handleUpdateGoal = async updatedData => {
    try {
      await goalService.updateGoal(updatedData._id, updatedData)
      setEditDialogOpen(false)
      getData()
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  const handleClick = id => {
    router.push(`/en/apps/goal/goal-report/${id}`)
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('subject', { header: 'Subject' }),
      columnHelper.accessor('goalType', { header: 'Goal Type' }),
      columnHelper.accessor('targetGoalValue', { header: 'Target Goal Value' }),
      columnHelper.accessor('startDate', {
        header: 'Start Date',
        cell: info =>
          new Date(info.getValue()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
      }),
      columnHelper.accessor('endDate', {
        header: 'End Date',
        cell: info =>
          new Date(info.getValue()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
      }),
      columnHelper.accessor(row => row.branch?.name || '', {
        id: 'branchName',
        header: 'Branch'
      }),
      columnHelper.accessor(row => row.department?.name || '', {
        id: 'departmentName',
        header: 'Department'
      }),
      columnHelper.accessor(row => row.designation?.name || '', {
        id: 'designationName',
        header: 'Designation'
      }),

      columnHelper.accessor('assignedEmployees', {
        header: 'Assigned Employees',
        cell: ({ getValue }) => {
          const assignedEmployees = getValue()
          if (!assignedEmployees || assignedEmployees.length === 0) return '—'

          return assignedEmployees.map(emp => emp.name).join(', ')
        }
      }),

      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => {
          const rowData = row.original

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {hasPermission('performance_goal:view') && (
                <IconButton color='primary' onClick={() => handleClick(row.original._id)}>
                  <ArticleIcon />
                </IconButton>
              )}

              {hasPermission('performance_goal:edit') && (
                <Tooltip title='Edit'>
                  <IconButton color='primary' onClick={() => handleEdit(rowData)}>
                    <i className='tabler-edit' />
                  </IconButton>
                </Tooltip>
              )}

              {hasPermission('performance_goal:delete') && (
                <DeleteConfirmationDialog
                  itemName='Goal'
                  icon={
                    <Tooltip title='Delete'>
                      <IconButton color='error'>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Tooltip>
                  }
                  onConfirm={() => handleDelete(rowData._id)}
                />
              )}
            </div>
          )
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data: useMemo(() => {
      return statusFilter === 'ALL' ? data : data.filter(row => row.status === statusFilter)
    }, [data, statusFilter]),
    columns,
    state: { globalFilter },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: { pagination: { pageSize: 9 } }
  })

  return (
    <Card>
      <CardContent className='flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between flex-wrap'>
        <div className='flex items-center gap-2'>
          <Typography variant='h4'>Goal Manage</Typography>
        </div>
        <div className='flex flex-wrap gap-4 justify-between items-center w-full sm:w-auto'>
          {hasPermission('performance_goal:add') && (
            <Button variant='contained' onClick={() => router.push('/en/apps/goal/add-goal')}>
              Add Goal
            </Button>
          )}
        </div>
      </CardContent>

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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />

      <EditGoalDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        goalData={selectedGoal}
        onSave={handleUpdateGoal}
      />
    </Card>
  )
}

export default GoalManageList
