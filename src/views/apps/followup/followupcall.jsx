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
import FollowUpCallService from '@/services/follow-up/followupCallService'
import ScheduledCallsView from '@/components/dialogs/follow-up/schedulesCalls'
import { Box, CircularProgress } from '@mui/material'

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

const FollowUpCall = () => {
  // States
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState([])
  const router = useRouter();
  const { hasPermission } = useAuth()
  const { id } = useParams()
  const [scheduledCallOpen, setScheduledCallOpen] = useState(false)
  const [selectedCallId, setSelectedCallId] = useState(null)
  const handleScheduledCallClose = () => {
    setScheduledCallOpen(false)
    setSelectedCallId(null)
  }

  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 9,
    employeeid: id,
    search: ''
  });
  const [totalCount, setTotalCount] = useState(0); // <-- for total rows

  const fetchData = async () => {
    try {
      setLoading(true);
      const { page_no, page_size, employeeid , search} = pagination;
      const response = await FollowUpCallService.getAll({ page_no, page_size, employeeid, search });
      setData(response.data.list); // Assuming backend returns `{ data, total }`
      setTotalCount(response.data.list.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page_no, pagination.page_size, pagination.employeeid, pagination.search]);



  useEffect(() => {
    fetchData()
  }, [])


  const [globalFilter, setGlobalFilter] = useState('')

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
      columnHelper.accessor('Last Call', {
        header: 'Last Call',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.last_call_date ? new Date(row.original.last_call_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) : 'N/A'}</Typography>
      }),
      columnHelper.accessor('Next Follow Up Date', {
        header: 'Next Visit',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.next_call_date ? new Date(row.original.next_call_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) : 'N/A'}</Typography>
      }),
      columnHelper.accessor('Call Label', {
        header: 'Call Up Label',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.call_label.replace(/_/g, ' ').charAt(0).toUpperCase() + row.original.call_label.replace(/_/g, ' ').slice(1) || 'N/A'}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              variant='text'
              size='small'
              className='cursor-pointer text-primary bg-transparent'
              sx={{ margin: "0", padding: "0" }}
              onClick={() => {
                setSelectedCallId(row.original._id)
                setScheduledCallOpen(true)
              }}
            >
              <i className='tabler-eye' />
            </button>
            {/* {hasPermission('follow_up_call:edit') && (
              <button
                variant='text'
                size='small'
                className='cursor-pointer text-primary bg-transparent'
                onClick={() => {
                  setEditValue(row.original)
                  setOpen(true)
                }}
              >
                <i className='tabler-edit' />
              </button>
            )} */}
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
            Follow Up Calls
          </Typography>
        </div>
      </div>
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

              </div>
              <div className='flex flex-wrap gap-4'>
                <DebouncedInput
                  value={pagination.search ?? ''}
                  onChange={value => setPagination({ ...pagination, search: String(value) })}
                  placeholder='Search...'
                  className='max-sm:is-full'
                />
                {hasPermission('follow_up_call:add') && <Button variant='contained' onClick={() => { router.push('/en/apps/followup/create-call') }}>
                  Add Follow Up Call
                </Button>}
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
            <ScheduledCallsView open={scheduledCallOpen} id={selectedCallId} handleClose={handleScheduledCallClose} />
          </Card>

      </Grid>
    </Grid>
  )
}

export default FollowUpCall;
