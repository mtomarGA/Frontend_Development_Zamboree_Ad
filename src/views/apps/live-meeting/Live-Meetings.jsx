'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  IconButton,
  TablePagination,
  Typography
} from '@mui/material'
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

import createLiveMeetingsService from '@/services/live-meetings/live-meetings.js'
import { toast } from 'react-toastify'

import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import PersonIcon from '@mui/icons-material/Person'

import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../deleteConfirmation'
import ViewMeetingDialog from './View'
import EditMeetingDialog from '@/components/dialogs/live-meeting/UpdatedMeetings'

const columnHelper = createColumnHelper()

const statusMap = {
  AWAITED: { title: 'AWAITED', color: 'warning' },
  CANCELLED: { title: 'CANCELLED', color: 'error' },
  FINISHED: { title: 'FINISHED', color: 'success' }
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

const LiveMeetingsPage = () => {
  const { hasPermission, user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const getAll = async () => {
    try {
      const res = await createLiveMeetingsService.getLiveMeetings()
      if (res.success) setData(res.data)
    } catch (error) {
      console.error('Error fetching live meetings:', error)
    }
  }
  

useEffect(() => {
  getAll()
}, [])


  const handleDelete = async meetingId => {
    try {
      const res = await createLiveMeetingsService.deleteLiveMeeting(meetingId)
      if (res.success) {
        toast.success('Meeting deleted successfully')
        getAll()
      } else {
        toast.error(res.message || 'Failed to delete meeting')
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleEdit = meeting => {
    setSelectedMeeting(meeting)
    setOpenEditDialog(true)
  }

  const handleView = meeting => {
    setSelectedMeeting(meeting)
    setOpenDialog(true)
  }

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Meeting Title',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => {
        const desc = info.getValue()
        return (
          <Box sx={{
            maxWidth: 250,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }} title={desc}>
            {desc}
          </Box>
        )
      }
    }),
   columnHelper.accessor('meetingDateTime', {
  header: 'Date & Time',
  cell: info =>
    info.getValue()
      ? new Date(info.getValue()).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      : '—'
}),

    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: info => `${info.getValue()} min`
    }),
    columnHelper.accessor('createdBy', {
      header: 'Created By',
      cell: info => {
        const createdBy = info.getValue()
        return createdBy ? `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim() : '-'
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const meeting = row.original
        const currentStatus = meeting.status?.toUpperCase() || 'AWAITED'
        const isCreator = user && meeting.createdBy && user._id === meeting.createdBy._id

        const handleStatusChange = async event => {
          const newStatus = event.target.value
          try {
            const res = await createLiveMeetingsService.updateLiveMeeting(meeting._id, {
              ...meeting,
              status: newStatus
            })
            if (res.success) {
              toast.success('Status updated successfully')
              await getAll()
            } else {
              toast.error(res.message || 'Failed to update status')
            }
          } catch (error) {
            toast.error(error.message || 'Error updating status')
          }
        }

        return (
          <Box sx={{ minWidth: 120 }}>
            {isCreator ? (
              <Chip
                label={
                  <select
                    value={currentStatus}
                    onChange={handleStatusChange}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontWeight: 600,
                      color: 'inherit',
                      outline: 'none',
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(statusMap).map(([value, { title }]) => (
                      <option key={value} value={value}>{title}</option>
                    ))}
                  </select>
                }
                color={statusMap[currentStatus]?.color || 'default'}
                variant='tonal'
                size='small'
              />
            ) : (
              <Chip
                label={statusMap[currentStatus]?.title || currentStatus}
                color={statusMap[currentStatus]?.color || 'default'}
                variant='tonal'
                size='small'
              />
            )}
          </Box>
        )
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const rowData = row.original
        const isCreator = user && rowData.createdBy && user._id === rowData.createdBy._id
        const status = rowData.status?.toUpperCase() || 'AWAITED'
        const showMeetingIcon = status === 'AWAITED'

        return (
          <Box className='flex items-center gap-2'>
            {showMeetingIcon && (
              <IconButton
                color='primary'
                onClick={() => {
                  if (rowData?.link) {
                    window.open(rowData.link, '_blank')
                  } else {
                    toast.error('Meeting link not available')
                  }
                }}
                title={isCreator ? 'Start Meeting' : 'Join Meeting'}
              >
                {isCreator ? (
                  <VideoCameraFrontIcon sx={{ fontSize: 28 }} />
                ) : (
                  <VideoCallIcon sx={{ fontSize: 28 }} />
                )}
              </IconButton>
            )}

            {hasPermission("live_meeting_all_meetings:view") && (user.userType === "ADMIN") && (
              <IconButton color='primary' onClick={() => handleView(rowData)}>
                <PersonIcon />
              </IconButton>
            )}

            {hasPermission("live_meeting_all_meetings:edit") && (
              <IconButton color='primary' onClick={() => handleEdit(rowData)}>
                <i className='tabler-edit' />
              </IconButton>
            )}

            {hasPermission("live_meeting_all_meetings:delete") && (
              <DeleteConfirmationDialog
                itemName='Meeting'
                onConfirm={() => handleDelete(rowData._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </Box>
        )
      },
      enableSorting: false
    })
  ], [user, hasPermission])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { sorting: [{ id: 'meetingDateTime', desc: true }] }
  })

  const handleAdd = () => router.push('/en/apps/add-live-meeting')

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h4'>Live Meetings</Typography>}
        action={
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search meetings...'
              sx={{ minWidth: { xs: '100%', sm: 250 }, maxWidth: { xs: '100%', sm: 300 } }}
            />
            {hasPermission("live_meeting_all_meetings:add") && (
              <Button variant='contained' onClick={handleAdd}>
                Add Meeting
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
                        className={classnames({ 'flex items-center': header.column.getIsSorted(), 'cursor-pointer select-none': header.column.getCanSort() })}
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
            {table.getFilteredRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No meetings available
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

      <ViewMeetingDialog open={openDialog} onClose={() => setOpenDialog(false)} meeting={selectedMeeting} />
      <EditMeetingDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} meeting={selectedMeeting} refreshList={getAll} />
    </Card>
  )
}

export default LiveMeetingsPage
