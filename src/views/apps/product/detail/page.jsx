'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Tabs, Tab, Box, Typography, Chip, List, ListItem, ListItemText, MenuItem, Button, Paper
} from '@mui/material'
import Grid from '@mui/material/Grid' // Changed to import from '@mui/material/Grid'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderMultiple from './fileUploaderMultiple'
import productCategoryService from '@/services/product/productCategory'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)
    useEffect(() => { setValue(initialValue) }, [initialValue])
    useEffect(() => {
        const timeout = setTimeout(() => { onChange(value) }, debounce)
        return () => clearTimeout(timeout)
    }, [value])
    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const AddEditProductForm = ({ initialProductData, onFormSubmit, businessId }) => {
    const initialFormState = {
        businessId,
        categoryIds: [],
        name: '',
        stock: '',
        actualPrice: '',
        offerPrice: '',
        description: '',
        status: 'PENDING',
        images: []
    }

    const [tab, setTab] = useState(0)
    const [formData, setFormData] = useState(initialFormState)
    const [categorySearchQuery, setCategorySearchQuery] = useState('')
    const [categorySearchResults, setCategorySearchResults] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])

    useEffect(() => {
        if (categorySearchQuery.trim()) {
            searchCategory(categorySearchQuery)
        } else {
            setCategorySearchResults([])
        }
    }, [categorySearchQuery])

    const searchCategory = async (query) => {
        try {
            const res = await productCategoryService.searchCategory(query)
            if (res?.data) setCategorySearchResults(res.data)
        } catch (err) {
            toast.error('Category search failed')
        }
    }

    const handleCategorySelect = (cat) => {
        if (!selectedCategories.some(c => c._id === cat._id)) {
            setSelectedCategories(prev => [...prev, cat])
            setFormData(prev => ({
                ...prev,
                categoryIds: [...prev.categoryIds, cat._id]
            }))
            setCategorySearchQuery('')
            setCategorySearchResults([])
        }
    }

    const handleRemoveCategory = (id) => {
        setSelectedCategories(prev => prev.filter(c => c._id !== id))
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.filter(cid => cid !== id)
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileSelect = (fileUrls) => {
        setFormData(prev => ({ ...prev, images: fileUrls }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.categoryIds.length === 0) return toast.error("Select at least one category")
        if (!formData.name || !formData.stock || !formData.actualPrice || !formData.offerPrice || !formData.images.length) {
            return toast.error("Please complete all product fields")
        }
        onFormSubmit(formData)
    }

    const renderCategorySearchResult = (cat) => {
        const fullPath = [...(cat.parents || []), cat.name].join(' > ')
        return (
            <ListItem key={cat._id} onClick={() => handleCategorySelect(cat)} sx={{ pl: 2 }}>
                <ListItemText primary={fullPath} />
            </ListItem>
        )
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 4 }}>
                <Tab label="Categories" />
                <Tab label="Product Details" />
            </Tabs>

            {tab === 0 && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={4} alignItems="stretch" sx={{ flexGrow: 1 }}>
                        {/* Left Column for Category Selection */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <DebouncedInput
                                    fullWidth
                                    label='Search & Select Category*'
                                    placeholder='Search category name'
                                    value={categorySearchQuery}
                                    onChange={setCategorySearchQuery}
                                    className='mb-2'
                                />

                                {categorySearchResults.length > 0 && categorySearchQuery.trim() !== '' && (
                                    <List sx={{ zIndex: 10, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, boxShadow: 3, maxHeight: 200, overflow: 'auto', mt: 1 }}>
                                        {categorySearchResults.map(cat => renderCategorySearchResult(cat))}
                                    </List>
                                )}

                                {selectedCategories.length > 0 && (
                                    <>
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2">Selected Categories</Typography>
                                            <Box className="flex gap-2 flex-wrap mt-1">
                                                {selectedCategories.map(cat => (
                                                    <Chip
                                                        key={cat._id}
                                                        label={[...(cat.parents || []), cat.name].join(' > ')}
                                                        onDelete={() => handleRemoveCategory(cat._id)}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2">Category Preview Image</Typography>
                                            <Box
                                                sx={{
                                                    mt: 1,
                                                    height: 300,
                                                    border: '1px dashed #ccc',
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#f8f8f8'
                                                }}
                                            >
                                                <Typography color="text.secondary">
                                                    {selectedCategories[0].name} Image Preview (optional)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Grid>

                        {/* Right Column for Image Upload */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '550px' // Ensure this matches the left column's minHeight
                                }}
                            >
                                {/* 1. First message (Note Typography) */}
                                <Typography variant="body1" sx={{ pb: 3 }}>
                                    <b>Note :</b> Please Add Your Product Images And First Image Will Be Your Cover Image Later You Can Change Your Cover Image
                                </Typography>

                                {/* 2. Image section with a border */}
                                <Box
                                    sx={{
                                        flexGrow: 1, // Allows this section to grow and push the guidelines down
                                        border: '1px dashed #ccc', // Add border here
                                        borderRadius: 2,
                                        p: 3, // Add padding inside the border
                                        mb: 4, // Margin-bottom to separate from guidelines, adjust as needed
                                        display: 'flex',
                                        alignItems: 'center', // Vertically center content if FileUploaderMultiple is shorter
                                        justifyContent: 'top', // Horizontally center content
                                        flexDirection: 'column'
                                    }}
                                >
                                    <FileUploaderMultiple
                                        initialFiles={formData.images || []}
                                        onFileSelect={handleFileSelect}
                                        error_text={!formData.images?.length ? 'At least one image is required' : ''}
                                    // No need for flexGrow on FileUploaderMultiple itself if its parent box handles it
                                    />
                                </Box>

                                {/* 3. Upload guidelines */}
                                <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                        Image Upload Guidelines
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2">• Upload clear, high-resolution images</Typography>
                                            <Typography variant="body2">• Only JPG, PNG, or WEBP formats allowed</Typography>
                                            <Typography variant="body2">• Minimum resolution: 800x600 pixels</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2">• Maximum 5 images allowed</Typography>
                                            <Typography variant="body2">• Avoid watermarks or logos</Typography>
                                            <Typography variant="body2">• Keep file size below 2MB per image</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {tab === 1 && (
                <Grid container spacing={4} sx={{ flexGrow: 1 }}>

                    {/* Column 1: Product Details (left column) */}
                    <Grid item xs={12} md={6}> {/* Takes full width on small screens, half width on medium/large */}
                        <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CustomTextField
                                fullWidth
                                label="Product Name*"
                                placeholder="Enter Product Name"
                                value={formData.name}
                                onChange={handleChange}
                                name="name"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            />
                            <CustomTextField
                                select
                                fullWidth
                                label="Stock Status*"
                                value={formData.stock}
                                onChange={handleChange}
                                name="stock"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            >
                                <MenuItem value="AVAILABLE">Available</MenuItem>
                                <MenuItem value="OUT OF STOCK">Out Of Stock</MenuItem>
                            </CustomTextField>
                            <CustomTextField
                                fullWidth
                                label="Actual Price*"
                                type="number"
                                value={formData.actualPrice}
                                onChange={handleChange}
                                name="actualPrice"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            />
                            <CustomTextField
                                fullWidth
                                label="Offer Price*"
                                type="number"
                                value={formData.offerPrice}
                                onChange={handleChange}
                                name="offerPrice"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            />
                            <CustomTextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Product Description*"
                                value={formData.description}
                                onChange={handleChange}
                                name="description"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            />
                            <CustomTextField
                                fullWidth
                                select
                                disabled
                                label="Status*"
                                value={formData.status}
                                onChange={handleChange}
                                name="status"
                                sx={{ mb: 3 }} // Add margin-bottom for spacing
                            >
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="APPROVED">Approved</MenuItem>
                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </CustomTextField>
                        </Paper>
                    </Grid>

                    {/* Column 2: Image and Upload Guidelines (right column) */}
                    <Grid item xs={12} md={6}> {/* Takes full width on small screens, half width on medium/large */}
                        <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ pb: 3 }}>
                                <b>Note :</b> Please Add Your Product Images And First Image Will Be Your Cover Image Later You Can Change Your Cover Image
                            </Typography>
                            <Box
                                sx={{
                                    flexGrow: 1, // Allow this box to grow and push guidelines down
                                    border: '1px dashed #ccc',
                                    borderRadius: 2,
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '200px', // Min height for the upload area
                                    mb: 4,
                                    flexDirection: 'column'
                                }}
                            >
                                <FileUploaderMultiple
                                    initialFiles={formData.images || []}
                                    onFileSelect={handleFileSelect}
                                    error_text={!formData.images?.length ? 'At least one image is required' : ''}
                                />
                            </Box>
                            <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                    Image Upload Guidelines
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">• Upload clear, high-resolution images</Typography>
                                        <Typography variant="body2">• Only JPG, PNG, or WEBP formats allowed</Typography>
                                        <Typography variant="body2">• Minimum resolution: 800x600 pixels</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">• Maximum 5 images allowed</Typography>
                                        <Typography variant="body2">• Avoid watermarks or logos</Typography>
                                        <Typography variant="body2">• Keep file size below 2MB per image</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Box className="flex justify-between mt-6">
                <Button
                    variant="outlined"
                    onClick={() => setTab((prev) => Math.max(0, prev - 1))}
                    disabled={tab === 0}
                >
                    Back
                </Button>
                {tab === 1 ? (
                    <Button type="submit" variant="contained">
                        {initialProductData ? 'Update Product' : 'Add Product'}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (!selectedCategories.length) return toast.error("Please select at least one category")
                            setTab(1)
                        }}
                    >
                        Next
                    </Button>
                )}
            </Box>
        </form>
    )
}

export default AddEditProductForm
