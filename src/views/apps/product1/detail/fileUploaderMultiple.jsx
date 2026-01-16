'use client'
import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material'
import { toast } from 'react-toastify'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import ImageService from '@/services/imageService'
import { useproductContext } from '@/contexts/productContext'
import MultiImageCropperModal from './ImageCropperModal'

const FileUploaderMultiple = ({
  initialImages,
  onFileSelect,
  maxFiles = 6,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const { handleFormChange, formData } = useproductContext()

  const [files, setFiles] = useState(Array(maxFiles).fill(null))
  const [isUploading, setIsUploading] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedPreviews, setSelectedPreviews] = useState([])

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuIndex, setMenuIndex] = useState(null)

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
  };
  useEffect(() => {
    if (!initialImages) return;

    // Normalize: handle both object + string
    const normalized = initialImages
      .map(img => {
        if (typeof img === "string") return img;     // add mode
        if (typeof img === "object") return img?.url; // edit mode
        return null;
      })
      .filter(Boolean);

    // Fill fixed size array
    const updated = Array(maxFiles).fill(null);

    normalized.slice(0, maxFiles).forEach((url, i) => {
      updated[i] = {
        url,
        isUploaded: true,
      };
    });

    setFiles(updated);

    // send only URLs to form
    handleFormChange("images", normalized);
  }, [initialImages]);


  useEffect(() => {
    if (!formData.hasVariants) {
      console.log(formData.variants, "formData.variants");
      const normalized = formData.images
        .map((img) =>
          typeof img === 'string'
            ? img.trim()
            : img?.url?.trim()
        )
        .filter(Boolean)

      const updated = Array(maxFiles).fill(null)
      normalized.slice(0, maxFiles).forEach((url, i) => {
        updated[i] = { url, isUploaded: true }
      })

      setFiles(updated)
      handleFormChange('images', normalized)
    }

  }, [formData.productName])

  const uploadImageToServer = async (file) => {
    const form = new FormData()
    form.append('image', file)
    const res = await ImageService.uploadImage(form)
    if (res.data?.url) return res.data.url
    throw new Error('Upload failed')
  }


  const { getInputProps, open } = useDropzone({
    multiple: true,
    noClick: true,
    noKeyboard: true,
    maxFiles,
    maxSize: 3 * 1024 * 1024,
    accept: acceptedFormats.reduce((a, f) => {
      a[f] = []
      return a
    }, {}),
    onDrop: (accepted) => {
      if (!accepted.length) return
      const previews = accepted.map((f) => URL.createObjectURL(f))
      setSelectedPreviews(previews)
      setCropModalOpen(true)
    },
    onDropRejected: () => toast.error('Only image files under 3MB allowed'),
  })

  // Handle cropped images upload (ONLY CROPPED)
  const handleCroppedImages = async (croppedBlobs) => {
    setCropModalOpen(false)
    setIsUploading(true)

    try {
      const urls = []
      for (const blob of croppedBlobs) {
        const croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
        const url = await uploadImageToServer(croppedFile)
        urls.push(url)
      }

      const updated = [...files]
      urls.forEach((url) => {
        const emptyIndex = updated.findIndex((f) => f === null)
        if (emptyIndex !== -1) updated[emptyIndex] = { url, isUploaded: true }
      })

      setFiles(updated)
      handleFormChange('images', updated.filter((f) => f?.url).map((f) => f.url))
      if (onFileSelect) onFileSelect(urls)
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
      selectedPreviews.forEach((url) => URL.revokeObjectURL(url))
      setSelectedPreviews([])
    }
  }

  const handleRemove = (index) => {
    const updated = [...files]
    updated[index] = null
    setFiles(updated)
    const urls = updated.filter((f) => f?.url).map((f) => f.url)

    if (onFileSelect) onFileSelect(urls)
    handleFormChange('images', urls)
  }

  const handleSetAsThumbnail = (index) => {
    const updated = [...files]
    const [selected] = updated.splice(index, 1)
    updated.unshift(selected)
    setFiles(updated)
    handleFormChange('images', updated.filter((f) => f?.url).map((f) => f.url))
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(files)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    setFiles(items)
    const urls = items
      .filter((f) => f?.url)
      .map((f) => f.url);

    // Callback
    onFileSelect?.(urls);
    handleFormChange('images', items.filter((f) => f?.url).map((f) => f.url))
  }

  const handleMenuOpen = (event, index) => {
    setMenuAnchor(event.currentTarget)
    setMenuIndex(index)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setMenuIndex(null)
  }

  return (
    <Box>
      <input {...getInputProps()} style={{ display: 'none' }} />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 112px))',
                gap: 2.5,
                p: 1,
              }}
            >
              {files.map((file, index) =>
                file ? (
                  <Draggable key={index} draggableId={`image-${index}`} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          width: 112,
                          height: 112,
                          position: 'relative',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={file.url}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {index === 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 6,
                              left: 6,
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              color: '#fff',
                              fontSize: '11px',
                              px: 1,
                              py: 0.3,
                              borderRadius: 1,
                            }}
                          >
                            Thumbnail
                          </Box>
                        )}

                        <Box
                          onClick={(e) => handleMenuOpen(e, index)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            cursor: 'pointer',
                            color: '#000',
                            backgroundColor: 'rgba(255,255,255,0.85)',
                            boxShadow: 2,
                            borderRadius: '4px',
                            px: 0.6,
                            py: 0.3,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            zIndex: 10,
                            '&:hover': { backgroundColor: 'white' },
                          }}
                        >
                          <i className="tabler-dots-vertical" />
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ) : (
                  <Box
                    key={index}
                    sx={{
                      width: 112,
                      height: 112,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'action.hover',
                    }}
                    onClick={() => open()}
                  >
                    <Box
                      className="flex items-center justify-center gap-1"
                      sx={{
                        cursor: "pointer",
                        width: "fit-content"
                      }}
                    >
                      <i className="tabler-plus" />
                      <Typography variant="caption">Add Image</Typography>
                    </Box>

                  </Box>
                )
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleSetAsThumbnail(menuIndex)} disabled={menuIndex === 0}>
          <i className="tabler-focus me-2" /> Set as Thumbnail
        </MenuItem>
        <MenuItem onClick={() => handleRemove(menuIndex)}>
          <i className="tabler-trash me-2" /> Remove Image
        </MenuItem>
      </Menu>

      {isUploading && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Uploading...</Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Tip: Drag & drop to reorder images. First image is the thumbnail.
      </Typography>

      <MultiImageCropperModal
        open={cropModalOpen}
        images={selectedPreviews}
        aspect={1}
        onCancel={() => setCropModalOpen(false)}
        onCropAll={handleCroppedImages}
      />
    </Box>
  )
}

export default FileUploaderMultiple
