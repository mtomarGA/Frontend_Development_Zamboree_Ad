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
import { Chip } from '@mui/material'
import BranchService from '@/services/employee/Master/BranchService'
import EmployeeMasterModal from '@/components/dialogs/employee-master'
import RoleService from '@/services/role/roleService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'


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

// Column Definitions
const columnHelper = createColumnHelper()

const PermissionView = ({ setviewAddRole }) => {
    // States
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [editValue, setEditValue] = useState('')
    const [data, setData] = useState([])
    const route = useRouter()
    const { isLoading, hasPermission } = useAuth()

    const handleUpdate = async data => {
        setLoading(true)
        setEditValue('')
        setOpen(false)
        await BranchService.update(data._id, data)
        fetchData()
        setLoading(false)
    }

    const handleAdd = async data => {
        setLoading(true)
        setEditValue('')
        // await BugService.createBugCategory(data)
        await BranchService.create(data)
        console.log('Add Category:', data)
        setOpen(false)
        setEditValue('')
        fetchData()
        setLoading(false)
    }

    const handleDelete = async id => {
        setLoading(true)
        await RoleService.delete(id)
        fetchData()
        setLoading(false)
    }
    const handleClose = () => {
        setOpen(false)
        setEditValue('')
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await RoleService.get()
            console.log(response)
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

    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.name}</Typography>
            }),
            columnHelper.accessor('permissions', {
                header: 'Module Access',
                cell: ({ row }) => {
                    const perms = row.original.permissions ? Object.keys(row.original.permissions) : []
                    const [expanded, setExpanded] = useState(false)
                    const limit = 10
                    const visible = expanded ? perms : perms.slice(0, limit)

                    return (
                        <div>
                            <div className='flex flex-wrap gap-1'>
                                {visible.map((perm, index) => (
                                    <Chip key={index} label={perm} size='small' variant='outlined' />
                                ))}
                            </div>
                            {perms.length > limit && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className='text-sm text-primary underline bg-transparent mt-1'
                                    type='button'
                                >
                                    {expanded ? 'Show less' : `+${perms.length - limit} more`}
                                </button>
                            )}
                        </div>
                    )
                }
            }),
            columnHelper.accessor('action', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        {hasPermission('role:edit') && <button
                            onClick={() => {
                                route.push(`/en/apps/role/${row.original._id}`)
                            }}
                            className='text-blue-600  tabler-edit text-xl cursor-pointer'
                        ></button>}
                       {hasPermission('roles:delete') && <button
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
                        Role Management
                    </Typography>
                </div>
            </div>
            <Grid className='w-full' item xs={12}>
                {loading || isLoading ? (
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
                                    placeholder='Search Role...'
                                    className='max-sm:is-full'
                                />
                                {hasPermission('role:add') && <Button variant='contained' onClick={() => setviewAddRole(true)}>
                                    Add Role
                                </Button>}
                            </div>
                        </CardContent>
                        <div className='overflow-x-auto'>
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
                                {table.getFilteredRowModel().rows.length === 0 ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                                No data available
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {table
                                            .getRowModel()
                                            .rows.slice(0, table.getState().pagination.pageSize)
                                            .map(row => (
                                                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                                    {row.getVisibleCells().map(cell => (
                                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                    </tbody>
                                )}
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
                )}
            </Grid>
        </Grid>
    )
}

export default PermissionView;
