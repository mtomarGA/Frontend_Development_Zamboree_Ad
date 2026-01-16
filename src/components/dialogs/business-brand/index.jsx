'use client'

import { useEffect, useState } from 'react'
import {
    CardContent,
    Typography,
    Button,
    CircularProgress
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Autocomplete from '@mui/material/Autocomplete'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import CustomTextField from '@core/components/mui/TextField'
import Image from '@/services/imageService'
import BusinessBrandService from "@/services/business/service/business-brand.service"

import CategoryService from '@/services/business/service/serviceCategory.service' // <-- use your actual category service

const BusinessBrand = ({ setEditModalOpen, getBusinessBrand, EditSelectedUser }) => {
    const router = useRouter()
    const { lang: locale } = useParams()

    const [formData, setFormData] = useState({
        name: '',
        category: [],
        logo: ''
    })
    useEffect(() => {
        if (EditSelectedUser) {
            setFormData({
                name: EditSelectedUser?.name || '',
                category: EditSelectedUser?.category?.map(cat => cat._id) || [],
                logo: EditSelectedUser?.logo || ''
            })
        }
    }, [EditSelectedUser])

    const [errors, setErrors] = useState({})
    const [imageLoader, setImageLoader] = useState(false)
    const [categories, setCategories] = useState([])

    // === Fetch all categories ===
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Example fetch logic — replace with your actual API call
                const res = await CategoryService.searchParentCategory()
                setCategories(res?.data || [])

            } catch (error) {
                console.error('Error fetching categories:', error)
                toast.error('Failed to load categories')
            }
        }

        fetchCategories()
    }, [])

    // === Image Upload ===
    const handleFileChange = async (e) => {
        try {
            setImageLoader(true)
            const file = e.target.files?.[0]
            if (!file) return

            const formDataImg = new FormData()
            formDataImg.append('image', file)
            const imageUrls = await Image.uploadImage(formDataImg)

            setFormData(prev => ({
                ...prev,
                logo: imageUrls?.data?.url
            }))
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Error uploading image')
        } finally {
            setImageLoader(false)
        }
    }

    const handleResetImage = () => {
        setFormData(prev => ({
            ...prev,
            logo: ''
        }))
    }

    // === Validation ===
    const validateForm = () => {
        const newErrors = {}
        if (!formData.name) newErrors.name = 'Brand Name is required'
        if (!formData.category.length) newErrors.category = 'Select at least one category'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            if (EditSelectedUser._id) {
                const Id=EditSelectedUser?._id
                console.log(formData, "Submitted Form Data")
                const result = await BusinessBrandService.updateBussinessBrand(Id,formData)
                toast.success(result.message)
                setEditModalOpen(false)
                getBusinessBrand()
            } else {
                console.log(formData, "Submitted Form Data")
                const result = await BusinessBrandService.addBussinessBrand(formData)
                toast.success(result.message)
                setEditModalOpen(false)
                getBusinessBrand()
            }

        }
    }

    return (
        <>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Create Brand
                </Typography>

                <Grid container spacing={6}>
                    {/* === Brand Name === */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label='Brand Franchisee'
                            placeholder='Enter Brand Franchisee'
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    {/* === Category Multi Select === */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Autocomplete
                            multiple
                            options={categories}
                            getOptionLabel={(option) => option.name || ''}
                            value={categories.filter((cat) => formData.category?.includes(cat._id)) || []}
                            onChange={(event, newValue) =>
                                setFormData({ ...formData, category: newValue.map((item) => item._id) })
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    label='Select Categories'
                                    placeholder='Choose categories'
                                    error={!!errors.category}
                                    helperText={errors.category}
                                />
                            )}
                        />

                    </Grid>

                    {/* === Logo Upload === */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <div className='flex items-center gap-6 relative'>
                            <div className="relative h-[100px] w-[100px] border rounded-md overflow-hidden flex items-center justify-center ">
                                {imageLoader && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                                        <CircularProgress className="text-white" />
                                    </div>
                                )}

                                {formData.logo ? (
                                    <img
                                        height={100}
                                        width={100}
                                        className="rounded object-cover"
                                        src={formData.logo}
                                        alt="Brand Logo"
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.primary">
                                        Upload Brand Logo
                                    </Typography>
                                )}
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-row gap-4'>
                                    <Button component='label' variant='contained'>
                                        Upload Logo
                                        <input
                                            type='file'
                                            hidden
                                            accept='image/png, image/jpeg'
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    <Button
                                        variant='tonal'
                                        color='secondary'
                                        onClick={handleResetImage}
                                        disabled={!formData.logo}
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <Typography variant='body2'>
                                    Allowed JPG, GIF or PNG. Max size of 200K
                                </Typography>
                            </div>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant='contained'
                            disabled={imageLoader}
                            sx={{ mt: 5 }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </>
    )
}

export default BusinessBrand
