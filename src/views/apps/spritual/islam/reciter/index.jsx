'use client'

// React Imports
import { useEffect, useState, useMemo, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import { Grid, Chip, CircularProgress, Box, IconButton, Tooltip, Stack, Table, TableHead, TableRow, TableCell, TableBody, styled } from '@mui/material'

// Third-party Imports
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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Services & Context
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import IslamReciterService from '@/services/spritual/inslamReciter'
import IslamReciterModal from '@/components/dialogs/islam-reciter'

// Styles
import tableStyles from '@core/styles/table.module.css'

// Vars
const colors = {
  support: 'info',
  users: 'success',
  manager: 'warning',
  administrator: 'primary',
  'restricted-user': 'error',
  ACTIVE: 'success',
  INACTIVE: 'error'
}

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

// Styled table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 16px',
  borderColor: theme.palette.divider
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': { backgroundColor: theme.palette.action.hover },
  '&:last-of-type td, &:last-of-type th': { border: 0 }
}))

const columnHelper = createColumnHelper()

const ReciterList = () => {
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
      const response = await IslamReciterService.getall()
      setData(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = async values => {
    try {
      setLoading(true)
      await IslamReciterService.create(values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error adding reciter:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async values => {
    try {
      setLoading(true)
      await IslamReciterService.update(editValue._id, values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error updating reciter:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      setLoading(true)
      await IslamReciterService.delete(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting reciter:', error)
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
    updatedOrder.forEach((item, index) => {
      item.position = index + 1
    })

    setData(updatedOrder)

    try {
      const orderPayload = updatedOrder.map(({ _id, position }) => ({ _id, position }))
      await IslamReciterService.updateOrder(orderPayload)
    } catch (err) {
      console.error('Reordering failed', err)
      setData(data) // revert on failure
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'drag',
        header: '',
        size: 40,
        cell: () => (
          <Tooltip title='Drag to reorder'>
            <Box sx={{ cursor: 'grab', textAlign: 'center' }}>
              <i className='tabler-grip-vertical' />
            </Box>
          </Tooltip>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('profile_image', {
        header: 'Profile',
        cell: ({ row }) =>
          row.original.profile_image ? (
            <img src={row.original.profile_image} alt={row.original.name} className='w-10 h-10 object-cover' />
          ) : (
            <Typography color='text.secondary'>No Image</Typography>
          )
      }),
      columnHelper.accessor('position', {
        header: 'Position',
        cell: ({ row }) => (
          <Chip label={row.original.position} color={colors[row.original.position] || 'default'} className='capitalize' />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        size: 150,
        cell: ({ row }) => (
          <Stack direction='row' spacing={0.5}>
            <IconButton size='small' onClick={() => router.push(`reciter/${row.original._id}`)}>
              <i className='tabler-headphones' />
            </IconButton>
            {hasPermission('spiritual_islam_reciter_list:edit') && (
              <IconButton size='small' color='primary' onClick={() => { setEditValue(row.original); setOpen(true) }}>
                <i className='tabler-edit' />
              </IconButton>
            )}
            {hasPermission('spiritual_islam_reciter_list:delete') && (
              <IconButton size='small' color='error' onClick={() => handleDelete(row.original._id)}>
                <i className='tabler-trash' />
              </IconButton>
            )}
          </Stack>
        ),
        enableSorting: false
      })
    ],
    [hasPermission, router]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 9 } },
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
          <Typography variant='h4'>Manage Reciters</Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
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
            <div className='flex flex-wrap gap-4'>
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                placeholder='Search Reciter...'
                className='max-sm:is-full'
              />
              {hasPermission('spiritual_islam_reciter_list:add') && (
                <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setOpen(true)}>
                  Add Reciter
                </Button>
              )}
            </div>
          </CardContent>

          <div className='overflow-x-auto'>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <StyledTableCell key={header.id}>
                        {header.isPlaceholder ? null : (
                          <Stack
                            direction='row'
                            alignItems='center'
                            onClick={header.column.getToggleSortingHandler()}
                            sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none' }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-sm' />,
                              desc: <i className='tabler-chevron-down text-sm' />
                            }[header.column.getIsSorted()] ?? null}
                          </Stack>
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='reciter-table-body'>
                  {provided => (
                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                      {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row, index) => (
                          <Draggable key={row.original._id} draggableId={row.original._id} index={index}>
                            {(provided, snapshot) => (
                              <StyledTableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? 'action.selected' : 'inherit',
                                  boxShadow: snapshot.isDragging ? 5 : 0
                                }}
                              >
                                {row.getVisibleCells().map(cell => (
                                  <StyledTableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} align='center'>
                            <Typography p={4}>No reciters found.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </div>
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => table.setPageIndex(page)}
            onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
          />
        </Card>
      </Grid>

      <IslamReciterModal
        open={open}
        data={editValue}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
        handleClose={() => {setOpen(false); setEditValue(null)}}
        title={'Reciter'}
      />
    </Grid>
  )
}

export default ReciterList
