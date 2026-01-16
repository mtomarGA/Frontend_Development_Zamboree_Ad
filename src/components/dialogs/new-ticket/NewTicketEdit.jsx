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
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  InputAdornment
} from '@mui/material'
import { useState, useEffect, use } from 'react'
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import CustomIconButton from '@core/components/mui/IconButton'
import '@/libs/styles/tiptapEditor.css'
import { useRouter } from 'next/navigation'
import allTicketService from '@/services/custmore-care-ticket/allTicketService'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service.js'
import getEmployeeDetailsByMobile from '@/services/employee/EmployeeService.js'
import CustomerService from '@/services/customers/createService.js'
import Image from '@/services/imageService'
import predefinedService from '@/services/custmore-care-ticket/predefinedService'
import CustomTextField from '@/@core/components/mui/TextField'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices'

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

const NewTicket = ({ selectedTicket, setNewTicketEdit, onSuccess }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [SearchData, setSearchData] = useState([])
  const [formErrors, setFormErrors] = useState({})

  // Form state
  
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
  priority: 'HIGH',        // ✅ Uppercase by default
  status: 'PENDING',       // ✅ Uppercase by default
  customRequesterType: '',
  selectedUser: ''
})

  useEffect(() => {
    if (selectedTicket) {
      setFormData({
        subject: selectedTicket.subject || '',
        customRequester: selectedTicket.customRequester || '',
        customerMobile: selectedTicket.customerMobile || '',
        customerEmail: selectedTicket.customerEmail || '',
        requesterType: selectedTicket.requesterType || '',
        cc: selectedTicket.cc || '',
        assignTo: selectedTicket.assignTo || '',
        priority: selectedTicket.priority || 'High',
        image: selectedTicket.image || '',
        attachment: selectedTicket.attachment || '',
        status: selectedTicket.status || 'Open'
      })
      fetchInfo(selectedTicket.customerMobile, selectedTicket.requesterType)
    }
  }, [selectedTicket])

  const fetchInfo = async (searchValue, requesterType) => {
    try {
      let response
      if (requesterType === 'Vendor') {
        response = await HomeBannerRoute.getsearch({ search: searchValue })
        const data = response.data[0]

        setSelected({
          name: data.companyInfo.name || 'Admin',
          businessName: data.companyInfo.companyName,
          city: data.locationInfo.city,
          pincode: data.locationInfo.pincode || '',
          parentId: data.vendorId
        })
      } else if (requesterType === 'Customer') {
        response = await CustomerService.getSerchUser(searchValue)
        const data = response.data[0]
        setSelected({
          name: data.firstName + ' ' + data.lastName,
          businessName: '',
          city: data.city,
          pincode: data.pincode || '',
          parentId: data.userId
        })
      } else if (requesterType === 'Employee') {
        response = await getEmployeeDetailsByMobile.getEmployeeDetailsByMobile(searchValue)
        const data = response.data[0]
        setSelected({
          name: data.name,
          businessName: '',
          city: data.address.city,
          pincode: data.address.pincode || '',
          parentId: data.employee_id
        })
      }
    } catch (error) {}
  }

  const [selected, setSelected] = useState({
    name: '',
    businessName: '',
    city: '',
    pincode: '',
    parentId: ''
  })

  useEffect(() => {
    setFiles(selectedTicket?.image || '')
    setAttachment(selectedTicket?.attachment || '')
  }, [selectedTicket])

  // Error state
  const [errors, setErrors] = useState({})

  // Other states
  const [files, setFiles] = useState('')
  const [attachment, setAttachment] = useState('')
  const [imageUploaded, setImageUploaded] = useState(false)
  const [attachmentUploaded, setAttachmentUploaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [replies, setReplies] = useState([])
  const [showReplyList, setShowReplyList] = useState(false)

  // Predefined replies management states
  const [openPreDefine, setOpenPreDefine] = useState(false)
  const [selectedReply, setSelectedReply] = useState(null)
  const [message, setMessage] = useState('')
  const [inputValue, setInputValue] = useState('')

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] })],
 
    content: selectedTicket?.description || ''
  })

  const handleInputChange = field => e => {
    const value = e.target.value

    if (field === 'requesterType') {
      setFormData(prev => ({
        ...prev,
        requesterType: value,
        customRequesterType: '',
        customRequester: '',
        customerMobile: '',
        customerEmail: '',
        cc: ''
      }))

      setSelected({
        name: '',
        businessName: '',
        city: '',
        pincode: '',
        parentId: ''
      })

      setInputValue('')
      setSearchData([])
      return
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }
  // File Upload Handler
  const handleFileUpload = async file => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const formData = new FormData()
    formData.append('image', file)

    if (imageTypes.includes(file.type)) {
      setImageUploaded(true)
      try {
        const res = await Image.uploadImage(formData)
        if (res?.data?.url) {
          setFiles(res.data.url)
          setAttachment(null)
        } else {
          throw new Error('No image URL returned')
        }
      } catch (error) {
        toast.error('Failed to upload image')
      } finally {
        setImageUploaded(false)
      }
    } else {
      setAttachmentUploaded(true)
      try {
        const res = await Image.uploadImage(formData)
        if (res?.data?.url) {
          setAttachment(res.data.url)
          setFiles(null)
        } else {
          throw new Error('No attachment URL returned')
        }
      } catch (error) {
        toast.error('Failed to upload attachment')
      } finally {
        setAttachmentUploaded(false)
      }
    }
  }

  const handleSend = () => {
    router.push(`/en/apps/custmore-tickets/tickets-card`)
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobileRegex = /^\d{10}$/

    if (!formData.subject) newErrors.subject = 'Subject is required'
    if (!formData.requesterType) newErrors.requesterType = 'Requestor type is required'
    if (!formData.customerMobile) {
      newErrors.customerMobile = 'Mobile number is required'
    } else if (!mobileRegex.test(formData.customerMobile)) {
      newErrors.customerMobile = 'Enter a valid mobile number (10 digits)'
    }
    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Email is required'
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Enter a valid email address'
    }
    if (formData.cc && !emailRegex.test(formData.cc)) {
    }
    if (!editor?.getHTML().trim()) newErrors.editor = 'Content is required'
    if (formData.requesterType === 'Other' && !formData.customRequesterType) {
      newErrors.customRequesterType = 'Please specify the requester type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit handler
  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        description: editor.getHTML(),
        ...(files && { image: files }),
        ...(attachment && { attachment: attachment })
      }

      const id = selectedTicket ? selectedTicket._id : null

      let response
      if (selectedTicket) {
        response = await allTicketService.updateTicket(id, payload)
        onSuccess()
        setNewTicketEdit(false)
      } else {
        response = await allTicketService.newTicketsCreate(payload)
      }

      setOpenPreDefine(false)
      setSelectedReply(null)
      setMessage('')

      toast.success(response.message)
      handleSend()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  //create and updated
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

  useEffect(() => {
    fetchReplies()
  }, [])

  const handleSearch = async searchValue => {
    if (!searchValue || searchValue.length < 3) {
      setSearchData([])
      return
    }

    try {
      let response

      if (formData.requesterType === 'Vendor') {
        response = await HomeBannerRoute.getsearch({ search: searchValue })
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      } else if (formData.requesterType === 'Customer') {
        response = await CustomerService.getSerchUser(searchValue)
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      } else if (formData.requesterType === 'Employee') {
        response = await getEmployeeDetailsByMobile.getEmployeeDetailsByMobile(searchValue)
        setSearchData(Array.isArray(response.data) ? response.data : [response.data])
      }
    } catch (error) {
      setSearchData([])
    }
  }

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await allTicketService.getEmployeeList()
        const data = Array.isArray(response.data) ? response.data : [response.data]
        setEmployees(data)
      } catch (error) {
        console.error('Failed to fetch employees:', error.message)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <form onSubmit={onSubmit} >
      <Card className='w-full h-full flex flex-col shadow-none'>
        <CardHeader
          title={ 'Edit Ticket'}
          sx={{
            '& .MuiCardHeader-content': {
              display: 'block',
              textAlign: 'left'
            }
          }}
        />

        <div className='flex flex-col md:flex-row gap-6 p-6'>
          {/* Left Section */}
          <div className='w-full md:w-2/3 space-y-4'>
            <TextField
              label='Subject*'
              fullWidth
              value={formData.subject}
              onChange={handleInputChange('subject')}
              error={!!errors.subject}
              helperText={errors.subject}
              disabled
            />

            <TextField
              select
              label='Requestor type*'
              fullWidth
              value={formData.requesterType}
              onChange={handleInputChange('requesterType')}
              error={!!errors.requesterType}
              helperText={errors.requesterType}
              sx={{ textAlign: 'left' }}
              disabled
            >
              <MenuItem value='Vendor'>Vendor</MenuItem>
              <MenuItem value='Customer'>Customer</MenuItem>
              <MenuItem value='Employee'>Employee</MenuItem>
              <MenuItem value='Other'>Other</MenuItem>
            </TextField>

            {formData.requesterType === 'Other' && (
              <TextField
                label='Specify Requestor Type*'
                fullWidth
                value={formData.customRequesterType}
                onChange={handleInputChange('customRequesterType')}
                error={!!errors.customRequesterType}
                helperText={errors.customRequesterType}
              />
            )}

            <div className='flex flex-col gap-2 my-2'>
              <Autocomplete
                fullWidth
                freeSolo
                options={SearchData}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue)
                  handleSearch(newInputValue)
                }}
                filterOptions={(options, state) => {
                  const input = state.inputValue.toLowerCase()
                  return options.filter(option => {
                    if (formData.requesterType === 'Vendor') {
                      const companyName = option?.companyInfo?.companyName?.toLowerCase() || ''
                      const vendorId = option?.vendorId?.toLowerCase() || ''
                      const phoneNo = option?.contactInfo?.phoneNo?.toLowerCase() || ''
                      return companyName.includes(input) || vendorId.includes(input) || phoneNo.includes(input)
                    } else if (formData.requesterType === 'Customer') {
                      const firstName = option?.firstName?.toLowerCase() || ''
                      const lastName = option?.lastName?.toLowerCase() || ''
                      const phone = option?.phone?.toLowerCase() || ''
                      const email = option?.email?.toLowerCase() || ''
                      return (
                        firstName.includes(input) ||
                        lastName.includes(input) ||
                        phone.includes(input) ||
                        email.includes(input)
                      )
                    } else if (formData.requesterType === 'Employee') {
                      const name = option?.name?.toLowerCase() || ''
                      const phone = option?.phone?.toLowerCase() || ''
                      const email = option?.email?.toLowerCase() || ''
                      return name.includes(input) || phone.includes(input) || email.includes(input)
                    }
                    return false
                  })
                }}
                getOptionLabel={option => {
                  if (!option) return ''
                  if (formData.requesterType === 'Vendor') {
                    return `${option?.companyInfo?.companyName || ''} - ${option?.contactInfo?.phoneNo || ''}`
                  } else if (formData.requesterType === 'Customer') {
                    return `${option?.firstName || ''} ${option?.lastName || ''} - ${option?.phone || ''}`.trim()
                  } else if (formData.requesterType === 'Employee') {
                    return `${option?.name || ''} - ${option?.phone || ''}`
                  }
                  return ''
                }}
                onChange={async (event, newValue) => {
                  if (!newValue || typeof newValue !== 'object') return

                  try {
                    if (formData.requesterType === 'Vendor') {
                      const contact = newValue?.contactInfo || {}
                      setSelected({
                        name: contact?.name || 'Admin',
                        businessName: newValue?.companyInfo?.companyName || '',
                        city: newValue?.locationInfo?.city || '',
                        pincode: newValue?.locationInfo?.pincode || '',
                        parentId: newValue?.vendorId || ''
                      })
                      setFormData(prev => ({
                        ...prev,
                        customerMobile: contact?.phoneNo || '',
                        customerEmail: contact?.email || '',
                        cc: contact?.email || '',
                        customRequester: contact?.name || 'Admin'
                      }))
                    } else if (formData.requesterType === 'Customer') {
                      setSelected({
                        name: `${newValue?.firstName || ''} ${newValue?.lastName || ''}`.trim() || 'Admin',
                        businessName: newValue?.companyInfo?.companyName || '',
                        city: newValue?.city || '',
                        pincode: newValue?.pincode || '',
                        parentId: newValue?.userId || ''
                      })
                      setFormData(prev => ({
                        ...prev,
                        customerMobile: newValue?.phone || '',
                        customerEmail: newValue?.email || '',
                        cc: newValue?.email || '',
                        customRequester: `${newValue?.firstName || ''} ${newValue?.lastName || ''}`.trim()
                      }))
                    } else if (formData.requesterType === 'Employee') {
                      setSelected({
                        name: newValue?.name || 'Admin',
                        businessName: newValue?.companyInfo?.companyName || '',
                        city: newValue?.address?.city || '',
                        pincode: newValue?.address?.pincode || '',
                        parentId: newValue?.employee_id || ''
                      })
                      setFormData(prev => ({
                        ...prev,
                        customerMobile: newValue?.phone || '',
                        customerEmail: newValue?.email || '',
                        cc: newValue?.email || '',
                        customRequester: newValue?.name || 'Admin'
                      }))
                    }
                  } catch (err) {
                    console.error('Error in selecting option:', err)
                  }
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={`Search by name or mobile or ID (${formData.requesterType || 'N/A'})`}
                    helperText={!formData.requesterType ? 'Please select a requestor type first' : ''}
                  />
                )}
                renderOption={(props, option) => {
                  if (!option) return null
                  return (
                    <li {...props} key={option?._id || option?.vendorId || option?.userId || option?.employee_id}>
                      {formData.requesterType === 'Vendor' && (
                        <>
                          <div>{option?.companyInfo?.companyName || '-'}</div>
                          <small style={{ color: 'gray' }}>
                            {option?.vendorId || ''} - {option?.contactInfo?.phoneNo || ''}
                          </small>
                        </>
                      )}
                      {formData.requesterType === 'Customer' && (
                        <>
                          <div>{`${option?.firstName || ''} ${option?.lastName || ''}`}</div>
                          <small style={{ color: 'gray' }}>
                            {option?.phone || ''} - {option?.email || ''}
                          </small>
                        </>
                      )}
                      {formData.requesterType === 'Employee' && (
                        <>
                          <div>{option?.name || '-'}</div>
                          <small style={{ color: 'gray' }}>
                            {option?.phone || ''} - {option?.email || ''}
                          </small>
                        </>
                      )}
                    </li>
                  )
                }}
                noOptionsText={
                  !formData.requesterType
                    ? 'Please select a requestor type first'
                    : inputValue.length < 3
                      ? 'Type at least 3 characters to search'
                      : `No ${formData.requesterType.toLowerCase()}s found`
                }
                disabled={!formData.requesterType}
              />
            </div>

            <Stack direction='row' spacing={2} alignItems='center'>
              <TextField
                label='Mobile Number *'
                fullWidth
                value={formData.customerMobile}
                onChange={handleInputChange('customerMobile')}
                error={!!errors.customerMobile}
                helperText={errors.customerMobile}
              />
            </Stack>

            <TextField
              label='Customer Email *'
              fullWidth
              value={formData.customerEmail}
              onChange={handleInputChange('customerEmail')}
              error={!!errors.customerEmail}
              helperText={errors.customerEmail}
            />

            <TextField label='Cc' fullWidth onChange={handleInputChange('cc')} />

            {/* Assign To */}

            <TextField
              select
              label='Assign to Employee'
              fullWidth
              value={formData.assignTo}
              onChange={e => setFormData({ ...formData, assignTo: e.target.value })}
              sx={{
                '& .MuiSelect-select': {
                  textAlign: 'left',
                  paddingLeft: '14px'
                }
              }}
            >
              {employees.map(emp => (
                <MenuItem key={emp._id} value={emp.name}>
                  {emp.name || emp.fullName || emp.mobile}
                </MenuItem>
              ))}
            </TextField>

            <div className='flex items-start gap-4 w-full'>
              {[
                {
                  label: 'Priority',
                  value: formData.priority,
                  onChange: handleInputChange('priority'),
                  error: errors.priority,
                  options: priorityOptions
                },
                {
                  label: 'Status',
                  value: formData.status,
                  onChange: handleInputChange('status'),
                  error: errors.status,
                  options: statusOptions
                }
              ].map(({ label, value, onChange, error, options }) => (
                <FormControl
                  key={label}
                  className='w-1/2'
                  error={!!error}
                  sx={{ textAlign: 'left' }} // Align entire FormControl content left
                >
                  <InputLabel sx={{ textAlign: 'left' }}>{label}</InputLabel>
                  <Select value={value} onChange={onChange} label={label}>
                    {options.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error}</FormHelperText>
                </FormControl>
              ))}
            </div>

            {/* Content Editor */}
            <div className='mb-4 flex items-center gap-2 w-full'>
              <Autocomplete
                multiple
                freeSolo={false}
                fullWidth
                options={results}
                getOptionLabel={option => option.name || ''}
                value={[]}
                inputValue={searchTerm}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setSearchTerm(newInputValue)
                    setShowReplyList(true)
                  }
                }}
                open={showReplyList}
                onOpen={() => {
                  fetchReplies()
                  setShowReplyList(true)
                }}
                onClose={() => setShowReplyList(false)}
                onChange={(event, newValue, reason) => {
                  if (reason === 'selectOption' && newValue.length > 0) {
                    const lastSelected = newValue[newValue.length - 1]
                    if (lastSelected?.name) {
                      handleAppendContent(lastSelected)
                    }
                  }
                }}
                renderInput={params => (
                  <TextField {...params} label='Select Predefined Reply' variant='outlined' size='medium' />
                )}
              />
            </div>

            <Box>
              <Typography sx={{ textAlign: 'left' }}>
                Content / Description <span className='text-red-600'>*</span>
              </Typography>
              <Card className='p-0 border shadow-none'>
                <CardContent className='p-0'>
                  <EditorToolbar editor={editor} />
                  <Divider />
                  <EditorContent
                    editor={editor}
                    style={{ fontSize: '0.875rem' }}
                    className='min-h-[135px] overflow-y-auto flex px-6 py-4 text-left justify-start'
                  />
                </CardContent>
              </Card>
              {errors.editor && (
                <FormHelperText error className='ml-6'>
                  {errors.editor}
                </FormHelperText>
              )}
            </Box>

            {/* File Uploads */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* File Input */}
              <input
                type='file'
                id='file-upload'
                hidden
                accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />

              {/* Upload Button */}
              <label htmlFor='file-upload'>
                <Button variant='outlined' component='span'>
                  Upload File
                </Button>
              </label>

              {/* Image Preview */}
              {files && (
                <img
                  src={files}
                  alt='Uploaded'
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                />
              )}
              {attachment && !files && typeof attachment === 'string' && (
                <a
                  href={attachment}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: 'none', color: '#1976d2' }}
                >
                  {attachment.split('/').pop()}
                </a>
              )}

              {/* Update Button */}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                type='submit'
                disabled={imageUploaded || attachmentUploaded || loading}
                variant='contained'
                sx={{ color: 'white' }}
              >
                {loading ? 'Processing...' : 'Update'}
              </Button>
            </Box>
          </div>

          {/* Right Section (Info Card) */}
          <Box className='w-full md:w-1/3'>
            <Card sx={{ maxWidth: 360, overflow: 'hidden' }} elevation={0}>
              <CardContent sx={{ textAlign: 'left' }}>
                <Typography variant='h6' color='primary' gutterBottom>
                  INFO
                </Typography>
                <Typography variant='body2' color='text.secondary' mb={3}>
                  <strong>Name :</strong> {selected.name || 'N/A'}
                </Typography>
                {formData.requesterType === 'Vendor' && (
                  <Typography variant='body2' color='text.secondary' mb={2}>
                    <strong>Business name :</strong> {selected.businessName || 'N/A'}
                  </Typography>
                )}

                <Typography variant='body2' color='text.secondary' mb={2}>
                  <strong>City :</strong> {selected?.city?.name || 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary' mb={2}>
                  <strong>Pincode :</strong> {selected.pincode || 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary' mb={2}>
                  <strong>Parent Id :</strong> {selected.parentId || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </div>
      </Card>
    </form>
  )
}

export default NewTicket
