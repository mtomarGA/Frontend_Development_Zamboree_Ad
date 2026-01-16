'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
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
import blogService from '@/services/blog/blogservice'
import blogTagService from '@/services/blog/blogTagService'
import blogCategoryService from '@/services/blog/blogCategoryservice'
import Image from '@/services/imageService'
import GeminiService from '@/contexts/mail/GeminiService'

import '@/libs/styles/tiptapEditor.css'
import CustomTextField from '@/@core/components/mui/TextField'

// -------------------- Toolbar --------------------
const EditorToolbar = ({ editor }) => {
  if (!editor) return null

  const buttons = [
    { icon: 'tabler-bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: 'tabler-underline', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: 'tabler-italic', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: 'tabler-strikethrough', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { icon: 'tabler-align-left', action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
    { icon: 'tabler-align-center', action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
    { icon: 'tabler-align-right', action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
    { icon: 'tabler-align-justified', action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) }
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

// -------------------- Main Component --------------------
const UpdateBlog = () => {
  const { id } = useParams()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [fileName, setFileName] = useState('')
  const [imageLoader, setImageLoader] = useState(false)
  const [productKeywords, setProductKeywords] = useState([])
  const [seoKeywords, setSeoKeywords] = useState([])
  const [blogTagList, setBlogTagList] = useState([])
  const [blogCategoryList, setBlogCategoryList] = useState([])

  const [formData, setFormData] = useState({ image: '' })
  const [originalImage, setOriginalImage] = useState('')
  const [openAi, setOpenAi] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [blogLoading, setBlogLoading] = useState(true)

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
    content: '',
    autofocus: true
  })

  const [editorContent, setEditorContent] = useState('')

  useEffect(() => {
    if (editor) {
      editor.on('update', () => setEditorContent(editor.getHTML()))
    }
  }, [editor])

  // -------------------- Fetch Blog --------------------
  useEffect(() => {
    if (!editor) return

    const fetchData = async () => {
      try {
        setBlogLoading(true)
        const [blogRes, tagRes, catRes] = await Promise.all([
          blogService.getSingleBlog(id),
          blogTagService.getBlogTag(),
          blogCategoryService.getActiveBlogCategory()
        ])

        const blog = blogRes.data
        setBlogTagList(tagRes.data || [])
        setBlogCategoryList(catRes.data || [])

        // Map tags
        const mappedTags = (blog.tags || [])
          .map(tagId => tagRes.data.find(t => t._id === tagId))
          .filter(Boolean)

        // Map category
        const mappedCategory = catRes.data.find(c => c._id === blog.category) || ''

        // Set form values
        setValue('title', blog.blogTitle || '')
        setValue('author', blog.authorName || '')
        setValue('metaTitle', blog.metaTitle || '')
        setValue('metaDescription', blog.metaDescription || '')
        setValue('category', mappedCategory._id || '')
        setValue('tags', mappedTags)
        setValue('status', blog.status || 'PENDING')

        setOriginalImage(blog.image || '')
        setFormData(prev => ({ ...prev, image: blog.image || '' }))

        setProductKeywords(blog.blogKeywords || [])
        setSeoKeywords(blog.seoKeywords || [])

        editor.commands.setContent(blog.description || '')
        setEditorContent(blog.description || '')
      } catch (error) {
        toast.error('Failed to load blog details')
      } finally {
        setBlogLoading(false)
      }
    }

    fetchData()
  }, [editor, id, setValue])

  // -------------------- File Upload --------------------
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
        throw new Error('Upload failed')
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setImageLoader(false)
    }
  }

  // -------------------- AI --------------------
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
      const formatted = `<p>${response.trim().replace(/\n\s*\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
      editor?.commands.setContent(formatted)
      setEditorContent(formatted)
      toast.success('AI content generated')
      handleCloseAi()
    } catch {
      toast.error('Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  // -------------------- Submit --------------------
  const onSubmit = async (data) => {
    if (!formData.image) return toast.error('Image is required')
    if (!editorContent.trim()) return toast.error('Content is required')

    const submitData = new FormData()
    submitData.append('blogTitle', data.title)
    submitData.append('authorName', data.author)
    submitData.append('metaTitle', data.metaTitle)
    submitData.append('metaDescription', data.metaDescription)
    submitData.append('description', editorContent)
    submitData.append('category', data.category)
    // Convert tags back to IDs
    submitData.append('tags', JSON.stringify((data.tags || []).map(t => t._id)))
    submitData.append('blogKeywords', JSON.stringify(productKeywords))
    submitData.append('seoKeywords', JSON.stringify(seoKeywords))
    submitData.append('status', data.status)
    submitData.append('image', formData.image)

    try {
      const res = await blogService.updateBlog(id, submitData)
      toast.success(res?.data?.message || 'Blog updated successfully!')
      router.push('/en/apps/blogs/blog-list')
    } catch (error) {
      toast.error(error.message || 'Failed to update blog')
    }
  }

  // -------------------- Loading State --------------------
  if (blogLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading blog details...</Typography>
      </Box>
    )
  }

  // -------------------- JSX --------------------
  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 4, mx: 'auto' }}>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h4'>Update Blog</Typography>
          <Button onClick={() => router.push('/en/apps/blogs/blog-list')} variant='outlined' startIcon={<ArrowLeft />}>
            Back
          </Button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Title & Author */}
            <Grid item xs={12} md={6}>
              <Controller
                name='title'
                control={control}
                rules={{ required: 'Title required' }}
                render={({ field }) => (
                  <CustomTextField {...field} label='Blog Title *' fullWidth error={!!errors.title} helperText={errors.title?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='author'
                control={control}
                rules={{ required: 'Author required' }}
                render={({ field }) => (
                  <CustomTextField {...field} label='Author *' fullWidth error={!!errors.author} helperText={errors.author?.message} />
                )}
              />
            </Grid>

            {/* Keywords & Tags */}
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
                    const split = last.split(',').map(i => i.trim()).filter(Boolean)
                    setProductKeywords([...new Set([...newValue.slice(0, -1), ...split])])
                  } else {
                    setProductKeywords(newValue)
                  }
                }}
                renderInput={params => <TextField {...params} fullWidth label='Product Keywords' />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='tags'
                control={control}
                rules={{ required: 'Tags are required' }}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={blogTagList}
                    getOptionLabel={opt => opt.name || ''}
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Tags *'
                        fullWidth
                        error={!!errors.tags}
                        helperText={errors.tags?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Category & Image */}
            <Grid item xs={12} md={6}>
              <Controller
                name='category'
                control={control}
                rules={{ required: 'Category required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label='Category *'
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {blogCategoryList.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' mb={1}>
                Blog Image *
              </Typography>
              {(formData.image || originalImage) && (
                <Box mb={2} textAlign='center'>
                  <img
                    src={formData.image || `http://localhost:8000/${originalImage}`}
                    alt='Blog'
                    style={{ maxWidth: '100%', height: 180, borderRadius: 8, objectFit: 'cover' }}
                  />
                </Box>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                disabled={imageLoader}
                style={{ width: '100%' }}
              />
              {fileName && <Typography variant='body2' mt={1}>{fileName}</Typography>}
              {imageLoader && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Grid>

            {/* Blog Content */}
            <Grid item xs={12}>
              <Typography variant='subtitle1' mb={1}>
                Blog Content *
              </Typography>
              <Card sx={{ position: 'relative' }}>
                <EditorToolbar editor={editor} />
                <Divider />
                <EditorContent editor={editor} style={{ minHeight: 200, padding: 16 }} />
                <Box sx={{ position: 'absolute', top: 8, right: 16 }}>
                  <Tooltip title='Use AI to generate blog content'>
                    <Button onClick={handleClickAi} variant='text' size='small'>
                      Generate with AI
                    </Button>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>

            {/* SEO Section */}
            <Grid item xs={12}>
              <Typography variant='h5' mt={2} mb={1}>
                SEO Section
              </Typography>
            </Grid>

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
                    const split = last.split(',').map(i => i.trim()).filter(Boolean)
                    setSeoKeywords([...new Set([...newValue.slice(0, -1), ...split])])
                  } else {
                    setSeoKeywords(newValue)
                  }
                }}
                renderInput={params => <TextField {...params} fullWidth label='SEO Keywords' />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='metaTitle'
                control={control}
                rules={{ required: 'Meta title required' }}
                render={({ field }) => (
                  <TextField {...field} label='Meta Title *' fullWidth error={!!errors.metaTitle} helperText={errors.metaTitle?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='metaDescription'
                control={control}
                rules={{ required: 'Meta description required' }}
                render={({ field }) => (
                  <CustomTextField {...field} label='Meta Description *' fullWidth multiline rows={4} error={!!errors.metaDescription} helperText={errors.metaDescription?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    label='Status'
                    fullWidth
                    disabled={true}
                  >
                    <MenuItem value='PENDING'>Pending</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} textAlign='right'>
              <Box display='flex' gap={2} justifyContent='flex-end'>
                <Button variant='outlined' onClick={() => router.push('/en/apps/blogs/blog-list')}>
                  Cancel
                </Button>
                <Button variant='contained' type='submit' disabled={!isValid || imageLoader || blogLoading}>
                  {imageLoader ? 'Processing...' : 'Update Blog'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* AI Dialog */}
      <Dialog open={openAi} onClose={handleCloseAi} fullWidth maxWidth='sm'>
        <DialogTitle>
          <Typography variant='h6'>Chat with Gemini</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder='Ask Gemini to generate blog content...'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAi}>Cancel</Button>
          <Button onClick={generateAIContent} disabled={loading} variant='contained'>
            {loading ? <CircularProgress size={20} /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UpdateBlog
