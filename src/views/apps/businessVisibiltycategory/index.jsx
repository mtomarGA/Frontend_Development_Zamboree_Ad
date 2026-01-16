'use client'

import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Paper,
  Divider,
  Checkbox,
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'

// ✅ Import Drag & Drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// ✅ Services
import Categorys from '@/services/business/service/serviceCategory.service'
import HomeCategoryService from '@/services/homeCategory/HomeCategory.Service'
import Image from '@/services/imageService'

export default function CategoryAssignPage() {
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [assignedCategories, setAssignedCategories] = useState([])
  const [imageLoader, setImageLoader] = useState(false)
  const [categoryOptions, setCategoryOptions] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeName, setActiveName] = useState('')


  const [formData, setFormData] = useState({
    image: '',
  })

  // ✅ FETCH EXISTING HOME CATEGORIES
  const getHomeCat = async () => {
    try {
      const result = await HomeCategoryService.getHomeCategory()
      if (result?.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item) => ({
          name: item.name,
          image: item.image || '',
          categories: item.category.map((cat) => ({
            _id: cat?.categoryId?._id,
            label: cat?.categoryId?.name,
            image: cat?.categoryId?.thumbImage,
            checked: cat?.checked || false,
          })),
        }))
        setAssignedCategories(formatted)
      }
    } catch (err) {
      console.error('Failed to fetch Home Categories:', err)
    }
  }

  useEffect(() => {
    getHomeCat()
  }, [])




  // ✅ LIVE SEARCH
  const searchCat = async (query) => {
    if (!query.trim()) return setCategoryOptions([])
    try {
      setLoading(true)
      const result = await Categorys.searchAllCat(query)
      const formatted =
        result?.data?.map((cat) => ({
          label: cat.name,
          image: cat.thumbImage,
          _id: cat._id,
        })) || []
      setCategoryOptions(formatted)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchCat(query)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [query])

  // ✅ ADD CATEGORY LOCALLY
  const handleAddCategory = () => {
    if (!name) return toast.warn('Please enter a name')

    setAssignedCategories((prev) => {
      const existing = prev.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      )

      if (existing) {
        // Only updating image
        if (!selectedCategory) {
          if (!formData.image) return toast.warn('Please upload an image')
          return prev.map((item) =>
            item.name === name
              ? { ...item, image: formData.image || item.image }
              : item
          )
        }

        // Add category
        const alreadyAdded = existing.categories.some(
          (cat) => cat.label === selectedCategory.label
        )

        if (alreadyAdded) {
          return prev.map((item) =>
            item.name === name
              ? { ...item, image: formData.image || item.image }
              : item
          )
        }

        return prev.map((item) =>
          item.name === name
            ? {
              ...item,
              image: formData.image || item.image,
              categories: [
                ...item.categories,
                { ...selectedCategory, checked: false },
              ],
            }
            : item
        )
      }

      if (!selectedCategory)
        return (
          toast.warn('Please select a category for new name'),
          [...prev]
        )

      return [
        ...prev,
        {
          name,
          image: formData.image,
          categories: [{ ...selectedCategory, checked: false }],
        },
      ]
    })

    setSelectedCategory(null)
  }

  // ✅ TOGGLE CHECKBOX
  const handleCheckboxChange = (name, index) => {
    setAssignedCategories((prev) =>
      prev.map((item) =>
        item.name === name
          ? {
            ...item,
            categories: item.categories.map((cat, i) =>
              i === index ? { ...cat, checked: !cat.checked } : cat
            ),
          }
          : item
      )
    )
  }
  const handleDelete = async (name) => {
    const result = await HomeCategoryService.DeleteHomeCategory(name)
    toast.success(result.message)
    getHomeCat()
  }

  // ✅ DELETE CATEGORY
  const handleDeleteCategory = async (data, person) => {
    const _id = data?._id
    const personName = person?.name
    // console.log(, "ASsasasas");
    const result = await HomeCategoryService.removeCategory(personName, _id)
    toast.success(result?.message)
    getHomeCat()

  }

  // ✅ IMAGE UPLOAD
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return toast.warn('No file selected')
      if (file.size > 800 * 1024) return toast.error('Max file size is 800KB')

      setImageLoader(true)
      const formDataImg = new FormData()
      formDataImg.append('image', file)
      const imageUrls = await Image.uploadImage(formDataImg)
      setFormData((prev) => ({
        ...prev,
        imgSrc: imageUrls?.data?.url,
        image: imageUrls?.data?.url,
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
    } finally {
      setImageLoader(false)
    }
  }

  useEffect(() => {
    if (!name.trim()) {
      setFormData({ image: '' })
      return
    }

    const existing = assignedCategories.find(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (existing) {
      setFormData((prev) => ({
        ...prev,
        image: existing.image || '',
      }))
    } else {
      setFormData({ image: '' })
    }
  }, [name, assignedCategories])

  const handleResetImage = () => {
    setFormData({ image: '' })
  }

  const handleConsoleData = async () => {
    const formattedData = assignedCategories.map((item) => ({
      name: item.name,
      image: item.image || '',
      categories: item.categories.map((cat) => ({
        categoryId: cat._id,
        checked: cat.checked,
      })),
    }))

    try {
      const result = await HomeCategoryService.addHomeCategory(formattedData)
      toast.success(result.message)
      getHomeCat()
    } catch (err) {
      console.error(err)
      toast.error('Error submitting data')
    }
  }

  // ✅ DRAG END HANDLER
  const handleDragEnd = (result) => {
    const { destination, source, type } = result
    if (!destination) return

    // 🟦 Move Names
    // if (type === 'NAME') {
    //   const updated = Array.from(assignedCategories)
    //   const [moved] = updated.splice(source.index, 1)
    //   updated.splice(destination.index, 0, moved)
    //   setAssignedCategories(updated)
    //   return
    // }

    // 🟩 Move Categories inside a specific Name
    if (type.startsWith('CATEGORY')) {
      const nameIndex = Number(type.split('-')[1])
      const updated = [...assignedCategories]
      const currentCategories = Array.from(updated[nameIndex].categories)
      const [movedCat] = currentCategories.splice(source.index, 1)
      currentCategories.splice(destination.index, 0, movedCat)
      updated[nameIndex].categories = currentCategories
      setAssignedCategories(updated)
    }
  }

  return (
    <Box className="p-4 sm:p-6">
      <Grid container spacing={3}>
        {/* ✅ LEFT SECTION */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className="p-4 h-full w-100">
            <Typography variant="h5" className="mb-4 font-semibold text-center sm:text-left">
              Added Names & Categories
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {assignedCategories.length === 0 ? (
              <Typography color="text.secondary" className="text-center">
                No categories added yet.
              </Typography>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="nameList">
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {assignedCategories.map((person, i) => (
                        // 🚫 Removed Draggable here — only keep a normal Box
                        <Box
                          key={person.name}
                          className="mb-6 rounded-lg transition-all duration-200"
                        >
                          <Box
                            className="rounded-md p-3 mb-3 flex flex-col sm:flex-row items-center sm:items-start gap-3 cursor-pointer transition-all duration-200"
                            onClick={() => {
                              setName(person.name)
                              setFormData((prev) => ({ ...prev, image: person.image || '' }))
                            }}
                          >
                            <Avatar
                              src={person.image}
                              alt={person.name}
                              sx={{
                                width: 50,
                                height: 50,
                                border: '2px solid transparent',
                                transition: '0.2s',
                                '&:hover': { borderColor: '#1976d2' },
                              }}
                            />

                            <Typography
                              variant="h6"
                              className="font-semibold text-center mt-4 sm:text-left flex-1"
                            >
                              {person.name}
                            </Typography>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(person?.name);
                              }}
                              className="inline-flex items-center justify-center bg-red-500 border border-red-600 rounded-full p-2 hover:bg-red-600 transition cursor-pointer"
                            >
                              <i className="tabler-trash text-white text-lg" />
                            </span>

                          </Box>



                          {/* 🟩 Inner Droppable for categories (still draggable) */}
                          <Droppable droppableId={`categoryList-${i}`} type={`CATEGORY-${i}`} direction="horizontal">
                            {(provided2) => (
                              <Box
                                ref={provided2.innerRef}
                                {...provided2.droppableProps}
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
                              >
                                {person.categories.map((cat, index) => (
                                  <Draggable
                                    key={cat._id || cat.label}
                                    draggableId={`${person.name}-${cat.label}`}
                                    index={index}
                                  >
                                    {(provided3) => (
                                      <Box ref={provided3.innerRef} {...provided3.draggableProps} {...provided3.dragHandleProps}>
                                        {/* Category Card */}
                                        <Box className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden mb-1 mx-auto sm:mx-0 group">
                                          <Avatar
                                            src={cat.image}
                                            alt={cat.label}
                                            variant="rounded"
                                            sx={{
                                              width: '100%',
                                              height: '100%',
                                              transition: '0.3s',
                                              '&:hover': { opacity: 0.85 },
                                            }}
                                          />

                                          {/* Checkbox */}
                                          <Checkbox
                                            checked={cat.checked}
                                            onChange={() => handleCheckboxChange(person.name, index)}
                                            sx={{
                                              position: 'absolute',
                                              top: 4,
                                              right: 4,
                                              bgcolor: 'white',
                                              borderRadius: '50%',
                                              border: '1px solid #9e9e9e',
                                              p: '2px',
                                              boxShadow: 1,
                                            }}
                                          />

                                          {/* Delete Button */}
                                          <Box
                                            component="span"
                                            onClick={() => handleDeleteCategory(cat, person)}
                                            sx={{
                                              position: 'absolute',
                                              bottom: 4,
                                              right: 4,
                                              bgcolor: 'red',
                                              color: 'white',
                                              border: '2px solid white',
                                              borderRadius: '50%',
                                              width: 32,
                                              height: 32,
                                              opacity: 0,
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              cursor: 'pointer',
                                              transition: 'all 0.3s ease',
                                              boxShadow: 1,
                                              '.group:hover &': {
                                                opacity: 1,
                                                bgcolor: 'red',
                                              },
                                              '&:hover': {
                                                opacity: 1,
                                                bgcolor: 'green',
                                                transform: 'scale(1.1)',
                                              },
                                            }}
                                          >
                                            <i className="tabler-trash text-white text-lg" />
                                          </Box>
                                        </Box>

                                        <Typography variant="body2" className="font-medium text-center truncate">
                                          {cat.label}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Draggable>
                                ))}
                                {provided2.placeholder}
                              </Box>
                            )}
                          </Droppable>
                        </Box>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>

            )}
          </Paper>
        </Grid>

        {/* ✅ RIGHT SIDEBAR */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            className="p-4 flex flex-col justify-between"
            sx={{
              position: { xs: 'relative', md: 'fixed' },
              top: { xs: 20, md: 120 },
              right: { md: 24 },
              width: { xs: '100%', md: '28%', lg: '21%' },
              height: { xs: 'auto', md: '85vh' },
              overflowY: { xs: 'visible', md: 'auto' },
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom className="text-center sm:text-left">
                Assign Category to Name
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField label="Enter Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />

              <Autocomplete
                options={categoryOptions}
                loading={loading}
                getOptionLabel={(option) => option.label || ''}
                value={selectedCategory}
                onChange={(e, newValue) => setSelectedCategory(newValue)}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Avatar src={option.image} alt={option.label} sx={{ width: 28, height: 28, mr: 1 }} />
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Category"
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />

              {/* ✅ Image Upload */}
              <Grid item xs={12}>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full">
                    {imageLoader && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <CircularProgress className="text-white" />
                      </div>
                    )}
                    {formData?.image && (
                      <img src={formData.image} alt="Preview" className="w-full h-32 rounded object-cover" />
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3 w-full">
                    <Button component="label" variant="contained" fullWidth>
                      Upload Background Image
                      <input hidden type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    </Button>

                    <Button variant="outlined" color="secondary" onClick={handleResetImage} fullWidth>
                      Reset
                    </Button>

                    <Typography variant="body2" className="text-center">
                      Allowed JPG, GIF or PNG. Max size of 800KB
                    </Typography>
                  </div>
                </div>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddCategory}
                disabled={!name}
                sx={{ mt: 3 }}
              >
                Add with Name
              </Button>
            </Box>

            <Button variant="outlined" color="primary" fullWidth sx={{ mt: { xs: 3, md: 0 } }} onClick={handleConsoleData}>
              Save
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
