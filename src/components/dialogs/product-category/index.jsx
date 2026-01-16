'use client'

import { useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import { IconButton, InputAdornment, FormControlLabel, Checkbox, Autocomplete, Chip, Collapse, Typography } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'

import serviceCategoryService from '@/services/business/service/serviceCategory.service'
import productCategoryService from '@/services/product/productCategory'
import Image from '@/services/imageService'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

const initialData = {
    name: '',
    parent: '',
    status: 'ACTIVE',
    image: '',
    visibility: false,
    keywords: [],
    content: '',
    metaTitle: '',
    metaDescription: ''
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddServiceCategoryInfo = ({ open, setOpen, data, parentCategory, onSuccess }) => {
    const [userData, setUserData] = useState(data || initialData)
    const [fileName, setFileName] = useState('')
    const fileInputRef = useRef(null)
    const [imageLoader, setImageLoader] = useState(false)
    const [categoryTree, setCategoryTree] = useState([])
    const [showAdvanced, setShowAdvanced] = useState(false)

    const buildCategoryTree = (categories, parentId = null) => {
        if (!Array.isArray(categories)) {
            console.warn("buildCategoryTree received non-array categories:", categories)
            return []
        }

        const filteredCategories = categories.filter(cat => {
            const currentParentId = (cat.parent && cat.parent._id) ? cat.parent._id : cat.parent
            return String(currentParentId) === String(parentId)
        })

        return filteredCategories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            parent: cat.parent,
            children: buildCategoryTree(categories, cat._id),
        }))
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await productCategoryService.getAllProductCategory()
                const fetchedCategories = res.data || []
                setCategoryTree(fetchedCategories)
            } catch (err) {
                console.error("Error fetching categories:", err)
                toast.error('Failed to load categories')
            }
        }
        fetchCategories()
    }, [])

    const renderCategoryOptions = (nodes, level = 0) => {
        return nodes.flatMap(node => {
            const indentation = '\u00A0\u00A0'.repeat(level)

            const items = [
                <MenuItem key={node._id} value={node._id}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {indentation}
                        <FiberManualRecordOutlinedIcon style={{ fontSize: '0.6rem', marginRight: '4px' }} />
                        {node.name}
                    </div>
                </MenuItem>,
            ]

            if (node.children && node.children.length > 0) {
                items.push(...renderCategoryOptions(node.children, level + 1))
            }

            return items
        })
    }

    useEffect(() => {
        if (data) {
            setUserData({
                name: data.name || '',
                parent: (data.parent && data.parent._id) ? data.parent._id : data.parent || '',
                image: data.image || '',
                status: data.status || 'ACTIVE',
                visibility: data.visibility || false,
                keywords: data.keywords || [],
                content: data.content || '',
                metaTitle: data.metaTitle || '',
                metaDescription: data.metaDescription || ''
            })
            setFileName(data.image ? data.image.split('/').pop() : '')
        } else {
            setUserData({
                ...initialData,
                parent: parentCategory ? parentCategory._id : ''
            })
            setFileName('')
        }
    }, [data, open, parentCategory])

    const handleClose = () => {
        setOpen(false)
        setUserData(initialData)
        setFileName('')
        setShowAdvanced(false)
    }

    const handleFileUpload = async (e) => {
        try {
            setImageLoader(true)
            const selectedFile = e.target.files?.[0]
            if (!selectedFile) return

            const formData = new FormData()
            formData.append('image', selectedFile)
            const imageUrls = await Image.uploadImage(formData)

            if (imageUrls?.data?.url) {
                setFileName(selectedFile.name)
                setUserData(prev => ({ ...prev, image: imageUrls.data.url }))
                toast.success('Image uploaded successfully.')
            } else {
                throw new Error('Image upload failed: No URL returned')
            }
        } catch (error) {
            console.error("Image upload error:", error)
            toast.error(error.message || 'Image upload failed')
        } finally {
            setImageLoader(false)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (!userData.name || !userData.status || !userData.image) {
            toast.error('Please fill all required fields (Category, Image, Status).')
            return
        }

        const payload = {
            name: userData.name,
            parent: userData.parent === '' ? null : userData.parent,
            image: userData.image || '',
            status: userData.status,
            visibility: userData.visibility,
            keywords: userData.keywords,
            content: userData.content,
            metaTitle: userData.metaTitle,
            metaDescription: userData.metaDescription
        }

        try {
            let res
            if (data?._id) {
                res = await productCategoryService.updateProductCategory(data._id, payload)
            } else {
                res = await productCategoryService.addProductCategory(payload)
            }

            toast.success(`Category ${data ? 'updated' : 'created'} successfully.`)
            onSuccess && onSuccess()
            handleClose()
        } catch (err) {
            console.error("API call error:", err)
            toast.error(err.response?.data?.message || 'Error occurred during category operation')
        }
    }

    return (
        <Dialog fullWidth open={open} onClose={handleClose} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
            <DialogCloseButton onClick={handleClose}>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h4' className='text-center'>
                {data ? 'Edit' : 'Add'} Product Category
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
                    <Grid container spacing={5}>
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                fullWidth
                                label='Category Name *'
                                placeholder='Enter Category Name'
                                value={userData.name}
                                onChange={e => setUserData({ ...userData, name: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Parent Category'
                                value={userData.parent || ''}
                                onChange={e => setUserData({ ...userData, parent: e.target.value })}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 250,
                                            overflowY: 'auto',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value=''>None</MenuItem>
                                {renderCategoryOptions(categoryTree)}
                            </CustomTextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <div className='flex items-end gap-4'>
                                <CustomTextField
                                    label='Category Image'
                                    type='text'
                                    placeholder='No file chosen'
                                    value={fileName}
                                    className='flex-auto'
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: fileName && (
                                            <InputAdornment position='end'>
                                                <IconButton size='small' edge='end' onClick={() => {
                                                    setFileName('')
                                                    setUserData(prev => ({ ...prev, image: '' }))
                                                }}>
                                                    <i className='tabler-x' />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button component='label' variant='tonal' disabled={imageLoader}>
                                    Choose
                                    <input hidden type='file' onChange={handleFileUpload} ref={fileInputRef} />
                                </Button>
                            </div>
                            {userData.image && (
                                <div style={{ marginTop: '8px' }}>
                                    <img src={userData.image} alt="Preview" style={{ maxHeight: 80, borderRadius: 4 }} />
                                </div>
                            )}
                        </Grid>

                        {/* Advanced Options Section */}
                        <Grid size={{ xs: 12 }} display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">Advanced Options</Typography>
                            <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                                {showAdvanced ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Collapse in={showAdvanced}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={userData.visibility}
                                                    onChange={e => setUserData({ ...userData, visibility: e.target.checked })}
                                                />
                                            }
                                            label="Category Visibility"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Autocomplete
                                            multiple
                                            freeSolo
                                            options={[]}
                                            value={userData.keywords}
                                            onChange={(event, newValue) => {
                                                setUserData({ ...userData, keywords: newValue })
                                            }}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        key={option + index}
                                                        variant="outlined"
                                                        label={option}
                                                        {...getTagProps({ index })}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <CustomTextField
                                                    {...params}
                                                    label="Keywords"
                                                    multiline
                                                    rows={2}
                                                    placeholder="Add keywords (press Enter after each)"
                                                />
                                            )}
                                        />
                                        <Typography variant="caption" color="textSecondary">
                                            Press Enter after each keyword, then click Save.
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <CustomTextField
                                            fullWidth
                                            label='Content'
                                            multiline
                                            rows={3}
                                            value={userData.content}
                                            onChange={e => setUserData({ ...userData, content: e.target.value })}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <CustomTextField
                                            fullWidth
                                            label='Meta Title'
                                            value={userData.metaTitle}
                                            onChange={e => setUserData({ ...userData, metaTitle: e.target.value })}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <CustomTextField
                                            fullWidth
                                            label='Meta Description'
                                            multiline
                                            rows={3}
                                            value={userData.metaDescription}
                                            onChange={e => setUserData({ ...userData, metaDescription: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Status*'
                                value={userData.status}
                                onChange={e => setUserData({ ...userData, status: e.target.value })}
                            >
                                <MenuItem value='' disabled>Select Status</MenuItem>
                                {statusOptions.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className='justify-center'>
                    <Button variant='tonal' color='secondary' onClick={handleClose} disabled={imageLoader}> Cancel </Button>
                    <Button variant='contained' type='submit' disabled={imageLoader}> Submit</Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}

export default AddServiceCategoryInfo
