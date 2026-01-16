'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

// React & Others
import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Styles
import '@/libs/styles/tiptapEditor.css'

// Services
import categoryService from '@/services/category/category.service'
import Image from '@/services/imageService'

import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

const CategoryInformation = () => {
  const router = useRouter()
  const { id } = useParams()

  const [imageLoader, setImageLoader] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'INACTIVE',
    iconImage: '',
    thumbImage: '',
    bannerImageWeb: '',
    bannerImageApp: ''
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write something here...' })
    ],
    content: `<p>Keep your account secure with authentication step.</p>`
  })

  // Fetch existing category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await categoryService.getCategoryById(id)
        const data = res.data
        console.log(data, 'data data data data')
        setFormData({
          name: data.name,
          description: data.description,
          status: data.status || 'INACTIVE',
          iconImage: null,
          thumbImage: null,
          bannerImageWeb: null,
          bannerImageApp: null
        })

        editor?.commands.setContent(data.description || '')
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch category')
      }
    }

    if (id) fetchData()
  }, [id, editor])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    const { name, files } = e.target

    if (!files?.[0]) return

    try {
      setImageLoader(true)
      const file = files[0]

      const data = new FormData()
      data.append('image', file)

      const response = await Image.uploadImage(data)

      if (response?.data?.url) {
        setFormData(prev => ({
          ...prev,
          [name]: response.data.url
        }))
      } else {
        throw new Error('Image URL not received')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Error uploading image')
    } finally {
      setImageLoader(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        description: editor?.getHTML() || '',
        status: formData.status,
        iconImage: formData.iconImage,           // image URL
        thumbImage: formData.thumbImage,         // image URL
        bannerImageWeb: formData.bannerImageWeb, // image URL
        bannerImageApp: formData.bannerImageApp  // image URL
      }

      await categoryService.updateCategory(id, payload)

      toast.success('Category Updated Successfully')
      router.push('/en/apps/listing/masters/view-category')
    } catch (err) {
      console.error(err)
      toast.error('Something Went Wrong')
    }
  }


  return (
    <Card>
      <CardHeader title='Category Information' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              fullWidth
              label='Category Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter Category Name'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              fullWidth
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Enter Description'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              select
              fullWidth
              label='Status'
              name='status'
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </Grid>
        </Grid>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='iconImage'
              label='Icon Image'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='thumbImage'
              label='Thumbnail Image'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='bannerImageWeb'
              label='Banner Image Web'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='bannerImageApp'
              label='Banner Image Application'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 3, md: 3 }}>
            <Button variant='contained' onClick={handleSubmit}>
              Update Category
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CategoryInformation
