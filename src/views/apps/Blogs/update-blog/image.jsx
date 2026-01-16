import { useState, useEffect } from 'react'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

const FileUploaderMultiple = ({ onFileChange }) => {
    const [files, setFiles] = useState([])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            const mappedFiles = acceptedFiles.map(file => Object.assign(file))
            setFiles(mappedFiles)
            onFileChange?.(mappedFiles) // Notify parent
        }
    })

    useEffect(() => {
        onFileChange?.(files)
    }, [files, onFileChange])

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
        } else {
            return <i className='tabler-file-description' />
        }
    }

    const handleRemoveFile = file => {
        const filtered = files.filter(i => i.name !== file.name)
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
                    <Typography variant='h4' className='mbe-2.5'>
                        Drop files here or click to upload.
                    </Typography>
                    <Typography>
                        Drop files here or click{' '}
                        <Link href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                            browse
                        </Link>{' '}
                        through your machine
                    </Typography>
                </div>
            </div>

            {files.length ? (
                <>
                    <List>
                        {files.map(file => (
                            <ListItem key={file.name}>
                                <div className='file-details'>
                                    <div className='file-preview'>{renderFilePreview(file)}</div>
                                    <div>
                                        <Typography className='file-name'>{file.name}</Typography>
                                        <Typography className='file-size' variant='body2'>
                                            {Math.round(file.size / 100) / 10 > 1000
                                                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                                                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                                        </Typography>
                                    </div>
                                </div>
                                <IconButton onClick={() => handleRemoveFile(file)}>
                                    <i className='tabler-x text-xl' />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <div className='buttons'>
                        {/* <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                            Remove All
                        </Button> */}
                        {/* <Button variant='contained'>Upload Files</Button> */}
                    </div>
                </>
            ) : null}
        </>
    )
}

export default FileUploaderMultiple
