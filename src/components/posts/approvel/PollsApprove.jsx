// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Paper, Box } from '@mui/material'

// Vendor Imports
import Vendors from '@/services/posts/post.service'
import Polls from '@/services/posts/polls.service'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import ReadGoogleMapLocation from '@/components/dialogs/posts/ReadOnlyLocution'

const ApprovePolles = ({ EditSelectedPost, onsuccess, getData }) => {
  // State for vendor data and search
  const [vendorData, setVendorData] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [vendorDetail, setVendorDetail] = useState(null)

  // Form data state
  const [formData, setFormData] = useState({
    question: '',
    chooseType: '',
    status: 'PENDING',
    chooseTypeId: '',
    locution: '',
    locutionKm: '',
    latCoordinate: '',
    lngCoordinate: '',
    options: []
  })

  // Error state (primarily for the submit button)
  const [errors, setErrors] = useState({
    chooseType: '',
    question: '',
    status: '',
    chooseTypeId: '',
    location: '',
    locationKm: ''
  })

  useEffect(() => {
    if (EditSelectedPost) {
      setFormData({
        question: EditSelectedPost.question || '',
        chooseType: EditSelectedPost.chooseType || '',
        status: EditSelectedPost.status || 'PENDING',
        chooseTypeId: EditSelectedPost.chooseTypeId || '',
        options: EditSelectedPost.options?.map(opt => opt.option) || [],
        locution: EditSelectedPost.locution || '',
        locutionKm: EditSelectedPost.locationKm || '',
        latCoordinate: EditSelectedPost.latCoordinate || '',
        lngCoordinate: EditSelectedPost.lngCoordinate || ''
      })

      setQuery(EditSelectedPost.chooseTypeId?.vendorId)
      setVendorDetail(EditSelectedPost.chooseTypeId?._id)
    }
  }, [EditSelectedPost])

  // Fetch vendor data
  const getVendorId = async () => {
    try {
      const result = await Vendors.getVendarId()
      setVendorData(result.data)
    } catch (error) {
      toast.error('Failed to fetch vendor data')
    }
  }

  // Initialize component
  useEffect(() => {
    getVendorId()
  }, [])

  // Handle search query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query?.trim() === '') {
        setResults([])
        return
      }

      const filtered = vendorData.filter(item => {
        const match = item.vendorId.toLowerCase().includes(query?.toLowerCase())
        return match
      })
      setResults(filtered)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query, vendorData])

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        question: formData.question,
        options: formData.options.map(option => ({ option })),
        chooseType: formData.chooseType,
        chooseTypeId: formData.chooseTypeId,
        lngCoordinate: formData.lngCoordinate,
        latCoordinate: formData.latCoordinate,
        location: formData.locution,
        locationKm: formData.locutionKm,
        status: formData.status
      }

      const pollsId = EditSelectedPost._id
      const result = await Polls.approvePolls(payload, pollsId)
      toast.success(result.message)
      onsuccess(false)
      getData()
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    }
  }

  return (
    <Card className='shadow-none'>
      <CardContent>
        <Typography variant='h4' sx={{ mb: 4 }}>
          Approve Poll
        </Typography>
        <Grid container spacing={6}>
          {/* question Field */}
          <Grid size={{ xs: 12, md: 12 }}>
            <CustomTextField
              fullWidth
              disabled
              multiline
              label='Poll Question'
              placeholder='Enter Poll Question'
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              error={!!errors.question}
              helperText={errors.question}
            />
          </Grid>
          {/* Display read-only options */}
          {formData.options.length > 0 && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Poll Options:
                </Typography>
                {formData.options.map((option, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < formData.options.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <Typography>{option}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}
          {/* Created For Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Created For'
              className='text-start'
              disabled
              value={formData?.chooseType}
              onChange={e => setFormData({ ...formData, chooseType: e.target.value })}
              error={!!errors.chooseType}
              helperText={errors.chooseType}
            >
              <MenuItem value='' disabled>
                -- Created For --
              </MenuItem>
              <MenuItem value='Admin'>Happening Bazaar</MenuItem>
              <MenuItem value='Business'>Business</MenuItem>
              <MenuItem value='Mandir'>Spritual</MenuItem>
            </CustomTextField>
          </Grid>
          {/* Status Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Status'
              className='text-start'
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              error={!!errors.status}
              helperText={errors.status}
            >
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='APPROVED'>Approved</MenuItem>
              <MenuItem value='REJECTED'>Rejected</MenuItem>
            </CustomTextField>
          </Grid>
          {/* Google Map Location */}
          {/* <Grid size={{xs:12,md:12}}>
            <ReadGoogleMapLocation
              errors={errors}
              formData={formData}
              googleMapData={{ latitude: formData.latCoordinate, longitude: formData.lngCoordinate }}
              setFormData={setFormData}
            />
          </Grid> */}
          {/* Submit Button */}
          <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
            <Button variant="contained" size="large" fullWidth onClick={handleSubmit}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1).toLowerCase()} Poll
            </Button>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ApprovePolles
