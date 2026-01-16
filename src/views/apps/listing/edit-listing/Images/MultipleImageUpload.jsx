'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Tooltip,
    CircularProgress,
    Paper,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import ImageService from '@/services/imageService'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'

export default function MultipleImagesUploader({
    title = 'Gallery',
    images = [],
    setImages,
    folderPath,
    errorKey,
}) {
    const [loading, setLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuIndex, setMenuIndex] = useState(null)
    const { galleryErrors, setRemovedBusinessImageIds } = useUpdateListingFormContext()

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsReady(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    // 📤 Upload new images
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        setLoading(true)
        try {
            const uploaded = await ImageService.uploadMultipleImage(files, {
                folder: folderPath,
            })
            const newImages =
                uploaded?.data?.map((item) => ({
                    url: item.url,
                    status: 'PENDING',
                })) || []

            setImages((prev) => [...prev, ...newImages])
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setLoading(false)
        }
    }

    // ❌ Remove image
    const handleRemove = useCallback(
        async (index, url) => {
            const removed = images[index]
            if (removed?._id) {
                setRemovedBusinessImageIds((prev) => [...prev, removed._id])
            }

            try {
                await ImageService.deleteImage(url)
            } catch (e) {
                console.error('Delete failed:', e)
            }

            setImages((prev) => prev.filter((_, i) => i !== index))
            handleMenuClose()
        },
        [images, setImages, setRemovedBusinessImageIds]
    )

    // ⭐ Set as cover image (move to first)
    const handleSetCover = (index) => {
        if (index === 0) return
        setImages((prev) => {
            const reordered = [...prev]
            const [selected] = reordered.splice(index, 1)
            reordered.unshift(selected)
            return reordered
        })
        handleMenuClose()
    }

    // Menu controls
    const handleMenuOpen = (e, index) => {
        setMenuAnchor(e.currentTarget)
        setMenuIndex(index)
    }

    const handleMenuClose = () => {
        setMenuAnchor(null)
        setMenuIndex(null)
    }

    // 🔀 Drag reorder
    const handleDragEnd = (result) => {
        const { source, destination } = result
        if (!destination) return
        const reordered = Array.from(images)
        const [moved] = reordered.splice(source.index, 1)
        reordered.splice(destination.index, 0, moved)
        setImages(reordered)
    }

    if (!isReady) {
        return (
            <Box sx={{ p: 2, background: '#1E2230', borderRadius: 2, minHeight: 120 }}>
                <Typography variant="body2" color="#aaa">
                    Initializing gallery…
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {title}{' '}
                <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontWeight: 400, fontSize: '0.85rem', color: 'primary', ml: 7 }}
                >
                    (Click ⋮ to set as cover or drag to reorder)
                </Typography>
            </Typography>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="gallery" direction="horizontal">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: 2,
                                p: 2,
                                borderRadius: 2,
                            }}
                        >
                            {/* Upload Slot */}
                            <label>
                                <input
                                    hidden
                                    accept="image/*"
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                                <Box sx={{ position: 'relative', width: '80%' }}>
                                    <Paper
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1 / 1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px dashed #555',
                                            color: '#888888ca',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            borderRadius: 2,
                                            transition: '0.2s',
                                            opacity: loading ? 0.7 : 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <AddPhotoAlternateIcon fontSize="medium" />
                                            <Typography variant="body2">
                                                {loading ? 'Uploading…' : '+ Add Image'}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    {loading && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                borderRadius: 2,
                                                zIndex: 2,
                                            }}
                                        >
                                            <CircularProgress size={36} color="primary" />
                                        </Box>
                                    )}
                                </Box>
                            </label>

                            {/* Images */}
                            {images.map((img, index) => {
                                const imgUrl = typeof img === 'string' ? img : img.url
                                const draggableId = `img-${index}-${btoa(imgUrl)
                                    .replace(/=/g, '')
                                    .slice(0, 10)}`
                                return (
                                    <Draggable
                                        key={draggableId}
                                        draggableId={draggableId}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    position: 'relative',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    width: '80%',
                                                    aspectRatio: '1 / 1',
                                                    border:
                                                        index === 0
                                                            ? '2px solid #1976d2'
                                                            : '1px solid #444',
                                                    backgroundColor: snapshot.isDragging
                                                        ? '#0d47a1'
                                                        : '#12141D',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Image-${index}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />

                                                {/* Status Tag */}
                                                {img?.status && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            left: 6,
                                                            backgroundColor:
                                                                img.status === 'APPROVED'
                                                                    ? '#2e7d32'
                                                                    : img.status === 'REJECTED'
                                                                    ? '#c62828'
                                                                    : '#1565c0',
                                                            color: 'white',
                                                            borderRadius: 1,
                                                            px: 1,
                                                            py: 0.25,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {img.status}
                                                    </Box>
                                                )}

                                                {/* Cover Label */}
                                                {index === 0 && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 8,
                                                            left: 8,
                                                            backgroundColor: '#1976d2',
                                                            color: 'white',
                                                            borderRadius: 1,
                                                            px: 1.5,
                                                            py: 0.25,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Cover
                                                    </Box>
                                                )}

                                                {/* ⋮ Menu */}
                                                <Tooltip title="Options">
                                                    <MoreVertIcon
                                                        onClick={(e) => handleMenuOpen(e, index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            right: 6,
                                                            fontSize: 28,
                                                            cursor: 'pointer',
                                                            color: 'white',
                                                            background: 'rgba(0, 0, 0, 0.4)',
                                                            borderRadius: '50%',
                                                            padding: '3px',
                                                            '&:hover': {
                                                                background: 'rgba(157, 12, 12, 0.9)',
                                                            },
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Paper>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#2C2F3A',
                        color: '#fff',
                        borderRadius: 1,
                        mt: 1,
                        minWidth: 140,
                    },
                }}
            >
                <MenuItem
                    onClick={() => handleSetCover(menuIndex)}
                    sx={{ fontSize: 14, '&:hover': { bgcolor: '#3b77b3ff' } }}
                >
                    Set as Cover
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => handleRemove(menuIndex, images[menuIndex]?.url)}
                    sx={{ fontSize: 14, '&:hover': { bgcolor: '#3b77b3ff' } }}
                >
                    Remove Image
                </MenuItem>
            </Menu>

            {/* Validation error */}
            {galleryErrors?.[errorKey] && (
                <Typography color="red" variant="body2" sx={{ mt: 1 }}>
                    {galleryErrors[errorKey]}
                </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                Tip: Click ⋮ → “Set as Cover” or drag to reorder. The first image is your Cover.
            </Typography>
        </Box>
    )
}
