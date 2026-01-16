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
    IconButton,
    Tooltip,
    Chip,
    Stack,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    styled
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
import AllahNameService from '@/services/spritual/allahName'
import AllahNameModal from '@/components/dialogs/islam-allah-name'
import IslamAllahViewModal from '@/components/dialogs/islam-allah-name/viewModal'

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

const AllahNameList = () => {
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [editValue, setEditValue] = useState(null)
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { hasPermission } = useAuth()

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await AllahNameService.getAll()
            setData(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching Allah names:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // CRUD Handlers
    const handleAdd = async values => {
        try {
            setLoading(true)
            await AllahNameService.create(values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error adding Allah Name:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async values => {
        try {
            setLoading(true)
            await AllahNameService.update(editValue._id, values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error updating Allah Name:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async id => {
        try {
            setLoading(true)
            await AllahNameService.delete(id)
            fetchData()
        } catch (error) {
            console.error('Error deleting Allah Name:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = useCallback(row => {
        setEditValue(row)
        setOpen(true)
    }, [])

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
            await AllahNameService.updateOrder(orderPayload)
        } catch (err) {
            console.error('Reordering failed', err)
            fetchData() // revert if backend fails
        }
    }

    // Columns
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
            columnHelper.accessor('sorting_no', {
                header: 'Sort No',
                size: 80,
                cell: ({ row }) => <Chip label={row.original.sorting_no} size='small' />
            }),
            columnHelper.accessor('name_english', {
                header: 'English Name',
                cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
            }),
            columnHelper.accessor('name_arabic', {
                header: 'Arabic Name',
                cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
            }),
            columnHelper.accessor('action', {
                header: 'Actions',
                size: 150,
                cell: ({ row }) => (
                    <Stack direction='row' spacing={0.5}>
                        <Tooltip title='View'>
                            <IconButton size='small' color='secondary' onClick={() => { setEditValue(row.original); setViewOpen(true) }}>
                                <i className='tabler-eye' />
                            </IconButton>
                        </Tooltip>
                        {hasPermission('spiritual_islam_allah_name:edit') && (
                            <Tooltip title='Edit'>
                                <IconButton size='small' color='primary' onClick={() => handleEdit(row.original)}>
                                    <i className='tabler-edit' />
                                </IconButton>
                            </Tooltip>
                        )}
                        {hasPermission('spiritual_islam_allah_name:delete') && (
                            <Tooltip title='Delete'>
                                <IconButton size='small' color='error' onClick={() => handleDelete(row.original._id)}>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                ),
                enableSorting: false
            })
        ],
        [handleEdit, handleDelete, hasPermission]
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
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
                    <Typography variant='h4'>Manage Allah Names</Typography>
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
                                placeholder='Search Allah Names...'
                                className='max-sm:is-full'
                            />
                            {hasPermission('spiritual_islam_allah_name:add') && (
                                <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setOpen(true)}>
                                    Add Allah Name
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

            <AllahNameModal
                open={open}
                data={editValue}
                handleUpdate={handleUpdate}
                handleAdd={handleAdd}
                handleClose={() => setOpen(false)}
                title={'Allah Name'}
            />
            <IslamAllahViewModal open={viewOpen} data={editValue} setOpen={() => setViewOpen(false)} />
        </Grid>
    )
}

export default AllahNameList
