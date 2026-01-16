'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Import Services
import categoryService from '@/services/category/category.service'
import subCategoryService from '@/services/category/subCategory.service'
import Image from '@/services/imageService'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { useEffect, useState } from 'react'

const EditorToolbar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      {[
        { icon: 'bold', action: () => editor.chain().focus().toggleBold().run() },
        { icon: 'underline', action: () => editor.chain().focus().toggleUnderline().run() },
        { icon: 'italic', action: () => editor.chain().focus().toggleItalic().run() },
        { icon: 'strikethrough', action: () => editor.chain().focus().toggleStrike().run(), name: 'strike' }
      ].map(({ icon, action, name }) => (
        <CustomIconButton
          key={icon}
          {...(editor.isActive(name || icon) && { color: 'primary' })}
          variant='tonal'
          size='small'
          onClick={action}
        >
          <i className={classnames(`tabler-${icon}`, { 'text-textSecondary': !editor.isActive(name || icon) })} />
        </CustomIconButton>
      ))}

      {['left', 'center', 'right', 'justify'].map(align => (
        <CustomIconButton
          key={align}
          {...(editor.isActive({ textAlign: align }) && { color: 'primary' })}
          variant='tonal'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
        >
          <i
            className={classnames(`tabler-align-${align === 'justify' ? 'justified' : align}`, {
              'text-textSecondary': !editor.isActive({ textAlign: align })
            })}
          />
        </CustomIconButton>
      ))}
    </div>
  )
}

