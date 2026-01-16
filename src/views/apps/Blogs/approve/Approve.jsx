'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next.js Router
import { useRouter } from 'next/navigation'

// MUI Imports
import { Box, Button, Card, CardHeader, Chip, Typography, Tabs, Tab } from '@mui/material'

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

// API & Context
import blogService from '@/services/blog/blogservice'
import { useAuth } from '@/contexts/AuthContext'

// Toast
import { toast } from 'react-toastify'
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
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const productStatusObj = {
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  INACTIVE: { title: 'INACTIVE', color: 'error' },
  PENDING: { title: 'PENDING', color: 'warning' }
}

const BlogApprove = () => {
  const router = useRouter()
  const { hasPermission } = useAuth()

  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [tabValue, setTabValue] = useState('ALL')

  const blogList = async () => {
    try {
      const res = await blogService.getBlog()
      const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setData(sortedData)
      setOriginalData(sortedData)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    }
  }

  useEffect(() => {
    blogList()
  }, [])

  const deleteBlog = async id => {
    try {
      await blogService.deleteBlog(id)
      toast.success('Blog deleted successfully')
      blogList()
    } catch (error) {
      console.error('Failed to delete blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  const handleReject = () => {
    setData(originalData.filter(item => item.status === 'INACTIVE'))
  }

  const handlePending = () => {
    setData(originalData.filter(item => item.status === 'PENDING'))
  }

  const handleActive = () => {
    setData(originalData.filter(item => item.status === 'ACTIVE'))
  }

  const handleEdit = id => {
    router.push(`/en/apps/blogs/update-approvel/${id}`)
  }

  const tabHandlers = {
    ALL: blogList,
    PENDING: handlePending,
    ACTIVE: handleActive,
    INACTIVE: handleReject
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    tabHandlers[newValue]?.()
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: 'Blog Id',
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
      columnHelper.accessor('authorName', {
        header: 'Author Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('blogTitle', {
        header: 'Blog Title',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('createdAt', {
        header: 'Approve Date',
        cell: info => {
          const date = new Date(info.getValue())
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        }
      }),
      columnHelper.accessor('createdBy', {
        header: 'Approved By',
        cell: info => {
          const createdBy = info.getValue()
          return `${createdBy.firstName} ${createdBy.lastName}`
        }
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
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center'>
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
                itemName='Blog Approve'
                onConfirm={() => deleteBlog(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
            {/* {hasPermission('blog_all_blogs:delete') && (
              <Button size='small' color='error' onClick={() => deleteBlog(row.original._id)}>
                <i className='tabler-trash' />
              </Button>
            )} */}
          </div>
        )
      })
    ],
    [hasPermission]
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
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }]
    }
  })

  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
            gap={2}
            width='100%'
            flexWrap='wrap'
          >
            <Typography variant='h4'>Approve Blog</Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                placeholder='Search blogs...'
                size='small'
                sx={{ width: { xs: '100%', sm: '300px' } }}
              />
              {hasPermission('blog_all_approve:search') && (
                <Button variant='contained' sx={{ color: 'white' }}>
                  Search
                </Button>
              )}
            </Box>
          </Box>
        }
      />

      <div className='overflow-x-auto'>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor='primary'
          indicatorColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='All' value='ALL' />
          <Tab label='Pending' value='PENDING' />
          <Tab label='Active' value='ACTIVE' />
          <Tab label='Inactive' value='INACTIVE' />
        </Tabs>

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

      <TablePaginationComponent table={table} />
    </Card>
  )
}

export default BlogApprove
