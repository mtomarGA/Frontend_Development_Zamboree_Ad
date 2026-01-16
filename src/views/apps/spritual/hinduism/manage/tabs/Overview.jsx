'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Typography,
    Autocomplete,
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useTempleContext } from '@/contexts/TempleFormContext'
import GoogleMapLocation from './sections/component/GoogleMapLocation'
import FileUploader from '@components/FileUploader.jsx'
import { useRouter } from 'next/navigation'


const TempleOverview = ({ nextHandle, handleCancel }) => {
    const { formData,
        errors,
        handleChange,
        countryList,
        stateList,
        cityList,
        getStatesbyId,
        getCityByStateId,
        validate,
        areaList,
        getAreaByCityId,
        imageId, setImageId, resetForm, setTempleTabManager
    } = useTempleContext()
    const router = useRouter();
    const [zoom, setZoom] = useState(1)

    // Image cropping states
    const [imageSrc, setImageSrc] = useState(null)




    const handleClose = () => {
        setImageCropDialogOpen(false)
        setImageSrc(null)
        setCurrentCropContext(null)
        setCrop({ x: 0, y: 0 })
        setCroppedAreaPixels(null)
        setZoom(1)
    }




    const handleNextButtonClick = (e) => {
        e.preventDefault()
        if (!validate()) return

        console.log('Form submitted:', formData);
        console.log(validate());
        setTempleTabManager(prev => ({
            ...prev,
            timing: true
        }))

        nextHandle()

    }
    const [sections, setSections] = useState(formData.about_temple || [{ title: '', content: '' }])
    const handleSectionChange = (index, field, value) => {
        const newSections = [...sections]
        newSections[index][field] = value
        setSections(newSections)
        handleChange('about_temple')({ target: { value: newSections } })
    }

    const addSection = () => {
        setSections([...sections, { title: '', content: '' }])
    }

    const removeSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index)
        setSections(newSections)
        handleChange('about_temple')({ target: { value: newSections } })
    }

    //image upload state
    const [imageUploading, setImageUploading] = useState(false)


    return (
        <Card sx={{ p: 5 }} component="form" onSubmit={handleNextButtonClick}>
            <Typography variant="h5" sx={{ mb: 4 }}>
                Temple Overview
            </Typography>

            <Grid container spacing={4}>
                {/* Temple Name */}
                <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth required label="Temple Name" name="templeName" value={formData.temple_name} onChange={handleChange("temple_name")} error={!!errors.temple_name}
                        helperText={errors.temple_name} />
                </Grid>

                {/* Main Image Upload */}
                <Grid item xs={12} sm={6}>

                    <FileUploader
                        acceptedFiles={['image/jpeg', 'image/png']}
                        error_text={errors.main_image}
                        initialFile={formData.main_image}
                        label="Upload Temple Main Image"
                        name={"main_image"}
                        folderName='Spiritual/Hinduism/Temple'
                        onFileSelect={handleChange("main_image")}
                        cropSize={{ width: 800, height: 600 }}
                        isWatermark={false}
                    />

                </Grid>

                {/* About Us */}
                <Grid item xs={12}>
                    <CustomTextField
                        fullWidth
                        multiline
                        required
                        minRows={4}
                        label="About Us"
                        name="aboutUs"
                        value={formData.about_us}
                        onChange={handleChange('about_us')}
                        error={!!errors.about_us}
                        helperText={errors.about_us}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* Dynamic Content Section */}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Additional Sections</Typography>
                        <Button variant="outlined" onClick={addSection}>
                            Add Section
                        </Button>
                    </Box>
                </Grid>

                {sections.map((section, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={12} sm={6}>
                            <CustomTextField
                                fullWidth
                                required
                                label={`Title`}
                                value={section.title}
                                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                error={!!errors.about_temple}
                                helperText={errors.about_temple}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CustomTextField
                                fullWidth
                                multiline
                                required
                                minRows={3}
                                label={`Content`}
                                value={section.content}
                                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                error={!!errors.about_temple}
                                helperText={errors.about_temple}
                            />
                        </Grid>
                        {sections.length > 1 && (
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button color="error" onClick={() => removeSection(index)}>
                                        Delete Section
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </React.Fragment>
                ))}


                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* Location Fields */}
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Location
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(countryList) ? countryList : []}
                        getOptionLabel={option => option?.name ?? ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        value={(Array.isArray(countryList) ? countryList : []).find(item => item._id === formData.country) || null}
                        onChange={(e, newValue) => {
                            const id = newValue?._id || ''
                            handleChange('country')({ target: { value: id } })
                            getStatesbyId(id)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Country"
                                placeholder="Select Country"
                                required
                                error={!!errors.country}
                                helperText={errors.country}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(stateList) ? stateList : []}
                        getOptionLabel={option => option?.name ?? ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        value={(Array.isArray(stateList) ? stateList : []).find(item => item._id === formData.state) || null}
                        onChange={(e, newValue) => {
                            const id = newValue?._id || ''
                            handleChange('state')({ target: { value: id } })
                            getCityByStateId(id)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="State"
                                placeholder="Select State"
                                required
                                error={!!errors.state}
                                helperText={errors.state}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(cityList) ? cityList : []}
                        getOptionLabel={option => option?.name ?? ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        value={(Array.isArray(cityList) ? cityList : []).find(item => item._id === formData.city) || null}
                        onChange={(e, newValue) => {
                            const id = newValue?._id || ''
                            handleChange('city')({ target: { value: id } })
                            getAreaByCityId(id)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="City"
                                placeholder="Select City"
                                required
                                error={!!errors.city}
                                helperText={errors.city}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(areaList) ? areaList : []}
                        getOptionLabel={option => option?.name ?? ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        value={(Array.isArray(areaList) ? areaList : []).find(item => item._id === formData.area) || null}
                        onChange={(e, newValue) => {
                            const id = newValue?._id || ''
                            handleChange('area')({ target: { value: id } })
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Area"
                                placeholder="Select Area"
                                required
                                error={!!errors.area}
                                helperText={errors.area}
                            />
                        )}
                    />
                </Grid>

                {/* Google Map Section */}
                <Grid item xs={12}>

                    <Box>
                        <GoogleMapLocation />
                    </Box>
                </Grid>

                {/* Contact Number */}
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        fullWidth
                        label="Contact Number"
                        placeholder="Enter Contact Number"
                        name="contactNumber"
                        required
                        type="number"
                        inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]{10,12}',
                            maxLength: 12,
                            minLength: 10
                        }}
                        value={formData.contact_number}
                        onChange={handleChange('contact_number')}
                        error={!!errors.contact_number}
                        helperText={errors.contact_number}
                    />
                </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
                <Button variant="outlined" color="secondary" onClick={() => { resetForm(); router.push(`/en/apps/spritual/hinduism/manage/`) }} sx={{ mr: 2 }}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                    Save & Continue
                </Button>
            </Box>

        </Card>
    )
}

export default TempleOverview
