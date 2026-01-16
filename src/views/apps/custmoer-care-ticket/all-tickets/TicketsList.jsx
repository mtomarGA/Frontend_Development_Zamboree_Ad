'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  TablePagination,
  Typography
} from '@mui/material'

// Next.js


// Third-party Imports
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

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

// Services & Utils
import allTicketService from '@/services/custmore-care-ticket/allTicketService'
import { toast } from 'react-toastify'
import NewTicketEdit from '@/components/dialogs/new-ticket/NewTicketEdit'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../../deleteConfirmation'
import { useRouter } from 'next/navigation'

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
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const productStatusObj = {
  CLOSE: { title: 'CLOSE', color: 'error' },
  OPEN: { title: 'OPEN', color: 'success' },
  PENDING: { title: 'PENDING', color: 'warning' }
}

const TicketList = ({ onTicketChange }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [newTicketEdit, setNewTicketEdit] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { hasPermission } = useAuth()

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const res = await allTicketService.getAllTickets()
      setData(Array.isArray(res?.data) ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [])
      onTicketChange?.()
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      toast.error('Failed to fetch tickets')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleEdit = ticket => {
    setSelectedTicket(ticket)
    setNewTicketEdit(true)
  }

  const handleDelete = async id => {
    try {
      const res = await allTicketService.deleteTicket(id)
      toast.success(res.message || 'Ticket deleted successfully')
      await fetchTickets()
    } catch (error) {
      console.error('Failed to delete ticket:', error)
      toast.error('Failed to delete ticket')
    }
  }

  const handleAdd = () => {
    router.push('/en/apps/custmore-tickets/new-ticket')
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('ticketCode', {
        header: 'Ticket Code',
        cell: info => (
          <Typography className='font-medium' color='text.primary'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('subject', { header: 'Subject', cell: info => info.getValue() }),
      columnHelper.accessor('customRequester', { header: 'Requester Name', cell: info => info.getValue() }),
      columnHelper.accessor('requesterType', { header: 'Requester Type', cell: info => info.getValue() }),
      columnHelper.accessor('createdAt', {
        header: 'Date Created',
        cell: info =>
          new Date(info.getValue()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Reply',
        cell: info =>
          new Date(info.getValue()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      }),
      columnHelper.accessor('assignTo', { header: 'Assign To', cell: info => info.getValue() || 'Unassigned' }),
      columnHelper.accessor('priority', { header: 'Priority', cell: info => info.getValue() || 'Normal' }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status?.toUpperCase()
          const statusData = productStatusObj[status]
          return statusData ? (
            <Chip label={statusData.title} variant='tonal' color={statusData.color} size='small' />
          ) : (
            <Chip label={status || 'UNKNOWN'} variant='outlined' color='default' size='small' />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            {hasPermission('customer_care_ticket_all_tickets:edit') && (
              <Button size='small' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit' />
              </Button>
            )}

            {hasPermission('customer_care_ticket_all_tickets:delete') && (
              <DeleteConfirmationDialog
                itemName='Ticket'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </Box>
        ),
        enableSorting: false
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { sorting: [{ id: 'createdAt', desc: true }] }
  })

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Typography variant='h4' sx={{ whiteSpace: 'nowrap' }}>
              All Tickets
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
                  minWidth: { xs: '100%', sm: 250 },
                  maxWidth: { xs: '100%', sm: 300 }
                }}
              />
              {hasPermission('customer_care_ticket_all_tickets:add') && (
                <Button
                  variant='contained'
                  onClick={handleAdd}
                  sx={{
                    color: 'white',
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 'auto' }
                  }}
                >
                  New Ticket
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
                          {header.column.getIsSorted() &&
                            (header.column.getIsSorted() === 'asc' ? (
                              <ChevronRight className='-rotate-90' />
                            ) : (
                              <ChevronRight className='rotate-90' />
                            ))}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getFilteredRowModel().rows.length ? (
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
                    {isLoading ? 'Loading...' : 'No data available'}
                  </td>
                </tr>
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

      <Dialog
     
        maxWidth='md'
        scroll='body'
        open={newTicketEdit}
        onClose={() => setNewTicketEdit(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setNewTicketEdit(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      
        <DialogContent sx={{ px: 2 }}>
          {selectedTicket && (
            <NewTicketEdit
              selectedTicket={selectedTicket}
              setNewTicketEdit={setNewTicketEdit}
              onSuccess={async () => {
                setNewTicketEdit(false)
                toast.success('Ticket updated successfully')
                await fetchTickets()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TicketList
