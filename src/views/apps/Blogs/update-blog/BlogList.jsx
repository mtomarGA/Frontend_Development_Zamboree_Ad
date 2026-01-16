'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'


// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'


// Api Calls

import blogService from '@/services/blog/blogservice'
import blogTagService from '@/services/blog/blogTagService'

import { Button } from '@mui/material'

// Column Definitions
const columnHelper = createColumnHelper()

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

// Debounced input for global search
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

const productStatusObj = {
    ACTIVE: { title: 'ACTIVE', color: 'success' },
    INACTIVE: { title: 'INACTIVE', color: 'warning' }

}

const BlogList = () => {
    const router = useRouter()

    useEffect(() => {
        blogList()
    }, [])

    const [globalFilter, setGlobalFilter] = useState('')
    const [data, setData] = useState([])
    const [updateList, SetUpdateList] = useState([])

    const blogList = async () => {
        const res = await blogService.getBlog()
        setData(res.data)
    }

    const handleDelete = async id => {
        const res = await blogService.deleteBlog(id)
        blogList()
    }

    const handleEdit = async id => {
        router.push(`/en/apps/blogs/update-blog/${id}`)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('_id', {
                cell: info => info.getValue(),
                header: 'Blog ID'
            }),
            columnHelper.accessor('authorName', {
                cell: info => info.getValue(),
                header: 'Author Name'
            }),
            columnHelper.accessor('blogTitle', {
                cell: info => info.getValue(),
                header: 'Blog Title'
            }),
            columnHelper.accessor('category.name', {
                cell: info => info.getValue(),
                header: 'Catergory'
            }),

            // new Colum start here
            columnHelper.accessor('tags', {
                cell: info => info.getValue(),
                header: 'Tags'
            }),
            columnHelper.accessor('description', {
                cell: info => info.getValue(),
                header: 'Description'
            }),
            columnHelper.accessor('blogKeywords', {
                cell: info => info.getValue(),
                header: 'BlogKeywords'
            }),
            columnHelper.accessor('metaDescription', {
                cell: info => info.getValue(),
                header: 'metaDescription'
            }),
            columnHelper.accessor('metaTitle', {
                cell: info => info.getValue(),
                header: 'Meta Title'
            }),
            columnHelper.accessor('seoKeywords', {
                cell: info => info.getValue(),
                header: 'Seo Keywords'
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusData = productStatusObj[status]

                    return statusData ? (
                        <Chip label={statusData.title} variant='tonal' color={statusData.color} size='small' />
                    ) : (
                        <Chip label='Unknown' variant='outlined' color='default' size='small' />
                    )
                }
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center'>
                        <Button size='small' onClick={() => handleEdit(row.original._id)}>
                            <i className='tabler-edit' />
                        </Button>
                        <Button size='small' color='error' onClick={() => handleDelete(row.original._id)}>
                            <i className='tabler-trash' />
                        </Button>
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
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    return (
        <Card>
            <CardHeader
                title='Blog List'
                action={
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search all columns...'
                    />
                }
            />
            <div className='overflow-x-auto'>
                <table className={styles.table}>
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
                                                    asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                                    desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
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
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
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
    )
}

export default BlogList
