'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardHeader, Chip, TablePagination, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
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
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import blogService from '@/services/blog/blogservice'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../../deleteConfirmation'

const columnHelper = createColumnHelper()

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

const productStatusObj = {
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  INACTIVE: { title: 'INACTIVE', color: 'error' },
  PENDING: { title: 'PENDING', color: 'warning' }
}

const BlogList = () => {
  const router = useRouter()
  const { hasPermission } = useAuth()

  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])

  const blogList = async () => {
    try {
      const res = await blogService.getBlog()
      const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setData(sortedData)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    }
  }

  useEffect(() => {
    blogList()
  }, [])

  const handleDelete = async id => {
    try {
      const res = await blogService.deleteBlog(id)
      toast.success(res.message || 'Blog deleted successfully')
      blogList()
    } catch (error) {
      toast.error('Failed to delete blog')
    }
  }

  const handleEdit = id => {
    router.push(`/en/apps/blogs/update-blog/${id}`)
  }

  const handleAdd = () => {
    router.push(`/en/apps/blogs/add-blog`)
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: 'BLOG ID',
        cell: ({ table, row }) => {
          const pageIndex = table.getState().pagination.pageIndex
          const pageSize = table.getState().pagination.pageSize
          const rowsInPage = table.getRowModel().rows
          const currentRowIndex = rowsInPage.findIndex(r => r.id === row.id)
          const displayIndex = pageIndex * pageSize + currentRowIndex + 1
          return (
            <Typography className='font-medium' color='text.primary'>
              {displayIndex}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('authorName', { header: 'AUTHOR NAME', cell: info => info.getValue() }),
      columnHelper.accessor('blogTitle', { header: 'BLOG TITLE', cell: info => info.getValue() }),
      columnHelper.accessor('createdAt', {
        header: 'CREATED DATE',
        cell: info =>
          new Date(info.getValue()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      }),
      columnHelper.accessor('createdBy', {
        header: 'CREATED BY',
        cell: info => `${info.getValue()?.firstName || ''} ${info.getValue()?.lastName || ''}`
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => {
          const status = row.original.status
          const statusData = productStatusObj[status]
          return statusData ? (
            <Chip label={statusData.title} variant='tonal' color={statusData.color} size='small' />
          ) : (
            <Chip label='UNKNOWN' variant='outlined' color='default' size='small' />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'ACTIONS',
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            {hasPermission('blog_all_blogs:edit') && (
              <Button
                size='small'
                onClick={row.original.status !== 'ACTIVE' ? () => handleEdit(row.original._id) : undefined}
                disabled={row.original.status === 'ACTIVE'}
              >
                <i className='tabler-edit' />
              </Button>
            )}

            {hasPermission('blog_all_blogs:delete') && (
              <DeleteConfirmationDialog
                itemName='Blog Post'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </Box>
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { sorting: [{ id: 'createdAt', desc: true }] }
  })

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h4'>Blog List</Typography>}
        action={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'stretch', sm: 'flex-end' }
            }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                maxWidth: { xs: '100%', sm: 300 }
              }}
            />
            {hasPermission('blog_all_blogs:add') && (
              <Button
                variant='contained'
                size='medium'
                onClick={handleAdd}
                sx={{ color: 'white', width: { xs: '100%', sm: 'auto' } }}
              >
                Add Blog
              </Button>
            )}
          </Box>
        }
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          '& .MuiCardHeader-action': {
            alignSelf: { xs: 'stretch', sm: 'center' },
            mt: { xs: 2, sm: 0 },
            ml: { xs: 0, sm: 'auto' }
          }
        }}
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
                        {header.column.getIsSorted() === 'asc' && <ChevronRight className='-rotate-90' />}
                        {header.column.getIsSorted() === 'desc' && <ChevronRight className='rotate-90' />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getFilteredRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </Card>
  )
}

export default BlogList
