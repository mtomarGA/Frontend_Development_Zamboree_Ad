'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  Tooltip,
  CircularProgress,
  Box,
} from '@mui/material'
import GetFollowedBusiness from "@/services/customers/createService"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const Followed = ({ selectedUser }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const getBusinessFollowed = async (id) => {
    try {
      setLoading(true)
      const result = await GetFollowedBusiness.getFollowedBusiness(id)
      const formatted = result?.data?.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString(),
        name: item.following?.companyInfo?.companyName || "N/A",
        presentid: item?.following.vendorId || "N/A",
        _id: item._id,
      })) || []
      setData(formatted)
    } catch (error) {
      console.error("Error fetching followed businesses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      getBusinessFollowed(selectedUser)
    }
  }, [selectedUser])

  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('name', {
      header: 'Name of Following',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('presentid', {
      header: 'Present Id',
      cell: info => info.getValue()
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          <Tooltip title="Delete" placement="top-end">
            <i
              className='tabler-trash text-red-500 text-2xl cursor-pointer'
              onClick={() => console.log('Delete:', row.original)}
            />
          </Tooltip>
        </div>
      )
    })
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Card className='shadow-none'>
      {loading ? (
        <Box className='flex justify-center items-center h-60'>
          <CircularProgress />
        </Box>
      ) : (
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {data.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className='text-start'>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='text-center py-6'>
                    No followed businesses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default Followed
