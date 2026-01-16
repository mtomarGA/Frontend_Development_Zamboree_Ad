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
import FollowUpService from '@/services/follow-up/followupService'
import FollowUpCallService from '@/services/follow-up/followupCallService'
import { Box, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

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
  alert(`Fuzzy filter called for column`);
  console.log(`Fuzzy filter called for column: ${columnId} with value: ${value}`);

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

const FollowUpScheduledCalls = () => {
  // States
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const router = useRouter();
  const { hasPermission } = useAuth()
  const { id } = useParams()
  const [all_counts, setAllCounts] = useState([
    { label: 'scheduled', count: 0 },
    { label: 'overdue', count: 0 },
    { label: 'today', count: 0 },
    { label: 'tomorrow', count: 0 },
    { label: 'next_7_days', count: 0 }
  ]);

  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 9,
    type: 'scheduled',
    employeeid: id ? id : null,
    search: ''
  });
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (from_date, to_date) => {
    
    try {
      setLoading(true);
      const { page_no, page_size, type, employeeid } = pagination;
      const response = await FollowUpCallService.getAll({ page_no, page_size, type, employeeid, from_date, to_date });
      setData(response.data.list);
      setTotalCount(response.data.list.length);

      setAllCounts(prevCounts =>
        prevCounts.map(item =>
          item.label === 'scheduled' ? { ...item, count: response.data.scheduled || 0 } :
          item.label === 'overdue' ? { ...item, count: response.data.overdue || 0 } :
          item.label === 'today' ? { ...item, count: response.data.today || 0 } :
          item.label === 'tomorrow' ? { ...item, count: response.data.tomorrow || 0 } :
          item.label === 'next_7_days' ? { ...item, count: response.data.next_7_days || 0 } :
          item
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);


  const [globalFilter, setGlobalFilter] = useState('')
  const [dateRange, setDateRange] = useState({
    from_date: '',
    to_date: ''
  });

  const actionMenuItems = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('employee_id', {
        header: 'Employee ID',
        cell: ({ row }) => <Typography color='text.primary'>{(row.original.employee_id == null ? row.original.createdBy.userType : row.original.employee_id.employee_id) || 'N/A'}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Business Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.business_id.companyInfo.companyName || 'N/A'}</Typography>
      }),
      columnHelper.accessor('Last Visit', {
        header: 'Last Visit',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.parent_meeting_id?.last_call_date ? new Date(row.original.parent_meeting_id?.last_call_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) : 'N/A'}</Typography>
      }),
      columnHelper.accessor('Next Follow Up Date', {
        header: 'Next Visit',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.parent_meeting_id?.next_call_date ? new Date(row.original.parent_meeting_id?.next_call_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) : 'N/A'}</Typography>
      }),
      columnHelper.accessor('Follow Label', {
        header: 'Follow Up Label',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.parent_meeting_id?.last_call_label?.replace(/_/g, ' ').charAt(0).toUpperCase() + row.original.parent_meeting_id?.last_call_label?.replace(/_/g, ' ').slice(1) || 'N/A'}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            {hasPermission('follow_up_call:edit') && (
              <button
                className='text-primary bg-transparent cursor-pointer'
                onClick={() => { router.push(`/en/apps/followup/scheduled-calls/edit/${row.original._id}`) }}
              >
                <i className='tabler-edit' />
              </button>
            )}
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
        pageSize: pagination.page_size
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
            Follow Up Calls
          </Typography>
        </div>
      </div>
      {/* create a 4 box design square in which i write count of follow up calls like overdue , today , tomorrow , next 7 days make equal height and width */}
      <Box className="w-full flex justify-center px-4">
        <Grid container className="justify-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 p-5">
          {all_counts.map((item, i) => (
              <Card
                key={i}
                onClick={() => {setPagination({ ...pagination, type: item.label, page_no: 1 })}}
                className="aspect-square flex flex-col items-center justify-center p-4 w-full cursor-pointer"
              >
                <Typography variant="h6" className="mb-2">{item.label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Typography>
                <Typography variant="h4" className="text-primary">{item.count}</Typography>
              </Card>
            ))}
        </Grid>
      </Box>

      <Grid className='w-full' item xs={12}>

          <Card>
            <CardContent className='flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between flex-wrap'>
              <div className='flex items-center gap-2'>
                <Typography>Show</Typography>
                <CustomTextField
                  select
                  value={pagination.page_size}
                  onChange={e => setPagination({ ...pagination, page_size: Number(e.target.value) })}
                  className='is-[70px]'
                >
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='7'>7</MenuItem>
                  <MenuItem value='9'>9</MenuItem>
                </CustomTextField>
                <Typography>Date Range</Typography>
                <CustomTextField
                  type='date'
                  value={dateRange.from_date || ''}
                  onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })}
                  className='is-[150px]'
                />
                <Typography>to</Typography>
                <CustomTextField
                  type='date'
                  value={dateRange.to_date || ''}
                  onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })}
                  className='is-[150px]'
                />
                <Button variant='contained' onClick={() => fetchData(dateRange.from_date, dateRange.to_date)}>
                  Apply
                </Button>
              </div>
              <div className='flex flex-wrap gap-4'>
                <DebouncedInput
                  value={pagination.search ?? ''}
                  onChange={value => setPagination({ ...pagination, search: String(value) })}
                  placeholder='Search...'
                  className='max-sm:is-full'
                />
              </div>
            </CardContent>
            {loading ? <Box width={"100%"} marginY={20} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}><CircularProgress /></Box> : <div className='overflow-x-auto'>
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
            </div>}
            {/* <TablePagination
              component={() => <TablePaginationComponent table={table} />}
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, page) => {
                table.setPageIndex(page)
              }}
            /> */}
            <TablePagination
              component={() => <TablePaginationComponent table={table} />}
              count={totalCount}
              rowsPerPage={pagination.page_size}
              page={pagination.page_no - 1}
              onPageChange={(_, newPage) =>
                setPagination(prev => ({ ...prev, page_no: newPage + 1 }))
              }
              onRowsPerPageChange={e =>
                setPagination({ ...pagination, page_size: parseInt(e.target.value), page_no: 1 })
              }
            />
          </Card>

      </Grid>
    </Grid>
  )
}

export default FollowUpScheduledCalls;
