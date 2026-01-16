import { useState, useEffect } from 'react'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import Image from "@/services/imageService"

const FileUploaderMultiple = ({ onFileChange }) => {
    const [files, setFiles] = useState([])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            const uploadedFiles = await Promise.all(
                acceptedFiles.map(async file => {
                    const result = await Image.uploadImage({ image: file })
                    return {
                        preview: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                        url: result.data.url
                    }
                })
            )
            const updatedFiles = [...files, ...uploadedFiles]
            setFiles(updatedFiles)
            onFileChange?.(updatedFiles)
        }
    })

    useEffect(() => {
        return () => {
            // Clean up file previews on unmount
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    const handleRemoveFile = (name) => {
        const filtered = files.filter(file => file.name !== name)
        setFiles(filtered)
        onFileChange?.(filtered)
    }

    const handleRemoveAllFiles = () => {
        setFiles([])
        onFileChange?.([])
    }

    return (
        <>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='flex items-center flex-col'>
                    <Avatar variant='rounded' className='bs-12 is-12 mbe-9 mt-6'>
                        <i className='tabler-upload' />
                    </Avatar>
                    <Typography variant='h6' className='text-center mbe-2.5'>
                        Drop files here or click to upload.
                    </Typography>
                    <Typography className='text-center'>
                        Drop files here or click{' '}
                        <Link href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                            browse
                        </Link>{' '}
                        through your machine
                    </Typography>
                </div>
            </div>

            {files.length > 0 && (
                <>
                    <List>
                        {files.map(file => (
                            <ListItem key={file.name} className='flex justify-between items-center'>
                                <div className='file-details flex gap-4 items-center'>
                                    <img
                                        width={38}
                                        height={38}
                                        alt={file.name}
                                        src={file.preview}
                                        style={{ borderRadius: '4px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <Typography className='file-name'>{file.name}</Typography>
                                        <Typography className='file-size' variant='body2'>
                                            {Math.round(file.size / 102.4) / 10 > 1000
                                                ? `${(Math.round(file.size / 102.4) / 100).toFixed(1)} MB`
                                                : `${(Math.round(file.size / 102.4) / 10).toFixed(1)} KB`}
                                        </Typography>
                                    </div>
                                </div>
                                <IconButton onClick={() => handleRemoveFile(file.name)}>
                                    <i className='tabler-x text-xl' />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    {/* <div className='text-end'>
                        <Button variant='outlined' color='error' onClick={handleRemoveAllFiles}>
                            Remove All
                        </Button>
                    </div> */}
                </>
            )}
        </>
    )
}

export default FileUploaderMultiple
