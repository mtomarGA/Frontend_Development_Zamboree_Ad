// React Imports
import { useEffect, useState, useRef } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, TextField } from '@mui/material'
import Story from '@/services/posts/story.service'
import Vendors from '@/services/posts/post.service'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import ReadGoogleMapLocation from '@/components/dialogs/posts/ReadOnlyLocution'

const StoryApprove = ({ EditSelectedStory, setEditModalOpen, getData }) => {
    console.log(EditSelectedStory,"EditSelectedStoryEditSelectedStory");
    

    const [vendorData, setVendorData] = useState([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [vendorDetail, setVendorDetail] = useState(null)
    const [formData, setFormData] = useState({
        images: [],
        imgSrcList: [],
        chooseType: '',
        status: 'PENDING',
        chooseTypeId: '',
        locution: '',
        Visibility: '',
        locutionkm: '',
        latCoordinate: '',
        langCoordinate: ''
    })
    const [errors, setErrors] = useState({
        chooseType: '',
        status: '',
        chooseTypeId: '',
        locution: '',
        Visibility: '',
        locutionkm: ''
    })
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [googleMapData, setGoogleMapData] = useState({
        lattitute: '',
        longitude: ''
    })


    useEffect(() => {
        if (EditSelectedStory) {
            const images = EditSelectedStory.images || []
            const imgSrcList = images.map(img => {
                if (typeof img === 'string') {
                    return img.includes('http') ? img : `${process.env.NEXT_PUBLIC_URL}/${img}`
                }
                return img.url ? (img.url.includes('http') ? img.url : `${process.env.NEXT_PUBLIC_URL}/${img.url}`) : ''
            })
            setFormData({
                images: images,
                imgSrcList: imgSrcList,
                chooseType: EditSelectedStory.chooseType || '',
                status: EditSelectedStory.status || 'PENDING',
                chooseTypeId: EditSelectedStory.chooseTypeId || '',
                locution: EditSelectedStory.locution || '',
                Visibility: EditSelectedStory.Visibility || '',
                locutionkm: EditSelectedStory.locutionkm || '',
                latCoordinate: EditSelectedStory.latCoordinate || '',
                langCoordinate: EditSelectedStory.langCoordinate || '',
            })
            setGoogleMapData({
                lattitute: EditSelectedStory.latCoordinate || '',
                longitude: EditSelectedStory.langCoordinate || '',
            })
            setQuery(EditSelectedStory.chooseTypeId?.vendorId)
            setVendorDetail(EditSelectedStory.chooseTypeId?._id)
            // Set lat/lng for map
            if (EditSelectedStory.latCoordinate && EditSelectedStory.langCoordinate) {
                setLat(EditSelectedStory.latCoordinate)
                setLng(EditSelectedStory.langCoordinate)
            }
        }
    }, [EditSelectedStory])

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


    // Validate form
    const validateForm = () => {
        const newErrors = {}
        const { chooseType, chooseTypeId, locution, locutionkm, status } = formData

        if (!chooseType) newErrors.chooseType = 'User Type is required'
        if (!locution) newErrors.locution = 'Location is required'
        if (!status) newErrors.status = 'Status is required'
        if (!locutionkm) newErrors.locutionkm = 'Visibility KM is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async () => {
      
        const id = EditSelectedStory._id
        const StoryUpdate = await Story.approveStoryBy(id, formData)
        console.log(StoryUpdate, 'StoryUpdate');
        toast.success(StoryUpdate.message)
        setEditModalOpen(false)
        getData()
        console.log('Form submitted:', formData);
    }
    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Approve Story
                </Typography>

                <Grid container spacing={6}>
                    {/* Media Preview Section */}
                    <Grid size={{ xs: 12 }}>
                        <div className='flex flex-wrap gap-4'>
                            {formData.imgSrcList?.map((src, idx) => {
                                const file = formData.images[idx]
                                const isExistingImage = typeof file === 'string' || (file && file.url)
                                const fileType = isExistingImage
                                    ? src?.match(/\.(mp4|webm|ogg)$/)
                                        ? 'video'
                                        : 'image'
                                    : file?.type?.startsWith('video')
                                        ? 'video'
                                        : 'image'

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {fileType === 'image' ? (
                                            <img
                                                src={isExistingImage ? src : URL.createObjectURL(file)}
                                                alt={`File ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <video
                                                src={isExistingImage ? src : URL.createObjectURL(file)}
                                                controls
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </Grid>


                   

                    {/* User Type Selection */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label='Created For'
                            className='text-start'
                            disabled
                            value={formData.chooseType}
                            onChange={e => setFormData({ ...formData, chooseType: e.target.value })}
                            error={!!errors.chooseType}
                            helperText={errors.chooseType}
                        >
                            <MenuItem value='' disabled>
                                -- Created For --
                            </MenuItem>
                            <MenuItem value='Admin'>Happening Bazaar</MenuItem>
                            <MenuItem value='Business'>Business</MenuItem>
                            <MenuItem value='Mandir'>Mandir</MenuItem>
                        </CustomTextField>
                    </Grid>

                    {/* Status Selection */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            select
                            label='Status'
                            className='text-start'
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            <MenuItem value='' disabled>
                                -- Status --
                            </MenuItem>
                            <MenuItem value='PENDING'>Pending</MenuItem>
                            <MenuItem value='APPROVED'>Approved</MenuItem>
                            <MenuItem value='REJECTED'>Rejected</MenuItem>
                        </CustomTextField>
                    </Grid>

                    {/* Vendor/Mandir Search */}
                    {(formData.chooseType === 'Business' || formData.chooseType === 'Mandir') && (
                        <Grid size={{ xs: 12, md: 12 }}>
                            {/* <CustomTextField
                                fullWidth
                                label={`Search ${formData.chooseType} ID`}
                                placeholder={`Enter ${formData.chooseType} ID`}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            /> */}

                            {/* Search Results */}
                            {/* <Paper
                                elevation={3}
                                sx={{
                                    mt: 1,
                                    maxHeight: 200,
                                    overflow: 'auto',
                                    display: results.length ? 'block' : 'none',
                                    borderRadius: 1
                                }}
                            >
                                {results.map(item => (
                                    <MenuItem
                                        key={item._id}
                                        onClick={() => {
                                            setQuery(item.vendorId)
                                            setFormData(prev => ({ ...prev, chooseTypeId: item._id }))
                                            handleGetVendorDetail(item._id)
                                            setResults([])
                                        }}
                                        sx={{
                                            py: 1.5,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            },
                                            '&:last-child': {
                                                borderBottom: 'none'
                                            }
                                        }}
                                    >
                                        <div className='flex flex-col'>
                                            <Typography variant='body1' fontWeight={500}>
                                                {item.vendorId}
                                            </Typography>
                                            {item.companyInfo?.companyName && (
                                                <Typography variant='body2' color='text.secondary'>
                                                    {item.companyInfo.companyName}
                                                </Typography>
                                            )}
                                        </div>
                                    </MenuItem>
                                ))}
                            </Paper> */}
                        </Grid>
                    )}

                    {/* Vendor/Mandir Details Display */}
                    {/* {vendorDetail && (formData.chooseType === 'Business' || formData.chooseType === 'Mandir') && (
                        <Grid size={{ xs: 12, md: 12 }} className='mt-6'>
                            <Paper elevation={0} variant='outlined' sx={{ p: 2 }}>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1' fontWeight={500}>
                                        {formData.chooseType} Information
                                    </Typography>
                                </Grid>
                                <Divider />
                                <Grid item xs={12} container direction='column' spacing={1}>
                                    <Grid container direction='row' justifyContent='space-between'>
                                        <Typography>{formData.chooseType} ID:</Typography>
                                        <Typography>{vendorDetail.vendorId || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction='row' justifyContent='space-between'>
                                        <Typography>Mobile:</Typography>
                                        <Typography>{vendorDetail.contactInfo?.phoneNo || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction='row' justifyContent='space-between'>
                                        <Typography>Business Name:</Typography>
                                        <Typography>{vendorDetail.companyInfo?.companyName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction='row' justifyContent='space-between'>
                                        <Typography>Email:</Typography>
                                        <Typography>{vendorDetail.contactInfo?.email || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )} */}
                    {/* Google Maps Section */}
                    {/* <Grid size={{ xs: 12, md: 12 }} disabled readOnly >
                        <ReadGoogleMapLocation errors={errors} formData={formData} googleMapData={{ latitude: formData.latCoordinage, longitude: formData.langCoordinagee }} setFormData={setFormData} />
                    </Grid> */}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Button variant='contained' size='large' fullWidth onClick={handleSubmit}>
                            Approve Story
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default StoryApprove
