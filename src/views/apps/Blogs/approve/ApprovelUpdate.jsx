'use client'

import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Button,
  Box
} from '@mui/material'
import Grid from '@mui/material/Grid'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import classnames from 'classnames'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

import '@/libs/styles/tiptapEditor.css'

import blogService from '@/services/blog/blogservice'
import blogTagService from '@/services/blog/blogTagService'
import blogCategoryService from '@/services/blog/blogCategoryservice'

const EditorToolbar = ({ editor }) => {
  if (!editor) return null

  const buttons = [
    { icon: 'tabler-bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    {
      icon: 'tabler-underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive('underline')
    },
    {
      icon: 'tabler-italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic')
    },
    {
      icon: 'tabler-strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive('strike')
    },
    {
      icon: 'tabler-align-left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      active: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: 'tabler-align-center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      active: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: 'tabler-align-right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      active: editor.isActive({ textAlign: 'right' })
    },
    {
      icon: 'tabler-align-justified',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      active: editor.isActive({ textAlign: 'justify' })
    }
  ]

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      {buttons.map((btn, idx) => (
        <CustomIconButton
          key={idx}
          {...(btn.active && { color: 'primary' })}
          variant='tonal'
          size='small'
          onClick={btn.action}
        >
          <i className={classnames(btn.icon, { 'text-textSecondary': !btn.active })} />
        </CustomIconButton>
      ))}
    </div>
  )
}

