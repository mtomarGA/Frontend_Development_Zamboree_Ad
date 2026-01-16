'use client'

// React Imports
import { useEffect, useState, useMemo, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'


// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
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
import { toast } from "react-toastify";

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Service Imports
import DocumentTypeService from '@/services/employee/Master/DocumentTypeService'

// Hook Import
import { useEmployeeForm } from '../../useEmployeeForm'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Box, Grid } from '@mui/material'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
import { is } from 'valibot'
import ImageService from '@/services/imageService'
import { styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// Vars
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const DocumentTypeForm = ({ nextHandle, handleCancel }) => {
  const {
    documentFormData,
    documentErrors,
    handleDocumentChange,
    validateDocument,
    addDocument,
    removeDocument,
    updateDocument,
    documentList,
    isEditMode,
    resetForm,
    setDocumentFormData, // Assuming you can expose this from your useEmployeeForm hook
    setTabManagement, // Assuming you can expose this from your useEmployeeForm hook
    tabManagement, // Assuming you can expose this from your useEmployeeForm hook
  } = useEmployeeFormContext();
  const fileInputRef = useRef(null);


  const [loading, setLoading] = useState(false)
  const [documentTypeList, setDocumentTypeList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [editIndex, setEditIndex] = useState(null)


  const columns = useMemo(
    () => [
      columnHelper.accessor('documentType', {
        header: 'Document Type',
        cell: ({ row }) => {
          const selectedDoc = documentTypeList.find(item => item._id === row.original.documentType)
          return (
            <Typography color="text.primary">
              {selectedDoc ? selectedDoc.name : 'Unknown'}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('fileURL', {
        header: 'File URL',
        cell: ({ row }) => {
          //check if the extenion of the image is jpg, jpeg, png, or gif then show the image else show the file name
          const fileExtension = row.original.fileURL.split('.').pop().toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
          return isImage ? (
            <img //set max width 60%
              className='h-20 max-w-[100%] object-contain'
              src={row.original.fileURL}
              alt='uploaded document'
            />
          ) : (

            <Typography color="text.primary">{fileExtension === 'pdf' ? "PDF File" : "Unknown File Type"}</Typography>
          );
        }
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const data = row.original
                setDocumentFormData({
                  documentType: data.documentType,
                  fileURL: data.fileURL
                })
                setEditIndex(row.index)
              }}
              className="text-blue-500 tabler-edit text-xl cursor-pointer"
              title="Edit"
            />
            <button
              onClick={() => removeDocument(row.index)}
              className="text-red-500 tabler-trash text-xl cursor-pointer"
              title="Remove"
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [documentTypeList, removeDocument]
  )

  const table = useReactTable({
    data: documentList,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true)
      const response = await DocumentTypeService.get()
      setDocumentTypeList(response.data)
    } catch (error) {
      console.error('Error fetching document types:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentTypes()
  }, [])

  const handleAddOrUpdate = () => {
    if (validateDocument()) {
      if (editIndex !== null) {
        updateDocument(editIndex)
        setEditIndex(null)
      } else {
        addDocument()
      }

    }
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setDocumentFormData({
      documentType: '',
      fileURL: ''
    })
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = ''; // Clear the file input value
    // }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit');
    if (!isEditMode && documentList.length === 0) {
      toast.error('Please add documents before proceeding.')
      return
    }
    e.preventDefault()
    setTabManagement(prev => ({
      ...prev,
      General: {
        ...prev.General,
        bank: true,
      }
    }))
    nextHandle()
  }

  //image loader
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  const handleImageUpload = async (e) => {
    setImageUploadLoading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    try {
      const response = await ImageService.uploadImage(formData)
      handleDocumentChange('fileURL', response.data.url)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setImageUploadLoading(false)
    }
  }
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });



  return (
    <Grid container spacing={4} component="form" onSubmit={handleSubmit} noValidate>
      <Grid item xs={12} >
        <Card sx={{ p: 4 }} >
          <Typography variant="h5" className="mb-4">
            {editIndex !== null ? 'Edit Document' : 'Add Documents'}
          </Typography>

          <CardContent className="flex flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
            <CustomTextField
              select
              fullWidth
              required
              label="Document Type"
              value={documentFormData.documentType}
              onChange={e => handleDocumentChange('documentType', e.target.value)}
              error={!!documentErrors.documentType}
              helperText={documentErrors.documentType}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: selected => {
                    if (selected === '') {
                      return <p>Select Document Type</p>
                    }
                    const selectedItem = documentTypeList.find(item => item._id === selected)
                    return selectedItem ? selectedItem.name : ''
                  }
                }
              }}
            >
              {/* <MenuItem value="">Select Document Type</MenuItem> */}
              {documentTypeList.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>

            {!documentFormData.fileURL && <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className='mb-2'
            >
              Upload Document
              <VisuallyHiddenInput
                type="file"
                required
                inputRef={fileInputRef}
                accept="image/*,application/pdf"
                onChange={e => handleImageUpload(e)}
              />
            </Button>}
            {documentFormData.fileURL && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(documentFormData.fileURL, '_blank')}
                >
                  Preview Uploaded File
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDocumentChange('fileURL', '')}
                >
                  Remove
                </Button>
              </div>
            )}

            {documentErrors.fileURL && <p className="text-red-500 text-sm mt-1">{documentErrors.fileURL}</p>}

            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={handleAddOrUpdate}
                disabled={imageUploadLoading}
              >
                {editIndex !== null ? 'Update Document' : 'Add Document'}
              </Button>
              {editIndex !== null && (
                <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <div className="overflow-x-auto">
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No documents added.
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

        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button className='m-2' onClick={() => { handleCancel(); resetForm() }} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button className='m-2' type="submit" variant="contained" color="primary">
            Next
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default DocumentTypeForm
