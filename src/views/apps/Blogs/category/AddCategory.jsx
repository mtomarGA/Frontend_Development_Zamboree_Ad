'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Avatar,
  Typography,
  Chip,
  TablePagination,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
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
import '@/libs/styles/tiptapEditor.css'
import CustomTextField from '@/@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import UpdateCategory from '../update-blog/UpdateCategory'
import blogCategoryService from '@/services/blog/blogCategoryservice'
import Image from '@/services/imageService.js'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import styles from '@core/styles/table.module.css'
import ChevronRight from '@menu/svg/ChevronRight'
import TablePaginationComponent from '@components/TablePaginationComponent'
import DeleteConfirmationDialog from '../../deleteConfirmation'

const columnHelper = createColumnHelper()

const statusObj = {
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  INACTIVE: { title: 'INACTIVE', color: 'error' }
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
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function BlogCategoryPage() {
  const { hasPermission } = useAuth()

  // Form states
  const [sortingNo, setSortingNo] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [status, setStatus] = useState('INACTIVE')
  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState([])
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  // Dialog states
  const [updateOpen, setUpdateOpen] = useState(false)
  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [categoryId, setCategoryId] = useState(null)
  const [categoryData, setCategoryData] = useState(null)

  // Data states
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    autofocus: true
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData()
        formData.append('image', acceptedFiles[0])
        try {
          const res = await Image.uploadImage(formData)
          setUploadedImageUrl(res.data.url)
          setFiles(acceptedFiles)
          toast.success('Image uploaded successfully!')
        } catch (error) {
          console.error('Image upload error:', error)
          toast.error('Image upload failed')
        }
      }
    }
  })

  // Fetch categories function
  const getCategories = async () => {
    try {
      setIsLoading(true)
      const res = await blogCategoryService.getBlogCategory()

      // Handle different response structures
      const categories = res?.data || res || []

      setData(Array.isArray(categories) ? categories : [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    getCategories()
  }, [])

  // Reset form function
  const resetForm = () => {
    setSortingNo('')
    setCategoryName('')
    setStatus('INACTIVE')
    setFiles([])
    setUploadedImageUrl('')
    setErrors({})
    if (editor) {
      editor.commands.clearContent()
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = {
      sortingNo: sortingNo ? '' : 'Sorting No is required',
      categoryName: categoryName ? '' : 'Category Name is required',
      status: status ? '' : 'Status is required'
    }

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors)
      return
    }

    // Check for duplicates
    const duplicate = data.find(d => d.name?.toLowerCase() === categoryName.toLowerCase() || d.sortingNo == sortingNo)
    if (duplicate) {
      toast.error('Category name or sorting number already exists')
      return
    }

    const payload = {
      sortingNo: parseInt(sortingNo),
      categoryName,
      status,
      image: uploadedImageUrl,
      content: editor?.getHTML() || ''
    }

    setIsSubmitting(true)
    try {
      const res = await blogCategoryService.addBlogCategory(payload)
      await getCategories()
      resetForm()
      setOpenAddCategory(false)
      toast.success('Category added successfully')
    } catch (error) {
      console.error('API Error:', error)
      toast.error('Failed to add category')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async id => {
    try {
      await blogCategoryService.deleteBlogCategory(id)
      await getCategories()
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Delete failed')
    }
  }

  // Handle edit
  const handleEdit = row => {
    setCategoryData(row)
    setCategoryId(row._id)
    setUpdateOpen(true)
  }

  // Handle update success
  const handleUpdateSuccess = () => {
    setUpdateOpen(false)
    getCategories()
  }

  // Handle dialog close
  const handleAddCategoryClose = () => {
    setOpenAddCategory(false)
    resetForm()
  }

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('sortingNo', {
        header: 'Sorting No',
        cell: info => (
          <Typography className='font-medium' color='text.primary'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => (
          <img
            src={info.getValue()}
            alt='Category'
            style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none'
            }}
          />
        ),
        enableSorting: false
      }),
      columnHelper.accessor('name', {
        header: 'Blog Category Name',
        cell: info => (
          <Typography className='font-medium' color='text.primary'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const statusData = statusObj[info.getValue()]
          return statusData ? (
            <Chip label={statusData.title} variant='tonal' color={statusData.color} size='small' />
          ) : (
            <Chip label={info.getValue() || 'Unknown'} variant='outlined' color='default' size='small' />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {hasPermission('blog_master:edit') && (
              <Button size='small' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit' />
              </Button>
            )}

            {hasPermission('blog_master:delete') && (
              <DeleteConfirmationDialog
                itemName='Blog Categorie'
                onConfirm={() => handleDelete(row.original._id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
            {/* {hasPermission('blog_master:delete') && (
              <Button size='small' color='error' onClick={() => handleDelete(row.original._id)}>
                <i className='tabler-trash' />
              </Button>
            )} */}
          </div>
        ),
        enableSorting: false
      })
    ],
    [hasPermission]
  )

  // Table configuration
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
    initialState: {
      sorting: [{ id: 'sortingNo', desc: false }]
    }
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
              <Box sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Blog Categories</Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search categories...'
                  sx={{ width: { xs: '100%', sm: '300px' } }}
                />

                {hasPermission('blog_master:add') && (
                  <Button
                    type='button'
                    variant='contained'
                    sx={{ color: 'white', width: { xs: '100%', sm: 'auto' } }}
                    size='medium'
                    onClick={() => setOpenAddCategory(true)}
                  >
                    ADD CATEGORY
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
                          {{
                            asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                            desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {isLoading ? 'Loading...' : 'No categories available'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      {/* Update Category Dialog */}
      <Dialog open={updateOpen} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setUpdateOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4'>
          <UpdateCategory
            categoryId={categoryId}
            categoryData={categoryData}
            onClose={() => setUpdateOpen(false)}
            onSuccess={handleUpdateSuccess}
          />
        </DialogTitle>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        fullWidth
        open={openAddCategory}
        maxWidth='sm'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible', borderRadius: 3, p: 3 } }}
      >
        <DialogCloseButton onClick={handleAddCategoryClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle variant='h5' sx={{ px: 0 }}>
          Add Blog Category
        </DialogTitle>

        <DialogContent sx={{ p: 0, pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Sorting No *'
                value={sortingNo}
                onChange={e => /^\d*$/.test(e.target.value) && setSortingNo(e.target.value)}
                error={!!errors.sortingNo}
                helperText={errors.sortingNo}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Name *'
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                error={!!errors.categoryName}
                helperText={errors.categoryName}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Status *'
                value={status}
                onChange={e => setStatus(e.target.value)}
                error={!!errors.status}
                helperText={errors.status}
                disabled={isSubmitting}
              >
                <MenuItem value='INACTIVE'>Inactive</MenuItem>
                <MenuItem value='ACTIVE'>Active</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <input {...getInputProps()} />
                <Avatar sx={{ bgcolor: 'grey.100', width: 28, height: 28, mx: 'auto', mb: 1 }} variant='rounded'>
                  <i className='tabler-upload' />
                </Avatar>
                <Typography variant='body1'>Drag and drop your image</Typography>
                <Typography variant='caption'>or</Typography>
                <Button variant='outlined' size='small' sx={{ mt: 1 }}>
                  Browse File
                </Button>
              </Box>

              {uploadedImageUrl && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <img
                    src={uploadedImageUrl}
                    alt='Uploaded'
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                  />
                  <Typography variant='caption' mt={1}>
                    Uploaded Image Preview
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={handleSubmit}
                  sx={{ color: 'white' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color='inherit' /> : 'Save'}
                </Button>
                <Button fullWidth variant='outlined' onClick={handleAddCategoryClose} disabled={isSubmitting}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}