const UpdateApprovelBlog = () => {
  const { id } = useParams()
  const router = useRouter()

  const [productKeywords, setProductKeywords] = useState([])
  const [seoKeywords, setSeoKeywords] = useState([])
  const [files, setFiles] = useState('')
  const [blogTagList, setBlogTagList] = useState([])
  const [blogCategoryList, setBlogCategoryList] = useState([])
  const [imageLoadError, setImageLoadError] = useState(false)

  const handleSend = () => {
    router.push(`/en/apps/blogs/approve-blogs`)
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      status: ''
    }
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    autofocus: true,
    editable: false
  })

  // Debug function for image path
  const debugImagePath = () => {}

  // Function to get proper image URL
  const getImageUrl = imagePath => {
    if (!imagePath) return ''

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    // If it starts with a slash, remove it to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

    return `http://localhost:8000/${cleanPath}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, tagRes, catRes] = await Promise.all([
          blogService.getSingleBlog(id),
          blogTagService.getBlogTag(),
          blogCategoryService.getBlogCategory()
        ])

        const blog = blogRes.data

        setBlogTagList(tagRes.data)
        setBlogCategoryList(catRes.data)
        setValue('title', blog.blogTitle)
        setValue('author', blog.authorName)
        setValue('metaTitle', blog.metaTitle)
        setValue('metaDescription', blog.metaDescription)
        setValue('category', blog.category || '')
        setValue('Tags', blog.tags?.map(tag => tag) || [])
        setValue('status', blog.status || '')

        // Improved file handling
        if (blog.image) {
          setFiles(blog.image)
          setImageLoadError(false)
        } else {
          console.warn('No image found in blog data')
          setFiles('')
        }

        setProductKeywords(blog.blogKeywords || [])
        setSeoKeywords(blog.seoKeywords || [])
        editor?.commands.setContent(blog.description || '')
      } catch (error) {
        console.error('Fetch error:', error) // Better error logging
        toast.error('Failed to load blog details')
      }
    }

    if (editor) fetchData()
  }, [editor, id, setValue])

  // Debug image path when files change
  useEffect(() => {
    if (files) {
      debugImagePath()
    }
  }, [files])

  const onSubmit = async data => {
    try {
      const datas = {
        status: data.status
      }

      const res = await blogService.updateStatus(id, datas)
      toast.success(res?.data?.message || 'Approve Blog updated ')
      handleSend()
    } catch (error) {
      toast.error(error.message || 'Failed to Approve blog update ')
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const handleImageError = e => {
    console.error('Image failed to load:', e.target.src)
    setImageLoadError(true)
  }

  const handleImageLoad = () => {
    setImageLoadError(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        {/* Blog Info Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={<Typography variant='h4'>Update Blog</Typography>} />
            <CardContent>
              <Grid container spacing={6}>
                {/* Blog Title */}
                <Grid item xs={12}>
                  <Controller
                    name='title'
                    control={control}
                    rules={{ required: 'Blog title is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Blog Title'
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12}>
                  <Controller
                    name='category'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={blogCategoryList}
                        getOptionLabel={option => option.name}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        value={blogCategoryList.find(cat => cat._id === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue._id : '')
                        }}
                        readOnly={true}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Category'
                            placeholder='Select Category'
                            size='small'
                            InputProps={{
                              ...params.InputProps,
                              readOnly: true
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <Controller
                    name='Tags'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={blogTagList}
                        getOptionLabel={option => option.name}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        value={blogTagList.filter(tag => field.value?.includes(tag._id))}
                        onChange={(event, newValue) => {
                          field.onChange(newValue.map(tag => tag._id))
                        }}
                        readOnly={true}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Tags'
                            placeholder='Select Tags'
                            size='small'
                            InputProps={{
                              ...params.InputProps,
                              readOnly: true
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Image Upload - Improved Version */}
                <Grid item xs={12}>
                  <Typography className='mb-1'>Image Upload</Typography>
                  <Card className='p-0 border shadow-none'>
                    {files ? (
                      <div className='flex justify-center p-4'>
                        {!imageLoadError ? (
                          <img
                            className='rounded-md h-40 w-auto object-cover max-w-full'
                            src={getImageUrl(files)}
                            alt='Blog Image'
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            style={{ maxHeight: '200px' }}
                          />
                        ) : (
                          <div className='text-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-md'>
                            <div className='mb-2'>
                              <i className='tabler-image-off text-4xl text-gray-400'></i>
                            </div>
                            <p>Image failed to load</p>
                            <p className='text-sm text-gray-400 mt-2'>Path: {getImageUrl(files)}</p>
                            <Button
                              variant='outlined'
                              size='small'
                              onClick={() => setImageLoadError(false)}
                              className='mt-2'
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='text-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-md'>
                        <div className='mb-2'>
                          <i className='tabler-photo text-4xl text-gray-400'></i>
                        </div>
                        <p>No image available</p>
                      </div>
                    )}
                  </Card>
                </Grid>

                {/* Blog Content */}
                <Grid item xs={12}>
                  <Typography className='mb-1'>
                    Content / Description <span className='text-red-600'>*</span>
                  </Typography>
                  <Card className='p-0 border shadow-none'>
                    <CardContent className='p-0'>
                      <EditorToolbar editor={editor} />
                      <Divider className='mx-6' />
                      <EditorContent editor={editor} className='min-h-[135px] px-6 py-4' />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Author */}
                <Grid item xs={12}>
                  <Controller
                    name='author'
                    control={control}
                    rules={{ required: 'Author name is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        size='small'
                        label='Author Name'
                        error={!!errors.author}
                        helperText={errors.author?.message}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Product Keywords */}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    disableCloseOnSelect
                    options={[]}
                    value={productKeywords}
                    onChange={(event, newValue) => {
                      const last = newValue[newValue.length - 1]
                      if (typeof last === 'string' && last.includes(',')) {
                        const split = last
                          .split(',')
                          .map(i => i.trim())
                          .filter(Boolean)
                        setProductKeywords([...new Set([...newValue.slice(0, -1), ...split])])
                      } else {
                        setProductKeywords(newValue)
                      }
                    }}
                    readOnly={true}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label='Product Keywords (Press Enter To Add More Key Words)'
                        placeholder='Add KeyWords'
                        InputProps={{
                          ...params.InputProps,
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: 'Status is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label='Status'
                        size='small'
                        error={!!errors.status}
                        helperText={errors.status?.message}
                      >
                        <MenuItem value='PENDING'>Pending</MenuItem>
                        <MenuItem value='ACTIVE'>Active</MenuItem>
                        <MenuItem value='INACTIVE'>Inactive</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display='flex' gap={2} justifyContent='flex-end' mt={4}>
                    <Button variant='outlined' onClick={handleSend} sx={{ mr: 2 }}>
                      Cancel
                    </Button>
                    <Button type='submit' variant='contained' sx={{ color: 'white' }}>
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* SEO Settings Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title='SEO Settings' />
            <CardContent>
              <Grid container spacing={6}>
                {/* Meta Title */}
                <Grid item xs={12}>
                  <Controller
                    name='metaTitle'
                    control={control}
                    rules={{ required: 'Meta title is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Meta Title'
                        error={!!errors.metaTitle}
                        helperText={errors.metaTitle?.message}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* SEO Keywords */}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    disableCloseOnSelect
                    options={[]}
                    value={seoKeywords}
                    onChange={(event, newValue) => {
                      const last = newValue[newValue.length - 1]
                      if (typeof last === 'string' && last.includes(',')) {
                        const split = last
                          .split(',')
                          .map(i => i.trim())
                          .filter(Boolean)
                        setSeoKeywords([...new Set([...newValue.slice(0, -1), ...split])])
                      } else {
                        setSeoKeywords(newValue)
                      }
                    }}
                    readOnly={true}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label='SEO Keywords (Press Enter To Add More Key Words)'
                        placeholder='Add KeyWords'
                        InputProps={{
                          ...params.InputProps,
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Meta Description */}
                <Grid item xs={12}>
                  <Controller
                    name='metaDescription'
                    control={control}
                    rules={{ required: 'Meta description is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Meta Description'
                        multiline
                        rows={6}
                        error={!!errors.metaDescription}
                        helperText={errors.metaDescription?.message}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default UpdateApprovelBlog