const UpdateSubCategoryPage = () => {
  const router = useRouter()
  const { id } = useParams()
  const [categoryList, setCategoryList] = useState([])
  const [imageLoader, setImageLoader] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
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
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline
    ]
  })

  const handleCategoryGet = async () => {
    const res = await categoryService.getCategories()
    setCategoryList(res.data)
  }

  useEffect(() => {
    handleCategoryGet()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await subCategoryService.getSubCategoryById(id)
        const data = res.data

        setFormData(prev => ({
          ...prev,
          name: data.name,
          category: data.category,
          description: data.description || '',
          status: data.status || 'INACTIVE'
        }))

        if (editor && data.description) {
          editor.commands.setContent(data.description)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch sub-category')
      }
    }

    if (id && editor) fetchData()
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
        category: formData.category,
        description: editor?.getHTML() || '',
        status: formData.status,
        iconImage: formData.iconImage,
        thumbImage: formData.thumbImage,
        bannerImageWeb: formData.bannerImageWeb,
        bannerImageApp: formData.bannerImageApp
      }

      await subCategoryService.updateSubCategory(id, payload)
      toast.success('Sub Category Updated Successfully')
      router.push('/en/apps/listing/masters/view-subcategory')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }


  return (
    <Card>
      <CardHeader title='Sub Category Information' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              select
              fullWidth
              label='Select Category'
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value='' disabled>
                Select Category
              </MenuItem>
              {categoryList?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              fullWidth
              label='Sub Category Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter Sub Category Name'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              select
              fullWidth
              name='status'
              value={formData.status}
              onChange={handleChange}
              label='Status'
            >
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
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
              label='Banner Image For Web'
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
              label='Banner Image For Application'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={6} className='mbe-6'>
          <div className='flex items-end gap-4'>
            <Button variant='contained' onClick={handleSubmit}>
              Update Sub Category
            </Button>
          </div>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UpdateSubCategoryPage

// 'use client'

// // MUI Imports
// import Divider from '@mui/material/Divider'
// import Grid from '@mui/material/Grid2'
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'
// import Button from '@mui/material/Button'
// import MenuItem from '@mui/material/MenuItem'
// import { TextField } from '@mui/material'
// import { toast } from 'react-toastify'
// import { useParams, useRouter } from 'next/navigation'

// // Third-party Imports
// import classnames from 'classnames'
// import { useEditor, EditorContent } from '@tiptap/react'
// import { StarterKit } from '@tiptap/starter-kit'
// import { Underline } from '@tiptap/extension-underline'
// import { Placeholder } from '@tiptap/extension-placeholder'
// import { TextAlign } from '@tiptap/extension-text-align'

// // Components Imports
// import CustomIconButton from '@core/components/mui/IconButton'
// import CustomTextField from '@core/components/mui/TextField'

// // Import Services
// import categoryService from '@/services/category/category.service'
// import subCategoryService from '@/services/category/subCategory.service'

// // Style Imports
// import '@/libs/styles/tiptapEditor.css'
// import { useEffect, useState } from 'react'

// const EditorToolbar = ({ editor }) => {
//   if (!editor) {
//     return null
//   }

//   return (
//     <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
//       <CustomIconButton
//         {...(editor.isActive('bold') && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().toggleBold().run()}
//       >
//         <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive('underline') && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//       >
//         <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive('italic') && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//       >
//         <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive('strike') && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//       >
//         <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().setTextAlign('left').run()}
//       >
//         <i
//           className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
//         />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().setTextAlign('center').run()}
//       >
//         <i
//           className={classnames('tabler-align-center', {
//             'text-textSecondary': !editor.isActive({ textAlign: 'center' })
//           })}
//         />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().setTextAlign('right').run()}
//       >
//         <i
//           className={classnames('tabler-align-right', {
//             'text-textSecondary': !editor.isActive({ textAlign: 'right' })
//           })}
//         />
//       </CustomIconButton>
//       <CustomIconButton
//         {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
//         variant='tonal'
//         size='small'
//         onClick={() => editor.chain().focus().setTextAlign('justify').run()}
//       >
//         <i
//           className={classnames('tabler-align-justified', {
//             'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
//           })}
//         />
//       </CustomIconButton>
//     </div>
//   )
// }

// const UpdateSubCategoryPage = () => {
//   const router = useRouter()
//   const { id } = useParams()

//   const [categoryList, setCategoryList] = useState([])

//   const [formData, setFormData] = useState({
//     category: '',
//     name: '',
//     description: '',
//     status: 'INACTIVE',
//     iconImage: null,
//     thumbImage: null,
//     bannerImageWeb: null,
//     bannerImageApp: null
//   })

//   useEffect(() => {
//     handleCategoryGet()
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await subCategoryService.getSubCategoryById(id)
//         const data = res.data
//         console.log(data, 'data data data data')
//         setFormData({
//           name: data.name,
//           category: data.category,
//           description: data.description,
//           status: data.status || 'INACTIVE',
//           iconImage: null,
//           thumbImage: null,
//           bannerImageWeb: null,
//           bannerImageApp: null
//         })

//         editor?.commands.setContent(data.description || '')
//       } catch (err) {
//         console.error(err)
//         toast.error('Failed to fetch category')
//       }
//     }

//     if (id) fetchData()
//   }, [id, editor])

//   const handleCategoryGet = async () => {
//     const res = await categoryService.getCategories()
//     setCategoryList(res.data)
//   }

//   const handleChange = e => {
//     const { name, value, files } = e.target
//     if (files) {
//       setFormData(prev => ({ ...prev, [name]: files[0] }))
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleSubmit = async () => {
//     try {
//       const userData = new FormData()
//       userData.append('name', formData.name)
//       userData.append('category', formData.category)
//       userData.append('description', formData.description)
//       userData.append('status', formData.status)
//       if (formData.iconImage) userData.append('iconImage', formData.iconImage)
//       if (formData.thumbImage) userData.append('thumbImage', formData.thumbImage)
//       if (formData.bannerImageWeb) userData.a

//       await subCategoryService.updateSubCategory(id, userData)
//       toast.success('Sub Category Updated Successfully')
//       router.push('/en/apps/listing/masters/view-subcategory')
//     } catch (err) {
//       console.error(err)
//       toast.error('Something Went Wrong')
//     }
//   }

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: 'Write something here...'
//       }),
//       TextAlign.configure({
//         types: ['heading', 'paragraph']
//       }),
//       Underline
//     ],
//     immediatelyRender: false,
//     content: `
//       <p>
//         Keep your account secure with authentication step.
//       </p>
//     `
//   })

//   return (
//     <Card>
//       <CardHeader title='Sub Category Information' />
//       <CardContent>
//         <Grid container spacing={6} className='mbe-6'>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <CustomTextField
//               select
//               fullWidth
//               label='Select Category'
//               value={formData.category}
//               onChange={e => setFormData({ ...formData, category: e.target.value })}
//             >
//               <MenuItem value='' disabled>
//                 {' '}
//                 Select Category{' '}
//               </MenuItem>
//               {categoryList &&
//                 categoryList.map(item => (
//                   <MenuItem key={item._id} value={item._id}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//             </CustomTextField>
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <CustomTextField
//               fullWidth
//               label='Sub Category Name'
//               name='name'
//               value={formData.name}
//               onChange={handleChange}
//               placeholder='Enter Sub Category Name'
//             />
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <CustomTextField
//               fullWidth
//               value={formData.description}
//               name='description'
//               onChange={handleChange}
//               label='Description'
//               placeholder='Enter Description'
//             />
//           </Grid>
//         </Grid>
//         <Grid container spacing={6} className='mbe-6'>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <TextField
//               fullWidth
//               type='file'
//               name='iconImage'
//               label='Icon Image'
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ accept: 'image/*' }}
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <TextField
//               fullWidth
//               type='file'
//               name='thumbImage'
//               label='Thumbnail Image'
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ accept: 'image/*' }}
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <TextField
//               fullWidth
//               type='file'
//               name='bannerImageWeb'
//               label='Banner Image For Web'
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ accept: 'image/*' }}
//             />
//           </Grid>
//         </Grid>
//         <Grid container spacing={6} className='mbe-6'>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <TextField
//               fullWidth
//               type='file'
//               name='bannerImageApp'
//               label='Banner Image For Application'
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ accept: 'image/*' }}
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 4 }}>
//             <CustomTextField
//               select
//               fullWidth
//               name='status'
//               value={formData.status}
//               onChange={handleChange}
//               label='Status'
//               defaultValue='INACTIVE'
//             >
//               <MenuItem value='ACTIVE'>Active</MenuItem>
//               <MenuItem value='INACTIVE'>InActive</MenuItem>
//             </CustomTextField>
//           </Grid>
//         </Grid>
//         <Grid container spacing={6} className='mbe-6'>
//           <div className='flex items-end gap-4'>
//             <Button variant='contained' onClick={handleSubmit}>
//               Update Sub Category
//             </Button>
//           </div>
//         </Grid>
//       </CardContent>
//     </Card>
//   )
// }

// export default UpdateSubCategoryPage
