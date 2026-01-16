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
import ImageService from '@/services/imageService'
import { useGurudwara } from '@/contexts/GurudwaraFormContext'
import FileUploader from '@/components/FileUploader'

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
        getAreaByCityId,
        areaList,
        imageId, setImageId, resetForm, setGurudwaraTabManager
    } = useGurudwara()

    const handleNextButtonClick = (e) => {
        e.preventDefault()
        if (!validate()) return

        console.log('Form submitted:', formData);
        console.log(validate());
        setGurudwaraTabManager(prev => ({
            ...prev,
            timing: true
        }))

        nextHandle()

    }
    const [sections, setSections] = useState(formData.about_gurudwara || [{ title: '', content: '' }])
    const handleSectionChange = (index, field, value) => {
        const newSections = [...sections]
        newSections[index][field] = value
        setSections(newSections)
        handleChange('about_gurudwara')({ target: { value: newSections } })
    }

    const addSection = () => {
        setSections([...sections, { title: '', content: '' }])
    }

    const removeSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index)
        setSections(newSections)
        handleChange('about_gurudwara')({ target: { value: newSections } })
    }



    return (
        <Card sx={{ p: 5 }} component="form" onSubmit={handleNextButtonClick}>
            <Typography variant="h5" sx={{ mb: 4 }}>
                Gurudwara Overview
            </Typography>

            <Grid container spacing={4}>
                {/* Gurudwara Name */}
                <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth required label="Gurudwara Name" name="gurudwaraName" value={formData.gurudwara_name} onChange={handleChange("gurudwara_name")} error={!!errors.gurudwara_name}
                        helperText={errors.gurudwara_name} />
                </Grid>

                {/* Main Image Upload */}
                <Grid item xs={12} sm={6}>
                    <FileUploader
                        acceptedFiles={['image/jpeg', 'image/png']}
                        error_text={errors.main_image}
                        initialFile={formData.main_image}
                        label="Upload Gurudwara Main Image"
                        name={"main_image"}
                        folderName='Spiritual/Sikhism/Temple'
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
                                error={!!errors.about_gurudwara}
                                helperText={errors.about_gurudwara}
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
                                error={!!errors.about_gurudwara}
                                helperText={errors.about_gurudwara}
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
                                placeholder="Select Country"
                                error={!!errors.country}
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
