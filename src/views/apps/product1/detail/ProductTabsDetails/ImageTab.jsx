'use client'

import React, { useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'

// ✅ Assuming you already created these custom components

import FileUploaderMultiple from '../fileUploaderMultiple'
import { useproductContext } from '@/contexts/productContext'


const ImagesTab = () => {
    const { formData, handleFormChange } = useproductContext()

    
    

    const hasVariants = Boolean(formData?.hasVariants)

    return (
        <>
            {!hasVariants && (
                <Card>
                    <CardHeader title="Product Images" subheader="Cover and Thumbnail are fixed. Drag others to reorder." />
                    <CardContent>
                        <Grid container spacing={4} className="mb-4">
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 3,
                                        p: 3,
                                        backgroundColor: 'background.default'
                                    }}
                                >
                                    <FileUploaderMultiple
                                        maxFiles={6}
                                        acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            
        </>
    )
}

export default ImagesTab
