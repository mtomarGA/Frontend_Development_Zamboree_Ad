'use client'

import { useEffect, useState } from 'react'
import { Card, Tooltip, Typography, CircularProgress } from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import SavePost from "@/services/customers/createService"

const columnHelper = createColumnHelper()

const Savepost = ({ selectedUser }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const getBusinessFollowed = async (id) => {
    try {
      setLoading(true)
      const result = await SavePost.getSavePost(id)

      const formatted =
        result?.data?.map((item) => ({
          date: new Date(item?.postId?.createdAt).toLocaleDateString(),
          postId: item?.postId?.pollsId || item?.postId?.postId,
          title: item.postId?.chooseTypeId?.companyInfo?.companyName || "N/A",
          presentid: item?.postId?.chooseTypeId?.vendorId || "N/A",
        })) || []

      setData(formatted)
    } catch (error) {
      console.error("Error fetching saved posts:", error)
      setData([])
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
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('postId', {
      header: 'Post Id',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('presentid', {
      header: 'Present Id',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('date', {
      header: 'Save Date',
      cell: info => info.getValue()
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center'>
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
        <div className='flex justify-center items-center py-10'>
          <CircularProgress />
        </div>
      ) : data.length === 0 ? (
        <Typography variant='body1' className='text-center py-10 '>
          No saved posts found
        </Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='text-start'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default Savepost
