'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Card, CardContent, Button, Typography, TablePagination,
  MenuItem, Chip, Grid, Box, Stack, IconButton, CircularProgress,
  Tooltip, Table, TableHead, TableRow, TableCell, TableBody, styled
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
  getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues,
  getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table'
import classnames from 'classnames'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import IslamAudioService from '@/services/spritual/islamAudio'
import IslamAudioModal from '@/components/dialogs/islam-audio'
import ModalMusicPlayer from '@/components/dialogs/audio-player'

// Styles
import tableStyles from '@core/styles/table.module.css'

// Vars
const colors = {
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

  useEffect(() => { setValue(initialValue) }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => { onChange(value) }, debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 16px',
  borderColor: theme.palette.divider
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': { backgroundColor: theme.palette.action.hover },
  '&:last-of-type td, &:last-of-type th': { border: 0 }
}))

const columnHelper = createColumnHelper()

const QuranAudio = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const [reciterName, setReciterName] = useState('')
  const [openMusicPlayer, setOpenMusicPlayer] = useState(false)
  const [selectedAudio, setSelectedAudio] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const { hasPermission } = useAuth()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await IslamAudioService.getAll(id)
      setData(Array.isArray(response.data) ? response.data : [])
      setReciterName(response.data[0]?.reciter_id?.name || '')
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
      await IslamAudioService.create(values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error adding audio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async values => {
    try {
      setLoading(true)
      await IslamAudioService.update(editValue._id, values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error updating audio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      setLoading(true)
      await IslamAudioService.delete(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting audio:', error)
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
    updatedOrder.forEach((item, index) => { item.sura_number = index + 1 })

    setData(updatedOrder)

    try {
      const orderPayload = updatedOrder.map(({ _id, sura_number }) => ({ _id, sura_number }))
      await IslamAudioService.updateOrder(orderPayload)
    } catch (err) {
      console.error('Reordering failed', err)
      setData(data) // revert
    }
  }

  const columns = useMemo(() => [
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
    columnHelper.accessor('sura_name', {
      header: 'Sura Name',
      cell: ({ row }) => <Typography>{row.original.sura_name}</Typography>
    }),
    columnHelper.accessor('sura_number', {
      header: 'Sura Number',
      cell: ({ row }) => <Chip label={row.original.sura_number} color='primary' />
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: ({ row }) => {
        const dur = row.original.duration
        return <Typography>{dur > 60 ? `${Math.floor(dur / 60)}m ${dur % 60}s` : `${dur}s`}</Typography>
      }
    }),
    columnHelper.accessor('audio', {
      header: 'Play',
      cell: ({ row }) => (
        <IconButton onClick={() => { setSelectedAudio(row.original.audio); setOpenMusicPlayer(true) }}>
          <i className='tabler-microphone' />
        </IconButton>
      )
    }),
    columnHelper.accessor('action', {
      header: 'Actions',
      size: 120,
      cell: ({ row }) => (
        <Stack direction='row' spacing={0.5}>
          {hasPermission('spiritual_islam_reciter_list:edit') && (
            <IconButton color='primary' onClick={() => { setEditValue(row.original); setOpen(true) }}>
              <i className='tabler-edit' />
            </IconButton>
          )}
          {hasPermission('spiritual_islam_reciter_list:delete') && (
            <IconButton color='error' onClick={() => handleDelete(row.original._id)}>
              <i className='tabler-trash' />
            </IconButton>
          )}
        </Stack>
      ),
      enableSorting: false
    })
  ], [hasPermission])

  const table = useReactTable({
    data,
    columns,
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
        <Typography variant='h4'>{reciterName} Manage Audio</Typography>
      </Grid>

      <Grid item xs={12}>
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
                placeholder='Search Audio...'
              />
              {hasPermission('spiritual_islam_reciter_list:add') && (
                <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
                  Add Audio
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
                            sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up' />,
                              desc: <i className='tabler-chevron-down' />
                            }[header.column.getIsSorted()] ?? null}
                          </Stack>
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='audio-table-body'>
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
                            <Typography>No audio found.</Typography>
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
          />
        </Card>
      </Grid>

      <IslamAudioModal
        loading={loading}
        open={open}
        data={editValue}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
        handleClose={() => {setOpen(false) ; setEditValue(null)}}
        title={'Audio'}
      />

      <ModalMusicPlayer open={openMusicPlayer} setOpen={setOpenMusicPlayer} audioUrl={selectedAudio} />
    </Grid>
  )
}

export default QuranAudio
