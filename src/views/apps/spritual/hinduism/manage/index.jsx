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
// import EmployeeService from '../../../../services/employee/EmployeeService'
import EmployeeService from '@/services/employee/EmployeeService'
import EmployeeDataModal from '@/components/dialogs/employee-data'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
import { useTempleContext } from '@/contexts/TempleFormContext'
import HinduService from '@/services/spritual/hinduService'
import { useRouter } from 'next/navigation'
import TempleDataModal from '@/components/dialogs/temple-data'
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

const HinduismManage = ({ handleAddEmployee }) => {
  // States
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState({})
  const [data, setData] = useState(null)
  const { handleLoadData, deleteEmployee, resetForm } = useTempleContext()
  const router = useRouter();
  const { hasPermission } = useAuth()


  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await HinduService.getAllTemple()
      console.log('temple data' + response.data);

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

  const handleDelete = async (id) => {
    try {
      await HinduService.deleteTemple(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting temple:', error)
    }
  }


  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('employee_id', {
        header: 'Temple ID',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.temple_id}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Temple Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.name}</Typography>
      }),

      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.location?.state?.name.toString() || 'N/A'}</Typography>
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.location?.city?.name.toString() || 'N/A'}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Typography color='text.primary'>{row.original?.status || 'N/A'}</Typography>
      }),
      columnHelper.accessor('createdAt', {
        header: 'Added Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Kolkata',
              hour12: true,
            }) : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.updatedAt ? new Date(row.original.updatedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Kolkata',
              hour12: true,
            }) : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('updatedBy', {
        header: 'Updated By',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.updatedBy?.userType === "ADMIN" ? 'ADMIN' : row.original.updatedBy?.userId?.employee_id || "N/A"}</Typography>
      }),
      columnHelper.accessor('createdBy', {
        header: 'Created By',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.createdBy?.userType === "ADMIN" ? 'ADMIN' : row.original.createdBy?.userId?.employee_id || "N/A"}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => {
                setEditValue(row.original)
                setOpen(true)
              }}
              className='tabler-eye text-xl cursor-pointer'
            ><></></button>
            {hasPermission('spiritual_hinduism_manage_temple:edit') && <button
              onClick={() => {
                resetForm()
                // handleLoadData(row.original)
                router.push(`/en/apps/spritual/hinduism/manage/${row.original._id}`)
                // handleAddEmployee()
              }}
              className='tabler-edit text-xl cursor-pointer'
            ></button>}
            {hasPermission('spiritual_hinduism_manage_temple:delete') && <button
              onClick={() => { handleDelete(row.original._id) }}
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
            Manage Temple
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
                  placeholder='Search Temple...'
                  className='max-sm:is-full'
                />
                {hasPermission('spiritual_hinduism_manage_temple:add') && <Button variant='contained' onClick={() => router.push(`/en/apps/spritual/hinduism/manage/create`)}>
                  Add Temple
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
        <TempleDataModal templeDetails={editValue} open={open} setOpen={setOpen} />
      </Grid>
    </Grid>
  )
}

export default HinduismManage;
