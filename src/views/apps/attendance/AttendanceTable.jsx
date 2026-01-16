'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
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
import classnames from 'classnames'
import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import TablePaginationComponent from '@components/TablePaginationComponent'
import DeleteConfirmationDialog from '../deleteConfirmation'
import punchService from '@/services/attendance/punchInOut.service'
import { toast } from 'react-toastify'
import EditAttendanceDialog from '@/components/dialogs/attendance/attendance-update'
import { useAuth } from '@/contexts/AuthContext'
import AddAttendanceDialog from './AddAttendanceDialog'
import CustomTextField from '@/@core/components/mui/TextField'

const columnHelper = createColumnHelper()

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const AddressCell = ({ value }) => (
  <span
    title={value || ''}
    style={{
      display: 'inline-block',
      maxWidth: '150px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      verticalAlign: 'bottom',
      cursor: 'pointer'
    }}
  >
    {value}
  </span>
)

const AttendanceTable = () => {
  const [data, setData] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const { hasPermission } = useAuth()
  const [employee, setEmployee] = useState('')
  const { user } = useAuth()
  const [summary, setSummary] = useState({})

  // ✅ Fetch attendance list

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await punchService.getEntry()
    setData(res.data)
  }

  const handleFilter = async () => {
    // 🔒 Prevent running if both dates are not selected
    if (!fromDate || !toDate) {
      toast.error('Please select both From and To dates before applying filter')
      return
    }

    try {
      const id = employee || user?.userId?._id

      const params = {
        employee_id: id,
        fromDate,
        toDate
      }

      const result = await punchService.getEntry(params)
      const rows = result?.data || []

      setData(rows)

      // Build summary on frontend
      const totalDays = rows.length
      const presentDays = rows.filter(r => r.status === 'Present').length
      const absentDays = rows.filter(r => r.status === 'Absent').length
      const lateDays = rows.filter(r => r.isLate).length
      const totalHours = rows.reduce((sum, r) => sum + (r.totalMinutes || 0) / 60, 0)

      setSummary({ totalDays, presentDays, absentDays, lateDays, totalHours })
    } catch (err) {
      toast.error('Failed to filter attendance')
    }
  }

  const handleEdit = rowData => {
    setSelectedAttendance(rowData)
    setEditOpen(true)
  }

  const handleDelete = async _id => {
    if (!_id) return toast.error('Invalid attendance ID')
    try {
      const res = await punchService.deleteEntry(_id)
      setData(prev => prev.filter(item => item._id !== _id))
      toast.success(res.message || 'Record deleted successfully')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete record')
    }
  }

  const handleEditSave = () => {
    fetchData()
  }

  const handleAddSave = () => {
    fetchData()
  }

  const columns = [
    columnHelper.accessor(
      row => {
        const d = new Date(row.date)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = String(d.getFullYear()).slice(-2)
        return `${day}/${month}/${year}`
      },
      { header: 'Date' }
    ),
    columnHelper.accessor(
      row =>
        row.punchIn?.time
          ? new Date(row.punchIn.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
          : '-',
      { header: 'In Time' }
    ),
    columnHelper.accessor(row => row.punchIn?.address || '-', {
      header: 'In Location',
      cell: info => {
        const row = info.row.original
        const address = row.punchIn?.address || '-'
        const lat = row.punchIn?.lat
        const lng = row.punchIn?.lng

        const handleClick = () => {
          if (lat && lng) {
            const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`
            window.open(mapUrl, '_blank')
          } else {
            alert('Location coordinates not available')
          }
        }

        return (
          <Button variant='text' onClick={handleClick} startIcon={<RoomIcon />} sx={{ textTransform: 'none' }}>
            Location
          </Button>
        )
      }
    }),
    columnHelper.accessor(
      row =>
        row.punchOut?.time
          ? new Date(row.punchOut.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
          : '-',
      { header: 'Out Time' }
    ),
    columnHelper.accessor(
      row => {
        return row.punchOut?.address || '-'
      },
      {
        id: 'outLocation',
        header: 'Out Location',
        cell: info => {
          const row = info.row.original
          const address = row.punchOut?.address || '-'
          const lat = row.punchOut?.lat
          const lng = row.punchOut?.lng

          const handleClick = () => {
            if (lat && lng) {
              window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
            } else {
              alert('Out location coordinates not available')
            }
          }

          return (
            <>
              {lat && lng ? (
                <Button variant='text' onClick={handleClick} startIcon={<RoomIcon />} sx={{ textTransform: 'none' }}>
                  Location
                </Button>
              ) : (
                <span>-</span>
              )}
            </>
          )
        }
      }
    ),

    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          {hasPermission('attendance_attendance_filter:edit') && (
            <Button size='small' onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit' />
            </Button>
          )}
          {hasPermission('attendance_attendance_filter:delete') && (
            <DeleteConfirmationDialog
              itemName='Attendance Record'
              onConfirm={() => handleDelete(row.original._id)}
              icon={<i className='tabler-trash text-2xl text-error' />}
            />
          )}
        </div>
      )
    })
  ]

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h4'>Attendances</Typography>}
        sx={{ alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}
        action={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%'
            }}
          >
            {/* From Date */}
            <Box sx={{ order: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              <CustomTextField
                type='date'
                label='From Date'
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                fullWidth
              />
            </Box>

            {/* To Date */}
            <Box sx={{ order: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              <CustomTextField
                type='date'
                label='To Date'
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                fullWidth
              />
            </Box>

            <Box sx={{ order: { xs: 3, sm: 0 }, mt: 4, width: { xs: '100%', sm: 'auto' } }}>
              <Button variant='contained' onClick={handleFilter} fullWidth>
                Filter
              </Button>
            </Box>

            <Box sx={{ order: { xs: 4, sm: 0 }, mt: 4, width: { xs: '100%', sm: 'auto' } }}>
              <Button variant='contained' onClick={() => setAddOpen(true)} fullWidth>
                Add Attendance
              </Button>
            </Box>
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
                    {!header.isPlaceholder && (
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
                <td colSpan={columns.length} className='text-center py-4'>
                  No attendance records
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

      <TablePaginationComponent table={table} />

      {/* ✅ Add Dialog */}
      <AddAttendanceDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAddSave} />

      {/* ✅ Edit Dialog */}
      {selectedAttendance && (
        <EditAttendanceDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
          editData={selectedAttendance}
        />
      )}
    </Card>
  )
}

export default AttendanceTable
