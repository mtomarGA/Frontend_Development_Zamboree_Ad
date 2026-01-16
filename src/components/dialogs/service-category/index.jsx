'use client'

import { useEffect, useRef, useState } from 'react'
// import Grid from '@mui/material/Grid'
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import { IconButton, InputAdornment, Collapse, Typography, TextField, FormControlLabel, Checkbox, Autocomplete, Chip } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

// import productCategoryService from '@/services/product/productCategory'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'
import Image from '@/services/imageService'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

const initialData = {
    name: '',
    parent: '',
    status: 'ACTIVE',
    thumbImage: '',
    iconImage: '',
    bannerImage: '',
    content: '',
    visibility: false,
    keywords: [],
    metaTitle: '',
    metaDescription: '',
    relatedCategory: ""
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddServiceCategoryInfo = ({ open, setOpen, data, parentCategory, onSuccess }) => {
    const [userData, setUserData] = useState(data || initialData)
    const [fileName, setFileName] = useState('')
    const [relatedCoategory, setRelatedCategoty] = useState([])
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)
    const [imageLoader, setImageLoader] = useState(false)
    const [imageThumbLoader, setImagThumbeLoader] = useState(false)
    const [imageBannerLoader, setImagBannerLoader] = useState(false)
    const [categoryTree, setCategoryTree] = useState([])
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [thumbFileName, setThumbFileName] = useState('')
    const [iconFileName, setIconFileName] = useState('')
    const [bannerFileName, setBannerFileName] = useState('')

    const buildCategoryTree = (categories, parentId = null) => {
        if (!Array.isArray(categories)) return []
        const filteredCategories = categories.filter(cat => {
            const currentParentId = cat.parent?._id || cat.parent
            return String(currentParentId) === String(parentId)
        })
        return filteredCategories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            parent: cat.parent,
            children: buildCategoryTree(categories, cat._id)
        }))
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await serviceCategoryService.getAllServiceCategory()
                setCategoryTree(res.data || [])
            } catch (err) {
                console.error("Error fetching categories:", err)
                toast.error('Failed to load categories')
            }
        }
        fetchCategories()
    }, [])

    const searchCategoey = async (search) => {
        const relatedCoategory = await serviceCategoryService.realatedCategoty(search)
        setRelatedCategoty(relatedCoategory.data)
    }

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
                </MenuItem>
            ]
            if (node.children?.length) {
                items.push(...renderCategoryOptions(node.children, level + 1))
            }
            return items
        })
    }

    useEffect(() => {
        if (data) {
            console.log(data, "Dadadada");


            setUserData({
                name: data.name || '',
                parent: data.parent?._id || data.parent || '',
                thumbImage: data.thumbImage || '',
                iconImage: data.iconImage || '',
                bannerImage: data.bannerImage || '',
                content: data.content || '',
                status: data.status || 'INACTIVE',
                visibility: data.visibility || false,
                keywords: data.keywords || [],
                metaTitle: data.metaTitle || '',
                metaDescription: data.metaDescription || '',
                relatedCategory: data.relatedCategory || []
            })

            setFileName('')
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
        setFile(null)
    }

    const handleThumbFileUpload = async (e) => {
        try {
            setImagThumbeLoader(true)
            const selectedFile = e.target.files?.[0]
            if (!selectedFile) return
            const formData = new FormData()
            formData.append('image', selectedFile)
            const imageUrls = await Image.uploadImage(formData)
            if (imageUrls?.data?.url) {
                setThumbFileName(selectedFile.name)
                setUserData(prev => ({ ...prev, thumbImage: imageUrls.data.url }))
                toast.success('Thumbnail Image uploaded successfully.')
            } else {
                throw new Error('Thumbnail Image upload failed: No URL returned')
            }
        } catch (error) {
            console.error("Image upload error:", error)
            toast.error(error.message || 'Image upload failed')
        } finally {
            setImagThumbeLoader(false)
        }
    }

    const handleIconFileUpload = async (e) => {
        try {
            setImageLoader(true)
            const selectedFile = e.target.files?.[0]
            if (!selectedFile) return
            const formData = new FormData()
            formData.append('image', selectedFile)
            const imageUrls = await Image.uploadImage(formData)
            if (imageUrls?.data?.url) {
                setIconFileName(selectedFile.name)
                setUserData(prev => ({ ...prev, iconImage: imageUrls.data.url }))
                toast.success('Icon Image Image uploaded successfully.')
            } else {
                throw new Error('IconImage Image upload failed: No URL returned')
            }
        } catch (error) {
            toast.error(error.message || 'Image upload failed')
        } finally {
            setImageLoader(false)
        }
    }

    const handleBannerFileUpload = async (e) => {
        try {
            setImagBannerLoader(true)
            const selectedFile = e.target.files?.[0]
            if (!selectedFile) return
            const formData = new FormData()
            formData.append('image', selectedFile)
            const imageUrls = await Image.uploadImage(formData)
            if (imageUrls?.data?.url) {
                setBannerFileName(selectedFile.name)
                setUserData(prev => ({ ...prev, bannerImage: imageUrls.data.url }))
                toast.success('Banner Image uploaded successfully.')
            } else {
                throw new Error('Banner Image upload failed: No URL returned')
            }
        } catch (error) {
            toast.error(error.message || 'Image upload failed')
        } finally {
            setImagBannerLoader(false)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!userData.name || !userData.thumbImage || !userData.iconImage || !userData.status) {
            toast.error('Please fill all required fields (Category, Thumb and Icon Image, Status).')
            return
        }
        const payload = {
            ...userData,
            parent: userData.parent === '' ? null : userData.parent,
            relatedCategory: (userData.relatedCategory || []).map(cat => cat._id)
        }
        try {
            let res
            if (data?._id) {
                res = await serviceCategoryService.updateServiceCategory(data._id, payload)
            } else {


                res = await serviceCategoryService.addServiceCategory(payload)

            }
            toast.success(`Category ${data ? 'updated' : 'created'} successfully.`)
            onSuccess && onSuccess()
            setUserData(initialData)
            setFileName('')
            setFile(null)
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
            <DialogTitle variant='h5' className='text-center'>
                Add Service Category
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
                    <Grid container spacing={5}>
                        {/* Basic Fields */}
                        <Grid size={{ xs: 12 }} >
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
                                    PaperProps: { style: { maxHeight: 250, overflowY: 'auto' } }
                                }}
                            >
                                <MenuItem value=''>None</MenuItem>
                                {renderCategoryOptions(categoryTree)}
                            </CustomTextField>
                        </Grid>

                        {/* Thumbnail Image */}
                        <Grid size={{ xs: 12 }}>
                            <div className='flex items-end gap-4'>
                                <CustomTextField
                                    label='Thumbnail Image*'
                                    type='text'
                                    placeholder='No file chosen'
                                    value={thumbFileName || (userData.thumbImage ? userData.thumbImage.split('/').pop() : '')}
                                    className='flex-auto'
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (thumbFileName || userData.thumbImage) && (
                                            <InputAdornment position='end'>
                                                <IconButton size='small' edge='end' onClick={() => {
                                                    setThumbFileName('')
                                                    setUserData(prev => ({ ...prev, thumbImage: '' }))
                                                }}>
                                                    <i className='tabler-x' />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button component='label' variant='tonal' disabled={imageThumbLoader}>
                                    Choose
                                    <input hidden type='file' onChange={handleThumbFileUpload} />
                                </Button>
                            </div>
                            {userData.thumbImage && (
                                <div style={{ marginTop: '8px' }}>
                                    <img src={userData.thumbImage} alt="Thumbnail Preview" style={{ maxHeight: 80, borderRadius: 4 }} />
                                </div>
                            )}
                        </Grid>

                        {/* Icon Image */}
                        <Grid size={{ xs: 12 }}>
                            <div className='flex items-end gap-4'>
                                <CustomTextField
                                    label='Icon Image*'
                                    type='text'
                                    placeholder='No file chosen'
                                    value={iconFileName || (userData.iconImage ? userData.iconImage.split('/').pop() : '')}
                                    className='flex-auto'
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (iconFileName || userData.iconImage) && (
                                            <InputAdornment position='end'>
                                                <IconButton size='small' edge='end' onClick={() => {
                                                    setIconFileName('')
                                                    setUserData(prev => ({ ...prev, iconImage: '' }))
                                                }}>
                                                    <i className='tabler-x' />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button component='label' variant='tonal' disabled={imageLoader}>
                                    Choose
                                    <input hidden type='file' onChange={handleIconFileUpload} />
                                </Button>
                            </div>
                            {userData.iconImage && (
                                <div style={{ marginTop: '8px' }}>
                                    <img src={userData.iconImage} alt="Icon Preview" style={{ maxHeight: 80, borderRadius: 4 }} />
                                </div>
                            )}
                        </Grid>

                        {/* Banner Image */}
                        <Grid size={{ xs: 12 }}>
                            <div className='flex items-end gap-4'>
                                <CustomTextField
                                    label='Banner Image*'
                                    type='text'
                                    placeholder='No file chosen'
                                    value={bannerFileName || (userData.bannerImage ? userData.bannerImage.split('/').pop() : '')}
                                    className='flex-auto'
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (bannerFileName || userData.bannerImage) && (
                                            <InputAdornment position='end'>
                                                <IconButton size='small' edge='end' onClick={() => {
                                                    setBannerFileName('')
                                                    setUserData(prev => ({ ...prev, bannerImage: '' }))
                                                }}>
                                                    <i className='tabler-x' />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button component='label' variant='tonal' disabled={imageBannerLoader}>
                                    Choose
                                    <input hidden type='file' onChange={handleBannerFileUpload} />
                                </Button>
                            </div>
                            {userData.bannerImage && (
                                <div style={{ marginTop: '8px' }}>
                                    <img src={userData.bannerImage} alt="Banner Preview" style={{ maxHeight: 80, borderRadius: 4 }} />
                                </div>
                            )}
                        </Grid>

                        {/* Advanced Options Toggle */}
                        <Grid size={{ xs: 12 }} display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">Advanced Options</Typography>
                            <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                                {showAdvanced ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Grid>

                        {/* Collapsible Advanced Fields */}
                        <Grid size={{ xs: 12 }}>
                            <Collapse in={showAdvanced}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={!!userData.visibility}
                                                    onChange={e => setUserData({ ...userData, visibility: e.target.checked })}
                                                />
                                            }
                                            label="Category Visibility"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 12 }}>
                                        <Autocomplete
                                            multiple
                                            freeSolo
                                            disableCloseOnSelect
                                            options={[]}
                                            value={userData.keywords || []}
                                            onChange={(event, newValue) => {
                                                if (!newValue) return;

                                                let updatedKeywords = [];

                                                newValue.forEach(item => {
                                                    if (typeof item === "string") {
                                                        // split by comma
                                                        const splitItems = item
                                                            .split(",")
                                                            .map(i => i.trim())
                                                            .filter(Boolean);

                                                        updatedKeywords.push(...splitItems);
                                                    } else {
                                                        updatedKeywords.push(item);
                                                    }
                                                });

                                                // remove duplicates
                                                updatedKeywords = [...new Set(updatedKeywords)];

                                                setUserData(prev => ({
                                                    ...prev,
                                                    keywords: updatedKeywords
                                                }));
                                            }}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        key={option + index}
                                                        variant="outlined"
                                                        label={option}
                                                        {...getTagProps({ index })}
                                                        onDelete={() => {
                                                            setUserData(prev => ({
                                                                ...prev,
                                                                keywords: prev.keywords.filter(item => item !== option)
                                                            }));
                                                        }}
                                                    />
                                                ))
                                            }
                                            renderInput={params => (
                                                <CustomTextField
                                                    {...params}
                                                    fullWidth
                                                    label="Keywords"
                                                    multiline
                                                    rows={2}

                                                />
                                            )}
                                        />
                                        <label htmlFor='' className='text-red-500 text-sm italic'>
                                            Press Enter after each keyword, then click Save.
                                        </label>
                                    </Grid>


                                    <Grid size={{ xs: 12 }}>
                                        <Autocomplete
                                            multiple
                                            options={relatedCoategory}
                                            getOptionLabel={(option) => option.name || ''}
                                            filterOptions={(x) => x}
                                            onInputChange={(event, value) => {
                                                if (value) searchCategoey(value)
                                            }}
                                            value={userData.relatedCategory || []}   // keep array of objects
                                            isOptionEqualToValue={(option, value) => option._id === value._id} // important!
                                            onChange={(event, newValue) => {
                                                setUserData(prev => ({
                                                    ...prev,
                                                    relatedCategory: newValue   // ✅ whole array, not ._id
                                                }))
                                            }}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        key={option._id}
                                                        label={option.name}
                                                        {...getTagProps({ index })}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <CustomTextField
                                                    {...params}
                                                    fullWidth
                                                    label="Related Category"
                                                    placeholder="Search Category"
                                                />
                                            )}
                                        />


                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <CustomTextField
                                            fullWidth
                                            label='Content'
                                            placeholder="Enter Content"
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
                                            placeholder="Enter Meta Title"
                                            value={userData.metaTitle}
                                            onChange={e => setUserData({ ...userData, metaTitle: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CustomTextField
                                            fullWidth
                                            label='Meta Description'
                                            placeholder="Enter Meta Description"
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
                    <Button variant='tonal' color='secondary' onClick={handleClose} disabled={imageLoader}>Cancel</Button>
                    <Button variant='contained' type='submit' disabled={imageLoader}>Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddServiceCategoryInfo
