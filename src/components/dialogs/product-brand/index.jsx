
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Image from '@/services/imageService'
import CategoryService from '@/services/product/productCategory'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import ProductBrandService from "@/services/product/product-brand"

const ProductBrandDialoag = ({ onsuccess, getProductBrands, EditSelectedPost }) => {

    // Categories
    const [Category, setRelatedCategory] = useState([])

    // Form data
    const [formData, setFormData] = useState({
        image: '', // ✅ single string
        name: '',
        Category: []
    })

    useEffect(() => {
        if (EditSelectedPost) {
            setFormData({
                name: EditSelectedPost?.name || "",
                image: EditSelectedPost?.image || "",
                Category: EditSelectedPost?.category?.map((c) => c._id) || [],
            })

            // preload Category options too (so Autocomplete can display)
            setRelatedCategory(EditSelectedPost?.category || [])
        }
    }, [EditSelectedPost])

    // Errors
    const [errors, setErrors] = useState({})

    // Upload state
    const [mediaItem, setMediaItem] = useState(null)
    const [imageLoader, setImageLoader] = useState(false)

    // Search categories
    const searchCategory = async (value) => {
        try {
            const res = await CategoryService.searchCategorys(value)
            setRelatedCategory(res.data || [])
        } catch (err) {
            console.error(err)
        }
    }

    // Handle file upload (single image only)
    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)

        const newMedia = {
            id: previewUrl,
            file,
            previewUrl,
            uploadedUrl: null,
            loading: true
        }

        setMediaItem(newMedia)
        setImageLoader(true)

        try {
            const response = await Image.uploadImage({ image: file })
            const uploadedUrl = response.data.url // ✅ fixed
            const publicId = response.data.public_id // ✅ save public_id

            setFormData((prev) => ({
                ...prev,
                image: uploadedUrl,
                imageId: publicId
            }))

            setMediaItem({
                ...newMedia,
                uploadedUrl,
                loading: false
            })
        } catch (error) {
            setMediaItem(null)
            toast.error('Failed to upload image.')
        } finally {
            setImageLoader(false)
        }
    }

    // Handle delete single image
    const handleSingleDelete = async () => {
        try {
            if (formData.imageId) {
                await Image.deleteImage(formData.imageId) // ✅ delete using public_id
            }
            setFormData((prev) => ({ ...prev, image: '', imageId: '' }))
            setMediaItem(null)
        } catch (error) {
            toast.error('Failed to delete image.')
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}
        if (!formData.name) newErrors.name = 'Brand Name is required'
        if (!formData.Category.length)
            newErrors.Category = 'At least one category is required'
        if (!formData.image) newErrors.image = 'Brand logo is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle submit
    const handleSubmit = async () => {
        if (validateForm()) {
            if (EditSelectedPost?._id) {
                const id=EditSelectedPost?._id
                const result = await ProductBrandService.updateProductBrand(id,formData)
                toast.success(result.message)
            } else {
                const result = await ProductBrandService.addProductBrand(formData)
                toast.success(result.message)
            }
            getProductBrands()
            onsuccess(false)
        }
    }

    return (
        <Card className="shadow-none">
            <CardContent>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Product Brand
                </Typography>

                <Grid container spacing={6}>
                    {/* File Upload */}
                    <Grid size={{ xs: 12 }}>
                        <div className="flex flex-grow flex-col gap-4 text-start">
                            <div className="flex flex-col sm:flex-row gap-4 mx-auto">
                                <Button component="label" variant="contained">
                                    Upload Brand Logo
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/avif"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                            </div>
                            <Typography variant="body2">
                                Allowed formats: JPG, PNG, AVIF. Max image: 1MB.
                            </Typography>
                        </div>

                        {/* Preview with loader */}
                        {(mediaItem || formData?.image) && (
                            <div className="relative w-32 h-32 mt-4 border rounded flex items-center justify-center overflow-hidden">
                                {imageLoader ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <img
                                        src={mediaItem?.uploadedUrl || mediaItem?.previewUrl || formData?.image}
                                        alt="Brand Logo"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={handleSingleDelete}
                                    sx={{ position: 'absolute', top: 2, right: 2 }}
                                >
                                    X
                                </Button>
                            </div>
                        )}

                        {errors.image && (
                            <Typography color="error" variant="body2">
                                {errors.image}
                            </Typography>
                        )}
                    </Grid>

                    {/* Brand Name */}
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Brand Franchisee"
                            placeholder="Enter Brand Franchisee"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    {/* Related Category */}
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            multiple
                            options={Category}
                            getOptionLabel={(option) => option.name || ''}
                            filterOptions={(x) => x}
                            onInputChange={(event, value) => {
                                if (value) searchCategory(value)
                            }}
                            // 🔹 Convert stored _id array into actual objects so Autocomplete can display chips
                            value={Category.filter((cat) => formData.Category.includes(cat._id))}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            onChange={(event, newValue) => {
                                // 🔹 Store only _id array in state
                                setFormData((prev) => ({
                                    ...prev,
                                    Category: newValue.map((item) => item._id),
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
                                    label="Select Category"
                                    placeholder="Search Category"
                                    error={!!errors.Category}
                                    helperText={errors.Category}
                                />
                            )}
                        />
                    </Grid>


                    {/* Submit */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={imageLoader}
                        >
                            {EditSelectedPost?._id ? "Update Brand" : "Create Brand"}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ProductBrandDialoag
