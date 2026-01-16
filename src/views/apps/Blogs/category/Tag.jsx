'use client'

// React
import { useState } from 'react'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Styles
import '@/libs/styles/tiptapEditor.css'

const EditorToolbar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      {/* Bold */}
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>

      {/* Italic */}
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>

      {/* Underline */}
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>

      {/* Strikethrough */}
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>

      {/* Superscript */}
      <CustomIconButton
        {...(editor.isActive('superscript') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleSuperscript?.().run()}
      >
        <i className={classnames('tabler-superscript', { 'text-textSecondary': !editor.isActive('superscript') })} />
      </CustomIconButton>

      {/* Headings */}
      {['H1', 'H2', 'H3'].map((tag, i) => (
        <CustomIconButton
          key={tag}
          variant='tonal'
          size='small'
          onClick={() => editor.chain().focus().toggleHeading({ level: i + 1 }).run()}
          {...(editor.isActive('heading', { level: i + 1 }) && { color: 'primary' })}
          className='px-1.5 py-1 h-7 min-w-[28px] text-[0.7rem]'
        >
          <span
            className={classnames({
              'text-textSecondary': !editor.isActive('heading', { level: i + 1 })
            })}
          >
            {tag}
          </span>
        </CustomIconButton>
      ))}

      {/* Code */}
      <CustomIconButton
        {...(editor.isActive('code') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <i className={classnames('tabler-code', { 'text-textSecondary': !editor.isActive('code') })} />
      </CustomIconButton>

      {/* Bullet List */}
      <CustomIconButton
        {...(editor.isActive('bulletList') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <i className={classnames('tabler-list', { 'text-textSecondary': !editor.isActive('bulletList') })} />
      </CustomIconButton>

      {/* Ordered List */}
      <CustomIconButton
        {...(editor.isActive('orderedList') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <i className={classnames('tabler-list-numbers', { 'text-textSecondary': !editor.isActive('orderedList') })} />
      </CustomIconButton>

      {/* Blockquote */}
      <CustomIconButton
        {...(editor.isActive('blockquote') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <i className={classnames('tabler-quote', { 'text-textSecondary': !editor.isActive('blockquote') })} />
      </CustomIconButton>

      {/* Horizontal Rule */}
      <CustomIconButton variant='tonal' size='small' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <i className='tabler-minus' />
      </CustomIconButton>

      {/* Clear Formatting */}
      <CustomIconButton
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <i className='tabler-clear-all' />
      </CustomIconButton>

      {/* Info / Help */}
      <CustomIconButton variant='tonal' size='small' onClick={() => alert('Editor Info or Help modal')}>
        <i className='tabler-question-mark' />
      </CustomIconButton>
    </div>
  )
}

const Tag = () => {
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)

  const handleChange = (event, value) => {
    setPage(value)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: `<p>Write here...</p>`,
    autofocus: true
  })

  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <Card>
          <CardHeader title='Blog Editor' />
          <CardContent>
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} className='tiptap-editor mt-4 border p-3 rounded-md' />
            <Divider sx={{ my: 4 }} />
            <Pagination count={10} page={page} onChange={handleChange} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Tag

 