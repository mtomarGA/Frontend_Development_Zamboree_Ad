'use client'

// React Imports
import { useEffect, useState, useMemo, useCallback } from 'react'

// MUI Imports
import {
  Card,
  CardContent,
  Button,
  Typography,
  TablePagination,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Chip,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  Dialog
} from '@mui/material'

// Table & Utils
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import { useAuth } from '@/contexts/AuthContext'

import faqsService from '@/services/utsav-packages/faqs.Service'
import DeleteConfirmationDialog from '../deleteConfirmation'
import EditFaq from '@/components/dialogs/faqs-edit/faqsEdit'
import AddFaq from './AddFaqs'

// Styled Table Cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 16px',
  borderColor: theme.palette.divider
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const TableHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const columnHelper = createColumnHelper()

// Debounced Input for Search
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

const FaqList = () => {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const { hasPermission } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState(null)

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await faqsService.getFaqs()
      setData(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async id => {
    try {
      setLoading(true)
      await faqsService.deleteFaqs(id)
      fetchData()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // Drag and Drop
  const handleDragEnd = async result => {
    if (!result.destination) return

    const oldIndex = result.source.index
    const newIndex = result.destination.index
    if (oldIndex === newIndex) return

    const updatedOrder = [...data]
    const [movedItem] = updatedOrder.splice(oldIndex, 1)
    updatedOrder.splice(newIndex, 0, movedItem)

    // Update sorting numbers
    updatedOrder.forEach((item, index) => {
      item.sorting_no = index + 1
    })

    setData(updatedOrder)

    try {
      const orderPayload = updatedOrder.map(({ _id, sorting_no }) => ({ _id, sorting_no }))
      await faqsService.updateFaqs(editValue, orderPayload)
    } catch (err) {
      console.error('Reordering failed', err)
      fetchData()
    }
  }


  const columns = useMemo(
    () => [
      columnHelper.accessor('sortingNumber', {
        header: 'Sort No',
        size: 80,
        cell: ({ row }) => (
          <Box display='flex' alignItems='center' gap={1}>
            <i className='tabler-grip-horizontal' style={{ cursor: 'grab', color: '#666' }} />
            <Chip label={row.original.sortingNumber} size='small' />
          </Box>
        )
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      // columnHelper.accessor('packageId.title', {
      //   header: 'Package Name',
      //   cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      // }),

      columnHelper.accessor('categories', {
        header: 'Categories',
        cell: info => (
          <Typography
            variant='body2'
            sx={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {info.getValue().map(category => category?.name).join(', ')}
          </Typography>
        )
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <>
            {hasPermission('utsav_package_master:view') && <Button
              size='small'
              onClick={() => {
                setSelectedFaq(row.original)
                setEditOpen(true)
                setViewOpen(true)
              }}
            >
              <i className='tabler-eye' />
            </Button>}

            {hasPermission('utsav_package_master:edit') && <Button
              size='small'
              onClick={() => {
                setSelectedFaq(row.original)
                setEditOpen(true)
              }}
            >
              <i className='tabler-edit' />
            </Button>}


            {hasPermission('utsav_package_master:delete') && (
              <DeleteConfirmationDialog
                itemName='FAQ'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 9 } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter
  })

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <Typography variant='h4' p={2} ml={5} mt={4}>
            Terms and Conditions
          </Typography>
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
                placeholder='Search terms...'
                className='max-sm:is-full'
              />

              {hasPermission('utsav_package_master:add') && <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setOpen(true)}>
                Add Terms & Conditions
              </Button>}
            </div>
          </CardContent>

          <div className='overflow-x-auto'>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHeaderCell key={header.id} sx={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : (
                          <Stack
                            direction='row'
                            alignItems='center'
                            onClick={header.column.getToggleSortingHandler()}
                            sx={{
                              cursor: header.column.getCanSort() ? 'pointer' : 'default',
                              userSelect: 'none'
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-sm' />,
                              desc: <i className='tabler-chevron-down text-sm' />
                            }[header.column.getIsSorted()] ?? null}
                          </Stack>
                        )}
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='allahnames-table-body'>
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
                            <Typography p={4}>No Allah names found.</Typography>
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
            onRowsPerPageChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          />
        </Card>
      </Grid>

      {/* Add FAQ Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
        <AddFaq
          onClose={() => {
            setOpen(false)
            fetchData()
          }}
        />
      </Dialog>

      {/* Edit FAQ Dialog */}
      <EditFaq
        viewOpen={viewOpen}
        setViewOpen={setViewOpen}
        open={editOpen}
        faqData={selectedFaq}
        onClose={async updated => {
          setEditOpen(false)
          setSelectedFaq(null)
          setViewOpen(false)
          if (updated) {
            await fetchData()
          }
        }}
      />
    </Grid>
  )
}

export default FaqList
