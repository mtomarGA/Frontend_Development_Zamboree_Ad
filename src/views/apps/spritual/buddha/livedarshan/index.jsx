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


import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Chip } from '@mui/material'

import BuddhaLiveDarshanService from '@/services/spritual/buddhaLiveDarshan'
import LiveDarshanModal from '@/components/dialogs/live-darshan'

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

const LiveDarshan = ({ handleAddEmployee }) => {
  // States
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [editValue, setEditValue] = useState(null)
  const [data, setData] = useState(null)
  const { hasPermission } = useAuth()


  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await BuddhaLiveDarshanService.getAll()
      console.log('festival data' + response.data);

      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (values) => {
    try {
      setLoading(true)
      await BuddhaLiveDarshanService.create(values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error adding festival:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleUpdate = async (values) => {
    try {
      setLoading(true)
      await BuddhaLiveDarshanService.update(editValue._id, values)
      fetchData()
      setOpen(false)
    } catch (error) {
      console.error('Error updating festival:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await BuddhaLiveDarshanService.delete(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting festival:', error)
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
      columnHelper.accessor('temple.name', {
        header: 'Temple',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.temple.name || "N/A"}</Typography>
      }),
      columnHelper.accessor('embeddedLink', {
        header: 'Embedded Link',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.embeddedLink ? row.original.embeddedLink : 'No Link Provided'}
          </Typography>
        )
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.title || "N/A"}</Typography>
      }),

      columnHelper.accessor('createdAt', {
        header: 'Added Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
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
              month: '2-digit',
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
        header: 'Added By',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.createdBy?.userType === "ADMIN" ? 'ADMIN' : row.original.createdBy?.userId?.employee_id || "N/A"}</Typography>
      }),
      columnHelper.accessor('Status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.status}
            color={colors[row.original.status] || 'default'}
            size='small'
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>

            {hasPermission('spiritual_buddhism_live_darshan:edit') && <button onClick={() => {
              setEditValue(row.original)
              setOpen(true)
            }}

              className='text-blue-600 tabler-edit text-xl cursor-pointer'
            ></button>}
            {hasPermission('spiritual_buddhism_live_darshan:delete') && <button onClick={() => handleDelete(row.original._id)}
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
            Manage Live Darshan
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
                  placeholder='Search Festival...'
                  className='max-sm:is-full'
                />
                {hasPermission('spiritual_buddhism_live_darshan:add') && <Button variant='contained' onClick={() => {setOpen(true); setEditValue(null)}}>
                  Add Live Darshan
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
        <LiveDarshanModal
          open={open}
          setOpen={setOpen}
          data={editValue}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
          handleClose={() => setOpen(false)}
          title='Live Darshan'
          folderName="Spiritual/Buddhism/LiveDarshan"
          serviceName="Buddhism"
        />
      </Grid>
    </Grid>
  )
}

export default LiveDarshan;
