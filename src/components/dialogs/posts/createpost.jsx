// React Imports
import { useEffect, useState, useRef } from 'react'
// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, TextField, CircularProgress } from '@mui/material'
import { Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material'
import Vendors from '@/services/posts/post.service'
// Third-party Imports
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import getVendor from '@/services/utsav/banner/HomeBannerServices'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import PostGoogleMapLocation from './GoogleLocution'
import SpritualServices from '@/services/posts/spritual.service'


const CreatePost = ({ onsuccess, getData }) => {
  // State for vendor data and search
  const [vendorData, setVendorData] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [vendorDetail, setVendorDetail] = useState(null)
  const [imgSrcListd, setimgSrcLists] = useState([])
  const [mediaList, setMediaList] = useState([])
  const [selectedSpritual, setSelectedSpritual] = useState({
    selectedPlace: ""
  })





  // Form data state
  const [formData, setFormData] = useState({
    images: [],
    imgSrcList: [],
    description: '',
    chooseType: '',
    status: 'PENDING',
    chooseTypeId: '',
    locution: '',
    Visibility: '',
    chooseTypeModel: "",
    locutionkm: '',
    latCoordinage: '',
    langCoordinagee: ''
  })
  // Error state
  const [errors, setErrors] = useState({
    chooseType: '',
    description: '',
    status: '',
    chooseTypeId: '',
    locution: '',
    Visibility: '',
    locutionkm: ''
  })


  const [imageLoader, setimageLoader] = useState(false)
  const [cloud, setCloud] = useState()

  useEffect(() => {
    const GetVendor = async () => {
      const data = { search: query };
      const SearchVendor = await getVendor.getsearch(data);
      setVendorData(SearchVendor.data);
    };

    if (formData?.chooseType === "Business" && query?.trim()) {
      GetVendor();
    }
  }, [query, formData?.chooseType]);


  useEffect(() => {
    const getHinduMandir = async () => {
      const result = await SpritualServices.searchHinduTabmple(query);
      setVendorData(result.data)
    };

    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "temples" &&
      query?.trim()
    ) {
      getHinduMandir();
    }
  }, [query, formData?.chooseType, formData?.chooseTypeModel]);



  useEffect(() => {
    const getSikhMandir = async () => {
      const result = await SpritualServices.SearchGurudwara(query);
      setVendorData(result.data)
    };
    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "gurudwaras" &&
      query?.trim()
    ) {
      getSikhMandir();
    }

  }, [query, formData?.chooseType, formData?.chooseTypeModel])


  useEffect(() => {
    const getChurchMandir = async () => {
      const result = await SpritualServices.SearchChurch(query);
      setVendorData(result.data)
    };

    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "christian_temple" &&
      query?.trim()
    ) {
      getChurchMandir();
    }
  }, [query, formData?.chooseType, formData?.chooseTypeModel])




  useEffect(() => {
    const getJinalayaMandir = async () => {
      const result = await SpritualServices.SearchJain(query);
      setVendorData(result.data)
    };

    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "jain_temples" &&
      query?.trim()
    ) {
      getJinalayaMandir();
    }
  }, [query, formData?.chooseType, formData?.chooseTypeModel])




  useEffect(() => {
    const getChaityaMandir = async () => {
      const result = await SpritualServices.SearchChaitya(query);
      setVendorData(result.data)
    };

    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "buddhism_temples" &&
      query?.trim()
    ) {
      getChaityaMandir();
    }
  }, [query, formData?.chooseType, formData?.chooseTypeModel])

  useEffect(() => {
    const getIsalamMandir = async () => {
      const result = await SpritualServices.SearchIslam(query);
      setVendorData(result.data)
    };



    if (
      formData?.chooseType === "Mandir" &&
      formData?.chooseTypeModel === "NearByMosque" &&
      query?.trim()
    ) {
      getIsalamMandir();
    }
  }, [query, formData?.chooseType, formData?.chooseTypeModel])





  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query?.trim() === '') {
        setResults([])
        return
      }

      // console.log(vendorDetail, "vendorDatavendorData");


      const filtered = vendorData.filter(item => {
        return (
          item.vendorId || item?.temple_id?.toLowerCase().includes(query.toLowerCase()) ||
          item.companyInfo?.companyName || item?.name?.toLowerCase().includes(query.toLowerCase()) ||
          item.contactInfo?.phoneNo || item?.contact_number?.toLowerCase().includes(query.toLowerCase())
        )
      })

      setResults(filtered)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query, vendorData])








  // Handle file upload
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)

    // Prepare initial mediaList with preview URLs and loading=true
    const newMedia = files.map(file => ({
      id: URL.createObjectURL(file), // use preview URL as temporary id, or use uuid
      file,
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      loading: true
    }))

    setMediaList(prev => [...prev, ...newMedia])

    // Upload each file async and update state when done
    newMedia.forEach(async (mediaItem) => {
      try {
        // Replace this with your actual upload function
        const response = await Image.uploadMultipleImage([mediaItem.file])

        const uploadedUrl = response.data[0].url // assuming one file per upload call

        console.log(uploadedUrl, "uploadedUrluploadedUrl");

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadedUrl]
        }));


        setMediaList(prev =>
          prev.map(item =>
            item.id === mediaItem.id
              ? { ...item, uploadedUrl, loading: false }
              : item
          )
        )
      } catch (error) {
        // Handle upload error per file
        setMediaList(prev =>
          prev.filter(item => item.id !== mediaItem.id) // remove failed uploads, or set loading false
        )
      }
    })
  }



  // Handle image reset
  const handleResetImages = () => {
    setFormData(prev => ({ ...prev, imgSrcList: [], images: [] }))
  }

  // Handle single image delete
  const handleSingleDelete = async (item) => {
    // item.url contains the URL to delete
    try {
      await Image.deleteImage(item.url) // or use public_id if you have it
      setFormData(prev => ({
        ...prev,
        imgSrcList: prev.imgSrcList.filter(url => url !== item.url),
        images: prev.images.filter(url => url !== item.url)
      }))
      setimgSrcLists(prev => prev.filter(url => url !== item.url))
    } catch (error) {
      toast.error("Failed to delete image/video.")
    }
  }


  // Validate form
  const validateForm = () => {
    const newErrors = {}
    const { chooseType, description, chooseTypeId, locution, locutionkm, status } = formData

    if (!chooseType) newErrors.chooseType = 'User Type is required'
    if (!chooseTypeId) newErrors.chooseTypeId = 'User Type Id required'
    if (!description) newErrors.description = 'Description is required'
    if (!locution) newErrors.locution = 'Location is required'
    if (!status) newErrors.status = 'Status is required'
    if (!locutionkm) newErrors.locutionkm = 'Visibility KM is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        console.log(formData);
        const result = await Vendors.addData(formData)
        toast.success(result.message)
        onsuccess(false)
        getData()
      } catch (error) {
        console.error('Error:', error)
        getData()
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
        toast.error(errorMessage)
      }
    }
  }




  return (
    <Card className='shadow-none'>
      <CardContent>
        <Typography variant='h4' sx={{ mb: 4 }}>
          Create Post
        </Typography>

        <Grid container spacing={6}>
          {/* File Upload Section */}
          <Grid size={{ xs: 12 }}>
            <div className="flex flex-grow flex-col gap-4 text-start">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button component="label" variant="contained">
                  Upload Photos & Videos
                  <input
                    type="file"
                    accept="image/png, image/jpeg, video/mp4, video/webm, video/ogg"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                <Button variant="outlined" color="error" onClick={handleResetImages}>
                  Delete all
                </Button>
              </div>
              <Typography variant="body2">
                Allowed formats: JPG, GIF, PNG, MP4, WebM, or OGG. Maximum image size: 1MB. Maximum video size: 50MB each.
              </Typography>
            </div>
          </Grid>

          {/* Media Preview Section */}
          <Grid size={{ xs: 12 }}>
            <div className='flex flex-wrap gap-4'>
              {mediaList.map(({ id, previewUrl, uploadedUrl, loading }) => {
                const url = uploadedUrl || previewUrl
                const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i)

                return (
                  <div
                    key={id}
                    style={{
                      width: '100px',
                      height: '100px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <button
                      onClick={() => handleSingleDelete(id)}
                      style={{ position: 'absolute', top: 4, right: 4, zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer' }}
                      aria-label='Delete'
                    >
                      ✕
                    </button>

                    {isImage ? (
                      <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : isVideo ? (
                      <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div>Unsupported</div>
                    )}

                    {loading && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        {/* You can use MUI CircularProgress */}
                        <CircularProgress size={24} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </Grid>


          {/* Description Field */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label="Description"
              placeholder="Enter Description"
              value={formData.description}
              multiline
              rows={4}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          {/* User Type Selection */}
          <Grid size={{ xs: 12, md: 6 }} >
            <CustomTextField
              select
              fullWidth
              label="Created For"
              className="text-start"
              value={formData.chooseType}
              onChange={e => setFormData({ ...formData, chooseType: e.target.value, chooseTypeModel: e.target.value })}
              error={!!errors.chooseType}
              helperText={errors.chooseType}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return <span>Select Sub Choose Type</span>;
                  }
                  // Optional: Capitalize or format
                  return selected;
                },
              }}
            >
              <MenuItem value="" disabled>-- Created For --</MenuItem>
              {/* <MenuItem value="Admin">Happening Bazaar</MenuItem> */}
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Mandir">Spritual</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Status Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              // select
              fullWidth
              label="Status"
              className='text-start'
              disabled
              value={'PENDING'}
              onChange={e => setFormData({ ...formData, status: "PENDING" })}
              error={!!errors.status}
              helperText={errors.status}
            >
            </CustomTextField>
          </Grid>

          {formData.chooseType === "Mandir" && (
            <RadioGroup
              row
              aria-label="controlled"
              name="controlled"
              value={formData.chooseTypeModel}

              onChange={(e) =>
                setFormData({ ...formData, chooseTypeModel: e.target.value })
              }
            >
              <FormControlLabel value="temples" control={<Radio />} label="Mandir (Hindu)" />
              <FormControlLabel value="gurudwaras" control={<Radio />} label="Gurudwara (Sikh) " />
              <FormControlLabel value="christian_temple" control={<Radio />} label="Church (Christian)" />
              <FormControlLabel value="jain_temples" control={<Radio />} label="Jinalaya (Jain)" />
              <FormControlLabel value="buddhism_temples" control={<Radio />} label="Chaitya (Buddhism)" />
              <FormControlLabel value="NearByMosque" control={<Radio />} label="Masjid (Ishlam)" />
            </RadioGroup>
          )}



          {/* Vendor/Mandir Search */}
          {(formData.chooseType === "Business" || formData.chooseType === "Mandir") && (
            <Grid size={{ xs: 12, md: 12 }}>
              <CustomTextField
                fullWidth
                label={`Search ${formData.chooseType} ID`}
                placeholder={`Enter ${formData.chooseType} ID`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={!!formData.chooseTypeId}
                error={!!errors.chooseTypeId}
                helperText={errors.chooseTypeId}
              />

              {/* Search Results */}
              <Paper
                elevation={3}
                sx={{
                  mt: 1,
                  maxHeight: 250,
                  overflow: 'auto',
                  display: results.length ? 'block' : 'none',
                  borderRadius: 1
                }}
              >
                {results.length > 0 && !vendorDetail && (
                  <Paper
                    elevation={3}
                    sx={{
                      mt: 1,
                      maxHeight: 200,
                      overflow: 'auto',
                      display: 'block',
                      borderRadius: 1
                    }}
                  >
                    {results.map(item => (
                      console.log(item?._id, "itemsssssss"),

                      <MenuItem
                        key={item._id}
                        onClick={() => {
                          setQuery(item?.vendorId || item?.temple_id || item?.gurudwara_id || item?.mosque_id); // show selected ID in input
                          setFormData(prev => ({ ...prev, chooseTypeId: item._id }));
                          setVendorDetail(item);
                          setResults([]);
                        }}
                        sx={{
                          py: 1.5,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <div className="flex gap-1 flex-col">
                          {item?.vendorId ? (
                            <Typography variant="body2" color="text.secondary" className="text-start">
                              <strong>Business Id :</strong> {item.vendorId}
                            </Typography>
                          ) : item?.temple_id || item?.gurudwara_id || item?.mosque_id ? (
                            <Typography variant="body2" color="text.secondary" className="text-start">
                              <strong>Temple Id :</strong> {item?.temple_id || item?.gurudwara_id || item?.mosque_id}
                            </Typography>
                          ) : null}

                          {item?.companyInfo?.companyName || item?.name && (
                            <Typography variant="body2" color="text.secondary" className='text-start'>
                              <strong>Name :</strong>  {item?.companyInfo?.companyName || item?.name}
                            </Typography>
                          )}
                          {item?.contactInfo?.phoneNo || item?.contact_number && (
                            <Typography variant="body2" color="text.secondary" className='text-start'>
                              <strong>Phone No :</strong> {item?.contactInfo?.phoneNo || item?.contact_number}
                            </Typography>
                          )}
                        </div>
                      </MenuItem>
                    ))}
                  </Paper>
                )}

              </Paper>
            </Grid>
          )}

          {/* Vendor/Mandir Details Display */}
          {vendorDetail && (formData.chooseType === "Business" || formData.chooseType === "Mandir") && (
            <Grid size={{ xs: 12 }} className="mt-6">
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

          {/* Google Maps Section */}

          <Grid size={{ xs: 12, md: 12 }}>
            <PostGoogleMapLocation errors={errors} formData={formData} googleMapData={{ latitude: formData.latCoordinage, longitude: formData.langCoordinagee }} setFormData={setFormData} />
          </Grid>



          {/* Submit Button */}
          <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={handleSubmit}
              disabled={imageLoader}
            >
              Create Post
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CreatePost
