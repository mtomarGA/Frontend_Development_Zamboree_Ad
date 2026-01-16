'use client'

import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  Stack,
  FormHelperText,
  TextField,
  IconButton,
  Autocomplete
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import CustomIconButton from '@core/components/mui/IconButton'
import '@/libs/styles/tiptapEditor.css'
import { useRouter } from 'next/navigation'
import allTicketService from '@/services/custmore-care-ticket/allTicketService'
import { toast } from 'react-toastify'
import EmployeeService from '@/services/employee/EmployeeService.js'
import CustomerService from '@/services/customers/createService.js'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices'
import Image from '@/services/imageService'
import predefinedService from '@/services/custmore-care-ticket/predefinedService'
import CustomTextField from '@/@core/components/mui/TextField'

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
    <div className='flex flex-wrap gap-x-3 gap-y-1 pb-6 pe-4 ps-6'>
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

const NewTicket = () => {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    ticketCode: '',
    subject: '',
    customRequester: '',
    customerMobile: '',
    customerEmail: '',
    requesterType: '',
    cc: '',
    assignTo: '',
    priority: 'HIGH', // ✅ Uppercase by default
    status: 'PENDING', // ✅ Uppercase by default
    customRequesterType: '',
    selectedUser: ''
  })

  const [selected, setSelected] = useState({
    name: '',
    businessName: '',
    city: '',
    pincode: '',
    parentId: ''
  })

  // Error state
  const [errors, setErrors] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Other states
  const [files, setFiles] = useState('')
  const [attachment, setAttachment] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [imageUploaded, setImageUploaded] = useState(false)
  const [attachmentUploaded, setAttachmentUploaded] = useState(false)
  const [replies, setReplies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [showReplyList, setShowReplyList] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [searchData, setSearchData] = useState([])
  const [employees, setEmployees] = useState([])

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ]
  })

  useEffect(() => {
    if (!editor) return
    const updateContent = () => setEditorContent(editor.getHTML())
    editor.on('update', updateContent)
    return () => {
      editor.off('update', updateContent)
      editor.destroy()
    }
  }, [editor])

  // Function to clear specific field errors
  const clearFieldErrors = fields => {
    setErrors(prev => {
      const newErrors = { ...prev }
      fields.forEach(field => {
        delete newErrors[field]
      })
      return newErrors
    })
  }

  // Handle input changes
  const handleInputChange = field => e => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when field changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Search functionality
  const handleSearch = async searchValue => {
    if (!searchValue || searchValue.length < 3) {
      setSearchData([])
      return
    }

    try {
      let response

      // Search based on requester type
      if (formData.requesterType === 'Vendor') {
        response = await HomeBannerRoute.getsearch({ search: searchValue })
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      } else if (formData.requesterType === 'Customer') {
        response = await CustomerService.getSerchUser(searchValue)
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      } else if (formData.requesterType === 'Employee') {
        response = await EmployeeService.getEmployeeDetailsByMobile(searchValue)
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSearchData([])
    }
  }

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await allTicketService.getEmployeeList()
        const data = Array.isArray(response.data) ? response.data : [response.data]
        setEmployees(data)
      } catch (error) {
      }
    }

    fetchEmployees()
  }, [])

  // File upload handlers
  const handleFileUpload = async file => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (imageTypes.includes(file.type)) {
      setImageUploaded(true)
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await Image.uploadImage(formData)
        setFiles(res.data.url)
        setAttachment(null) // clear attachment if any
      } catch (error) {
        toast.error('Failed to upload image')
      } finally {
        setImageUploaded(false)
      }
    } else {
      setAttachmentUploaded(true)
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await Image.uploadImage(formData)
        setAttachment(res.data.url)
        setFiles(null) // clear image if any
      } catch (error) {
        toast.error('Failed to upload attachment')
      } finally {
        setAttachmentUploaded(false)
      }
    }
  }

  const handleRemoveFile = () => {
    setFiles(null)
  }

  const handleRemoveAttachment = () => {
    setAttachment(null)
  }

  const handleSend = () => {
    router.push(`/en/apps/custmore-tickets/tickets-card`)
  }

  // Updated validation function
  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobileRegex = /^\d{10}$/

    if (!formData.subject) newErrors.subject = 'Subject is required'
    if (!formData.requesterType) newErrors.requesterType = 'Requestor type is required'

    // Fixed mobile validation
    if (!formData.customerMobile) {
      newErrors.customerMobile = 'Mobile number is required'
    } else if (!mobileRegex.test(formData.customerMobile)) {
      newErrors.customerMobile = 'Enter a valid mobile number (10 digits)'
    }

    // Fixed email validation
    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Email is required'
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Enter a valid email address'
    }

    if (!formData.assignTo) {
      newErrors.assignTo = 'Assign To is required'
    }

    // Editor Content
    if (!editorContent || editorContent === '<p></p>' || editorContent.trim() === '') {
      newErrors.editor = 'Content is required'
    }

    if (formData.requesterType === 'Other' && !formData.customRequesterType) {
      newErrors.customRequesterType = 'Please specify the requester type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit handler
  const onSubmit = async e => {
    e.preventDefault()
    setHasSubmitted(true)

    if (!validateForm()) return

    try {
      const payload = {
        ...formData,
        description: editorContent,
        ...(files && { image: files }),
        ...(attachment && { attachment: attachment })
      }

      const response = await allTicketService.newTicketsCreate(payload)
      handleSend()
      toast.success(response.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong!')
    }
  }

  const priorityOptions = ['HIGH', 'MEDIUM', 'LOW']
  const statusOptions = ['OPEN', 'CLOSE', 'PENDING']

  // Function to handle changes in requester type and fetch user data
  const fetchReplies = async () => {
    try {
      const data = await predefinedService.getReplies()
      const normalized = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      setReplies(normalized)
      setResults(normalized)
    } catch (error) {
      console.error('Failed to fetch replies:', error.message)
    }
  }

  const handleSearchChange = async e => {
    const value = e.target.value
    setSearchTerm(value)

    if (!value.trim()) {
      setResults(replies)
      return
    }

    try {
      const response = await predefinedService.searchPredefinedReply(value)

      let normalizedResults = []
      if (Array.isArray(response)) {
        normalizedResults = response
      } else if (response?.data) {
        normalizedResults = Array.isArray(response.data) ? response.data : [response.data]
      }

      setResults(normalizedResults)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    }
  }

  const handleAppendContent = reply => {
    if (editor?.commands?.insertContent && reply?.name) {
      editor.commands.focus()

      const currentText = editor.getText()
      const needsSpace = currentText && !currentText.endsWith(' ') ? ' ' : ''

      editor.commands.insertContent(`${needsSpace}${reply.name} `)

      setSearchTerm('')
      setResults(replies)
      setShowReplyList(false)
    }
  }

  // Clear search data when requester type changes
  useEffect(() => {
    setSearchData([])
    setInputValue('')
    // Clear form fields when requester type changes
    setFormData(prev => ({
      ...prev,
      customerMobile: '',
      customerEmail: '',
      cc: '',
      customRequester: '',
      selectedUser: ''
    }))
    setSelected({
      name: '',
      businessName: '',
      city: '',
      pincode: '',
      parentId: ''
    })
    // Clear errors for these fields
    clearFieldErrors(['customerMobile', 'customerEmail', 'cc', 'customRequester'])
  }, [formData.requesterType])

  // Clear errors when fields are populated programmatically
  useEffect(() => {
    if (hasSubmitted) {
      const fieldsToCheck = ['customerMobile', 'customerEmail', 'assignTo', 'customRequester']
      const errorsToCheck = fieldsToCheck.filter(field => formData[field] && errors[field])
      if (errorsToCheck.length > 0) {
        clearFieldErrors(errorsToCheck)
      }
    }
  }, [formData.customerMobile, formData.customerEmail, formData.assignTo, formData.customRequester, hasSubmitted])

  useEffect(() => {
    fetchReplies()
  }, [])

  // Helper function to generate unique keys for options
  const getOptionKey = (option, requesterType) => {
    if (!option || typeof option !== 'object') return Math.random().toString()

    switch (requesterType) {
      case 'Vendor':
        return option._id || option.vendorId || option.companyInfo?.companyName || Math.random().toString()
      case 'Customer':
        return option._id || option.userId || option.phone || Math.random().toString()
      case 'Employee':
        return option._id || option.employee_id || option.phone || Math.random().toString()
      default:
        return option._id || Math.random().toString()
    }
  }

  return (
    <Card >
     <Typography className='ml-4 mt-6' variant='h4'>New Ticket</Typography>
      <div className='flex flex-col md:flex-row gap-6 p-6'>
        <div className='w-full md:w-2/3 space-y-3'>
          {/* Subject */}
          <CustomTextField
            label='Subject*'
            fullWidth
            value={formData.subject}
            onChange={handleInputChange('subject')}
            error={hasSubmitted && !!errors.subject}
            helperText={hasSubmitted ? errors.subject : ''}
          />

          {/* Requester Type */}
          <CustomTextField 
            select
            label='Requestor type*'
            fullWidth
            value={formData.requesterType}
            onChange={handleInputChange('requesterType')}
            error={hasSubmitted && !!errors.requesterType}
            helperText={hasSubmitted ? errors.requesterType : ''}
          >
            <MenuItem value='Vendor'>Vendor</MenuItem>
            <MenuItem value='Customer'>Customer</MenuItem>
            <MenuItem value='Employee'>Employee</MenuItem>
          </CustomTextField >

          {/* Custom Requester Type */}
          {formData.requesterType === 'Other' && (
            <Box mt={2}>
              <CustomTextField 
                label='Specify Requestor Type*'
                fullWidth
                value={formData.customRequesterType}
                onChange={handleInputChange('customRequesterType')}
                error={hasSubmitted && !!errors.customRequesterType}
                helperText={hasSubmitted ? errors.customRequesterType : ''}
              />
            </Box>
          )}

          {/* Search Autocomplete */}
          <div className='flex flex-col gap-2 my-2'>
            <Autocomplete
              fullWidth
              freeSolo
              disabled={!formData.requesterType}
              options={searchData}
              inputValue={inputValue}
              value={formData.selectedUser}
              getOptionLabel={option => {
                if (!option || typeof option !== 'object') return ''
                if (formData.requesterType === 'Vendor') {
                  return `${option.companyInfo?.companyName || ''} - ${option.contactInfo?.phoneNo || ''}`
                } else if (formData.requesterType === 'Customer') {
                  return `${option.firstName || ''} ${option.lastName || ''} - ${option.phone || ''}`.trim()
                } else if (formData.requesterType === 'Employee') {
                  return `${option.name || ''} - ${option.phone || ''}`
                }
                return ''
              }}
              filterOptions={(options, state) => {
                const input = state.inputValue.toLowerCase()
                return options.filter(option => {
                  if (formData.requesterType === 'Vendor') {
                    const companyName = option.companyInfo?.companyName?.toLowerCase() || ''
                    const vendorId = option.vendorId?.toLowerCase() || ''
                    const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || ''
                    return companyName.includes(input) || vendorId.includes(input) || phoneNo.includes(input)
                  } else if (formData.requesterType === 'Customer') {
                    const firstName = option.firstName?.toLowerCase() || ''
                    const lastName = option.lastName?.toLowerCase() || ''
                    const phone = option.phone?.toLowerCase() || ''
                    const userId = option.userId?.toLowerCase() || ''
                    const email = option.email?.toLowerCase() || ''
                    return (
                      firstName.includes(input) ||
                      lastName.includes(input) ||
                      userId.includes(input) ||
                      phone.includes(input) ||
                      email.includes(input)
                    )
                  } else if (formData.requesterType === 'Employee') {
                    const name = option.name?.toLowerCase() || ''
                    const phone = option.phone?.toLowerCase() || ''
                    const email = option.email?.toLowerCase() || ''
                    const emp = option.employee_id?.toLowerCase() || ''
                    return name.includes(input) || phone.includes(input) || email.includes(input) || emp.includes(input)
                  }
                  return false
                })
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
                if (newInputValue.length >= 3) {
                  handleSearch(newInputValue)
                }
              }}
              onChange={(event, newValue) => {
                setFormData(prev => ({ ...prev, selectedUser: newValue || '' }))

                if (!newValue) return

                let selectedData = newValue
                if (formData.requesterType === 'Vendor') {
                  setSelected({
                    name: selectedData?.contactInfo?.name || 'Admin',
                    businessName: selectedData?.companyInfo?.companyName || '',
                    city: selectedData?.locationInfo?.city || '',
                    pincode: selectedData?.locationInfo?.pincode || '',
                    parentId: selectedData?.vendorId || ''
                  })
                  setFormData(prev => ({
                    ...prev,
                    customerMobile: selectedData?.contactInfo?.phoneNo || '',
                    customerEmail: selectedData?.contactInfo?.email || '',
                    cc: selectedData?.contactInfo?.email || '',
                    customRequester: selectedData?.contactInfo?.name || 'Admin'
                  }))
                  // Clear errors for auto-populated fields
                  clearFieldErrors(['customerMobile', 'customerEmail', 'cc', 'customRequester'])
                } else if (formData.requesterType === 'Customer') {
                  setSelected({
                    name: `${selectedData?.firstName || ''} ${selectedData?.lastName || ''}`.trim() || 'Admin',
                    businessName: selectedData?.companyInfo?.companyName || '',
                    city: selectedData?.city || '',
                    pincode: selectedData?.pincode || '',
                    parentId: selectedData?.userId || ''
                  })
                  setFormData(prev => ({
                    ...prev,
                    customerMobile: selectedData?.phone || '',
                    customerEmail: selectedData?.email || '',
                    cc: selectedData?.email || '',
                    customRequester: `${selectedData?.firstName || ''} ${selectedData?.lastName || ''}`.trim()
                  }))
                  // Clear errors for auto-populated fields
                  clearFieldErrors(['customerMobile', 'customerEmail', 'cc', 'customRequester'])
                } else if (formData.requesterType === 'Employee') {
                  setSelected({
                    name: selectedData?.name || 'Admin',
                    businessName: selectedData?.companyInfo?.companyName || '',
                    city: selectedData?.address?.city || '',
                    pincode: selectedData?.address?.pincode || '',
                    parentId: selectedData?.employee_id || ''
                  })
                  setFormData(prev => ({
                    ...prev,
                    customerMobile: selectedData?.phone || '',
                    customerEmail: selectedData?.email || '',
                    cc: selectedData?.email || '',
                    customRequester: selectedData?.name || ''
                  }))

                  clearFieldErrors(['customerMobile', 'customerEmail', 'cc', 'customRequester'])
                }
              }}
              renderInput={params => (
                //
                <CustomTextField 
                  {...params}
                  label={` Search by name or mobile or Id ${formData.requesterType}`}
                  helperText={!formData.requesterType}
                />
              )}
              renderOption={(props, option, { index }) => {
                if (!formData.requesterType) return <li {...props} key={`empty-${index}`}></li>

                const uniqueKey = getOptionKey(option, formData.requesterType)

                return (
                  <li {...props} key={uniqueKey}>
                    {formData.requesterType === 'Vendor' && (
                      <div>
                        <div>{option.companyInfo?.companyName}</div>
                        <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                          {option.vendorId} - {option.contactInfo?.phoneNo}
                        </div>
                      </div>
                    )}
                    {/*  */}
                    {formData.requesterType === 'Customer' && (
                      <div>
                        <div>
                          {option.firstName} {option.lastName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                          {option.phone} - {option.userId}
                        </div>
                      </div>
                    )}
                    {formData.requesterType === 'Employee' && (
                      <div>
                        <div>{option.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                          {option.phone} - {option.employee_id}
                        </div>
                      </div>
                    )}
                  </li>
                )
              }}
              noOptionsText={
                !formData.requesterType
                  ? 'Please select a requester type first'
                  : inputValue.length < 3
                    ? 'Type at least 3 characters to search'
                    : `No ${formData.requesterType.toLowerCase()}s found`
              }
            />
          </div>

          {/* Mobile Number */}
          <CustomTextField 
            label='Mobile Number *'
            fullWidth
            value={formData.customerMobile}
            onChange={handleInputChange('customerMobile')}
            error={hasSubmitted && !!errors.customerMobile}
            helperText={hasSubmitted ? errors.customerMobile : ''}
          />

          {/* Customer Email */}
          <CustomTextField 
            label='Customer Email *'
            fullWidth
            value={formData.customerEmail}
            onChange={handleInputChange('customerEmail')}
            error={hasSubmitted && !!errors.customerEmail}
            helperText={hasSubmitted ? errors.customerEmail : ''}
          />

          {/* CC */}
          <CustomTextField 
            label='Cc'
            fullWidth
            // value={formData.cc}
            onChange={handleInputChange('cc')}
          />

          {/* Assign To */}
          <CustomTextField 
            select
            label='Assign to Employee*'
            fullWidth
            value={formData.assignTo}
            onChange={e => {
              setFormData({ ...formData, assignTo: e.target.value })

              if (errors.assignTo) {
                setErrors(prev => ({ ...prev, assignTo: undefined }))
              }
            }}
            error={hasSubmitted && !!errors.assignTo}
            helperText={hasSubmitted ? errors.assignTo : ''}
          >
            {employees.map(emp => (
              <MenuItem key={emp._id || emp.name || emp.mobile} value={emp.name}>
                {`${emp.employee_id} - ${emp.name}`}
              </MenuItem>
            ))}
          </CustomTextField>

          {/* Priority and Status */}
        

{/* Priority and Status */}
<div className='flex items-start gap-4 w-full'>
  {/* Priority Dropdown */}
  <CustomTextField
    select
    label='Priority'
    className='w-1/2'
    value={formData.priority}
    onChange={handleInputChange('priority')}
    error={hasSubmitted && !!errors.priority}
    helperText={hasSubmitted ? errors.priority : ''}
  >
    {priorityOptions.map(option => (
      <MenuItem key={option} value={option.toUpperCase()}>
        {option.charAt(0) + option.slice(1).toLowerCase()}
      </MenuItem>
    ))}
  </CustomTextField>

  {/* Status Dropdown */}
  <CustomTextField
    select
    label='Status'
    className='w-1/2'
    value={formData.status}
    onChange={handleInputChange('status')}
    error={hasSubmitted && !!errors.status}
    helperText={hasSubmitted ? errors.status : ''}
  >
    {statusOptions.map(option => (
      <MenuItem key={option} value={option.toUpperCase()}>
        {option.charAt(0) + option.slice(1).toLowerCase()}
      </MenuItem>
    ))}
  </CustomTextField>
</div>

         {/* Predefined Reply Dropdown */}
<CustomTextField
  select
  label='Select Predefined Reply'
  fullWidth
  value={formData.selectedPredefinedReply || ''}
  onChange={(e) => {
    const selectedReply = results.find(reply => reply._id === e.target.value);
    if (selectedReply?.name && editor) {
      const currentText = editor.getText();
      const needsSpace = currentText && !currentText.endsWith(' ') ? ' ' : '';
      editor.commands.focus();
      editor.commands.insertContent(`${needsSpace}${selectedReply.name} `);
      
      // Clear the selection after inserting
      setFormData(prev => ({ ...prev, selectedPredefinedReply: '' }));
      clearFieldErrors(['editor']);
    }
  }}
  SelectProps={{
    displayEmpty: true,
    renderValue: (selected) => {
      if (!selected) {
        return <em style={{ color: '#999' }}>Select a predefined reply</em>;
      }
      const reply = results.find(r => r._id === selected);
      return reply?.name || '';
    }
  }}
>
  <MenuItem value="" disabled>
    <em>Select a predefined reply</em>
  </MenuItem>
  {results.map((reply) => (
    <MenuItem key={reply._id || reply.name} value={reply._id}>
      {reply.name}
    </MenuItem>
  ))}
</CustomTextField>


          {/* here is css problem call unother compnents */}
          <div>
            <Typography>
              Content / Description <span className='text-red-600'>*</span>
            </Typography>
            {hasSubmitted && errors.editor && (
              <FormHelperText error className='mb-2'>
                {errors.editor}
              </FormHelperText>
            )}
            <Card className='p-0 border shadow-none'>
              <CardContent className='p-0'>
                <EditorToolbar editor={editor} />
                <Divider />
                <EditorContent editor={editor} className='min-h-[135px] overflow-y-auto flex px-6 py-4' />
              </CardContent>
            </Card>
          </div>

          {/* File Uploads */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              type='file'
              id='file-upload'
              hidden
              accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
                e.target.value = '' // reset input so same file can be uploaded again if needed
              }}
            />
            <label htmlFor='file-upload'>
              <Button variant='outlined' component='span'>
                Upload File
              </Button>
            </label>

            {/* Image Preview with Remove Icon */}
            {files && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={files}
                  alt='Uploaded'
                  className='w-20 h-20 object-cover rounded border'
                  style={{ display: 'block' }}
                />
                <IconButton
                  size='small'
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                  onClick={handleRemoveFile}
                  aria-label='Remove uploaded image'
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </Box>
            )}
            {attachment && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
                  {attachment.split('/').pop()}
                </Typography>
                <IconButton size='small' onClick={handleRemoveAttachment} aria-label='Remove uploaded attachment'>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Save Button */}
          <Box display='flex' justifyContent='flex-end' mb={2}>
            <Button
              onClick={onSubmit} // <-- trigger your submission function directly
              disabled={imageUploaded || attachmentUploaded}
              variant='contained'
              sx={{ color: 'white' }}
            >
              Save
            </Button>
          </Box>
        </div>
        <Box className='w-full md:w-1/3'>
          <Card sx={{ maxWidth: 360, overflow: 'hidden' }} elevation={0}>
            <CardContent>
              <Typography variant='h6' color='primary' gutterBottom>
                INFO
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={3}>
                <strong>Name :</strong> {selected?.name || 'N/A'}
              </Typography>

        
              {formData.requesterType === 'Vendor' && (
                <Typography variant='body2' color='text.secondary' mb={2}>
                  <strong>Business name :</strong> {selected?.businessName || 'N/A'}
                </Typography>
              )}

              <Typography variant='body2' color='text.secondary' mb={2}>
                <strong>City :</strong> {selected?.city?.name || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={2}>
                <strong>Pincode :</strong> {selected?.pincode || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={2}>
                <strong>Parent Id :</strong> {selected?.parentId || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
    </Card>
  )
}

export default NewTicket






