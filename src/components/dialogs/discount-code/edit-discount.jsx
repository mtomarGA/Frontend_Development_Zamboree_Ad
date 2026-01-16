'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Typography,
  TablePagination
} from '@mui/material'
import { ChevronRight } from 'lucide-react'
import classnames from 'classnames'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
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

import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@/@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import discountCode from '@/services/utsav-packages/discountCode.service'

const hasPermission = () => true

const productStatusObj = {
  active: { title: 'ACTIVE', color: 'success' },
  inactive: { title: 'INACTIVE', color: 'warning' },
}

const EditDiscount = () => {
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])

  const fetchDiscountCodes = async () => {
    try {
      const res = await discountCode.getDiscount()
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      toast.error('Failed to fetch discount codes')
    }
  }

  const handleDelete = async id => {
    try {
      await discountCode.deleteDiscount(id)
      toast.success('Discount deleted')
      fetchDiscountCodes()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  useEffect(() => {
    fetchDiscountCodes()
  }, [])

  const columnHelper = createColumnHelper()

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'ID',
      header: 'ID',
      cell: ({ table, row }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        const rowsInPage = table.getRowModel().rows
        const index = rowsInPage.findIndex(r => r.id === row.id)
        return <Typography>{pageIndex * pageSize + index + 1}</Typography>
      }
    }),
    columnHelper.accessor('couponCode', {
      header: 'CODE',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('discount', {
      header: 'DISCOUNT',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('voucherType', {
      header: 'VOUCHER TYPE',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('date', {
      header: 'EXPIRE DATE',
      cell: info => info.getValue()?.split('T')[0]
    }),
    columnHelper.accessor('status', {
      header: 'STATUS',
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase()
        const statusData = productStatusObj[status]
        return statusData ? (
          <Chip label={statusData.title} color={statusData.color} variant='tonal' size='small' />
        ) : (
          <Chip label='Unknown' variant='outlined' size='small' />
        )
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <Box display='flex' gap={1}>
          {hasPermission('edit') && (
            <Button size='small' onClick={() => (row.original._id)}>
              <i className='tabler-edit' />
            </Button>
          )}
          {hasPermission('delete') && (
            <Button size='small' color='error' onClick={() => handleDelete(row.original._id)}>
              <i className='tabler-trash' />
            </Button>
          )}
        </Box>
      ),
      enableSorting: false
    })
  ], [])

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

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
    getPaginationRowModel: getPaginationRowModel()
  })

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

  return (
    <Card>
      <CardHeader
        title='Discount List'
        action={
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
            />
            <Button variant='contained' onClick={() => router.push('/en/apps/utsav-package/create-discount')}>
              Add Discount
            </Button>
          </Box>
        }
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
                          'cursor-pointer': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <ChevronRight
                            className={header.column.getIsSorted() === 'asc' ? '-rotate-90' : 'rotate-90'}
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
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

export default EditDiscount
