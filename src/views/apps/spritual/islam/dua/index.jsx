'use client'

import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import {
  Card, CardContent, Button, Typography, TablePagination,
  MenuItem, Grid, Box, IconButton, Tooltip, Stack
} from '@mui/material'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
  getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues,
  getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import classnames from 'classnames'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import IslamDuaService from '@/services/spritual/islamdua'
import IslamDuaModal from '@/components/dialogs/islam-dua'
import IslamViewModal from '@/components/dialogs/islam-dua-view'

// Column helper
const columnHelper = createColumnHelper()

// fuzzy filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Debounced Input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => { setValue(initialValue) }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => { onChange(value) }, debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const DuaList = () => {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const { hasPermission } = useAuth()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await IslamDuaService.getAll()
      setData(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAdd = async values => {
    try {
      setLoading(true)
      await IslamDuaService.create(values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error adding dua:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async values => {
    try {
      setLoading(true)
      await IslamDuaService.update(editValue._id, values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error updating dua:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      setLoading(true)
      await IslamDuaService.delete(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting dua:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async result => {
    if (!result.destination) return
    const oldIndex = result.source.index
    const newIndex = result.destination.index
    if (oldIndex === newIndex) return

    const updatedOrder = [...data]
    const [movedItem] = updatedOrder.splice(oldIndex, 1)
    updatedOrder.splice(newIndex, 0, movedItem)
    updatedOrder.forEach((item, index) => { item.sorting_no = index + 1 })

    setData(updatedOrder)

    try {
      const orderPayload = updatedOrder.map(({ _id, sorting_no }) => ({ _id, sorting_no }))
      await IslamDuaService.updateOrder(orderPayload)
    } catch (err) {
      console.error('Reordering failed', err)
      setData(data) // revert
    }
  }

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'drag',
      header: '',
      cell: () => (
        <Tooltip title='Drag to reorder'>
          <Box sx={{ cursor: 'grab', textAlign: 'center' }}>
            <i className='tabler-grip-vertical' />
          </Box>
        </Tooltip>
      ),
      enableSorting: false
    }),
    columnHelper.accessor('sorting_no', {
      header: 'Sorting No',
      cell: ({ row }) => <Typography>{row.original.sorting_no}</Typography>
    }),
    columnHelper.accessor('dua_title_english', {
      header: 'Dua Title (English)',
      cell: ({ row }) => <Typography>{row.original.dua_title_english}</Typography>
    }),
    columnHelper.accessor('dua_title_arabic', {
      header: 'Dua Title (Arabic)',
      cell: ({ row }) => <Typography>{row.original.dua_title_arabic}</Typography>
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ row }) => <Typography>{row.original.category_id?.english_category_name || 'N/A'}</Typography>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: ({ row }) => (
        <Typography>
          {new Date(row.original.createdAt).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'Asia/Kolkata', hour12: true
          })}
        </Typography>
      )
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: ({ row }) => (
        <Typography>
          {new Date(row.original.updatedAt).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'Asia/Kolkata', hour12: true
          })}
        </Typography>
      )
    }),
    columnHelper.accessor('action', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button onClick={() => { setEditValue(row.original); setViewOpen(true) }} className='tabler-eye text-xl cursor-pointer'></button>
          {hasPermission('spiritual_islam_dua:edit') && (
            <button onClick={() => { setEditValue(row.original); setOpen(true) }}
              className='text-blue-600 tabler-edit text-xl cursor-pointer'></button>
          )}
          {hasPermission('spiritual_islam_dua:delete') && (
            <button onClick={() => handleDelete(row.original._id)}
              className='text-red-500 tabler-trash text-xl cursor-pointer'></button>
          )}
        </div>
      ),
      enableSorting: false
    })
  ], [hasPermission])

  const table = useReactTable({
    data, columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 9 } },
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
    <Grid container>
      <div className='flex flex-col md:flex-row w-full justify-between items-center'>
        <Typography variant='h4'>Manage Dua</Typography>
      </div>
      <Grid item xs={12} className='w-full'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <Typography variant='h6'>Loading...</Typography>
          </div>
        ) : (
          <Card>
            <CardContent className='flex flex-col sm:flex-row justify-between flex-wrap gap-4'>
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
              <div className='flex gap-4'>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search Dua...'
                />
                {hasPermission('spiritual_islam_dua:add') && (
                  <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
                    Add Dua
                  </Button>
                )}
              </div>
            </CardContent>

            <div className='overflow-x-auto'>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='dua-table-body'>
                  {provided => (
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
                                    {{
                                      asc: <i className='tabler-chevron-up text-xl' />,
                                      desc: <i className='tabler-chevron-down text-xl' />
                                    }[header.column.getIsSorted()] ?? null}
                                  </div>
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {table.getRowModel().rows.length === 0 ? (
                          <tr>
                            <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                              No data available
                            </td>
                          </tr>
                        ) : (
                          table.getRowModel().rows.map((row, index) => (
                            <Draggable key={row.original._id} draggableId={row.original._id} index={index}>
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={classnames({ selected: row.getIsSelected() })}
                                  style={{
                                    ...provided.draggableProps.style,
                                    // backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'inherit'
                                  }}
                                >
                                  {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                  ))}
                                </tr>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </tbody>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <TablePagination
              component={() => <TablePaginationComponent table={table} />}
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, page) => table.setPageIndex(page)}
            />
          </Card>
        )}

        <IslamDuaModal
          open={open}
          data={editValue}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
          handleClose={() => setOpen(false)}
          title={'Dua'}
        />
        <IslamViewModal open={viewOpen} data={editValue} setOpen={() => setViewOpen(false)} />
      </Grid>
    </Grid>
  )
}

export default DuaList
