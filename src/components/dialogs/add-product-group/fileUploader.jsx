'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Avatar, Typography, IconButton, List, ListItem, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'

const FileUploader = ({ onFileSelect, initialFile, error_text }) => {
    const [file, setFile] = useState(null)
    const [imageUploading, setImageUploading] = useState(false)

    useEffect(() => {
        if (initialFile) {
            setFile(initialFile)
        }
    }, [initialFile])

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        maxFiles: 1,
        maxSize: 2 * 1024 * 1024, // 2MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: async acceptedFiles => {
            const selectedFile = acceptedFiles[0]
            if (!selectedFile) return

            setImageUploading(true)
            try {
                const formData = new FormData()
                formData.append('image', selectedFile)
                const response = await ImageService.uploadImage(formData)

                if (response?.data?.url) {
                    setFile(response.data.url)
                    onFileSelect(response.data.url) // ⬅️ pass the image URL to parent
                } else {
                    throw new Error('Invalid image upload response')
                }
            } catch (err) {
                console.error('Image upload failed:', err)
                toast.error('Image upload failed. Please try again.')
            } finally {
                setImageUploading(false)
            }
        },
        onDropRejected: () => {
            toast.error('You can only upload 1 image with max size of 2 MB.', { autoClose: 3000 })
        }
    })

    const handleRemove = () => {
        setFile(null)
        onFileSelect(null)
    }

    if (imageUploading) return <CircularProgress color='inherit' />

    return (
        <>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {!file && (
                    <div className='flex items-center flex-col'>
                        <Avatar variant='rounded' className='bs-12 is-12'>
                            <i className='tabler-upload' />
                        </Avatar>
                        <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
                        {/* <Typography>Only 1 file, max size 2 MB</Typography> */}
                        <p className='text-red-500 text-sm'>{error_text}</p>
                    </div>
                )}
            </div>

            {file && (
                <List>
                    <ListItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <img src={file} alt="Uploaded file" width={100} height={100} />
                            <IconButton onClick={handleRemove}>
                                <i className='tabler-x text-xl' />
                            </IconButton>
                        </div>
                    </ListItem>
                </List>
            )}
        </>
    )
}

export default FileUploader
