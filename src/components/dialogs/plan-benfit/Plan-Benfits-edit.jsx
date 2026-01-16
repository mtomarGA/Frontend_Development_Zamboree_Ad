'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  IconButton
} from '@mui/material'
import { X } from 'lucide-react'
import CustomTextField from '@/@core/components/mui/TextField'
import benefitsService from '@/services/utsav-packages/benifits.Service'
import Image from '@/services/imageService'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'

const PlanBenifitsEdit = ({ onClose, editData, onSuccess, setViewOpen, viewOpen }) => {
  const fileInputRef = useRef(null)
  const [packages, setPackages] = useState([])
  const [imageLoader, setImageLoader] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isViewMode, setIsViewMode] = useState(viewOpen)

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    chooseCategories: [],
    howToRedeem: ['']
  })

  // ✅ Sync local view mode with props
  // useEffect(() => {
  //   setIsViewMode(viewOpen)
  // }, [viewOpen])

  // ✅ Fetch categories
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await serviceCategoryService.getAllServiceCategory()
        const packageList = Array.isArray(res) ? res : res?.data || res?.result || []
        setPackages(packageList)
      } catch {
        setPackages([])
      }
    }
    fetchPackages()
  }, [])

  // ✅ Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        image: editData.image || '',
        chooseCategories: Array.isArray(editData.chooseCategories)
          ? editData.chooseCategories.map(cat => cat._id || cat)
          : editData.chooseCategories
            ? [editData.chooseCategories]
            : [],
        howToRedeem:
          editData.howToRedeem?.length > 0
            ? editData.howToRedeem
            : ['']
      })
      setFileName(editData.image ? 'Current image' : '')
    } else {
      setFormData({
        title: '',
        image: '',
        chooseCategories: [],
        howToRedeem: ['']
      })
    }
  }, [editData])

  // ✅ Reset viewOpen on unmount
  useEffect(() => {
    return () => {
      if (typeof setViewOpen === 'function') setViewOpen(false)
    }
  }, [setViewOpen])

  // ✅ Handlers
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleHowToRedeemChange = (index, value) => {
    const updated = [...formData.howToRedeem]
    updated[index] = value
    setFormData(prev => ({ ...prev, howToRedeem: updated }))
  }

  const addHowToRedeem = () => {
    setFormData(prev => ({ ...prev, howToRedeem: [...prev.howToRedeem, ''] }))
  }

  const removeHowToRedeem = index => {
    if (formData.howToRedeem.length > 1) {
      const updated = formData.howToRedeem.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, howToRedeem: updated }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editData) {
        await benefitsService.updateBenefits(editData._id, formData)
      } else {
        await benefitsService.createBenefits(formData)
      }
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
    if (typeof setViewOpen === 'function') setViewOpen(false)
    setIsViewMode(false)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* ✅ Close icon */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(0,0,0,0.05)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
        }}
      >
        <X size={20} />
      </IconButton>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} p={4}>
          <Grid item xs={12}>
            <Typography variant="h4">
              {isViewMode
                ? 'View How To Redeem Conditions'
                : editData
                  ? 'Edit How To Redeem Conditions'
                  : 'Add How To Redeem Conditions'}
            </Typography>
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <CustomTextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              disabled={isViewMode}
            />
          </Grid>

          {/* Choose Categories */}
          <Grid item xs={12}>
            <FormControl fullWidth disabled={isViewMode}>
              <InputLabel>Choose Categories</InputLabel>
              <Select
                name="chooseCategories"
                value={formData.chooseCategories}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    chooseCategories: e.target.value
                  }))
                }
                multiple
                renderValue={selected => {
                  if (!selected.length) return 'Select categories'
                  return packages
                    .filter(pkg => selected.includes(pkg._id))
                    .map(pkg => pkg.name)
                    .join(', ')
                }}
              >
                {packages.length > 0 ? (
                  packages.map(pkg => (
                    <MenuItem key={pkg._id} value={pkg._id}>
                      {pkg.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No categories available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* How to Redeem */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" mb={1}>
              How to Redeem
            </Typography>
            {formData.howToRedeem.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <CustomTextField
                  label={`Condition ${index + 1}`}
                  value={item}
                  onChange={e => handleHowToRedeemChange(index, e.target.value)}
                  fullWidth
                  disabled={isViewMode}
                />
                {!isViewMode && (
                  <IconButton
                    onClick={() => removeHowToRedeem(index)}
                    sx={{ ml: 1 }}
                    disabled={formData.howToRedeem.length === 1}
                  >
                    <X size={16} />
                  </IconButton>
                )}
              </Box>
            ))}
            {!isViewMode && (
              <Button variant="outlined" onClick={addHowToRedeem} sx={{ mt: 1 }}>
                Add Condition
              </Button>
            )}
          </Grid>

          {/* Submit */}
          {!isViewMode && (
            <Grid item xs={12}>
              <Button variant="contained" type="submit" disabled={imageLoader}>
                {editData ? 'Update' : 'Save'}
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  )
}

export default PlanBenifitsEdit
