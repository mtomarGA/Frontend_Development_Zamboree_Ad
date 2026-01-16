'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Avatar, Typography, IconButton, List, ListItem, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'

const FileUploaderMultiple = ({ onFileSelect, initialFiles = [], error_text }) => {
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (initialFiles.length > 0) {
            setFiles(initialFiles)
        }
    }, [initialFiles])

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        maxSize: 2 * 1024 * 1024, // 2MB per file
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: async acceptedFiles => {
            if (acceptedFiles.length === 0) return

            setUploading(true)
            try {
                const formData = new FormData()
                acceptedFiles.forEach(file => formData.append('images', file)) // ⬅️ field name 'images'

                const response = await ImageService.uploadMultipleImage(formData)

                if (response?.data?.length) {
                    const uploadedUrls = response.data.map(item => item.url)
                    const updatedFiles = [...files, ...uploadedUrls]
                    setFiles(updatedFiles)
                    onFileSelect(updatedFiles) // ⬅️ send full list to parent
                    console.log(updatedFiles, "updated fillllll");

                } else {
                    throw new Error('Invalid response from server')
                }
            } catch (err) {
                console.error('Image upload failed:', err)
                toast.error('Some images failed to upload.')
            } finally {
                setUploading(false)
            }
        },

        onDropRejected: () => {
            toast.error('Only image files under 2 MB are allowed.', { autoClose: 3000 })
        }
    })

    const handleRemove = url => {
        const updatedFiles = files.filter(item => item !== url)
        setFiles(updatedFiles)
        onFileSelect(updatedFiles)
    }

    return (
        <>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='flex items-center flex-col'>
                    <Avatar variant='rounded' className='bs-12 is-12'>
                        <i className='tabler-upload' />
                    </Avatar>
                    <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif (Max 2 MB each)</Typography>
                    <p className='text-red-500 text-sm'>{error_text}</p>
                </div>
            </div>

            {uploading ? (
                <CircularProgress color='inherit' sx={{ mt: 2 }} />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
                    {files.map((url, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={url}
                                alt={`Uploaded file ${index}`}
                                width={100}
                                height={100}
                                style={{ borderRadius: 8, objectFit: 'cover' }}
                            />
                            <IconButton
                                onClick={() => handleRemove(url)}
                                size="small"
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: '#fff',
                                    boxShadow: '0 0 6px rgba(0,0,0,0.2)'
                                }}
                            >
                                <i className='tabler-x text-sm' />
                            </IconButton>
                        </div>
                    ))}
                </div>

            )}
        </>
    )
}

export default FileUploaderMultiple
