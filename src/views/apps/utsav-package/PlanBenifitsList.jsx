'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardHeader,
  Typography,
  Button,
  Box,
  Dialog,
  CircularProgress,
  TablePagination
} from '@mui/material'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import classnames from 'classnames'
import ChevronRight from '@menu/svg/ChevronRight'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import styles from '@core/styles/table.module.css'
import benefitsService from '@/services/utsav-packages/benifits.Service'
import DeleteConfirmationDialog from '../deleteConfirmation'
import PlanBenifitsEdit from '@/components/dialogs/plan-benfit/Plan-Benfits-edit'
import { useAuth } from '@/contexts/AuthContext'

const columnHelper = createColumnHelper()

// ✅ Debounced Search Input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const PlanBenefitsList = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)

  const { hasPermission } = useAuth()

  // ✅ Fetch all benefits
  const fetchBenefits = async () => {
    try {
      setLoading(true)
      const response = await benefitsService.getBenefits()

      let benefits = []
      if (Array.isArray(response)) benefits = response
      else if (response?.data) benefits = response.data
      else if (response?.result) benefits = response.result

      benefits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setData(benefits)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to fetch benefits')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBenefits()
  }, [])

  // ✅ Delete handler
  const handleDelete = async id => {
    try {
      const res = await benefitsService.deleteBenefits(id)
      if (res) {
        setData(prev => prev.filter(item => item._id !== id))
        toast.success('Benefit deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete benefit')
    }
  }

  // ✅ View Mode Handler
  const handleView = id => {
    const item = data.find(i => i._id === id)
    if (item) {
      setSelectedItem(item)
      setViewOpen(true)
      setOpenEdit(true)
    }
  }

  // ✅ Edit Mode Handler
  const handleEdit = id => {
    const item = data.find(i => i._id === id)
    if (item) {
      setSelectedItem(item)
      setViewOpen(false)
      setOpenEdit(true)
    }
  }

  // ✅ Close Dialog - NOW PROPERLY RESETS viewOpen
  const handleEditClose = () => {
    setOpenEdit(false)
    setSelectedItem(null)
    setViewOpen(false) // Reset immediately
  }

  // ✅ Close Add Dialog
  const handleAddClose = () => {
    setOpenAdd(false)
  }

  const handleSuccess = () => {
    handleEditClose()
    handleAddClose()
    fetchBenefits()
  }

  // ✅ Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('chooseCategories', {
        header: 'Categories',
        cell: info => (
          <Typography
            variant='body2'
            sx={{
              maxWidth: 300,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {info.getValue()?.map(cat => cat?.name).join(', ') || '—'}
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {hasPermission('utsav_package_master:view') && (
              <Button
                size='small'
                onClick={() => {
                  setViewOpen(true)
                  setSelectedItem(row.original)
                  setOpenEdit(true)
                }}
              >
                <i className='tabler-eye' />
              </Button>
            )}
            {hasPermission('utsav_package_master:edit') && (
              <Button
                size='small'
                onClick={() => {
                  setViewOpen(false)
                  setSelectedItem(row.original)
                  setOpenEdit(true)
                }}
              >
                <i className='tabler-edit' />
              </Button>
            )}
            {hasPermission('utsav_package_master:delete') && (
              <DeleteConfirmationDialog
                itemName='Benefit'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </div>
        )
      })
    ],
    [hasPermission, data]
  )

  // ✅ Table setup
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  // ✅ Render
  return (
    <Card>
      {/* Header */}
      <CardHeader
        title={<Typography variant='h4'>How to Redeem</Typography>}
        action={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'stretch', sm: 'flex-end' }
            }}
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search benefits...'
              sx={{ minWidth: { xs: '100%', sm: 200 }, maxWidth: { xs: '100%', sm: 300 } }}
            />
            {hasPermission('utsav_package_master:add') && (
              <Button
                variant='contained'
                onClick={() => setOpenAdd(true)}
                sx={{ color: 'white', width: { xs: '100%', sm: 'auto' } }}
              >
                Add Redeem Conditions
              </Button>
            )}
          </Box>
        }
      />

      {/* Table */}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center py-4'>
                  No benefits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog
        open={openAdd}
        onClose={handleAddClose}
        maxWidth='md'
        fullWidth
      >
        <PlanBenifitsEdit
          onClose={handleAddClose}
          onSuccess={handleSuccess}
        />
      </Dialog>

      {/* Edit / View Dialog - NOW PROPERLY HANDLES BACKDROP CLICKS */}
      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        maxWidth='md'
        fullWidth
      >
        <PlanBenifitsEdit
          onClose={handleEditClose}
          setViewOpen={setViewOpen}
          viewOpen={viewOpen}
          editData={selectedItem}
          onSuccess={handleSuccess}
        />
      </Dialog>

      {/* Pagination */}
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

export default PlanBenefitsList
