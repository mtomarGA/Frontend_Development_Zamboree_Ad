'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Button,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import classnames from 'classnames'
import { toast } from 'react-toastify'

import CustomIconButton from '@core/components/mui/IconButton'
import predefinedReply from '@/services/custmore-care-ticket/predefinedService'
import GeminiService from '@/contexts/mail/GeminiService'

import '@/libs/styles/tiptapEditor.css'

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

const Predefined = () => {
  const router = useRouter()
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    autofocus: true
  })

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [openAi, setOpenAi] = useState(false)

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

  const handleSubmit = async e => {
    e.preventDefault()
    const textContent = editor?.getText()

    try {
      const result = await predefinedReply.createReply({ message: textContent })
      editor?.commands.clearContent()
      toast.success(result.message)
      router.push('/en/apps/custmore-tickets/predifiend-reply')
    } catch (error) {
      toast.error('Failed to save reply')
    }
  }

  return (
    <form className='w-full flex gap-4' onSubmit={handleSubmit}>
      <Card className='w-full h-full'>
        <CardHeader title={<Typography variant='h4'>Add New Predefined Reply</Typography>} />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {/* Editor */}
              <Card className='border shadow-none w-full'>
                <CardContent className='p-0 relative'>
                  <EditorToolbar editor={editor} />
                  <Divider />
                  <EditorContent editor={editor} className='overflow-y-auto flex px-6 py-4' />

                  {/* AI Bot Icon */}
                  <Box className='absolute top-2 right-4'>
                    <Tooltip title='Use AI to generate message'>
                      <Button onClick={handleClickAi} variant='text' size='small'>
                        Generate with AI
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>

        <Box className='flex justify-end mb-4 mr-5'>
          <Button type='submit' variant='contained' sx={{ color: 'white' }}>
            Save
          </Button>
        </Box>
      </Card>

      {/* AI Prompt Dialog */}
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
          <Button onClick={generateAIContent} disabled={loading} variant='contained'>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default Predefined
