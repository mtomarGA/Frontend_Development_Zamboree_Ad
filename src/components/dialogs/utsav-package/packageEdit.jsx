'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Box,
  Grid,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
  TextField
} from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import voucherRoute from '@/services/utsav/voucher'
import createUtsavPackage from '@/services/utsav-packages/utsavPackageService'
import { GripVertical, Plus, Trash2, X } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const EditUtsavPackageForm = ({ utsavPackageEdit, setselectedUtsavPackage, getPackage, onSuccess }) => {
  const fileInputRef = useRef(null)

  const [voucherTypes, setVoucherTypes] = useState([])
  const [fileName, setFileName] = useState('')
  const [imageLoader, setImageLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [voucherRows, setVoucherRows] = useState([{ id: Date.now(), value: '' }])
  const [redeemRows, setRedeemRows] = useState([{ id: Date.now(), value: '' }])

  const [formData, setFormData] = useState({
    title: '',
    packageId: '',
    price: '',
    offer_price: '',
    packageValiditydays: '',
    status: 'ACTIVE',
    image: '',
    benefits: [''],
    faqs: []
  })

  const getAvailableVouchersForRow = (currentRowId) => {
    const selectedVoucherIds = voucherRows
      .filter(row => row.id !== currentRowId && row.value)
      .map(row => row.value)

    return voucherTypes.filter(voucher => !selectedVoucherIds.includes(voucher._id))
  }

  // Fetch voucher types
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true)
        const res = await voucherRoute.getVoucher()

        let vouchers = []
        if (Array.isArray(res)) {
          vouchers = res
        } else if (res?.data && Array.isArray(res.data)) {
          vouchers = res.data
        } else if (res?.vouchers && Array.isArray(res.vouchers)) {
          vouchers = res.vouchers
        } else {
          console.warn('Unexpected voucher response structure:', res)
          vouchers = []
        }

        // ✅ सिर्फ ACTIVE vouchers रखो
        const activeVouchers = vouchers
          .filter(v => v.status === 'ACTIVE')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setVoucherTypes(activeVouchers)
      } catch (error) {
        console.error('Failed to fetch vouchers:', error)
        toast.error('Failed to load voucher types')
        setVoucherTypes([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchVouchers()
  }, [])

  useEffect(() => {
    if (utsavPackageEdit && voucherTypes.length > 0) {
      setFormData({
        faqs: utsavPackageEdit.faqs || [],
        title: utsavPackageEdit.title || '',
        packageId: utsavPackageEdit.packageId || '',
        price: utsavPackageEdit.price || '',
        packageValiditydays: utsavPackageEdit.packageValiditydays || '',
        status: utsavPackageEdit.status || 'ACTIVE',
        image: utsavPackageEdit.image || '',
        offer_price: utsavPackageEdit.offer_price || '',
        benefits: utsavPackageEdit.benefits || []
      })
      setFileName(utsavPackageEdit.image ? 'Current image' : '')

      if (Array.isArray(utsavPackageEdit.benefits) && utsavPackageEdit.benefits.length > 0) {
        setBenefitsFields(utsavPackageEdit.benefits)
      } else {
        setBenefitsFields([''])
      }

      // Handle combined voucher data: assume chooseVoucherType is array of {voucher, limit} or separate arrays
      if (Array.isArray(utsavPackageEdit.chooseVoucherType)) {
        if (utsavPackageEdit.chooseVoucherType.length > 0 && typeof utsavPackageEdit.chooseVoucherType[0] === 'object') {
          // Combined format: [{voucher, limit}]
          setVoucherRows(
            utsavPackageEdit.chooseVoucherType.map((item, i) => ({
              id: Date.now() + i,
              value: item.voucher
            }))
          )
          setRedeemRows(
            utsavPackageEdit.chooseVoucherType.map((item, i) => ({
              id: Date.now() + i,
              value: item.limit.toString()
            }))
          )
        } else {
          // Separate arrays
          setVoucherRows(
            utsavPackageEdit.chooseVoucherType.map((voucherId, i) => ({
              id: Date.now() + i,
              value: voucherId
            }))
          )
          if (Array.isArray(utsavPackageEdit.noOfRedeemLimit)) {
            setRedeemRows(
              utsavPackageEdit.noOfRedeemLimit.map((limit, i) => ({
                id: Date.now() + i,
                value: limit.toString()
              }))
            )
          }
        }
      }
    }
  }, [utsavPackageEdit, voucherTypes])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async e => {
    try {
      setImageLoader(true)
      const file = e.target.files?.[0]
      if (!file) return

      const formDataImg = new FormData()
      formDataImg.append('image', file)
      const res = await Image.uploadImage(formDataImg)

      if (res?.data?.url) {
        setFormData(prev => ({ ...prev, image: res.data.url }))
        setFileName(file.name)
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Image URL not received from server')
      }
    } catch {
      toast.error('Image upload failed')
    } finally {
      setImageLoader(false)
    }
  }

  const removeRow = rowId => {
    if (voucherRows.length > 1) {
      setVoucherRows(prev => prev.filter(row => row.id !== rowId))
      setRedeemRows(prev => prev.filter(row => row.id !== rowId))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const combinedVoucherData = voucherRows
      .map(row => {
        const redeem = redeemRows.find(r => r.id === row.id)
        if (row.value && redeem?.value) {
          return { voucher: row.value, limit: Number(redeem.value) }
        }
        return null
      })
      .filter(Boolean)

    if (combinedVoucherData.length === 0) {
      toast.error('Please add at least one voucher with limit')
      return
    }

    if (!formData.title.trim() || !formData.packageId.trim() || !formData.price || !formData.status) {
      toast.error('Please fill all required fields')
      return
    }
    if (!formData.image) {
      toast.error('Package image is required')
      return
    }

    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('price', Number(formData.price))
    submitData.append('packageId', formData.packageId)
    submitData.append('packageValiditydays', formData.packageValiditydays)
    submitData.append('status', formData.status.toUpperCase())
    submitData.append('image', formData.image)
    submitData.append('offer_price', Number(formData.offer_price))

    // ✅ Send benefits as array fields
    benefitsFields
      .filter(b => b.trim() !== '')
      .forEach((b, i) => submitData.append(`benefits[${i}]`, b))

    // ✅ Send unified voucher + limit as array of objects
    combinedVoucherData.forEach((v, i) => {
      submitData.append(`chooseVoucherType[${i}][voucher]`, v.voucher)
      submitData.append(`chooseVoucherType[${i}][limit]`, v.limit)
    })

    // ✅ Send FAQs as array of objects
    formData.faqs.forEach((faq, index) => {
      submitData.append(`faqs[${index}][question]`, faq.question)
      submitData.append(`faqs[${index}][answer]`, faq.answer)
    })

    try {
      const result = await createUtsavPackage.updatePackage(utsavPackageEdit._id, submitData)
      if (result.data?.message?.length) {
        result.data.message.forEach(msg => toast.error(msg))
      } else {
        toast.success('Package updated successfully')
      }
      getPackage()
      onSuccess(false)
      setselectedUtsavPackage(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    }
  }




  // --- FAQs Management ---
  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs]
    updatedFaqs[index][field] = value
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }))
  }

  const handleRemoveFaq = index => {
    const updatedFaqs = [...formData.faqs]
    updatedFaqs.splice(index, 1)
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }))
  }

  const handleFaqDragEnd = result => {
    if (!result.destination) return
    const reordered = Array.from(formData.faqs)
    const [movedItem] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, movedItem)
    setFormData(prev => ({ ...prev, faqs: reordered }))
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
    <Card>
      <CardHeader title='Edit Utsav Package' />
      <CardContent>
        {isLoading && (
          <Box display="flex" justifyContent="center" mb={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" ml={1}>Loading voucher types...</Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Name *'
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Package ID *'
                value={formData.packageId}
                onChange={e => handleInputChange('packageId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} md={6}>
                {voucherRows.map((row, index) => {
                  const availableVouchers = getAvailableVouchersForRow(row.id)
                  return (
                    <Box key={row.id} display='flex' mb={1} alignItems='center'>
                      <CustomTextField
                        select
                        label={`Voucher Type ${index + 1}`}
                        fullWidth
                        value={row.value}
                        onChange={e =>
                          setVoucherRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, value: e.target.value } : r))
                          )
                        }
                        disabled={isLoading || voucherTypes.length === 0}
                      >
                        {availableVouchers.length === 0 ? (
                          <MenuItem disabled value="">
                            {voucherTypes.length === 0 ? 'No voucher types available' : 'All voucher types selected'}
                          </MenuItem>
                        ) : (
                          availableVouchers.map(v => (
                            <MenuItem key={v._id} value={v._id}>
                              {v.vouchertype}
                            </MenuItem>
                          ))
                        )}

                        {row.value && !availableVouchers.find(v => v._id === row.value) && (
                          <MenuItem key={row.value} value={row.value}>
                            {voucherTypes.find(v => v._id === row.value)?.vouchertype || 'Selected Voucher'}
                          </MenuItem>
                        )}
                      </CustomTextField>
                    </Box>
                  )
                })}
              </Grid>

              <Grid item xs={12} md={6}>
                {redeemRows.map((row, index) => (
                  <Box key={row.id} display='flex' mb={1} alignItems='center' gap={1}>
                    <CustomTextField
                      label={`Redeem Limit ${index + 1}`}
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
                      isLoading ||
                      voucherRows.some(r => !r.value) ||
                      voucherRows.length >= voucherTypes.length ||
                      voucherTypes.length === 0
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

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Price *'
                type='number'
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Offer Price *'
                type='number'
                value={formData.offer_price}
                onChange={e => handleInputChange('offer_price', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Validity (Days)'
                type='number'
                value={formData.packageValiditydays}
                onChange={e => handleInputChange('packageValiditydays', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
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

            <Grid item xs={12}>
              <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h6'>FAQs</Typography>
                <Button
                  variant='outlined'
                  startIcon={<Plus size={18} />}
                  onClick={handleAddFaq}
                >
                  Add FAQ
                </Button>
              </Box>

              <DragDropContext onDragEnd={handleFaqDragEnd}>
                <Droppable droppableId='faqs'>
                  {provided => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {formData.faqs.map((faq, index) => (
                        <Draggable key={index} draggableId={`faq-${index}`} index={index}>
                          {provided => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                p: 2,
                                mb: 2,
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                backgroundColor: 'Background.default'
                              }}
                            >
                              <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'
                                mb={2}
                              >
                                <Box
                                  {...provided.dragHandleProps}
                                  sx={{ display: 'flex', alignItems: 'center', cursor: 'grab' }}
                                >
                                  <GripVertical size={18} style={{ marginRight: 8 }} />
                                  <Typography variant='subtitle2'>
                                    FAQ {index + 1}
                                  </Typography>
                                </Box>
                                <IconButton
                                  color='error'
                                  onClick={() => handleRemoveFaq(index)}
                                  size='small'
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <CustomTextField
                                    fullWidth
                                    label='Question'
                                    value={faq.question}
                                    onChange={e =>
                                      handleFaqChange(index, 'question', e.target.value)
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <CustomTextField
                                    fullWidth
                                    label='Answer'
                                    value={faq.answer}
                                    onChange={e =>
                                      handleFaqChange(index, 'answer', e.target.value)
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Grid>


            {/* Image */}
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' mb={1}>
                Package Image *
              </Typography>
              {formData.image && (
                <Box mb={2} textAlign='center'>
                  <img
                    src={formData.image}
                    alt='Package Preview'
                    style={{
                      maxWidth: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #ccc'
                    }}
                  />
                </Box>
              )}
              <input
                type='file'
                ref={fileInputRef}
                accept='image/*'
                onChange={handleImageUpload}
                disabled={imageLoader}
                style={{ width: '100%' }}
              />
              {fileName && (
                <Typography variant='body2' sx={{ mt: 1 }}>
                  {imageLoader ? 'Uploading...' : `Selected: ${fileName}`}
                </Typography>
              )}
              {imageLoader && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end' gap={2}>
                <Button variant='contained' color='primary' type='submit' disabled={imageLoader || isLoading}>
                  {imageLoader ? 'Updating...' : 'Update Package'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditUtsavPackageForm
