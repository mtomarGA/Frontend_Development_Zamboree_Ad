'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

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

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Grid } from '@mui/system'


import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Box, Chip, Stack, styled, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'

import ModalMusicPlayer from '@/components/dialogs/audio-player'
import { QuranVerseService } from '@/services/spritual/islamQuranChapterService'
import IslamQuranVerseModal from '@/components/dialogs/islam-quran-verse'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

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

// Column Definitions
const columnHelper = createColumnHelper()

const QuranVerses = () => {
    // States
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [editValue, setEditValue] = useState(null)
    const [data, setData] = useState(null)
    const router = useRouter();
    const { hasPermission } = useAuth()
    const [reciterName, setReciterName] = useState('')
    const [openMusicPlayer, setOpenMusicPlayer] = useState(false)
    const [selectedAudio, setSelectedAudio] = useState('')



    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await QuranVerseService.getAll(id)
            console.log('Fetched data:', response.data);
            setData(response.data)
            setReciterName(response.data[0]?.chapter_id.english_chapter_name || 'Unknown Chapter')
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (values) => {
        console.log('Adding reciter with values:', values);

        try {
            setLoading(true)
            await QuranVerseService.create(values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error adding reciter:', error)
        } finally {
            setLoading(false)
        }
    }
    const handleUpdate = async (values) => {
        try {
            setLoading(true)
            await QuranVerseService.update(editValue._id, values)
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
            await QuranVerseService.delete(id)
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


    const [globalFilter, setGlobalFilter] = useState('')

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
                header: 'Sorting Number',
                cell: ({ row }) => <Chip
                    label={row.original.sorting_no}
                    color={colors[row.original.sorting_no] || 'default'}
                    variant='outlined'
                    className='capitalize'
                />
            }),
            columnHelper.accessor('english_verse', {
                header: 'English Verse',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.english_verse}</Typography>
            }),
            columnHelper.accessor('arabic_verse', {
                header: 'Arabic Verse',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.arabic_verse}</Typography>
            }),
            columnHelper.accessor('verses_meaning', {
                header: 'Verse Meaning',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.verses_meaning}</Typography>
            }),
            columnHelper.accessor('duration', {
                header: 'Duration',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.duration > 60 ? `${Math.floor(row.original.duration / 60)} minute ${row.original.duration % 60} seconds` : `${row.original.duration} seconds`}</Typography>
            }),
            columnHelper.accessor('audio', {
                header: 'Play Audio',
                cell: ({ row }) => (
                    <button
                        onClick={() => {
                            setSelectedAudio(row.original.audio_url)
                            setOpenMusicPlayer(true)
                        }}
                        className='tabler-microphone'
                    />
                )

            }),
            columnHelper.accessor('action', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        {/* <button onClick={() => router.push(`reciter/${row.original._id}`)} className='tabler-headphones text-xl cursor-pointer'></button> */}
                        {hasPermission('spiritual_islam_quran_chapters:edit') && <button onClick={() => {
                            setEditValue(row.original)
                            setOpen(true)
                        }}

                            className='text-blue-600  tabler-edit text-xl cursor-pointer'
                        ></button>}
                        {hasPermission('spiritual_islam_quran_chapters:delete') && <button
                            onClick={() => handleDelete(row.original._id)}
                            className='text-red-500 tabler-trash text-xl cursor-pointer'
                        ></button>}
                    </div>
                ),
                enableSorting: false
            })
        ],
        []
    )

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
            await QuranVerseService.updateOrder(updatedOrder)
        } catch (err) {
            console.error('Reordering failed', err)
            setData(data) // Revert on failure
        }
    }

    const table = useReactTable({
        data: data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            rowSelection,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 9
            }
        },
        enableRowSelection: true,
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
        <Grid className='' container>
            <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                <div>
                    <Typography variant='h4' className='mbe-1'>
                        Manage Verses {reciterName}
                    </Typography>
                </div>
            </div>
            <Grid className='w-full' item xs={12}>
                {loading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Typography variant='h6'>Loading...</Typography>
                    </div>
                ) : (
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
                                    placeholder='Search Verses...'
                                    className='max-sm:is-full'
                                />
                                {hasPermission('spiritual_islam_quran_chapters:add') && <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
                                    Add Verse
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
                            onPageChange={(_, page) => {
                                table.setPageIndex(page)
                            }}
                        />
                    </Card>
                )}
                <IslamQuranVerseModal loading={loading} open={open} data={editValue ? editValue : null} handleUpdate={handleUpdate} handleAdd={handleAdd} handleClose={() => setOpen(false)} title={'Verse'} />
                <ModalMusicPlayer
                    open={openMusicPlayer}
                    setOpen={setOpenMusicPlayer}
                    audioUrl={selectedAudio}
                />

            </Grid>
        </Grid>
    )
}

export default QuranVerses;


