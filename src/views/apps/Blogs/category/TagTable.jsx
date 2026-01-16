'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  Box,
  Typography,
  TablePagination,
  IconButton
} from '@mui/material'

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

import blogTagService from '@/services/blog/blogTagService'
import { toast } from 'react-toastify'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../../deleteConfirmation'

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

const BlogTagsPage = () => {
  const [openTagBlog, setTagBlog] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryUpdateName, setCategoryUpdateName] = useState({ name: '' })
  const [tagList, setTagList] = useState([])
  const [errors, setErrors] = useState({ categoryName: '' })
  const [tagIdUpdate, setTagIdUpdate] = useState(false)
  const [tagId, setTagId] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const { hasPermission } = useAuth()

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const res = await blogTagService.getBlogTag()
      const sortedTags = (Array.isArray(res?.data) ? res.data : []).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )
      setTagList(sortedTags)
    } catch (err) {
      console.error('Failed to fetch tags:', err)
      toast.error('Failed to fetch tags')
      setTagList([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSave = async () => {
    const trimmedName = categoryName.trim()
    setCategoryName(trimmedName)

    if (!trimmedName) {
      setErrors({ categoryName: 'Tag Name is required' })
      return
    }

    const isDuplicate = tagList.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())
    if (isDuplicate) {
      setErrors({ categoryName: 'This tag name already exists' })
      return
    }

    try {
      const result = await blogTagService.addBlogTag({ name: trimmedName })
      toast.success(result?.message || 'Tag successfully added')
      setTagBlog(false)
      setCategoryName('')
      setErrors({ categoryName: '' })
      await fetchTags()
    } catch (err) {
      console.error('Failed to save tag:', err)
      toast.error('Failed to save tag')
    }
  }

  const handleUpdate = async () => {
    const trimmedName = categoryUpdateName.name.trim()
    setCategoryUpdateName({ name: trimmedName })

    if (!trimmedName) {
      toast.error('Tag name is required')
      return
    }

    const isDuplicate = tagList.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase() && tag._id !== tagId)
    if (isDuplicate) {
      toast.error('Tag name already exists')
      return
    }

    try {
      const result = await blogTagService.updateTag(tagId, trimmedName)
      toast.success(result?.message || 'Tag updated successfully')
      setTagIdUpdate(false)
      setCategoryUpdateName({ name: '' })
      await fetchTags()
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update tag')
    }
  }

  const handleDelete = async id => {
    try {
      const response = await blogTagService.deleteBlogTag(id)
      toast.success(response?.message || 'Tag deleted successfully')
      await fetchTags()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete tag')
    }
  }

  const handleEdit = tag => {
    setTagId(tag._id)
    setTagIdUpdate(true)
    setCategoryUpdateName({ name: tag.name })
  }

  const handleAdd = () => {
    setTagBlog(true)
    setCategoryName('')
    setErrors({ categoryName: '' })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <Typography sx={{ textAlign: 'left' }}>Tag Name</Typography>,
        cell: info => <Typography sx={{ textAlign: 'left' }}>{info.getValue()}</Typography>
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <Typography sx={{ textAlign: 'right', width: '100%' }}>Actions</Typography>,
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <IconButton size='large' color='primary' onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit' />
            </IconButton>

            <DeleteConfirmationDialog
              itemName='Tag'
              onConfirm={() => handleDelete(row.original._id)}
              icon={<i className='tabler-trash text-2xl text-error' />}
            />

            {/* <IconButton size='large' color='error' onClick={() => handleDelete(row.original._id)}>
            <i className='tabler-trash' />
          </IconButton> */}
          </Box>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: tagList,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { sorting: [{ id: 'updatedAt', desc: true }] }
  })

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent='space-between'
              flexWrap='wrap'
              gap={2}
              width='100%'
            >
              <Box>Tag List</Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  width: { xs: '50%', sm: 'auto' }
                }}
              >
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search tags...'
                  sx={{ width: { xs: '100%', sm: '300px' } }}
                />
                {hasPermission('blog_master:add') && (
                  <Button
                    variant='contained'
                    sx={{ color: 'white', width: { xs: '100%', sm: 'auto' } }}
                    size='medium'
                    onClick={handleAdd}
                  >
                    Create Tag
                  </Button>
                )}
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
                            {
                              asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                              desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                            }[header.column.getIsSorted()]}
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
                    {isLoading ? 'Loading...' : 'No tags found'}
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

      <Dialog
        fullWidth
        open={openTagBlog}
        maxWidth='xs'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setTagBlog(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbe-6 sm:pli-16'>
          <Card className='shadow-none'>
            <CardHeader title='Create Tag' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tag Name *'
                    size='small'
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value.trimStart())}
                    error={!!errors.categoryName}
                    helperText={errors.categoryName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display='flex' gap={2} justifyContent='flex-end'>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={handleSave}
                      sx={{ color: 'white' }}
                      disabled={
                        !categoryName.trim() ||
                        tagList.some(tag => tag.name.toLowerCase() === categoryName.trim().toLowerCase())
                      }
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogTitle>
      </Dialog>

      <Dialog
        fullWidth
        open={tagIdUpdate}
        maxWidth='xs'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setTagIdUpdate(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbe-6 sm:pli-16'>
          <Card className='shadow-none'>
            <CardHeader title='Update Tag' />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tag Name *'
                    size='small'
                    value={categoryUpdateName.name}
                    onChange={e => setCategoryUpdateName({ name: e.target.value.trimStart() })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display='flex' gap={2} justifyContent='flex-end'>
                    <Button variant='outlined' size='small' onClick={() => setTagIdUpdate(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={handleUpdate}
                      sx={{ color: 'white' }}
                      disabled={
                        !categoryUpdateName.name.trim() ||
                        tagList.some(
                          tag =>
                            tag.name.toLowerCase() === categoryUpdateName.name.trim().toLowerCase() && tag._id !== tagId
                        )
                      }
                    >
                      Update
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogTitle>
      </Dialog>
    </>
  )
}

export default BlogTagsPage
