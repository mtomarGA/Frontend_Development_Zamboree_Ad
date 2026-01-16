'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  TextField,
  Card,
  CardHeader,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  TablePagination
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import predefinedService from '@/services/custmore-care-ticket/predefinedService'
import EditPreDefine from '@/components/dialogs/preDefineDialogs/EditPreDefine'
import ChevronRight from '@menu/svg/ChevronRight'
import TablePaginationComponent from '@components/TablePaginationComponent'
import classnames from 'classnames'
import styles from '@core/styles/table.module.css'
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
import DeleteConfirmationDialog from '../../deleteConfirmation'

const columnHelper = createColumnHelper()

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const PredefinedReplyPage = () => {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [openPreDefine, setOpenPreDefine] = useState(false)
  const [selectedReply, setSelectedReply] = useState(null)

  const fetchReplies = async () => {
    try {
      const res = await predefinedService.getReplies()
      const normalized = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      const sorted = normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setData(sorted)
    } catch (error) {
      toast.error('Failed to fetch replies')
    }
  }

  useEffect(() => {
    fetchReplies()
  }, [])

  const handleDelete = async id => {
    try {
      const res = await predefinedService.deleteReply(id)
      toast.success(res.message || 'Deleted successfully')
      fetchReplies()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = reply => {
    setSelectedReply(reply)
    setOpenPreDefine(true)
  }

  const handleAdd = () => {
    router.push('/en/apps/custmore-tickets/pre-definend')
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <Typography sx={{ textAlign: 'left' }}>PREDEFINED REPLY NAME</Typography>,
        cell: info => <Typography sx={{ textAlign: 'left' }}>{info.getValue()}</Typography>
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <Typography sx={{ textAlign: 'right', width: '100%' }}>ACTIONS</Typography>,
        cell: ({ row }) => (
          <Box className='flex justify-end gap-2'>
            {hasPermission('customer_care_ticket_predefined_reply:edit') && (
              <IconButton size='medium' color='primary' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit' />
              </IconButton>
            )}

            {hasPermission('customer_care_ticket_predefined_reply:delete') && (
              <DeleteConfirmationDialog
                itemName='Predefined Reply'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
        
          </Box>
        )
      })
    ],
    [hasPermission]
  )

  const table = useReactTable({
    data,
    columns,
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
            Predefined Replies
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
            <TextField
              size='small'
              placeholder='Search all columns...'
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                maxWidth: { xs: '100%', sm: 300 }
              }}
            />
            {hasPermission('customer_care_ticket_predefined_reply:add') && (
              <Button
                variant='contained'
                onClick={handleAdd}
                sx={{
                  color: 'white',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: 'auto' }
                }}
              >
                Add Predefined Replies
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

      <Box className='overflow-x-auto' sx={{ p: 2 }}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No replies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />

      <Dialog
        open={openPreDefine}
        maxWidth='lg'
        fullWidth
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent>
          {selectedReply && (
            <EditPreDefine data={selectedReply} setOpenPreDefine={setOpenPreDefine} fetchReplies={fetchReplies} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PredefinedReplyPage
