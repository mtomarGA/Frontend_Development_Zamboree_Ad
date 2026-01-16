'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import AllInvoicedData from '@/services/premium-listing/banner.service'

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

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Eye, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Grid } from '@mui/system'
import { Box } from '@mui/material'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const InvoiceListTable = ({ invoiceData, deleteInvoice }) => {
  // States
  const [status, setStatus] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  useEffect(() => {
    getAllInvoiced()
  }, [])

  const getproposal = async () => {
    const res = await AllProposal.getPropsal()
    console.log(res, "resssss");
    setData(res.data)
  }
      const getAllInvoiced = async () => {
          const res = await AllInvoicedData.getInvoiceBanner()
          console.log(res, "ssss");
  
          setData(res.data)
      }
  // Hooks
  const { lang: locale } = useParams()
  const { hasPermission } = useAuth();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'invoiceid',
        header: 'Invoice Id',
        cell: ({ row }) => (
          <Typography color='primary.main'>#{row.original.InvoiceId||row.original.INVOICEDID}</Typography>
        )
      },
      {
        accessorKey: 'invoiceid',
        header: 'Business ID',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: 180 /* set consistent width */ }}>
            <Typography
              color="secondary.main"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.original?.basicDetails?.vendorId}
            </Typography>

            <Typography
              color="secondary.main"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.original?.basicDetails?.vendor?.contactInfo?.email ||
                row.original?.basicDetails?.vendor?.companyInfo?.companyName}
            </Typography>
          </Box>
        ),
      },


      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => <Typography>₹{row.original.amount?.EstimateTotal}</Typography>
      },
      {
        accessorKey: 'gst',
        header: 'GST',
        cell: ({ row }) => <Typography>₹{row.original.amount.TAX18 || "0"}</Typography>
      },
      {
        accessorKey: 'orderid',
        header: 'Type',
        cell: ({ row }) => (
          <Typography variant='body2' color='secondary.main'>{row.original.type}</Typography>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) =>

        (
          <Chip
            variant='tonal'
            label={row.original?.status}
            color={row.original.status === 'PAID' ? 'success' : 'warning'}
            size='small'
          />
        )
      },
      {
        accessorKey: 'createdAt',
        header: 'Created Date',
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original.proposalDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        )
      },

      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <>
            <Link href={`/en/apps/listingInvoice/invoice-preview/${row.original._id}`}>
              <Eye className='cursor-pointer text-blue-400' />
            </Link>
            {/* <Trash2 className='cursor-pointer text-red-400 ml-2' /> */}
          </>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    const filteredData = data.filter(invoice => {
      if (status && invoice.status !== status) return false
      return true
    })

    setFilteredData(filteredData)
  }, [status, data])

  return (
    <Card>

      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h5" fontWeight={600}>
            Invoice Table
          </Typography>
        </Grid>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>

          <div className='flex items-center gap-2 is-full sm:is-auto'>

            {/* <Typography className='hidden sm:block'>Show</Typography> */}
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='is-[70px] max-sm:is-full'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>


        </div>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Invoice'
            className='max-sm:is-full sm:is-[250px]'
          />
          {/* <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='max-sm:is-full sm:is-[160px]'
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>All Status</MenuItem>
            <MenuItem value='COMPLETED'>Completed</MenuItem>
            <MenuItem value='PENDING'>Pending</MenuItem>
            <MenuItem value='FAILED'>Failed</MenuItem>
          </CustomTextField> */}
        </div>
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup._id}>
                {headerGroup.headers.map(header => (
                  <th key={header._id}>
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
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row._id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell._id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        component={() => (
          <div className='flex items-center justify-between p-4'>
            <div>
              <Typography variant='body2'>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredData.length
                )}{' '}
                of {filteredData.length} entries
              </Typography>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        count={filteredData.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default InvoiceListTable
