'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import predefinedService from '@/services/custmore-care-ticket/predefinedService'
import GeminiService from '@/contexts/mail/GeminiService'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import CustomIconButton from '@/@core/components/mui/IconButton'
import classNames from 'classnames'

import '@/libs/styles/tiptapEditor.css'

// ✅ Editor Toolbar Component
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
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-4'>
      {buttons.map((btn, idx) => (
        <CustomIconButton
          key={idx}
          {...(btn.active && { color: 'primary' })}
          variant='tonal'
          size='small'
          onClick={btn.action}
        >
          <i className={classNames(btn.icon, { 'text-textSecondary': !btn.active })} />
        </CustomIconButton>
      ))}
    </div>
  )
}

// ✅ Main Component
const EditPreDefine = ({ data, setOpenPreDefine, fetchReplies }) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [openAi, setOpenAi] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setMessage(editor.getHTML())
    }
  })

  useEffect(() => {
    if (data?.name && editor) {
      editor.commands.setContent(data.name)
      setMessage(data.name)
    }
  }, [data, editor])

  const handleClickAi = () => {
    setOpenAi(true)
  }

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

  const handleSubmit = async () => {
    const rawHTML = editor?.getHTML() || ''
    const cleanedHTML = rawHTML.replace(/<\/?p>/g, '')

    if (!cleanedHTML.trim()) {
      toast.error('Message cannot be empty')
      return
    }

    setLoading(true)
    try {
      const res = await predefinedService.updateReply(data._id, cleanedHTML)

      if (res) {
        toast.success('Reply updated successfully')
        fetchReplies()
        setOpenPreDefine(false)
      } else {
        toast.error('Failed to update reply')
      }
    } catch (error) {
      toast.error('Update failed: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <IconButton
        onClick={() => setOpenPreDefine(false)}
        sx={{
          position: 'absolute',
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant='h4' sx={{ mb: 3 }}>Edit Predefined Reply</Typography>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          width: '100%',
          position: 'relative',
          backgroundColor: 'white'
        }}
      >
        <EditorToolbar editor={editor} />
        <Divider />

        {/* AI Bot Button - Same position as in add component */}
        <Box sx={{ position: 'absolute', top: 8, right: 16, zIndex: 1 }}>
          <Tooltip title='Use AI to generate message'>
            <Button onClick={handleClickAi} variant='text' size='small' sx={{ color: '#6366f1' }}>
              Generate with AI
            </Button>
          </Tooltip>
        </Box>

        <Box
          sx={{
            px: 4,
            py: 3,
            '& .ProseMirror': {
              outline: 'none',
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              minHeight: '250px',
              border: 'none'
            }
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading}

        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      {/* AI Prompt Dialog - Same as in add component */}
      <Dialog open={openAi} onClose={handleCloseAi} fullWidth maxWidth='sm'>
        <DialogTitle>
          <Typography variant='h6'>Chat with Gemini</Typography>
        </DialogTitle>
        <DialogContent>
          <Box className='flex gap-2 items-start mt-2'>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder='Ask Gemini to generate content for your reply...'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAi}>Cancel</Button>
          <Button onClick={generateAIContent} disabled={aiLoading} variant='contained'>
            {aiLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditPreDefine
