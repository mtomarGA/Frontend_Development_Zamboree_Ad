// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material'

// Services & Components
import CreateStorys from '@/services/posts/story.service'
import { toast } from 'react-toastify'
import UploadImage from '@/services/imageService'
import PostGoogleMapLocation from './GoogleLocution'
import SpritualServices from '@/services/posts/spritual.service'
import CustomTextField from '@core/components/mui/TextField'
import getVendor from '@/services/utsav/banner/HomeBannerServices'

const CreateStory = ({ onsuccess, getData }) => {
  const [vendorData, setVendorData] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [vendorDetail, setVendorDetail] = useState(null)
  const [mediaList, setMediaList] = useState([])

  const [formData, setFormData] = useState({
    images: [],
    chooseType: '',
    status: 'PENDING',
    chooseTypeModel: '',
    chooseTypeId: '',
    locution: '',
    Visibility: '',
    locutionkm: '',
    latCoordinage: '',
    langCoordinagee: ''
  })

  const [errors, setErrors] = useState({})
  const [imageLoader, setImageLoader] = useState(false)

  // --- Search Vendors ---
  useEffect(() => {
    const searchBusiness = async () => {
      const { data } = await getVendor.getsearch({ search: query })
      setVendorData(data)
    }
    if (formData.chooseType === 'Business' && query.trim()) searchBusiness()
  }, [query, formData.chooseType])

  useEffect(() => {
    const searchTemple = async (fn) => {
      const { data } = await fn(query)
      setVendorData(data)
    }
    if (formData.chooseType === 'Mandir' && query.trim()) {
      const map = {
        temples: SpritualServices.searchHinduTabmple,
        gurudwaras: SpritualServices.SearchGurudwara,
        christian_temple: SpritualServices.SearchChurch,
        jain_temples: SpritualServices.SearchJain,
        buddhism_temples: SpritualServices.SearchChaitya,
        NearByMosque: SpritualServices.SearchIslam
      }
      if (map[formData.chooseTypeModel]) searchTemple(map[formData.chooseTypeModel])
    }
  }, [query, formData.chooseType, formData.chooseTypeModel])

  // --- Filter Results ---
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) return setResults([])
      const q = query.toLowerCase()
      const filtered = vendorData.filter(item =>
        item.vendorId?.toLowerCase().includes(q) ||
        item.temple_id?.toLowerCase().includes(q) ||
        item.gurudwara_id?.toLowerCase().includes(q) ||
        item.mosque_id?.toLowerCase().includes(q) ||
        item.companyInfo?.companyName?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.contactInfo?.phoneNo?.includes(q) ||
        item.contact_number?.includes(q)
      )
      setResults(filtered)
    }, 300)
    return () => clearTimeout(delay)
  }, [query, vendorData])

  // --- Handle File Upload ---
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    const newMedia = files.map(file => ({
      id: URL.createObjectURL(file),
      file,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      loading: true
    }))
    setMediaList(prev => [...prev, ...newMedia])
    setImageLoader(true)

    try {
      const uploadPromises = newMedia.map(item => UploadImage.uploadMultipleImage([item.file]))
      const responses = await Promise.all(uploadPromises)
      const uploadedUrls = responses.map(res => res.data[0].url)

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))

      setMediaList(prev =>
        prev.map(item => {
          const uploadedUrl = uploadedUrls.shift()
          return { ...item, uploadedUrl, loading: false }
        })
      )
    } catch {
      toast.error('One or more uploads failed.')
    } finally {
      setImageLoader(false)
    }
  }

  // --- Delete Media ---
  const handleSingleDelete = async (media) => {
    if (media.uploadedUrl) {
      await UploadImage.deleteImage(media.public_id) // if API needs public_id
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== media.uploadedUrl)
      }))
    }
    setMediaList(prev => prev.filter(m => m.id !== media.id))
  }

  const handleResetImages = () => {
    setMediaList([])
    setFormData(prev => ({ ...prev, images: [] }))
  }

  // --- Validate Form ---
  const validateForm = () => {
    const { chooseType, locution, status, locutionkm,chooseTypeId } = formData
    const newErrors = {}
    if (!chooseType) newErrors.chooseType = 'User Type is required'
    if(!chooseTypeId) newErrors.chooseTypeId="Search Choose Type id"
    if (!locution) newErrors.locution = 'Location is required'
    if (!status) newErrors.status = 'Status is required'
    if (!locutionkm) newErrors.locutionkm = 'Visibility KM is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Submit ---
  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      const result = await CreateStorys.createStory(formData)
      toast.success(result.message)
      onsuccess(false)
      getData()
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Something went wrong"
      toast.error(msg)
      getData()
    }
  }

  return (
    <Card className='shadow-none'>
      <CardContent>
        <Typography variant='h4' sx={{ mb: 4 }}>Create Story</Typography>
        <Grid container spacing={6}>

          {/* Upload */}
          <Grid size={{ xs: 12 }}>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Button component="label" variant="contained">
                Upload Photos & Videos
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button variant="outlined" color="error" onClick={handleResetImages}>Delete all</Button>
            </div>
          </Grid>

          {/* Preview */}
          <Grid size={{ xs: 12 }}>
            <div className='flex flex-wrap gap-4'>
              {mediaList.map(media => {
                const isImage = media.type?.startsWith('image')
                const isVideo = media.type?.startsWith('video')
                const url = media.uploadedUrl || media.previewUrl

                return (
                  <div key={media.id} style={{ width: 100, height: 100, position: 'relative' }}>
                    <button
                      onClick={() => handleSingleDelete(media)}
                      style={{ position: 'absolute', top: 4, right: 4, zIndex: 10, background: 'transparent', border: 'none' }}
                    >✕</button>

                    {isImage ? (
                      <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : isVideo ? (
                      <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : <div>Unsupported</div>}

                    {media.loading && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                        <CircularProgress size={24} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Grid>

          {/* Choose Type */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select fullWidth label="Created For"
              className="text-start"
              value={formData.chooseType}
              onChange={e => setFormData({ ...formData, chooseType: e.target.value, chooseTypeModel: e.target.value })}
              error={!!errors.chooseType} helperText={errors.chooseType}
            >
              <MenuItem value="" disabled>-- Created For --</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Mandir">Mandir</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField fullWidth label="Status" disabled value="PENDING" />
          </Grid>

          {/* Mandir Options */}
          {formData.chooseType === "Mandir" && (
            <RadioGroup row value={formData.chooseTypeModel}
              onChange={e => setFormData({ ...formData, chooseTypeModel: e.target.value })}>
              <FormControlLabel value="temples" control={<Radio />} label="Mandir (Hindu)" />
              <FormControlLabel value="gurudwaras" control={<Radio />} label="Gurudwara (Sikh)" />
              <FormControlLabel value="christian_temple" control={<Radio />} label="Church (Christian)" />
              <FormControlLabel value="jain_temples" control={<Radio />} label="Jinalaya (Jain)" />
              <FormControlLabel value="buddhism_temples" control={<Radio />} label="Chaitya (Buddhism)" />
              <FormControlLabel value="NearByMosque" control={<Radio />} label="Masjid (Islam)" />
            </RadioGroup>
          )}

          {/* Search */}
          {(formData.chooseType === "Business" || formData.chooseType === "Mandir") && (
            <Grid size={{ xs: 12, md: 12 }}>
              <CustomTextField
                fullWidth
                label={`Search ${formData.chooseType} ID`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={!!formData.chooseTypeId}
                error={!!errors.chooseTypeId}
                helperText={errors.chooseTypeId}
              />
              {results.length > 0 && !vendorDetail && (
                <Paper sx={{ mt: 1, maxHeight: 250, overflow: 'auto' }}>
                  {results.map(item => (
                    <MenuItem key={item._id} onClick={() => {
                      setQuery(item.vendorId || item.temple_id || item.gurudwara_id || item.mosque_id)
                      setFormData(prev => ({ ...prev, chooseTypeId: item._id }))
                      setVendorDetail(item)
                      setResults([])
                    }}>
                      <div className="flex flex-col">
                        <Typography variant="body2"><strong>ID:</strong> {item.vendorId || item.temple_id || item.gurudwara_id || item.mosque_id}</Typography>
                        <Typography variant="body2"><strong>Name:</strong> {item.companyInfo?.companyName || item.name}</Typography>
                        <Typography variant="body2"><strong>Phone:</strong> {item.contactInfo?.phoneNo || item.contact_number}</Typography>
                      </div>
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </Grid>
          )}

          {/* Vendor Detail */}
          {vendorDetail && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {formData.chooseType} Information
                  </Typography>
                </Grid>
                <Divider />
                <Grid size={{ xs: 12 }} container direction="column" spacing={1}>
                  <Grid container direction="row" justifyContent="space-between">
                    <Typography>{formData.chooseType} ID:</Typography>
                    <Typography>{vendorDetail.vendorId || vendorDetail?.temple_id || vendorDetail?.mosque_id || 'N/A'}</Typography>
                  </Grid>
                  <Grid container direction="row" justifyContent="space-between">
                    <Typography>Mobile No:</Typography>
                    <Typography>{vendorDetail.contactInfo?.phoneNo || vendorDetail?.contact_number || 'N/A'}</Typography>
                  </Grid>
                  <Grid container direction="row" justifyContent="space-between">
                    <Typography>Name:</Typography>
                    <Typography>{vendorDetail?.companyInfo?.companyName || vendorDetail?.name || 'N/A'}</Typography>
                  </Grid>
                  <Grid container direction="row" justifyContent="space-between">
                    <Typography>Email:</Typography>
                    <Typography>{vendorDetail.contactInfo?.email || vendorDetail?.user_id?.email || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Map */}
          <Grid size={{ xs: 12 }}>
            <PostGoogleMapLocation
              formData={formData}
              errors={errors}
              googleMapData={{ latitude: formData.latCoordinage, longitude: formData.langCoordinagee }}
              setFormData={setFormData}
            />
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
            <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={imageLoader}>
              Create Story
            </Button>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default CreateStory
