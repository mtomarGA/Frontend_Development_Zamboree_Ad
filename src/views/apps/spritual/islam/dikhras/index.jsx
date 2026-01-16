'use client'

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
import {
    DragDropContext,
    Droppable,
    Draggable
} from '@hello-pangea/dnd'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Grid } from '@mui/system'

import { useAuth } from '@/contexts/AuthContext'
import { Chip, Tooltip } from '@mui/material'
import DikhrasService from '@/services/spritual/dikhrasService'
import IslamDikhrasModal from '@/components/dialogs/islam-dikhras'
import ModalMusicPlayer from '@/components/dialogs/audio-player'

// Fuzzy filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

// Debounced Input
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

const DikhrasList = () => {
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [editValue, setEditValue] = useState(null)
    const [data, setData] = useState([])
    const { hasPermission } = useAuth()
    const [openMusicPlayer, setOpenMusicPlayer] = useState(false)
    const [selectedAudio, setSelectedAudio] = useState('')
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await DikhrasService.getAll()
            setData(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
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
            await DikhrasService.create(values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error adding dikhras:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async values => {
        try {
            setLoading(true)
            await DikhrasService.update(editValue._id, values)
            fetchData()
            setOpen(false)
        } catch (error) {
            console.error('Error updating dikhras:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async id => {
        try {
            setLoading(true)
            await DikhrasService.delete(id)
            fetchData()
        } catch (error) {
            console.error('Error deleting dikhras:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle drag and drop reorder
    const handleDragEnd = async result => {
        if (!result.destination) return

        const oldIndex = result.source.index
        const newIndex = result.destination.index
        if (oldIndex === newIndex) return

        const updatedOrder = [...data]
        const [movedItem] = updatedOrder.splice(oldIndex, 1)
        updatedOrder.splice(newIndex, 0, movedItem)

        // Reassign sorting_no
        updatedOrder.forEach((item, index) => {
            item.sorting_no = index + 1
        })

        setData(updatedOrder)

        // Persist reorder in backend
        try {
            await DikhrasService.updateOrder(updatedOrder)
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'drag',
                header: '',
                enableSorting: false,
                cell: ({ row }) => (
                    <div {...row.getRowProps?.()} {...row?.dragHandleProps}>
                        <Tooltip title='Drag to reorder'>
                            <i className='tabler-grip-vertical cursor-grab' />
                        </Tooltip>
                    </div>
                )
            }),
            columnHelper.accessor('sorting_no', {
                header: 'Sorting Number',
                cell: ({ row }) => <Chip label={row.original.sorting_no} />
            }),
            columnHelper.accessor('dikhr_name_english', {
                header: 'Name (English)',
                cell: ({ row }) => <Typography variant='body2'>{row.original.dikhr_name_english}</Typography>
            }),
            columnHelper.accessor('audio_url', {
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
                        {hasPermission('spiritual_islam_dikhras:edit') && (
                            <button
                                onClick={() => {
                                    setEditValue(row.original)
                                    setOpen(true)
                                }}
                                className='text-blue-600 tabler-edit text-xl cursor-pointer'
                            ></button>
                        )}
                        {hasPermission('spiritual_islam_dikhras:delete') && (
                            <button
                                onClick={() => handleDelete(row.original._id)}
                                className='text-red-500 tabler-trash text-xl cursor-pointer'
                            ></button>
                        )}
                    </div>
                ),
                enableSorting: false
            })
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 9 } },
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
                        Manage Dikhras
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
                                    placeholder='Search Dikhras...'
                                    className='max-sm:is-full'
                                />
                                {hasPermission('spiritual_islam_dikhras:add') && (
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setOpen(true)
                                            setEditValue(null)
                                        }}
                                    >
                                        Add Dikhras
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                        <div className='overflow-x-auto'>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId='dikhras'>
                                    {provided => (
                                        <table
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={tableStyles.table}
                                        >
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
                                                                            asc: <i className='tabler-chevron-up text-sm' />,
                                                                            desc: <i className='tabler-chevron-down text-sm' />
                                                                        }[header.column.getIsSorted()] ?? null}
                                                                    </div>
                                                                )}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>

                                            <tbody>
                                                {table
                                                    .getRowModel()
                                                    .rows.map((row, index) => (
                                                        <Draggable
                                                            key={row.original._id}
                                                            draggableId={row.original._id}
                                                            index={index}
                                                        >
                                                            {provided => (
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={classnames({ selected: row.getIsSelected() })}
                                                                >
                                                                    {row.getVisibleCells().map(cell => (
                                                                        <td key={cell.id}>
                                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            )}
                                                        </Draggable>
                                                    ))}
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
                            onPageChange={(_, page) => {
                                table.setPageIndex(page)
                            }}
                        />
                    </Card>
                )}
                <IslamDikhrasModal
                    open={open}
                    data={editValue}
                    handleUpdate={handleUpdate}
                    handleAdd={handleAdd}
                    handleClose={() => setOpen(false)}
                    title={'Dikhras'}
                />
                <ModalMusicPlayer open={openMusicPlayer} setOpen={setOpenMusicPlayer} audioUrl={selectedAudio} />
            </Grid>
        </Grid>
    )
}

export default DikhrasList
