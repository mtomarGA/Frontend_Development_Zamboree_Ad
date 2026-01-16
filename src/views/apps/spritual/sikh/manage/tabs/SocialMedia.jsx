'use client'

import React from 'react'
import {
    Button, Card, Box, Typography, Grid, InputAdornment
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { YouTube, Facebook, Instagram, LinkedIn } from '@mui/icons-material'
import { useGurudwara } from '@/contexts/GurudwaraFormContext'

const SocialMedia = ({ nextHandle, handleCancel }) => {
    const {
        handleSocialMediaChange,
        socialMediaData,
        socialMediaErrors,
        validateSocialMedia,
        resetForm,
        setGurudwaraTabManager
    } = useGurudwara()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setGurudwaraTabManager(prev => ({
            ...prev,
            gallery: true
        }))

        nextHandle()
    }

    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    Social Media
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            fullWidth
                            label="YouTube"
                            name="youtube"
                            placeholder="Enter YouTube URL"
                            value={socialMediaData.youtube || ''}
                            onChange={handleSocialMediaChange('youtube')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <YouTube color="error" sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            youtube.com/
                                        </Typography>
                                    </InputAdornment>
                                )
                            }}
                            error={!!socialMediaErrors.youtube}
                            helperText={socialMediaErrors.youtube}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            fullWidth
                            label="Facebook"
                            name="facebook"
                            placeholder="Enter Facebook URL"
                            value={socialMediaData.facebook || ''}
                            onChange={handleSocialMediaChange('facebook')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Facebook color="primary"  sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            facebook.com/
                                        </Typography>
                                    </InputAdornment>
                                )
                            }}
                            error={!!socialMediaErrors.facebook}
                            helperText={socialMediaErrors.facebook}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            fullWidth
                            label="Instagram"
                            name="instagram"
                            placeholder="Enter Instagram URL"
                            value={socialMediaData.instagram || ''}
                            onChange={handleSocialMediaChange('instagram')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Instagram sx={{ color: '#E1306C', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            instagram.com/
                                        </Typography>
                                    </InputAdornment>
                                )
                            }}
                            error={!!socialMediaErrors.instagram}
                            helperText={socialMediaErrors.instagram}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            fullWidth
                            label="LinkedIn"
                            name="linkedin"
                            placeholder="Enter LinkedIn URL"
                            value={socialMediaData.linkedIn || ''}
                            onChange={handleSocialMediaChange('linkedIn')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LinkedIn sx={{ color: '#0077B5', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            linkedin.com/
                                        </Typography>
                                    </InputAdornment>
                                )
                            }}
                            error={!!socialMediaErrors.linkedIn}
                            helperText={socialMediaErrors.linkedIn}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                    <Button className="mr-2" onClick={() => { handleCancel(); resetForm() }} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save & Continue
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}

export default SocialMedia
