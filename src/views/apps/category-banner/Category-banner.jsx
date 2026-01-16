'use client'
import styles from '@core/styles/table.module.css'
import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tooltip,
    Grid,
    CircularProgress,
    Box,
    Typography,
    Paper,
    MenuItem,
    ListItemText,
    Autocomplete
} from '@mui/material'
import { toast } from 'react-toastify'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Remove unused imports and fix service names
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import ImageService from '@/services/imageService'
import CategoryBanner from "@/services/business/service/banner-category.service"
import ServiceCategory from "@/services/business/service/serviceCategory.service"

const columnHelper = createColumnHelper()

const CategoryBannerTable = () => {
    const { hasPermission } = useAuth()
    const [bannerList, setBannerList] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [editingId, setEditingId] = useState(null) // Track editing ID separately
    const [categories, setCategories] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingCategories, setLoadingCategories] = useState(false)

    // Form state - single source of truth
    const initialForm = {
        categoryId: '',
        categoryName: '', // Add categoryName for display
        banner: []
    }
    const [formData, setFormData] = useState(initialForm)
    const [mediaList, setMediaList] = useState([])

    const fetchBanners = async () => {
        try {
            const result = await CategoryBanner.getBanner()
            setBannerList(result.data || [])
        } catch (err) {
            toast.error(err.message || 'Failed to fetch banners')
        }
    }

    // Fetch categories based on search query
    const fetchCategories = async (query = '') => {
        try {
            setLoadingCategories(true)
            const result = await ServiceCategory.searchCategory(query)
            console.log('Categories fetched:', result)
            if (result.data && Array.isArray(result.data)) {
                setCategories(result.data)
            } else if (result.success && result.data) {
                setCategories([result.data])
            } else {
                setCategories([])
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
            toast.error('Failed to fetch categories')
            setCategories([])
        } finally {
            setLoadingCategories(false)
        }
    }

    useEffect(() => {
        fetchBanners()
        fetchCategories()
    }, [])

    // Debounced search for categories
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() !== '') {
                fetchCategories(searchQuery)
            } else {
                fetchCategories()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handleCategoryChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            categoryId: newValue?._id || '',
            categoryName: newValue?.name || '' // Store name for display
        }));
        console.log('Updated formData category:', newValue);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    // Upload single image
    const uploadImage = async (file) => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await ImageService.uploadImage(formData)
            return response.data.url
        } catch (error) {
            console.error('Upload failed:', error)
            throw error
        }
    }

    // Handle file selection and preview
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        const newMedia = files.map(file => ({
            id: URL.createObjectURL(file),
            file,
            previewUrl: URL.createObjectURL(file),
            uploadedUrl: null,
            loading: true
        }))

        setMediaList(prev => [...prev, ...newMedia])

        newMedia.forEach(async (mediaItem) => {
            try {
                const uploadedUrl = await uploadImage(mediaItem.file)

                setMediaList(prev =>
                    prev.map(item =>
                        item.id === mediaItem.id
                            ? { ...item, uploadedUrl, loading: false }
                            : item
                    )
                )

                // Always update formData
                setFormData(prev => ({
                    ...prev,
                    banner: [...prev.banner, uploadedUrl]
                }))
            } catch (error) {
                toast.error(`Failed to upload ${mediaItem.file.name}`)
                setMediaList(prev =>
                    prev.filter(item => item.id !== mediaItem.id)
                )
            }
        })
    }

    // Reset all images
    const handleResetImages = () => {
        mediaList.forEach(media => {
            if (media.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(media.previewUrl)
            }
        })
        setMediaList([])
        setFormData(prev => ({ ...prev, banner: [] }))
    }

    // Add or Update Category Banner
    const handleAdd = async () => {
        const stillUploading = mediaList.some(media => media.loading)
        if (stillUploading) {
            toast.error('Please wait for all banners to finish uploading')
            return
        }

        // Validate form
        if (!formData.categoryId) {
            toast.error('Please select a category')
            return
        }

        if (formData.banner.length === 0) {
            toast.error('Please upload at least one banner image')
            return
        }

        // Prepare payload - only send what the API expects
        const payload = {
            categoryId: formData.categoryId,
            banner: formData.banner
        }

        console.log('Payload:', payload);

        try {
            let result
            if (editingId) {
                result = await CategoryBanner.UpdatedBanner(editingId, payload)
                toast.success('Banner updated successfully')
            } else {
                result = await CategoryBanner.createBanner(payload)
                toast.success('Banner created successfully')
            }

            // Reset form and close modal
            handleCloseModal()
            fetchBanners() // Refresh the list

        } catch (err) {
            console.error('Error saving banner:', err)
            toast.error(err.response?.data?.message || err.message || 'Failed to save banner')
        }
    }

    // Delete Category Banner
    const handleDelete = async (id) => {
        try {
            const result = await CategoryBanner.deleteBanner(id)
            toast.success(result.message)
            fetchBanners()
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to delete banner')
        }
    }

    // Remove single image
    // Remove single image - FIXED VERSION
    const removeImage = (id) => {
        const mediaToRemove = mediaList.find(media => media.id === id)

        if (mediaToRemove && mediaToRemove.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaToRemove.previewUrl)
        }

        // Remove from mediaList first
        setMediaList(prev => prev.filter(media => media.id !== id))

        // Then update formData banner array - THIS WAS THE MAIN ISSUE
        if (mediaToRemove.uploadedUrl) {
            setFormData(prev => ({
                ...prev,
                banner: prev.banner.filter(url => url !== mediaToRemove.uploadedUrl)
            }))
        } else if (mediaToRemove.previewUrl) {
            // Handle case where image hasn't finished uploading yet
            // For new uploads that are still in progress
            setFormData(prev => ({
                ...prev,
                banner: prev.banner.filter(url => url !== mediaToRemove.previewUrl)
            }))
        }
    }

    const openEditModal = (row) => {
        setEditingId(row._id)

        // Set form data from the row
        setFormData({
            categoryId: row.categoryId?._id || row.categoryId || '',
            categoryName: row.categoryId?.name || '',
            banner: row.banner || []
        })

        // Set media list for existing images
        const existingMedia = (row.banner || []).map(url => ({
            id: url,
            file: null,
            previewUrl: url,
            uploadedUrl: url,
            loading: false
        }))
        setMediaList(existingMedia)

        // Set initial search query to current category name
        setSearchQuery(row.categoryId?.name || '')

        setOpenModal(true)
    }

    // Close modal and cleanup
    const handleCloseModal = () => {
        mediaList.forEach(media => {
            if (media.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(media.previewUrl)
            }
        })

        setOpenModal(false)
        setEditingId(null)
        setFormData(initialForm)
        setMediaList([])
        setSearchQuery('')
    }

    const isAnyImageLoading = mediaList.some(media => media.loading)

    // Get current category value for Autocomplete
    const getCurrentCategoryValue = () => {
        if (!formData.categoryId) return null

        // Find in categories list or create a temporary object
        const foundCategory = categories.find(cat => cat._id === formData.categoryId)
        if (foundCategory) return foundCategory

        // If not found in categories (might be from edit), return object with current data
        return formData.categoryName ? {
            _id: formData.categoryId,
            name: formData.categoryName
        } : null
    }

    // Table columns
    const columns = [
        columnHelper.accessor(row => row.categoryId?.name, {
            header: 'Category',
            cell: ({ getValue }) => getValue() || 'N/A'
        }),
        columnHelper.accessor('banner', {
            header: 'Banners',
            cell: ({ getValue }) => {
                const banners = getValue()
                return (
                    <div className='flex gap-2 flex-wrap'>
                        {banners && banners.length > 0 ? (
                            banners.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`banner-${idx}`}
                                    className='w-16 h-16 object-cover rounded'
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                    }}
                                />
                            ))
                        ) : (
                            <span className="text-gray-400">No banners</span>
                        )}
                    </div>
                )
            }
        }),

        columnHelper.display({
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className='flex items-center gap-4'>
                    <Tooltip title='Edit'>
                        <i
                            className='tabler-edit text-blue-600 text-2xl cursor-pointer'
                            onClick={() => openEditModal(row.original)}
                        />
                    </Tooltip>

                    <Tooltip title='Delete'>
                        <i
                            className='tabler-trash text-red-500 text-2xl cursor-pointer'
                            onClick={() => handleDelete(row.original._id)}
                        />
                    </Tooltip>
                </div>
            )
        })
    ]

    const table = useReactTable({
        data: bannerList,
        columns,
        state: { columnVisibility },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <Card>
            <CardContent>
                <Grid container justifyContent='space-between' alignItems='center'>
                    <CardHeader title='Category Banner List' />
                    {hasPermission('partner_banner_setup:add') && (
                        <Button
                            variant='outlined'
                            className='bg-[#7367F0] text-white'
                            onClick={() => {
                                setEditingId(null);
                                setFormData(initialForm);
                                setMediaList([]);
                                setSearchQuery('');
                                setOpenModal(true);
                            }}
                        >
                            Add category Banner
                        </Button>
                    )}
                </Grid>
            </CardContent>

            <div className='overflow-x-auto'>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={openModal} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton disableRipple onClick={handleCloseModal}>
                    <i className='tabler-x' />
                </DialogCloseButton>

                <DialogTitle>{editingId ? 'Edit' : 'Add'} Category Banner</DialogTitle>
                <DialogContent className='w-[400px]'>

                    <Grid size={{ xs: 12 }}>
                        <div className="flex flex-grow flex-col gap-4 text-start">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button component="label" variant="contained">
                                    Upload Photos
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        multiple
                                        hidden
                                        onChange={handleFileChange}
                                        disabled={isAnyImageLoading}
                                    />
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleResetImages}
                                    disabled={isAnyImageLoading}
                                >
                                    Delete all
                                </Button>
                            </div>
                            <Typography variant="body2">
                                Allowed formats: JPG, PNG. Maximum image size: 1MB.
                            </Typography>
                        </div>
                    </Grid>

                    {mediaList.length > 0 && (
                        <Grid item xs={12} className='my-3'>
                            <div className='flex flex-wrap gap-2'>
                                {mediaList.map((mediaItem) => (
                                    <div
                                        key={mediaItem.id}
                                        className="relative inline-block"
                                        style={{ marginRight: 8, marginBottom: 8 }}
                                    >
                                        <div className="relative">
                                            <img
                                                src={mediaItem.previewUrl}
                                                alt={`Preview`}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    borderRadius: '10%',
                                                    objectFit: 'cover',
                                                    opacity: mediaItem.loading ? 0.5 : 1
                                                }}
                                            />

                                            {mediaItem.loading && (
                                                <Box
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    sx={{
                                                        background: 'rgba(0,0,0,0.3)',
                                                        borderRadius: '10%'
                                                    }}
                                                >
                                                    <CircularProgress
                                                        size={20}
                                                        sx={{ color: 'white' }}
                                                    />
                                                </Box>
                                            )}
                                        </div>

                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='error'
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                minWidth: '24px',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                padding: 0
                                            }}
                                            onClick={() => removeImage(mediaItem.id)}
                                            disabled={mediaItem.loading}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    )}

                    {/* Category Search Dropdown */}
                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name || ''}
                        value={getCurrentCategoryValue()}
                        onChange={(event, newValue) => {
                            handleCategoryChange(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            handleSearchChange(newInputValue);
                        }}
                        loading={loadingCategories}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Search Category"
                                fullWidth
                                placeholder="Type to search categories..."
                                sx={{ mt: 2 }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingCategories ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <MenuItem {...props}>
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        )}
                        PaperComponent={({ children }) => (
                            <Paper>
                                {children}
                            </Paper>
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={handleAdd}
                        disabled={isAnyImageLoading || !formData.categoryId || formData.banner.length === 0}
                    >
                        {isAnyImageLoading ? 'Uploading...' : (editingId ? 'Update' : 'Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default CategoryBannerTable
