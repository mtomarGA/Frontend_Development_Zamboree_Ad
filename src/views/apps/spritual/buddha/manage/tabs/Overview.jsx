'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Typography,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { useTempleContext } from '@/contexts/TempleFormContext'
import GoogleMapLocation from './sections/component/GoogleMapLocation'
import FileUploader from './sections/component/FileUploader'
import ImageService from '@/services/imageService'
import { useJainism } from '@/contexts/JainFormContext'
import { useBuddhism } from '@/contexts/BuddhaFormContext'

const TempleOverview = ({ nextHandle, handleCancel }) => {
    const { formData,
        errors,
        handleChange,
        countryList,
        stateList,
        cityList,
        areaList,
        getAreaByCityId,
        getStatesbyId,
        getCityByStateId,
        validate,
        imageId, setImageId, resetForm, setTempleTabManager
    } = useBuddhism()

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

    console.log("errors in overview", errors);

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
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Temple Main Image*
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            height: 200,
                            border: `1px dashed ${errors.main_image ? 'red' : '#ccc'}`,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                            fontSize: 14,
                            textAlign: 'center',
                        }}
                    >
                        <FileUploader
                            onFileSelect={async (file) => {
                                setImageUploading(true)
                                if (file) {
                                    const url = URL.createObjectURL(file)
                                    const formData = new FormData()
                                    formData.append('image', file)
                                    const uploadedFile = await ImageService.uploadImage(formData, { folder: "Spiritual/Buddhism/Temple" })
                                    const imageUrl = uploadedFile.data.url
                                    setImageId(uploadedFile.data.url)
                                    handleChange('main_image')({ target: { value: imageUrl } })
                                    setImageUploading(false)
                                }
                                setImageUploading(false)
                            }}
                            imageUploading={imageUploading}
                            error_text={errors.main_image}
                            initialFile={formData.main_image}
                            imageId={imageId}
                            setImageUploading={setImageUploading}
                        />
                    </Box>
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
                        getOptionLabel={(option) => option?.name || ''}
                        value={Array.isArray(countryList) ? countryList.find(item => item._id === formData.country) || null : null}
                        onChange={(_, newValue) => {
                            const value = newValue ? newValue._id : ''
                            handleChange('country')({ target: { value } })
                            if (value) getStatesbyId(value)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Country"
                                required
                                error={!!errors.country}
                                placeholder="Select Country"
                                helperText={errors.country}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(stateList) ? stateList : []}
                        getOptionLabel={(option) => option?.name || ''}
                        value={Array.isArray(stateList) ? stateList.find(item => item._id === formData.state) || null : null}
                        onChange={(_, newValue) => {
                            const value = newValue ? newValue._id : ''
                            handleChange('state')({ target: { value } })
                            if (value) getCityByStateId(value)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="State"
                                required
                                placeholder="Select State"
                                error={!!errors.state}
                                helperText={errors.state}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(cityList) ? cityList : []}
                        getOptionLabel={(option) => option?.name || ''}
                        value={Array.isArray(cityList) ? cityList.find(item => item._id === formData.city) || null : null}
                        onChange={(_, newValue) => {
                            const value = newValue ? newValue._id : ''
                            handleChange('city')({ target: { value } })
                            if (value) getAreaByCityId(value)
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="City"
                                required
                                placeholder="Select City"
                                error={!!errors.city}
                                helperText={errors.city}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(areaList) ? areaList : []}
                        getOptionLabel={(option) => option?.name || ''}
                        value={Array.isArray(areaList) ? areaList.find(item => item._id === formData.area) || null : null}
                        onChange={(_, newValue) => {
                            const value = newValue ? newValue._id : ''
                            handleChange('area')({ target: { value } })
                        }}
                        renderInput={(params) => (
                            <CustomTextField
                                {...params}
                                label="Area"
                                required
                                placeholder="Select Area"
                                error={!!errors.area}
                                helperText={errors.area}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                </Grid>

                {/* Google Map Section */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Google Map Location
                    </Typography>
                    <CustomTextField
                        fullWidth
                        placeholder="Paste map embed link or coordinates"
                        required
                        name="mapLocation"
                        value={formData.google_map_url}
                        onChange={handleChange('google_map_url')}
                        error={!!errors.google_map_url}
                        helperText={errors.google_map_url}
                        disabled
                    />
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
                        InputProps={{
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
                <Button variant="outlined" color="secondary" onClick={() => { handleCancel(); resetForm() }} sx={{ mr: 2 }}>
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
