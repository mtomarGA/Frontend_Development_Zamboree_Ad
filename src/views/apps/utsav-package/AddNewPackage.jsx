'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react'
import { Button, Card, MenuItem, Grid, Typography, Box, CircularProgress, IconButton, TextField } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import createPackageService from '@/services/utsav-packages/utsavPackageService'
import Image from '@/services/imageService'
import voucherRoute from '@/services/utsav/voucher'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const AddNewPackageForm = ({ data }) => {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [fileName, setFileName] = useState('')
  const [imageLoader, setImageLoader] = useState(false)
  const [voucherTypes, setVoucherTypes] = useState([])
  const [existingPackages, setExistingPackages] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    packageId: '',
    packageValiditydays: '',
    image: '',
    status: 'INACTIVE'
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({ mode: 'onChange' })
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalImage, setOriginalImage] = useState('')

  // Dynamic fields
  const [voucherRows, setVoucherRows] = useState([{ id: Date.now(), value: '' }])
  const [redeemRows, setRedeemRows] = useState([{ id: Date.now(), value: '' }])

  // Fetch vouchers & packages
  useEffect(() => {
    ; (async () => {
      try {
        const v = await voucherRoute.getVoucher()
        const activeVouchers = (v?.data || []).filter(v => v.status === "ACTIVE") // ✅ सिर्फ ACTIVE
        const p = await createPackageService.getPackage()
        setVoucherTypes(activeVouchers)
        setExistingPackages(p?.data || [])
      } catch {
        toast.error('Failed to load data')
      }
    })()
  }, [])

  // Prepopulate edit mode
  useEffect(() => {
    if (data && data._id) {
      setIsEditMode(true)
      const updatedForm = {
        title: data.title || '',
        price: data.price || '',
        packageId: data.packageId || '',
        packageValiditydays: data.packageValiditydays || '',
        image: data.image || '',
        status: (data.status || 'INACTIVE').toUpperCase()
      }

      setFormData(updatedForm)
      setOriginalImage(data.image || '')
      setFileName(data.image ? 'Current image' : '')

      Object.keys(updatedForm).forEach(key => {
        if (key !== 'image') setValue(key, updatedForm[key])
      })

      // Handle existing voucher types and redeem limits for edit mode
      if (data.chooseVoucherType) {
        const voucherArray = Array.isArray(data.chooseVoucherType) ? data.chooseVoucherType : [data.chooseVoucherType]
        setVoucherRows(voucherArray.map((type, index) => ({ id: Date.now() + index, value: type })))
      }
      if (data.noOfRedeemLimit) {
        const redeemArray = Array.isArray(data.noOfRedeemLimit) ? data.noOfRedeemLimit : [data.noOfRedeemLimit]
        setRedeemRows(redeemArray.map((limit, index) => ({ id: Date.now() + index, value: limit.toString() })))
      }
    }
  }, [data, setValue])

  // File upload
  const handleFileUpload = async e => {
    try {
      setImageLoader(true)
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) return

      const uploadData = new FormData()
      uploadData.append('image', selectedFile)
      const response = await Image.uploadImage(uploadData)

      if (response?.data?.url) {
        setFormData(prev => ({ ...prev, image: response.data.url }))
        setFileName(selectedFile.name)
      } else throw new Error('Upload failed')
    } catch {
      toast.error('Failed to upload image')
      setFormData(prev => ({ ...prev, image: '' }))
      setFileName('')
    } finally {
      setImageLoader(false)
    }
  }

  // Remove row function
  const removeRow = (rowId) => {
    if (voucherRows.length > 1) {
      setVoucherRows(prev => prev.filter(row => row.id !== rowId))
      setRedeemRows(prev => prev.filter(row => row.id !== rowId))
    }
  }

  // Submit
  // const onSubmit = async formValues => {
  //   const voucherValues = voucherRows.map(r => r.value).filter(Boolean)
  //   const redeemValues = redeemRows.map(r => r.value).filter(Boolean)

  //   if (voucherValues.length === 0) return toast.error('Please add at least one voucher type')
  //   if (!formValues.title?.trim() || !formValues.packageId?.trim() || !formValues.price || !formValues.status)
  //     return toast.error('Please fill in all required fields')
  //   if (!formData.image) return toast.error('Package image is required')

  //   if (
  //     !isEditMode &&
  //     existingPackages.some(pkg => pkg.title?.toLowerCase() === formValues.title.trim().toLowerCase())
  //   ) {
  //     return toast.error('This title already exists')
  //   }

  //   const submitData = new FormData()
  //   submitData.append('title', formValues.title)
  //   submitData.append('price', formValues.price)
  //   submitData.append('packageId', formValues.packageId)
  //   submitData.append('packageValiditydays', formValues.packageValiditydays)
  //   submitData.append('status', formValues.status.toUpperCase())
  //   submitData.append('image', formData.image)
  //   // submitData.append('offer_price', formValues.offer_price)
  //   submitData.append('offer_price', formValues.offer_price) // ✅ Important fix!
  //   submitData.append('benefits', JSON.stringify(benefitsFields.filter(Boolean))) // ✅ New

  //   faqFields.forEach((faq, index) => {
  //     submitData.append(`faqs[${index}][question]`, faq.question)
  //     submitData.append(`faqs[${index}][answer]`, faq.answer)
  //   })


  //   submitData.append('chooseVoucherType', JSON.stringify(voucherValues))
  //   submitData.append('noOfRedeemLimit', JSON.stringify(redeemValues))

  //   try {
  //     await (isEditMode
  //       ? createPackageService.updatePackage(formValues._id, submitData)
  //       : createPackageService.createPackage(submitData))
  //     toast.success(isEditMode ? 'Package updated successfully' : 'Package created successfully')
  //     router.push('/en/apps/utsav-package/utsav-packages')
  //   } catch (error) {
  //     console.error('Submit error:', error)
  //     toast.error(isEditMode ? 'Failed to update package' : 'Failed to create package')
  //   }
  // }


  const onSubmit = async formValues => {
    const combinedVoucherData = voucherRows
      .map(row => {
        const redeem = redeemRows.find(r => r.id === row.id)
        if (row.value && redeem?.value) {
          return { voucher: row.value, limit: Number(redeem.value) }
        }
        return null
      })
      .filter(Boolean)

    if (combinedVoucherData.length === 0)
      return toast.error('Please add at least one voucher with limit')

    if (!formValues.title?.trim() || !formValues.packageId?.trim() || !formValues.price || !formValues.status)
      return toast.error('Please fill in all required fields')
    if (!formData.image) return toast.error('Package image is required')

    if (
      !isEditMode &&
      existingPackages.some(pkg => pkg.title?.toLowerCase() === formValues.title.trim().toLowerCase())
    ) {
      return toast.error('This title already exists')
    }

    const submitData = new FormData()
    submitData.append('title', formValues.title)
    submitData.append('price', formValues.price)
    submitData.append('packageId', formValues.packageId)
    submitData.append('packageValiditydays', formValues.packageValiditydays)
    submitData.append('status', formValues.status.toUpperCase())
    submitData.append('image', formData.image)
    submitData.append('offer_price', formValues.offer_price)

    // ✅ Send benefits as array fields, not JSON string
    benefitsFields
      .filter(Boolean)
      .forEach((b, i) => submitData.append(`benefits[${i}]`, b))

    // ✅ Send unified voucher + limit as array of objects
    combinedVoucherData.forEach((v, i) => {
      submitData.append(`chooseVoucherType[${i}][voucher]`, v.voucher)
      submitData.append(`chooseVoucherType[${i}][limit]`, v.limit)
    })

    // ✅ Send FAQs as array of objects
    faqFields.forEach((faq, index) => {
      submitData.append(`faqs[${index}][question]`, faq.question)
      submitData.append(`faqs[${index}][answer]`, faq.answer)
    })

    try {
      await (isEditMode
        ? createPackageService.updatePackage(formValues._id, submitData)
        : createPackageService.createPackage(submitData))
      toast.success(isEditMode ? 'Package updated successfully' : 'Package created successfully')
      router.push('/en/apps/utsav-package/utsav-packages')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(isEditMode ? 'Failed to update package' : 'Failed to create package')
    }
  }

  // FAQ Section with Drag and Drop
  const [faqFields, setFaqFields] = useState([{ question: '', answer: '' }])

  const handleFaqAddField = () => {
    setFaqFields(prev => [...prev, { question: '', answer: '' }])
  }

  const handleFaqRemoveField = index => {
    setFaqFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqFields]
    updated[index][field] = value
    setFaqFields(updated)
  }

  const handleFaqDragEnd = result => {
    if (!result.destination) return
    const items = Array.from(faqFields)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setFaqFields(items)
  }




  // handle fields ✅ Renamed to benefits
  const [benefitsFields, setBenefitsFields] = useState([''])

  const handleBenefitAddField = () => {
    setBenefitsFields(prev => [...prev, ''])
  }

  const handleBenefitRemoveField = index => {
    const newFields = [...benefitsFields]
    newFields.splice(index, 1)
    setBenefitsFields(newFields)
  }

  const handleBenefitChange = (index, event) => {
    const newFields = [...benefitsFields]
    newFields[index] = event.target.value
    setBenefitsFields(newFields)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 4, mx: 'auto' }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h4'>{isEditMode ? 'Edit Package' : 'Add New Package'}</Typography>
          <Button
            onClick={() => router.push('/en/apps/utsav-package/utsav-packages')}
            variant='outlined'
            startIcon={<ArrowLeft />}
          >
            Back
          </Button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Title & Package ID */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label='Title *'
                fullWidth
                {...register('title', { required: 'Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label='Package ID *'
                fullWidth
                {...register('packageId', { required: 'Package ID is required' })}
                error={!!errors.packageId}
                helperText={errors.packageId?.message}
              />
            </Grid>

            {/* Voucher Type & Redeem Limit Rows */}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} md={6}>
                {voucherRows.map(row => (
                  <Box key={row.id} display='flex' mb={1} alignItems='center'>
                    <CustomTextField
                      select
                      label='Voucher Type'
                      fullWidth
                      value={row.value}
                      onChange={e =>
                        setVoucherRows(prev =>
                          prev.map(r => (r.id === row.id ? { ...r, value: e.target.value } : r))
                        )
                      }
                    >
                      {voucherTypes
                        .filter(v =>
                          !voucherRows.some(
                            r => r.value === v._id && r.id !== row.id
                          )
                        )
                        .map(v => (
                          <MenuItem key={v._id} value={v._id}>
                            {v.vouchertype}
                          </MenuItem>
                        ))}
                    </CustomTextField>
                  </Box>
                ))}
              </Grid>
              {/* Redeem Limit */}
              <Grid item xs={12} md={6}>
                {redeemRows.map(row => (
                  <Box key={row.id} display='flex' mb={1} alignItems='center' gap={1}>
                    <CustomTextField
                      label='Redeem Limit'
                      type='number'
                      fullWidth
                      value={row.value}
                      onChange={e =>
                        setRedeemRows(prev =>
                          prev.map(r => (r.id === row.id ? { ...r, value: e.target.value } : r))
                        )
                      }
                    />
                    {redeemRows.length > 1 && (
                      <IconButton
                        onClick={() => removeRow(row.id)}
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <X size={18} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Grid>



              <Grid item xs={12}>
                <Box display='flex' justifyContent='flex-end'>
                  <Button
                    startIcon={<Plus />}
                    size='small'
                    disabled={
                      voucherRows.some(r => !r.value) || voucherRows.length >= voucherTypes.length
                    }
                    onClick={() => {
                      const newId = Date.now()
                      setVoucherRows(prev => [...prev, { id: newId, value: '' }])
                      setRedeemRows(prev => [...prev, { id: newId, value: '' }])
                    }}
                  >
                    Add Row
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Price, Validity, Status */}
            <Grid item xs={12} md={6}>
              <CustomTextField
                label='Price *'
                type='number'
                fullWidth
                {...register('price', { required: 'Price is required' })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                label='Offer Price *'
                type='number'
                fullWidth
                {...register('offer_price', { required: 'Offer Price is required' })}
                error={!!errors.offer_price}
                helperText={errors.offer_price?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField label='Validity (Days)' type='number' fullWidth {...register('packageValiditydays')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                label='Status *'
                fullWidth
                defaultValue='INACTIVE'
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {benefitsFields.map((value, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      label={`Benefits ${index + 1}`}
                      value={value}
                      onChange={e => handleBenefitChange(index, e)}
                    />
                    <IconButton
                      onClick={() => handleBenefitRemoveField(index)}
                      aria-label='delete'
                      color='error'
                      disabled={benefitsFields.length === 1}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  onClick={handleBenefitAddField}
                  variant='outlined'
                  startIcon={<Plus />}
                  sx={{ width: 'fit-content' }}
                >
                  Add Benefit
                </Button>
              </Box>
            </Grid>


            {/* FAQ Section */}
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                FAQs
              </Typography>

              <DragDropContext onDragEnd={handleFaqDragEnd}>
                <Droppable droppableId='faq-list'>
                  {provided => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                      {faqFields.map((faq, index) => (
                        <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                          {providedDrag => (
                            <Box
                              ref={providedDrag.innerRef}
                              {...providedDrag.draggableProps}
                              {...providedDrag.dragHandleProps}
                              sx={{
                                p: 2,
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                backgroundColor: 'Background.default',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              }}
                            >
                              <Typography variant='subtitle1' mb={1}>
                                FAQ {index + 1}
                              </Typography>

                              <CustomTextField
                                label='Question'
                                fullWidth
                                value={faq.question}
                                onChange={e => handleFaqChange(index, 'question', e.target.value)}
                                sx={{ mb: 2 }}
                              />

                              <CustomTextField
                                label='Answer'
                                fullWidth
                                multiline
                                rows={3}
                                value={faq.answer}
                                onChange={e => handleFaqChange(index, 'answer', e.target.value)}
                              />

                              <Box textAlign='right' mt={1}>
                                <IconButton
                                  onClick={() => handleFaqRemoveField(index)}
                                  color='error'
                                  size='small'
                                  disabled={faqFields.length === 1}
                                >
                                  <Trash2 size={20} />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>

              <Button
                onClick={handleFaqAddField}
                variant='outlined'
                startIcon={<Plus />}
                sx={{ width: 'fit-content', mt: 2 }}
              >
                Add FAQ
              </Button>
            </Grid>


            {/* Image Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' mb={1}>
                Package Image *
              </Typography>
              {formData.image && (
                <Box mb={2} textAlign='center'>
                  <img
                    src={formData.image || originalImage}
                    alt='Package'
                    style={{ maxWidth: '100%', height: 180, borderRadius: 8, border: '1px solid #ccc' }}
                  />
                </Box>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                disabled={imageLoader}
                style={{ width: '100%' }}
              />
              {fileName && (
                <Typography variant='body2' mt={1}>
                  {fileName}
                </Typography>
              )}
              {imageLoader && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Grid>




            <Grid item xs={12} textAlign='right'>
              <Button variant='contained' type='submit' disabled={!isValid || imageLoader}>
                {imageLoader ? 'Processing...' : isEditMode ? 'Update Package' : 'Create Package'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  )
}

export default AddNewPackageForm
