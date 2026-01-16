'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import {
  Card,
  Button,
  MenuItem,
  TablePagination,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material'

// Contexts & Services
import { useAuth } from '@/contexts/AuthContext'
import manageBusinessService from '@/services/business/service/paymentBusiness.service'

// Third-party Imports
import classnames from 'classnames'
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

// Components
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import ViewBusinessDetail from '@/components/dialogs/view-business'
import DeleteConfirmationDialog from '../deleteConfirmation'
import PaymentDiolog from '@/components/dialogs/payment/Payment.Diloag'
import PaymentMethod from '@/components/dialogs/payment-method'
import PaymentAdd from '@/components/dialogs/payment/Payment.Diloag'

// 🔍 Fuzzy search filter
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase()

  const searchFields = [
    row.original.vendorId?.toString().toLowerCase() || '',
    row.original?.companyInfo?.companyName?.toLowerCase() || '',
    row.original?.contactInfo?.email?.toLowerCase() || '',
    row.original?.contactInfo?.phoneNo?.toString().toLowerCase() || '',
    row.original?.companyInfo?.businessCategory?.name?.toLowerCase() || '',
    row.original?.locationInfo?.city?.name?.toLowerCase() || '',
    row.original?.status?.toLowerCase() || ''
  ]

  const passed = searchFields.some(field => field.includes(searchValue))
  addMeta({ itemRank: passed ? 1 : 0 })

  return passed
}

// 🔁 Debounced search input
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
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper()

const PaymentTable = () => {
  const [status, setStatus] = useState('All')
  const [rowSelection, setRowSelection] = useState({})
  const [allData, setAllData] = useState([])
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [showData, setShowData] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { hasPermission } = useAuth()
  const { lang: locale } = useParams()

  // 📡 Fetch businesses
  const getAllBusiness = useCallback(async () => {
    setLoading(true)
    try {
      const response = await manageBusinessService.getServicePayment()
      console.log(response);
      
      setData(response.data)
      setAllData(response.data)
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllBusiness()
  }, [getAllBusiness])

  // 🗑 Delete business handler
  const handleDelete = useCallback(
    async id => {
      try {
        const res = await manageBusinessService.getDeletePayment(id) // ✅ fixed typo
        if (res.statusCode === 200 || res.statusCode === 201) {
          toast.success('Business Deleted')
          getAllBusiness()
        } else {
          toast.error('Something Went Wrong')
        }
      } catch {
        toast.error('Failed to delete business')
      }
    },
    [getAllBusiness]
  )

  // 📊 Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('vendorId', {
        header: 'Payment Name',
        cell: ({ row }) => (
          <Typography variant='body2'>{row.original.name || 'N/A'}</Typography>
        )
      }),
      columnHelper.accessor('companyInfo.companyName', {
        header: 'Business Name',
        cell: ({ row }) => (
          <Typography variant='body2'>{row.original?.status|| 'N/A'}</Typography>
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
          
              <IconButton onClick={() => { setShowData(row.original); setOpen(true) }}>
                <i className='tabler-edit text-blue-500' />
              </IconButton>
      
        
              <DeleteConfirmationDialog
                itemName='business'
                onConfirm={() => handleDelete(row.original._id)}
              />
  
          </div>
        )
      })
    ],
    [handleDelete]
  )

  // 📌 Apply filters
  useEffect(() => {
    const filtered = allData.filter(business =>
      status === 'All' ? true : business.status === status
    )
    setData(filtered)
  }, [status, allData])

  // ⚡️ Table setup
  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
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
        <div className='grid grid-cols-12 gap-4 p-6 items-center'>
          {/* 🔍 Search */}
          <div className='col-span-3'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search businesses...'
              className='w-full'
            />
          </div>

          {/* 📊 Status filter */}
          <div className='col-span-3'>
            <CustomTextField
              select
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='APPROVED'>Approved</MenuItem>
            </CustomTextField>
          </div>

          {/* 📄 Page size selector */}
          <div className='col-span-2'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              fullWidth
            >
              {[10, 25, 50].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </CustomTextField>
          </div>

          {/* ➕ Add Payment Button */}
          <div className='col-span-2 flex justify-end gap-2'>
 
              <Button variant='contained' onClick={() => setOpen(true)}>
                Add Payment Method
              </Button>
     
          </div>
        </div>

        {/* 📋 Table */}
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='flex justify-center items-center p-6'>
              <CircularProgress size={28} />
            </div>
          ) : (
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {!header.isPlaceholder && (
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {({
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            })[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No businesses found for the selected filters
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 📑 Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      {/* 💳 Payment Dialog */}
      <PaymentAdd open={open} setOpen={setOpen} data={showData} getAllBusiness={getAllBusiness} />
    </>
  )
}

export default PaymentTable
