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

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Service Imports


// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Box, Grid } from '@mui/material'
import { useTempleContext } from '@/contexts/TempleFormContext'
import FileUploader from './sections/component/FileUploader'
import ImageService from '@/services/imageService'
import { useBuddhism } from '@/contexts/BuddhaFormContext'

// Vars
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const DonationList = ({ nextHandle, handleCancel }) => {
  const {
    donationData, setDonationData,
    donationErrors, setDonationErrors,
    donationList,
    removeDonation,
    validateDonationData,
    addDonation,
    updateDonation,
    handleDonationDataChange,
    setTempleTabManager
  } = useBuddhism();
  const fileInputRef = useRef(null);


  const [imageUploading, setImageUploading] = useState(false)

  const [globalFilter, setGlobalFilter] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => {
          const data = row.original
          return (
            <img
              src={data.image}
              alt="Document"
              style={{ width: '50px', height: '50px', borderRadius: '4px' }}
            />
          )
        }
      }),
      columnHelper.accessor('description', {
        header: 'description',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.description}</Typography>
        )
      }),
      columnHelper.accessor('button_text', {
        header: 'Button Text',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.button_text}</Typography>
        )
      }),
      columnHelper.accessor('button_link', {
        header: 'Button Link',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.button_link}</Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const data = row.original
                setDonationData({
                  image: data.image,
                  description: data.description,
                  button_text: data.button_text,
                  button_link: data.button_link,
                })
                console.log(row);

                setEditIndex(row.index)
              }}
              className="text-blue-500 tabler-edit text-xl cursor-pointer"
              title="Edit"
            />
            <button
              onClick={() => removeDonation(row.index)}
              className="text-red-500 tabler-trash text-xl cursor-pointer"
              title="Remove"
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [donationList, removeDonation]
  )

  const table = useReactTable({
    data: donationList,
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



  const handleAddOrUpdate = () => {
    if (validateDonationData()) {
      if (editIndex !== null) {
        updateDonation(editIndex)
        setEditIndex(null)
      } else {
        addDonation()
      }
    }
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setDonationData({
      image: '',
      description: '',
      button_text: '',
      button_link: '',
    })

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit');
    // if (!isEditMode && donationList.length === 0) {
    //   toast.error('Please add documents before proceeding.')
    //   return
    // }
    setTempleTabManager(prev => ({
            ...prev,
            security: true
        }))


    nextHandle()
  }

  return (
    <Grid container spacing={4} component="form" onSubmit={handleSubmit} noValidate>
      <Grid item xs={12} >
        <Card sx={{ p: 4 }} >
          <Typography variant="h5" className="mb-4">
            {editIndex !== null ? 'Edit Donation' : 'Add Donation'}
          </Typography>

          <CardContent className="flex flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">

            {/* <CustomTextField
              fullWidth
              label="File URL"
              type="file"
              inputRef={fileInputRef}
              // value={documentFormData.fileURL}
              onChange={e => handleDonationDataChange('image', e.target.value)}
              error={!!donationErrors.image}
              helperText={donationErrors.image}
            /> */}
            <Box
              sx={{
                width: '100%',
                height: 200,
                border: `1px dashed ${donationErrors.image ? 'red' : '#ccc'}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              <FileUploader

                initialFile={donationData.image}
                error_text={donationErrors.image}


                onFileSelect={async (file) => {
                  setImageUploading(true)
                  if (file) {
                    const url = URL.createObjectURL(file)
                    const formData = new FormData()
                    formData.append('image', file)
                    const uploadedFile = await ImageService.uploadImage(formData, { folder: "Spiritual/Buddhism/Temple" })
                    const imageUrl = uploadedFile.data.url
                    const imageId = uploadedFile.data.public_id
                    handleDonationDataChange('image', imageUrl)
                    handleDonationDataChange('imageId', imageId)
                    setImageUploading(false)
                  }
                  setImageUploading(false)
                }}
                imageId={donationData.imageId}
                imageUploading={imageUploading}
                setImageUploading={setImageUploading}
              />
            </Box>
            <CustomTextField
              fullWidth
              label="Description"
              value={donationData.description}
              onChange={e => handleDonationDataChange('description', e.target.value)}
              error={!!donationErrors.description}
              helperText={donationErrors.description}
            />
            <CustomTextField
              fullWidth
              label="Button Text"
              value={donationData.button_text}
              onChange={e => handleDonationDataChange('button_text', e.target.value)}
              error={!!donationErrors.button_text}
              helperText={donationErrors.button_text}
            />
            <CustomTextField
              fullWidth
              label="Button Link"
              value={donationData.button_link}
              onChange={e => handleDonationDataChange('button_link', e.target.value)}
              error={!!donationErrors.button_link}
              helperText={donationErrors.button_link}
            />

            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={handleAddOrUpdate}
              >
                {editIndex !== null ? 'Update' : 'Add'}
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

export default DonationList
