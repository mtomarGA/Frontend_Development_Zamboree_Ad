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
    Chip,
    Grid,
    CircularProgress,
    Box,
    IconButton,
    Tooltip,
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
    getPaginationRowModel,
    getSortedRowModel
} from '@tanstack/react-table'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// Components & Services
import CustomTextField from '@core/components/mui/TextField'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import QuranChapterModal from '@/components/dialogs/islam-quran-chapter'
import { QuranChapterService } from '@/services/spritual/islamQuranChapterService'

import TablePaginationComponent from '@/components/TablePaginationComponent'

// Styled Components for a polished look
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '12px 16px',
    borderColor: theme.palette.divider
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
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

const QuranChapter = () => {
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [open, setOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [editValue, setEditValue] = useState(null)
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const router = useRouter()
    const { hasPermission } = useAuth()

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await QuranChapterService.getAll()

            setData(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching data:', error)
            
            setData([])
        } finally {
            setLoading(false)
        }
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

    const handleAdd = async (values) => {
        try {
            setLoading(true)
            await QuranChapterService.create(values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error adding reciter:', error)
        } finally {
            setLoading(false)
        }
    };

    const handleUpdate = async (values) => {
        try {
            setLoading(true)
            await QuranChapterService.update(editValue._id, values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error updating reciter:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            await QuranChapterService.delete(id)
            fetchData()
        } catch (error) {
            console.error('Error deleting reciter:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = useCallback(row => {
        setEditValue(row)
        setOpen(true)
    }, [])


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
            columnHelper.accessor('arabic_chapter_name', {
                header: 'Arabic Name',
                cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
            }),
            columnHelper.accessor('english_chapter_name', {
                header: 'English Name',
                cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
            }),
            columnHelper.accessor('chapter_name_meaning', {
                header: 'Meaning',
                cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
            }),
            columnHelper.accessor('action', {
                header: 'Actions',
                size: 150,
                cell: ({ row }) => (
                    <Stack direction='row' spacing={0.5}>
                        <Tooltip title='Listen'>
                            <IconButton size='small' onClick={() => router.push(`quran-chapter/${row.original._id}`)}>
                                <i className='tabler-headphones' />
                            </IconButton>
                        </Tooltip>
                        {hasPermission('spiritual_islam_quran_chapters:edit') && (
                            <Tooltip title='Edit'>
                                <IconButton size='small' color='primary' onClick={() => handleEdit(row.original)}>
                                    <i className='tabler-edit' />
                                </IconButton>
                            </Tooltip>
                        )}
                        {hasPermission('spiritual_islam_quran_chapters:delete') && (
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
        [handleEdit, handleDelete, hasPermission, router]
    )

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter
    })

    const handleModalClose = () => {
        setOpen(false)
        setEditValue(null)
    }

    const handleFormSubmit = async values => {
        setIsSubmitting(true)
        const action = editValue ? 'update' : 'create'

        try {
            if (editValue) {
                await QuranChapterService.update(editValue._id, values)
            } else {
                await QuranChapterService.create(values)
            }
            fetchData()
            handleModalClose()
        } catch (err) {
            console.error('Form submission failed', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDragEnd = async result => {
        if (!result.destination) return
        // i want to swap the sorting_no of the chapters based on the drag and drop and also adjust the order of remaining chapters
        const oldIndex = result.source.index
        const newIndex = result.destination.index
        if (oldIndex === newIndex) return

        console.log(result, 'Drag End Result');
        

        const updatedOrder = [...data]
        const [movedItem] = updatedOrder.splice(oldIndex, 1)
        updatedOrder.splice(newIndex, 0, movedItem)
        updatedOrder.forEach((item, index) => {
            item.sorting_no = index + 1
        })
        console.log('Updated Order:', updatedOrder);
        
        setData(updatedOrder)


        try {
            const orderPayload = updatedOrder.map(({ _id, sorting_no }) => ({ _id, sorting_no }))
            await QuranChapterService.updateOrder(updatedOrder)
        } catch (err) {
            console.error('Reordering failed', err)
            setData(data) // Revert on failure
        }
    }

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
                    <Typography variant='h4'>Manage Quran Chapters</Typography>

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
                                placeholder='Search Quran...'
                                className='max-sm:is-full'
                            />
                            {hasPermission('spiritual_islam_quran_chapters:add') && (
                                <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setOpen(true)}>
                                    Add Chapter
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
                                                        sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none' }}
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
                                <Droppable droppableId='quran-table-body'>
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
                                                                    backgroundColor: snapshot.isDragging
                                                                        ? 'action.selected'
                                                                        : 'inherit',
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
                                                        <Typography p={4}>No chapters found.</Typography>
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
                            table.setPageSize(Number(e.target.value));
                        }}
                    />
                </Card>
            </Grid>

            <QuranChapterModal
                open={open}
                data={editValue}
                isSubmitting={isSubmitting}
                handleFormSubmit={handleFormSubmit}
                handleClose={handleModalClose}
                handleAdd={handleAdd}
                handleUpdate={handleUpdate}
                key={editValue ? editValue._id : 'new-chapter'}
                title={' Chapter'}
            />
        </Grid>
    )
}

export default QuranChapter
