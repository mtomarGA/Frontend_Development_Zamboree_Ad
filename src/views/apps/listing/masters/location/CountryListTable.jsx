'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

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


import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import countryService from '@/services/location/country.services'
import { useAuth } from '@/contexts/AuthContext'

import tableStyles from '@core/styles/table.module.css'
import AddCountry from '@/components/dialogs/add-country/add'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import AddCountryInfo from '@/components/dialogs/add-country/add'
import DeleteConfirmationDialog from '@/views/apps/deleteConfirmation'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })
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

const productStatusObj = {
  INACTIVE: { title: 'INACTIVE', color: 'warning' },
  ACTIVE: { title: 'ACTIVE', color: 'success' }
}

const columnHelper = createColumnHelper()

const CountryListTable = () => {

  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const { hasPermission } = useAuth()

  const handleDelete = async id => {
    const data = await countryService.deleteCountry(id)
    toast.success('Country Deleted Successfully')
    handleGet()
  }

  useEffect(() => {
    handleGet()
  }, [])

  const handleGet = async () => {
    const res = await countryService.getAllCountries()
    console.log(res, "res eeee");

    setData(res.data)
    setFilteredData(res.data)
  }

  const handleEditCountry = data => {
    setEditData(data)
    setOpen(true)
  }

  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => {
          const imageUrl = row.original.image

          return (
            <div className='flex items-center gap-4'>
              <img
                src={imageUrl}
                width={38}
                height={38}
                className='rounded bg-actionHover'
                alt='State Image'
              />
            </div>
          )
        }
      }),

      columnHelper.accessor('countryCode', {
        header: 'Country Code',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Typography color='text.primary'>{row.original.countryCode}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('totalStates', {
        header: 'Total States',
        cell: ({ row }) => <Typography>{row.original.stateCount}</Typography>
      }),
      columnHelper.accessor('totalCities', {
        header: 'Total Cities',
        cell: ({ row }) => <Typography>{row.original.cityCount}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('totalArea', {
        header: 'Total Area',
        cell: ({ row }) => <Typography>{row.original.areaCount}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={productStatusObj[row.original.status].title}
            variant='tonal'
            color={productStatusObj[row.original.status].color}
            size='small'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {hasPermission("partner_master:edit") &&
              <IconButton onClick={() => handleEditCountry(row.original)}>
                <i className='tabler-edit text-blue-500' />
              </IconButton>}
            {hasPermission("partner_master:delete") && (
              <DeleteConfirmationDialog
                itemName="country"
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-red-500' />}
              />
            )}
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const globalFilterByName = (row, columnId, value) => {
    if (!value) return true
    const nameValue = String(row.original?.name ?? '')
    return nameValue.toLowerCase().includes(String(value).toLowerCase().trim())
  }

  const table = useReactTable({
    data: filteredData,
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
    globalFilterFn: globalFilterByName,
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

  const buttonProps = {
    variant: 'contained',
    children: 'Add Country'
  }

  return (
    <>
      <Card>
        {/* <CardHeader title='Filters' /> */}
        {/* <TableFilters setData={setFilteredData} productData={data} /> */}
        <Divider />
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Country'
            className='max-sm:is-full'
          />
          <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto max-sm:is-full sm:is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
            <Button
              color='secondary'
              variant='tonal'
              className='max-sm:is-full is-auto'
              startIcon={<i className='tabler-upload' />}
            >
              Export
            </Button>
            {hasPermission("partner_master:add") &&
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps}
                dialog={AddCountry}
                dialogProps={{ onSuccess: handleGet }}
              />
            }
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
      <AddCountryInfo open={open} setOpen={setOpen} data={editData} onSuccess={handleGet} />
    </>
  )
}

export default CountryListTable
