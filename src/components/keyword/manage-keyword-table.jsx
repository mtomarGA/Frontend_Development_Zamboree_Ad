'use client'

import { useEffect, useMemo, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Card,
  Divider,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  CardHeader
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import Grid from '@mui/material/Grid2'
import classnames from 'classnames'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'
import AddMoney from '@/views/apps/keywords/AddMoney'
import { useRouter } from 'next/navigation'
import Category from '@/services/category/category.service'
import SubCategory from '@/services/category/subCategory.service'

//import service keyword
import keyword from '@/services/keywords/createKeywordService'

import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

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

const Managekeyword = ({ datas, onSuccess ,getKeywords }) => {
  const { hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setData(datas || [])
  }, [datas])


  const [keywordId, setkeywordId] = useState()

  const handleSingleKeyword = (keywordId) => {
    const id = keywordId._id
    const name = keywordId.name
    setkeywordId(id)

    router.push(`/en/apps/keywords/import-singleKeyword/${id}`)
  }

  const [rowSelection, setRowSelection] = useState({})

  const [globalFilter, setGlobalFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [singleOpen, setSingleOpen] = useState(false)
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [modalMode, setModalMode] = useState('view')
 
  const [selectedKeyword, setSelectedKeyword] = useState()

  const [data, setData] = useState(datas || [])
  const [EditModalOpen, setEditModalOpen] = useState(false)
  const [EditSelectedUser, setEditSelectedUser] = useState(null)

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    name: ''
  })

  useEffect(() => {
    if (EditSelectedUser) {


      setFormData({
        category: EditSelectedUser?.category?._id || '',
        subcategory: EditSelectedUser?.subcategory?._id || '',
        name: EditSelectedUser?.name || ''
      });

      // If category exists, load its subcategories
      if (EditSelectedUser?.category?._id) {
        getSubCategory(EditSelectedUser.category._id);
      }
    }
  }, [EditSelectedUser]);

  const [errors, setErrors] = useState({
    category: '',
    subcategory: '',
    name: ''
  })
  const getCategory = async () => {
    const result = await Category.getCategories()
    setCategory(result.data)
  }

  const getSubCategory = async (id) => {

    const result = await SubCategory.getByCategoryId(id)

    setSubCategory(result.data)
  }

  useEffect(() => {
    getCategory()
    // getSubCategory()
  }, [])

  const handleKeywordDelete = (keywordToDelete) => {
    setFormData(prev => ({
      ...prev,
      name: prev.name.filter(k => k !== keywordToDelete)
    }))
  }

  const handleSave = async () => {
    const newErrors = {
      category: formData.category ? '' : 'Category is required',
      subcategory: formData.subcategory ? '' : 'Subcategory is required',
      name: formData.name.length > 0 ? '' : 'At least one keyword is required'
    }

    setErrors(newErrors)

    const hasError = Object.values(newErrors).some(error => error !== '')
    if (hasError) return
    const keywordId = EditSelectedUser._id

    const result = await keyword.updateKeyword(keywordId, formData)
    onSuccess()
    toast.success(result.message)
    setEditModalOpen(false)
    setFormData("")
  }

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()

    return [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) =>
        
          (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.category !== null ? row.original?.category?.name : 'None'}
          </Typography>
        )
      }),

      columnHelper.accessor('totalHits', {
        header: 'Total Hits',
        cell: ({ row }) => <Typography color='text.primary'>{row.original?.keywordTotalHist}</Typography>
      }),



      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {hasPermission("keywords_manage:view") && <IconButton
              onClick={() => {
                handleSingleKeyword(row.original)
              }}
            >
              <Tooltip title='Show Hits' placement='top-end'>
                <i className='tabler-hand-move text-orange-500 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>
            }
            {hasPermission("keywords_manage:add") && <IconButton
              onClick={() => {
                setModalMode('view')
                setSelectedKeyword(row.original)
                setModalOpen(true)
              }}
            >
              <Tooltip title='Add Money' placement='top-end'>
                <i className='tabler-currency-rupee text-green-500 text-2xl cursor-pointer' />
              </Tooltip>
            </IconButton>}
      
          </div>
        ),
        enableSorting: false
      })
    ]
  }, [])

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card className='shadow-none mt-0'>

      <div className='flex flex-wrap justify-between gap-4 pb-6 px-6'>
        <Grid container xs={12} className='flex items-center justify-between'>
          <CardHeader title='Keyword List' />
        </Grid>

        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search keyword'
            className='max-sm:is-full'
          />
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='flex-auto is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </div>

      <div className='overflow-x-auto '>
        <table className={tableStyles.table}>
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
                        {header.column.getIsSorted() === 'asc' && <i className='tabler-chevron-up text-xl' />}
                        {header.column.getIsSorted() === 'desc' && <i className='tabler-chevron-down text-xl' />}
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
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </div>

      <Dialog fullWidth open={modalOpen} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <AddMoney selectedKeyword={selectedKeyword} setModalOpen={setModalOpen} getKeywords={getKeywords} />
        </DialogTitle>
      </Dialog>

      <Dialog fullWidth open={EditModalOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col  sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <DialogContent>
            <Grid container spacing={6} className='flex flex-col'>
              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Category'
                  value={formData.category}
                  onChange={e => {
                    setFormData({ ...formData, category: e.target.value })
                    getSubCategory(e.target.value)
                  }}
                  error={!!errors.category}
                  helperText={errors.category}
                >
                  <MenuItem value='' disabled>
                    Select Category
                  </MenuItem>
                  {Array.isArray(category) &&
                    category.map(item => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Sub Category'
                  value={formData.subcategory || ''}
                  onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                  error={!!errors.subcategory}
                  helperText={errors.subcategory}
                >
                  <MenuItem value='' disabled>
                    Select Sub Category
                  </MenuItem>
                  {Array.isArray(subCategory) &&
                    subCategory.map(item => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </CustomTextField>

              </Grid>

              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  freeSolo
                  options={[]} // your string options here
                  value={formData.name || ''}
                  onChange={(event, newValue) => {
                    // This handles selection from dropdown or Enter key
                    setFormData(prev => ({
                      ...prev,
                      name: newValue || ''
                    }))
                  }}
                  onInputChange={(event, newInputValue) => {
                    // This updates as user types, without requiring Enter
                    setFormData(prev => ({
                      ...prev,
                      name: newInputValue || ''
                    }))
                  }}
                  getOptionLabel={option => {
                    return typeof option === 'string' ? option : ''
                  }}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      fullWidth
                      label='Keyword'
                      placeholder='Add keyword'
                      error={!!errors.keywords}
                      helperText={errors.keywords}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            {/* <Button onClick={() => setOpenGenderModal(false)}>Cancel</Button> */}
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </DialogTitle>
      </Dialog>
    </Card>
  )
}

export default Managekeyword
