'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'

import {
  Button,
  Card,
  MenuItem,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Autocomplete,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField' // Import CustomTextField
import blogService from '@/services/blog/blogservice'
import blogTagService from '@/services/blog/blogTagService'
import blogCategoryService from '@/services/blog/blogCategoryservice'
import Image from '@/services/imageService'
import GeminiService from '@/contexts/mail/GeminiService'

import '@/libs/styles/tiptapEditor.css'

// Editor Toolbar
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
          <i className={btn.icon} />
        </CustomIconButton>
      ))}
    </div>
  )
}

// Main Component
const AddBlog = ({ data }) => {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [fileName, setFileName] = useState('')
  const [imageLoader, setImageLoader] = useState(false)
  const [productKeywords, setProductKeywords] = useState([])
  const [seoKeywords, setSeoKeywords] = useState([])
  const [blogTagList, setBlogTagList] = useState([])
  const [blogCategoryList, setBlogCategoryList] = useState([])

  const [formData, setFormData] = useState({ image: '' })
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalImage, setOriginalImage] = useState('')
  const [openAi, setOpenAi] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      author: '',
      metaTitle: '',
      metaDescription: '',
      tags: [],
      category: '',
      status: 'PENDING'
    }
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write your blog content here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    autofocus: true
  })

  const [editorContent, setEditorContent] = useState('')

  useEffect(() => {
    if (editor) {
      editor.on('update', () => setEditorContent(editor.getHTML()))
    }
  }, [editor])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, categoriesRes] = await Promise.all([
          blogTagService.getBlogTag(),
          blogCategoryService.getActiveBlogCategory()
        ])
        setBlogTagList(tagsRes?.data || [])
        setBlogCategoryList(categoriesRes?.data || [])
      } catch {
        toast.error('Failed to load tags/categories')
      }
    }

    fetchData()
  }, [])

  const handleFileUpload = async e => {
    try {
      setImageLoader(true)
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) return

      const uploadData = new FormData()
      uploadData.append('image', selectedFile)

      const response = await Image.uploadImage(uploadData)
      if (response?.data?.url) {
        setFormData(prev => ({ ...prev, image: response.data.url }))
        setFileName(selectedFile.name)
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setImageLoader(false)
    }
  }

  const handleClickAi = () => setOpenAi(true)
  const handleCloseAi = () => {
    setOpenAi(false)
    setQuery('')
  }

  const generateAIContent = async () => {
    if (!query.trim()) return toast.error('Please enter a prompt.')

    try {
      setLoading(true)
      const response = await GeminiService.GetGemini(query)

      // safely extract text
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || ''

      if (!text) {
        toast.error('AI returned empty response')
        return
      }

      const formatted = `<p>${text
        .trim()
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/\n/g, '<br />')}</p>`

      editor?.commands.setContent(formatted)
      toast.success('AI content generated')
      handleCloseAi()
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate content')
    } finally {
      setLoading(false)
    }
  }


  const onSubmit = async data => {
    if (!formData.image) return toast.error('Image is required')
    if (!editorContent.trim()) return toast.error('Content is required')

    const submitData = new FormData()
    submitData.append('blogTitle', data.title)
    submitData.append('authorName', data.author)
    submitData.append('metaTitle', data.metaTitle)
    submitData.append('metaDescription', data.metaDescription)
    submitData.append('description', editorContent)
    submitData.append('category', data.category)
    submitData.append('tags', JSON.stringify(data.tags))
    submitData.append('blogKeywords', JSON.stringify(productKeywords))
    submitData.append('seoKeywords', JSON.stringify(seoKeywords))
    submitData.append('status', data.status)
    submitData.append('image', formData.image)

    try {
      await (isEditMode ? blogService.updateBlog(data._id, submitData) : blogService.addBlog(submitData))
      toast.success(isEditMode ? 'Blog updated successfully' : 'Blog created successfully')
      router.push('/en/apps/blogs/blog-list')
    } catch {
      toast.error('Failed to submit blog')
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 4, mx: 'auto' }}>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h4'>{isEditMode ? 'Edit Blog' : 'Add New Blog'}</Typography>
          <Button onClick={() => router.push('/en/apps/blogs/blog-list')} variant='outlined' startIcon={<ArrowLeft />}>
            Back
          </Button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Row 1: Title & Author */}
            <Grid item xs={12} md={6}>
              <Controller
                name='title'
                control={control}
                rules={{ required: 'Blog title is required' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Blog Title'
                    placeholder='Enter blog title'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='author'
                control={control}
                rules={{ required: 'Author name is required' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Author Name'
                    placeholder='Enter author name'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Product Keywords & Tags */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                freeSolo
                disableCloseOnSelect
                options={[]}
                value={productKeywords}
                onChange={(e, newValue) => {
                  const last = newValue.at(-1)
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
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    fullWidth
                    label='Product Keywords'
                    placeholder='Add keywords separated by commas'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='tags'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={blogTagList}
                    getOptionLabel={opt => opt.name || ''}
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Blog Tags'
                        fullWidth
                        placeholder='Select tags'
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Row 3: Category & Image */}
            <Grid item xs={12} md={6}>
              <Controller
                name='category'
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Blog Category'
                    placeholder='Select category'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {blogCategoryList.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' mb={1}>
                Blog Image *
              </Typography>
              {formData.image && (
                <Box mb={2} textAlign='center'>
                  <img
                    src={formData.image || originalImage}
                    alt='Blog Preview'
                    style={{
                      maxWidth: '100%',
                      height: 180,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                disabled={imageLoader}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px'
                }}
              />
              {fileName && (
                <Typography variant='body2' mt={1} color='text.secondary'>
                  Selected: {fileName}
                </Typography>
              )}
              {imageLoader && (
                <Box display='flex' alignItems='center' mt={1}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant='body2'>Uploading...</Typography>
                </Box>
              )}
            </Grid>

            {/* Blog Content Editor Full Width */}
            <Grid item xs={12}>
              <Typography variant='subtitle1' mb={1}>
                Blog Content *
              </Typography>
              <Box sx={{ position: 'relative', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <EditorToolbar editor={editor} />
                <Divider />
                <EditorContent editor={editor} style={{ minHeight: 200, padding: 16 }} />
                <Box sx={{ position: 'absolute', top: 8, right: 16 }}>
                  <Tooltip title='Use AI to generate blog content'>
                    <Button onClick={handleClickAi} variant='text' size='small' color='primary'>
                      ✨ Generate with AI
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>

            {/* SEO Section Title */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h5' mt={2} mb={1} color='primary'>
                SEO Configuration
              </Typography>
            </Grid>

            {/* SEO Keywords */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                freeSolo
                disableCloseOnSelect
                options={[]}
                value={seoKeywords}
                onChange={(e, newValue) => {
                  const last = newValue.at(-1)
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
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    fullWidth
                    label='SEO Keywords'
                    placeholder='Add SEO keywords separated by commas'
                  />
                )}
              />
            </Grid>

            {/* Meta Title */}
            <Grid item xs={12} md={6}>
              <Controller
                name='metaTitle'
                control={control}
                rules={{
                  required: 'Meta title is required',
                  maxLength: { value: 60, message: 'Meta title should be under 60 characters' }
                }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Meta Title'
                    placeholder='Enter meta title (recommended: 50-60 characters)'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || `${field.value?.length || 0}/60 characters`}
                  />
                )}
              />
            </Grid>

            {/* Meta Description */}
            <Grid item xs={12} md={6}>
              <Controller
                name='metaDescription'
                control={control}
                rules={{
                  required: 'Meta description is required',
                  maxLength: { value: 160, message: 'Meta description should be under 160 characters' }
                }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label='Meta Description'
                    placeholder='Enter meta description (recommended: 150-160 characters)'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || `${field.value?.length || 0}/160 characters`}
                  />
                )}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Publication Status'
                    disabled={true}
                  >
                    <MenuItem value='PENDING'>Pending Review</MenuItem>
                    <MenuItem value='PUBLISHED'>Published</MenuItem>
                    <MenuItem value='DRAFT'>Draft</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display='flex' gap={2} justifyContent='flex-end'>
                <Button
                  variant='outlined'
                  onClick={() => router.push('/en/apps/blogs/blog-list')}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={!isValid || imageLoader || !formData.image}
                  size='large'
                >
                  {imageLoader ? 'Processing...' : isEditMode ? 'Update Blog' : 'Create Blog'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* AI Content Generation Dialog */}
      <Dialog open={openAi} onClose={handleCloseAi} fullWidth maxWidth='md'>
        <DialogTitle>
          <Typography variant='h6'>✨ Generate Content with AI</Typography>
          <Typography variant='body2' color='text.secondary'>
            Describe what you want to write about and AI will generate content for your blog
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            multiline
            minRows={4}
            label='Content Prompt'
            placeholder='e.g., "Write a blog post about the benefits of sustainable living, including practical tips for beginners..."'
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAi} variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={generateAIContent}
            disabled={loading || !query.trim()}
            variant='contained'
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AddBlog
