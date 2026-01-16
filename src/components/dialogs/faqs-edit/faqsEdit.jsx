'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Chip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomTextField from '@/@core/components/mui/TextField'
import faqsService from '@/services/utsav-packages/faqs.Service'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

const EditFaq = ({ open, onClose, faqData, viewOpen = false, setViewOpen }) => {
  const [loading, setLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [isViewMode, setIsViewMode] = useState(viewOpen)

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      selectedCategories: [],
      terms: [{ value: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'terms'
  })

  // Update view mode when dialog opens or viewOpen prop changes
  useEffect(() => {
    if (open) {
      // Set view mode immediately when dialog opens to prevent flickering
      setIsViewMode(viewOpen)
    } else {
      // Reset view mode when dialog closes
      setIsViewMode(false)
    }
  }, [viewOpen, open])

  // Fetch categories once
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const res = await serviceCategoryService.getAllServiceCategory()
          setCategoryList(Array.isArray(res?.data) ? res.data : [])
        } catch (err) {
          console.error('Error fetching categories:', err)
        }
      }
      fetchCategories()
    }
  }, [open])

  // Pre-fill form data when editing - only when dialog opens and faqData is available
  useEffect(() => {
    if (open && faqData) {
      reset({
        title: faqData.title || '',
        selectedCategories: faqData.categories ? faqData.categories.map(cat => cat._id) : [],
        terms: faqData.terms && faqData.terms.length > 0
          ? faqData.terms.map(term => ({ value: term }))
          : [{ value: '' }]
      })
    } else if (!open) {
      // Reset form when dialog closes
      setIsViewMode(false)
      reset({
        title: '',
        selectedCategories: [],
        terms: [{ value: '' }]
      })
    }
  }, [faqData, reset, open])

  // Ensure view mode resets if component unmounts (e.g., route change)
  useEffect(() => {
    return () => {
      if (typeof setViewOpen === 'function') {
        setViewOpen(false)
      }
    }
  }, [])

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await faqsService.updateFaq(faqData._id, {
        title: data.title,
        categories: data.selectedCategories,
        terms: data.terms.map(term => term.value)
      })
      toast.success('Terms & Conditions updated successfully')
      onClose(true)
    } catch (error) {
      console.error('Error updating Terms & Conditions:', error)
      toast.error('Failed to update Terms & Conditions')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose(false)
    if (typeof setViewOpen === 'function') {
      setViewOpen(false)
    }
    setIsViewMode(false)
  }

  // Use isViewMode state instead of viewOpen prop directly to prevent flickering
  const dialogTitle = isViewMode ? 'View Terms & Conditions' : 'Edit Terms & Conditions'

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{
        onExited: () => {
          if (typeof setViewOpen === 'function') {
            setViewOpen(false)
          }
        }
      }}
    >
      {/* Dialog Title with Close Button */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography component={"span"}>{dialogTitle}</Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} mt={1}>


            <Grid item xs={12}>
              <Controller
                name='selectedCategories'
                control={control}
                rules={{
                  required: isViewMode ? false : 'At least one category is required'
                }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.selectedCategories}
                    sx={{
                      '& .MuiInputBase-root': {
                        minHeight: '56px',
                        '&.Mui-focused': {
                          minHeight: '56px'
                        }
                      }
                    }}
                  >
                    <InputLabel id="categories-select-label" shrink={field.value?.length > 0}>
                      Choose Categories *
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="categories-select-label"
                      multiple
                      fullWidth
                      notched
                      disabled={isViewMode}
                      sx={{
                        '& .MuiSelect-select': {
                          padding: field.value?.length > 0 ? '10px 14px' : '16.5px 14px',
                          minHeight: 'auto',
                          height: 'auto',
                          display: 'flex',
                          alignItems: 'flex-start',
                          boxSizing: 'border-box',
                          paddingTop: field.value?.length > 0 ? '10px' : '16.5px',
                          paddingBottom: field.value?.length > 0 ? '10px' : '16.5px'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          '& legend': {
                            width: field.value?.length > 0 ? '135px' : '0px'
                          }
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            width: 'auto'
                          }
                        },
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left'
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left'
                        }
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>Select categories</em>
                        }
                        return (
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                              width: '100%',
                              maxWidth: '100%',
                              mt: field.value?.length > 0 ? 0.5 : 0,
                              mb: field.value?.length > 0 ? 0.5 : 0
                            }}
                          >
                            {selected.map((value) => {
                              const category = categoryList.find(cat => cat._id === value)
                              return (
                                <Chip
                                  key={value}
                                  label={category?.name || value}
                                  size="small"

                                  sx={{
                                    height: '24px',
                                    '& .MuiChip-label': {
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '200px',
                                      px: 1
                                    }
                                  }}
                                />
                              )
                            })}
                          </Box>
                        )
                      }}
                    >
                      {categoryList.map(cat => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.selectedCategories && (
                      <FormHelperText>{errors.selectedCategories.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>


            {/* Terms and Conditions Title */}
            <Grid item xs={12}>
              <Controller
                name='title'
                control={control}
                rules={{
                  required: isViewMode ? false : 'Terms and Conditions Title is required'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Terms and Conditions Title *'
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isViewMode}
                  />
                )}
              />
            </Grid>

            {/* Terms and Conditions */}
            <Grid item xs={12}>
              <Typography variant='h6' mb={2}>
                Terms and Conditions
              </Typography>
              {fields.map((field, index) => (
                <Box key={field.id} display='flex' alignItems='center' mb={2}>
                  <Controller
                    name={`terms.${index}.value`}
                    control={control}
                    rules={{
                      required: isViewMode ? false : 'Term is required'
                    }}
                    render={({ field: inputField }) => (
                      <CustomTextField
                        {...inputField}
                        label={`Term ${index + 1} *`}
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={10}
                        disabled={isViewMode}
                        error={!!errors.terms?.[index]?.value}
                        helperText={errors.terms?.[index]?.value?.message}
                      />
                    )}
                  />
                  {!isViewMode && (
                    <IconButton
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      sx={{ ml: 1 }}
                      aria-label="delete term"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              {!isViewMode && (

                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={() => append({ value: '' })}
                  sx={{ mt: 1 }}
                >
                  Add Term
                </Button>
              )}
            </Grid>

            {/* Buttons */}
            {!isViewMode && (

              <Grid item xs={12} textAlign='right'>
                <Stack direction='row' spacing={2} justifyContent='flex-end'>
                  <Button variant='outlined' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditFaq
