"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Card, Chip, IconButton, Menu, MenuItem, Tooltip, Typography, CircularProgress } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB like FileUploader

const ImageGrid = ({
    value = [],
    onChange = () => { },
    maxImages = 12,
    coverFixedIndex = 0, // position where cover should live (0-based)
    folderName = 'Gallery',
    acceptedFiles = 'image/*',
    isWatermark = false
}) => {
    const [items, setItems] = useState(() => normalize(value, coverFixedIndex))
    const [draggingId, setDraggingId] = useState(null)
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuForId, setMenuForId] = useState(null)
    const inputRef = useRef(null)

    // keep local state in sync with prop changes
    useEffect(() => {
        setItems(prev => normalize(value, coverFixedIndex))
    }, [value, coverFixedIndex])

    const total = items.length

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        noClick: true,
        noKeyboard: true,
        multiple: true,
        maxFiles: Math.max(0, maxImages - total),
        maxSize: MAX_SIZE_BYTES,
        accept: { [acceptedFiles]: ['.png', '.jpg', '.jpeg'] },
        onDropRejected: (rejections) => {
            // aggregate errors
            const msg = rejections?.[0]?.errors?.[0]?.message || 'Some files were rejected.'
            toast.error(msg, { autoClose: 2500 })
        },
        onDrop: async (accepted) => {
            if (!accepted?.length) return
            const remainingSlots = Math.max(0, maxImages - (items.length))
            const files = accepted.slice(0, remainingSlots)
            if (accepted.length > files.length) {
                toast.info(`Only ${remainingSlots} more image(s) allowed.`, { autoClose: 2500 })
            }
            await handleUploadFiles(files)
        }
    })

    async function handleUploadFiles(files) {
        if (!files?.length) return
        // optimistic: show previews with uploading state
        const tempEntries = files.map(file => ({
            id: genId(),
            url: URL.createObjectURL(file),
            isCover: false,
            isThumbnail: false,
            _uploading: true,
            _file: file
        }))
        setItems(prev => {
            const merged = [...prev, ...tempEntries].slice(0, maxImages)
            return enforceCoverPosition(merged, coverFixedIndex)
        })

        for (const temp of tempEntries) {
            try {
                const fd = new FormData()
                fd.append('image', temp._file)
                const uploaded = await ImageService.uploadImage(fd, { isWatermark, folder: folderName })
                const url = uploaded?.data?.url
                if (!url) throw new Error('Upload succeeded without URL')
                setItems(prev => {
                    const next = prev.map(it => it.id === temp.id ? { id: temp.id, url, isCover: it.isCover, isThumbnail: it.isThumbnail } : it)
                    // If there's no cover yet, set the first image as cover automatically
                    if (!next.some(i => i.isCover) && next.length) {
                        next[coverFixedIndex] = { ...next[coverFixedIndex], isCover: true }
                        // ensure the cover sits at fixed index
                        return enforceCoverPosition(next, coverFixedIndex)
                    }
                    return next
                })
            } catch (err) {
                console.error(err)
                toast.error('Upload failed for 1 image.', { autoClose: 2500 })
                setItems(prev => prev.filter(it => it.id !== temp.id))
            }
        }
        // emit after finishing batch
        emitChange()
    }

    const emitChange = useCallback(() => {
        onChange(items.map(({ _uploading, _file, ...rest }) => rest))
    }, [items, onChange])

    useEffect(() => {
        emitChange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items])

    // Context menu handlers
    const openMenu = (event, id) => {
        setMenuAnchor(event.currentTarget)
        setMenuForId(id)
    }
    const closeMenu = () => {
        setMenuAnchor(null)
        setMenuForId(null)
    }

    const setAsCover = (id) => {
        setItems(prev => {
            const idx = prev.findIndex(i => i.id === id)
            if (idx === -1) return prev
            const next = prev.map(i => ({ ...i, isCover: i.id === id }))
            // move that image to coverFixedIndex (swap)
            return moveToIndex(next, idx, coverFixedIndex)
        })
        closeMenu()
    }

    const setAsThumbnail = (id) => {
        setItems(prev => prev.map(i => ({ ...i, isThumbnail: i.id === id })))
        closeMenu()
    }

    const clearThumbnail = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, isThumbnail: false } : i))
        closeMenu()
    }

    const removeItem = (id) => {
        setItems(prev => {
            let next = prev.filter(i => i.id !== id)
            // If we removed the cover, assign a new cover if any
            if (!next.some(i => i.isCover) && next.length) {
                const target = Math.min(coverFixedIndex, next.length - 1)
                next = next.map((i, idx) => ({ ...i, isCover: idx === target }))
                next = enforceCoverPosition(next, coverFixedIndex)
            }
            return next
        })
        closeMenu()
    }

    // Drag & drop reordering
    const onDragStart = (e, id) => {
        setDraggingId(id)
        e.dataTransfer.effectAllowed = 'move'
    }
    const onDragOver = (e, targetIndex) => {
        e.preventDefault()
        // Indicate move allowed
        e.dataTransfer.dropEffect = 'move'
    }
    const onDropItem = (e, targetIndex) => {
        e.preventDefault()
        if (!draggingId) return
        setItems(prev => {
            const fromIdx = prev.findIndex(i => i.id === draggingId)
            if (fromIdx === -1) return prev
            const draggingIsCover = prev[fromIdx].isCover
            const targetIsCoverSpot = targetIndex === coverFixedIndex
            // Prevent dragging the cover away from its fixed index
            if (draggingIsCover && targetIndex !== coverFixedIndex) {
                return prev
            }
            // If dropping onto the cover spot with a non-cover => replace cover with this as cover (swap & set flag)
            if (!draggingIsCover && targetIsCoverSpot) {
                const next = prev.map((i, idx) => ({ ...i, isCover: idx === fromIdx }))
                return moveToIndex(next, fromIdx, coverFixedIndex)
            }
            // Regular reorder (keeping cover fixed)
            const next = arrayMove(prev, fromIdx, targetIndex)
            return enforceCoverPosition(next, coverFixedIndex)
        })
        setDraggingId(null)
    }

    const onDragEnd = () => setDraggingId(null)

    const canAddMore = items.length < maxImages

    const previewTiles = useMemo(() => items, [items])

    return (
        <Card className="p-4">
            <Box className="flex items-center justify-between mb-3">
                <Typography variant="h6">Images</Typography>
                <Chip label={`Total: ${total}/${maxImages}`} size="small" color="primary" variant="outlined" />
            </Box>

            <Box {...getRootProps()}>
                <input {...getInputProps()} />
                <Box className={`grid gap-3`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                    {previewTiles.map((item, idx) => (
                        <ImageTile
                            key={item.id}
                            item={item}
                            index={idx}
                            coverFixedIndex={coverFixedIndex}
                            onDelete={() => removeItem(item.id)}
                            onMenu={(e) => openMenu(e, item.id)}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDropItem}
                            onDragEnd={onDragEnd}
                        />
                    ))}

                    {canAddMore && (
                        <UploadTile
                            isDragActive={isDragActive}
                            onClick={() => open()}
                            onPickClick={() => inputRef.current?.click()}
                        />
                    )}
                </Box>
            </Box>

            {/* Hidden file input as alternative to drop */}
            <input
                ref={inputRef}
                type="file"
                accept={acceptedFiles}
                multiple
                hidden
                onChange={async (e) => {
                    const files = Array.from(e.target.files || [])
                    e.currentTarget.value = ''
                    const remainingSlots = Math.max(0, maxImages - (items.length))
                    const selected = files.slice(0, remainingSlots)
                    if (!selected.length) return
                    const tooBig = selected.find(f => f.size > MAX_SIZE_BYTES)
                    if (tooBig) {
                        toast.error('Each image must be under 2MB.', { autoClose: 2500 })
                        return
                    }
                    await handleUploadFiles(selected)
                }}
            />

            {/* Per-image menu */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                {menuForId && (
                    <>
                        <MenuItem onClick={() => setAsCover(menuForId)}>Set as cover</MenuItem>
                        <MenuItem onClick={() => setAsThumbnail(menuForId)}>Set as thumbnail</MenuItem>
                        <MenuItem onClick={() => clearThumbnail(menuForId)}>Remove thumbnail</MenuItem>
                        <MenuItem onClick={() => removeItem(menuForId)} sx={{ color: 'error.main' }}>Delete</MenuItem>
                    </>
                )}
            </Menu>
        </Card>
    )
}

function UploadTile({ isDragActive, onClick, onPickClick }) {
    return (
        <Box
            role="button"
            onClick={onClick}
            className={`border border-dashed rounded-lg h-[140px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition ${isDragActive ? 'bg-gray-50 border-primary' : ''}`}
        >
            <i className="tabler-cloud-upload text-2xl mb-2" />
            <Typography variant="body2" className="font-medium">Add images</Typography>
            <Typography variant="caption" color="text.secondary">Drag & drop or click</Typography>
        </Box>
    )
}

function ImageTile({ item, index, coverFixedIndex, onDelete, onMenu, onDragStart, onDragOver, onDrop, onDragEnd }) {
    const isCoverSpot = index === coverFixedIndex
    const isCover = item.isCover
    const uploading = item._uploading

    const disabledDrag = isCover && isCoverSpot // cover tile stays put

    return (
        <Box
            className="relative group rounded-lg overflow-hidden border hover:shadow-sm"
            draggable={!disabledDrag}
            onDragStart={(e) => onDragStart(e, item.id)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
            sx={{ userSelect: 'none' }}
        >
            <Box className="aspect-square bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={isCover ? 'Cover image' : 'Image'} className="w-full h-full object-cover" />
            </Box>

            {/* Tags */}
            <Box className="absolute top-1 left-1 flex gap-1">
                {isCover && <Chip size="small" label="Cover" color="primary" />}
                {item.isThumbnail && <Chip size="small" label="Thumbnail" color="secondary" />}
            </Box>

            {/* Actions */}
            <Box className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={onDelete}>
                        <i className="tabler-x" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="More">
                    <IconButton size="small" onClick={onMenu}>
                        <i className="tabler-dots" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Upload overlay */}
            {uploading && (
                <Box className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <CircularProgress size={28} thickness={5} />
                </Box>
            )}

            {/* Cover position indicator */}
            {isCoverSpot && !isCover && (
                <Box className="absolute bottom-1 left-1">
                    <Chip size="small" variant="outlined" label="Cover position" />
                </Box>
            )}
        </Box>
    )
}

// Helpers
function arrayMove(arr, from, to) {
    const next = arr.slice()
    const [spliced] = next.splice(from, 1)
    next.splice(to, 0, spliced)
    return next
}

function moveToIndex(arr, from, to) {
    if (from === to) return arr
    return arrayMove(arr, from, to)
}

function enforceCoverPosition(arr, coverIdx) {
    const next = arr.slice()
    const currentIndex = next.findIndex(i => i.isCover)
    if (currentIndex === -1) return next
    if (currentIndex === coverIdx) return next
    return moveToIndex(next, currentIndex, Math.min(coverIdx, next.length - 1))
}

function normalize(value, coverIdx) {
    const mapped = (value || []).map(v => ({
        id: v.id || genId(),
        url: v.url,
        isCover: !!v.isCover,
        isThumbnail: !!v.isThumbnail
    }))
    return enforceCoverPosition(mapped, coverIdx)
}

export default ImageGrid
