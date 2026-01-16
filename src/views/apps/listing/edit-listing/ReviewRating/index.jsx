'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/navigation'

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

// Import Services

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from 'react-toastify'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
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

const ReviewRatingTable = () => {
  const router = useRouter()
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const statusObj = {
    INACTIVE: { title: 'INACTIVE', color: 'warning' },
    ACTIVE: { title: 'ACTIVE', color: 'success' }
  }

  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: 'User Id',
        cell: ({ table, row }) => {
          const pageIndex = table.getState().pagination.pageIndex
          const pageSize = table.getState().pagination.pageSize
          const rowsInPage = table.getRowModel().rows
          const currentRowIndex = rowsInPage.findIndex(r => r.id === row.id)
          const displayIndex = pageIndex * pageSize + currentRowIndex + 1

          return (
            <div className='flex items-center gap-3'>
              <Typography className='font-medium' color='text.primary'>
                {displayIndex}
              </Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' /> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {/* {row.original.name} */}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' /> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {/* {row.original.name} */}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('comment', {
        header: 'Comment',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' /> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {/* {row.original.name} */}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' /> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {/* {row.original.name} */}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created Date',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' /> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {/* {row.original.name} */}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton >
              <i className='tabler-eye' />
            </IconButton>
            <IconButton >
              <i className='tabler-edit' />
            </IconButton>
            <IconButton >
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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
    <>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            className='max-sm:is-full'
          />
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto max-sm:is-full sm:is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='15'>15</MenuItem>
              <MenuItem value='25'>25</MenuItem>
            </CustomTextField>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
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
                        </>
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
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
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
    </>
  )
}

export default ReviewRatingTable
