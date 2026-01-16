'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, TablePagination, Chip, Button, Typography, Box, Dialog, DialogTitle } from '@mui/material'
import { useRouter } from 'next/navigation'
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
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'
import createUtsavPackage from '@/services/utsav-packages/utsavPackageService'
import PackageEdit from '@/components/dialogs/utsav-package/packageEdit'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../deleteConfirmation'

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
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const productStatusObj = {
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  INACTIVE: { title: 'INACTIVE', color: 'error' }
}

const UtsavPackages = () => {
  const router = useRouter()
  const { hasPermission } = useAuth()

  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [utsavPackageEditOpen, setUtsavPackageEditOpen] = useState(false)
  const [selectedUtsavPackage, setSelectedUtsavPackage] = useState(null)

  const handleAdd = () => {
    router.push(`/en/apps/utsav-package/add-new`)
  }

  const getPackage = async () => {
    try {
      const response = await createUtsavPackage.getPackage()
      let packages = response?.data || []

      packages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      const updatedPackages = packages.map(item => ({
        ...item,
        voucherType: item.voucherType || item.chooseVoucherType || '—'
      }))

      setData(updatedPackages)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to fetch packages')
    }
  }

  useEffect(() => {
    getPackage()
  }, [])

  const handleDelete = async id => {
    try {
      const response = await createUtsavPackage.deletePackage(id)
      if (response?.statusCode === 200 && response?.success) {
        toast.success('Package deleted successfully')
        await getPackage()
      } else {
        toast.error(response?.message || 'Failed to delete package')
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting package')
      console.error(error)
    }
  }

  const handleEdit = pkg => {
    setSelectedUtsavPackage(pkg)
    setUtsavPackageEditOpen(true)
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: 'No.',
        cell: ({ table, row }) => {
          const pageIndex = table.getState().pagination.pageIndex
          const pageSize = table.getState().pagination.pageSize
          const rowsInPage = table.getRowModel().rows
          const currentRowIndex = rowsInPage.findIndex(r => r.id === row.id)
          const displayIndex = pageIndex * pageSize + currentRowIndex + 1
          return <Typography className='font-medium'>{displayIndex}</Typography>
        }
      }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => (
          <img
            src={info.getValue()}
            alt='Image'
            width={35}
            height={35}
           
          />
        )
      }),
      columnHelper.accessor('title', { header: 'Name', cell: info => info.getValue() }),
      columnHelper.accessor('price', { header: 'Price', cell: info => `₹${info.getValue()}` }),
      columnHelper.accessor('packageId', { header: 'Package ID', cell: info => info.getValue() }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue()
          const statusData = productStatusObj[status]
          return statusData ? (
            <Chip label={statusData.title} variant='tonal' color={statusData.color} size='small' />
          ) : (
            <Chip label='Unknown' variant='outlined' color='default' size='small' />
          )
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {hasPermission('utsav_package_utsav_packages_list:edit') && (
              <Button size='small' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit' />
              </Button>
            )}

            {hasPermission('utsav_package_utsav_packages_list:delete') && (
              <DeleteConfirmationDialog
                itemName='Utsav Package '
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
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
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant='h4' sx={{ whiteSpace: 'nowrap' }}>
            Utsav Packages
          </Typography>
        }
        action={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'stretch', sm: 'flex-end' },
              ml: { xs: 0, sm: 2 }
            }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { xs: '100%', sm: 300 }
              }}
            />
            {hasPermission('utsav_package_utsav_packages_list:add') && (
              <Button
                variant='contained'
                onClick={handleAdd}
                sx={{
                  color: 'white',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: 'auto' }
                }}
              >
                Add Package
              </Button>
            )}
          </Box>
        }
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          '& .MuiCardHeader-action': {
            alignSelf: { xs: 'stretch', sm: 'center' },
            mt: { xs: 2, sm: 0 },
            ml: { xs: 0, sm: 'auto' }
          }
        }}
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
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronRight className='-rotate-90' />}
                        {header.column.getIsSorted() === 'desc' && <ChevronRight className='rotate-90' />}
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
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
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

      <Dialog
        fullWidth
        maxWidth='lg'
        scroll='body'
        open={utsavPackageEditOpen}
        onClose={() => setUtsavPackageEditOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setUtsavPackageEditOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
       
        <PackageEdit
          utsavPackageEdit={selectedUtsavPackage}
          setselectedUtsavPackage={setSelectedUtsavPackage}
          onSuccess={setUtsavPackageEditOpen}
          getPackage={getPackage}
        />
      </Dialog>

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

export default UtsavPackages
