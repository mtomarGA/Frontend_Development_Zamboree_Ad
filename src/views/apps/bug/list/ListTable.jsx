'use client'

import { useEffect, useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
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

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import AddBugModal from '@/components/dialogs/add-bug'
import tableStyles from '@core/styles/table.module.css'
import BugService from '@/services/bugService'
import { useAuth } from '@/contexts/AuthContext'
import ViewBugModal from '@/components/dialogs/view-bug'

const colors = {
  ACTIVE: 'error',
  INACTIVE: 'success'
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  console.log(columnId, value);

  let itemValue = ''

  itemValue = String(row.getValue(columnId) ?? '')


  const itemRank = rankItem(itemValue, value)
  addMeta?.({ itemRank })
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

const columnHelper = createColumnHelper()

const ListTable = () => {
  const [open, setOpen] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [editValue, setEditValue] = useState(null)
  const [viewData, setViewData] = useState(null)
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const { hasPermission } = useAuth()
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [rowSelection, setRowSelection] = useState({})

  // Derived list of selected _id values from the rowSelection state
  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection])


  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await BugService.getAllBugs()
      const flatData = response.data.map(item => ({
        ...item,
        categoryName: item.category?.name ?? ''
      }))

      setData(flatData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns = useMemo(
    () => [
      // Selection column
      columnHelper.display({
        id: 'select',
        header: ({ table }) => {
          // Select/Deselect only the CURRENT PAGE rows (what's visible)
          const pageRowIds = table.getRowModel().rows.map(r => r.id)
          const selection = table.getState().rowSelection
          const selectedCount = pageRowIds.filter(id => selection[id])?.length ?? 0
          const allSelected = pageRowIds.length > 0 && selectedCount === pageRowIds.length
          const partiallySelected = selectedCount > 0 && selectedCount < pageRowIds.length

          const toggleAllVisible = checked => {
            if (checked) {
              const next = { ...selection }
              pageRowIds.forEach(id => {
                next[id] = true
              })
              table.setRowSelection(next)
            } else {
              // Deselect only the current page rows, keep other selections (if any)
              const next = { ...selection }
              pageRowIds.forEach(id => {
                delete next[id]
              })
              table.setRowSelection(next)
            }
          }

          return (
            <Checkbox
              checked={allSelected}
              indeterminate={partiallySelected}
              onChange={e => toggleAllVisible(e.target.checked)}
              onClick={e => e.stopPropagation()}
              inputProps={{ 'aria-label': 'Select all visible rows' }}
            />
          )
        },
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect?.()}
            onChange={row.getToggleSelectedHandler()}
            onClick={e => e.stopPropagation()}
            inputProps={{ 'aria-label': `Select row ${row.id}` }}
          />
        ),
        enableSorting: false,
        enableHiding: false
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => <Typography>{row.original.title}</Typography>
      }),
      columnHelper.accessor('image', {
        header: 'Screenshot',
        cell: ({ row }) =>
          row.original.image ? (
            <img src={row.original.image} alt='screenshot' className='w-[70px] h-auto rounded' />
          ) : (
            <Typography color='text.secondary'>No Image</Typography>
          )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => {
          const description = row.original.description;
          const lastSpace = description.substring(0, 40).lastIndexOf(' ');
          const cutPoint = lastSpace > 0 ? lastSpace : 40;
          return <Typography>{description.substring(0, cutPoint) || 'N/A'}...</Typography>;
        }
      }),
      columnHelper.accessor('categoryName', {
        header: 'Category',
        filterFn: 'fuzzy',
        cell: ({ row }) => <Typography>{row.original.categoryName || "N/A"}</Typography>
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.status === "ACTIVE" ? "Unsolved" : "Solved"}
            color={colors[row.original.status] || 'default'}
            size='small'
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('createdBy', {
        header: 'Created By',
        cell: ({ row }) => <Typography>{row.original.createdBy?.userType === "ADMIN" ? 'ADMIN' : row.original.createdBy?.userId?.employee_id || "N/A"}</Typography>
      }),
      columnHelper.accessor('updatedBy', {
        header: 'Updated By',
        cell: ({ row }) => <Typography>{row.original.updatedBy?.userType === "ADMIN" ? 'ADMIN' : row.original.updatedBy?.userId?.employee_id || "N/A"}</Typography>
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => {
          return <Typography>{new Date(row.original.createdAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata',
            hour12: true,
          })}</Typography>
        }
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => {
          return <Typography>{new Date(row.original.updatedAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata',
            hour12: true,
          })}</Typography>
        }
      }),

      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            {hasPermission("bug_all_bugs:view") && <button
              onClick={() => { setOpenView(true); setViewData(row.original) }}
              className='text-primary tabler-eye text-xl cursor-pointer'
            ></button>}
            {hasPermission("bug_all_bugs:edit") && <button
              onClick={() => { setOpen(true); setEditValue(row.original) }}
              className='text-primary tabler-edit text-xl cursor-pointer'
            ></button>}
            {hasPermission("bug_all_bugs:delete") && <button
              onClick={() => handleDelete(row.original._id)}
              className='text-error tabler-trash text-xl cursor-pointer'
            ></button>}
          </div>
        ),
        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data: useMemo(() => {
      return statusFilter === 'ALL' ? data : data.filter(row => row.status === statusFilter)
    }, [data, statusFilter]),
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, rowSelection },
    initialState: { pagination: { pageSize: 9 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row._id,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleAdd = async (data) => {
    const formData = new FormData()
    formData.append('title', data.bugTitle)
    formData.append('description', data.bugDescription)
    formData.append('category', data.bugCategory)
    formData.append('status', data.status)
    formData.append('image', data.screenShot)


    try {
      setLoading(true)
      await BugService.addBug(formData)
      await fetchData()
    } catch (error) {
      console.error('Error adding bug:', error)
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  const handleUpdate = async data => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category)
    formData.append('status', data.status)
    formData.append('image', data.image)
    try {
      setLoading(true)
      await BugService.updateBug(data._id, formData)
    } catch (error) {
      console.error('Error adding bug:', error)
    } finally {
      setOpen(false)
      await fetchData()
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await BugService.deleteBug(id)
      await fetchData()
    } catch (error) {
      console.error('Error deleting bug:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return
    try {
      setLoading(true)
      await BugService.bulkDelete(selectedIds)
      // await Promise.all(selectedIds.map(id => BugService.deleteBug(id)))
      console.log(selectedIds);

      setRowSelection({})
      await fetchData()
    } catch (error) {
      console.error('Error bulk deleting bugs:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between flex-wrap'>
          <div className='flex items-center gap-2'>
            <Typography>Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='is-[70px]'
            >
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='7'>7</MenuItem>
              <MenuItem value='9'>9</MenuItem>
            </CustomTextField>
          </div>

          <div className='flex flex-wrap gap-4 justify-between items-center w-full sm:w-auto'>
            <Typography>Status</Typography>
            <CustomTextField
              select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              // label='Status'
              size='small'
              className='min-w-[120px]'
            >
              <MenuItem value='ALL'>All</MenuItem>
              <MenuItem value='ACTIVE'>Unsolved</MenuItem>
              <MenuItem value='INACTIVE'>Solved</MenuItem>
            </CustomTextField>
            <DebouncedInput
              value={table.getColumn('categoryName')?.getFilterValue() ?? ''}
              onChange={value => table.getColumn('categoryName')?.setFilterValue(String(value))}
              placeholder='Search Category...'
              className='max-sm:is-full'
            />
            {hasPermission("bug_all_bugs:delete") && (
              <Button
                variant='outlined'
                color='error'
                disabled={!selectedIds.length || loading}
                onClick={handleBulkDelete}
              >
                Bulk Delete{selectedIds.length ? ` (${selectedIds.length})` : ''}
              </Button>
            )}
            {hasPermission("bug_all_bugs:add") && <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
              Add Bug
            </Button>}
          </div>
        </CardContent>

        <div className='overflow-x-auto max-h-[500px] overflow-y-auto'>
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
                          {header.column.getIsSorted() === 'asc' ? (
                            <i className='tabler-chevron-up text-xl' />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <i className='tabler-chevron-down text-xl' />
                          ) : null}
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
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <ViewBugModal open={openView} setOpen={setOpenView} data={viewData} />
      <AddBugModal open={open} setOpen={setOpen} data={editValue} handleUpdate={handleUpdate} handleAddBug={handleAdd} />
    </>
  )
}

export default ListTable
