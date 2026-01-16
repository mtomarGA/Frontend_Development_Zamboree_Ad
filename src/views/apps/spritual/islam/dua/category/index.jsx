'use client'

import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import {
  Card, CardContent, Button, Typography, TablePagination,
  MenuItem, Grid, Chip, Box, Tooltip
} from '@mui/material'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
  getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues,
  getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import IslamDuaCategoryService from '@/services/spritual/islamduacategory'
import IslamDuaCategoryModal from '@/components/dialogs/islam-dua-category'

// Helpers
const columnHelper = createColumnHelper()

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => { setValue(initialValue) }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => { onChange(value) }, debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const DuaCategory = () => {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const { hasPermission } = useAuth()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await IslamDuaCategoryService.getAll()
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
      await IslamDuaCategoryService.create(values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async values => {
    try {
      setLoading(true)
      await IslamDuaCategoryService.update(editValue._id, values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error updating category:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      setLoading(true)
      await IslamDuaCategoryService.delete(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting category:', error)
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
      await IslamDuaCategoryService.updateOrder(orderPayload)
    } catch (err) {
      console.error('Reordering failed', err)
      fetchData() // revert by refetching
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
      cell: ({ row }) => <Chip label={row.original.sorting_no} className='capitalize' />
    }),
    columnHelper.accessor('mobile_image', {
      header: 'Mobile Image',
      cell: ({ row }) => (
        <div className='flex items-center'>
          {row.original.mobile_image ? (
            <img
              src={row.original.mobile_image}
              alt={row.original.english_category_name}
              className='w-10 h-10 object-cover'
            />
          ) : <Typography color='text.secondary'>No Image</Typography>}
        </div>
      )
    }),
    columnHelper.accessor('web_image', {
      header: 'Web Image',
      cell: ({ row }) => (
        <div className='flex items-center'>
          {row.original.web_image ? (
            <img
              src={row.original.web_image}
              alt={row.original.english_category_name}
              className='w-10 h-10 object-cover'
            />
          ) : <Typography color='text.secondary'>No Image</Typography>}
        </div>
      )
    }),
    columnHelper.accessor('arabic_category_name', {
      header: 'Arabic Category Name',
      cell: ({ row }) => <Typography className='capitalize'>{row.original.arabic_category_name}</Typography>
    }),
    columnHelper.accessor('english_category_name', {
      header: 'English Category Name',
      cell: ({ row }) => <Typography className='capitalize'>{row.original.english_category_name}</Typography>
    }),
    columnHelper.accessor('action', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          {hasPermission('spiritual_islam_dua_category:edit') && (
            <button onClick={() => { setEditValue(row.original); setOpen(true) }}
              className='text-blue-600 tabler-edit text-xl cursor-pointer'></button>
          )}
          {hasPermission('spiritual_islam_dua_category:delete') && (
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
        <Typography variant='h4'>Manage Dua Category</Typography>
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
                  placeholder='Search Category...'
                />
                {hasPermission('spiritual_islam_dua_category:add') && (
                  <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
                    Add Dua Category
                  </Button>
                )}
              </div>
            </CardContent>

            <div className='overflow-x-auto'>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='dua-category-table'>
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

        <IslamDuaCategoryModal
          open={open}
          data={editValue}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
          handleClose={() => setOpen(false)}
          title={'Dua Category'}
        />
      </Grid>
    </Grid>
  )
}

export default DuaCategory
