// React Imports
import { useEffect, useState, useRef } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper } from '@mui/material'
import Vendors from '@/services/posts/post.service'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import ReadGoogleMapLocation from '@/components/dialogs/posts/ReadOnlyLocution'

const Approve = ({ EditSelectedPost, onsuccess, getData }) => {
    const [formData, setFormData] = useState({
        images: [],
        imgSrcList: [],
        description: '',
        chooseType: '',
        status: 'PENDING',
        chooseTypeId: '',
        locution: '',
        Visibility: '',
        locutionkm: '',
        latCoordinate: '',
        langCoordinate: ''
    })
    // State for vendor data and search
    const [vendorData, setVendorData] = useState([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [vendorDetail, setVendorDetail] = useState(null)

    // Initialize form data when EditSelectedPost changes
    useEffect(() => {
        if (EditSelectedPost) {
            const images = EditSelectedPost.media || []
            const imgSrcList = images.map(img => {
                if (typeof img === 'string') {
                    return img.includes('http') ? img : `${process.env.NEXT_PUBLIC_URL}/${img}`
                }
                return img.url ? (img.url.includes('http') ? img.url : `${process.env.NEXT_PUBLIC_URL}/${img.url}`) : ''
            })
            setFormData({
                images: images,
                imgSrcList: imgSrcList,
                description: EditSelectedPost.description || '',
                chooseType: EditSelectedPost.chooseType || '',
                status: EditSelectedPost.status || 'PENDING',
                // chooseTypeId: EditSelectedPost.chooseTypeId?.gurudwara_id||EditSelectedPost.chooseTypeId.temple_id || '',
                locution: EditSelectedPost.locution || '',
                Visibility: EditSelectedPost.Visibility || '',
                locutionkm: EditSelectedPost.locutionkm || '',
                latCoordinate: EditSelectedPost.latCoordinage || '',
                langCoordinate: EditSelectedPost.langCoordinagee || '',
            })
            setQuery(EditSelectedPost.chooseTypeId?.vendorId)
            setVendorDetail(EditSelectedPost.chooseTypeId?._id)
            // Set lat/lng for map

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

    // Fetch vendor details
    const handleGetVendorDetail = async (id) => {
        try {
            const result = await Vendors.getVendarDetails(id)
            setVendorDetail(result.data)
        } catch (error) {
            toast.error('Failed to fetch vendor details')
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
                const match = item.vendorId.toLowerCase().includes(query.toLowerCase())
                return match
            })
            setResults(filtered)
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [query])

    // Handle form submission
    const handleSubmit = async () => {
        const data = {
            status: formData.status
        }
        try {
            const result = await Vendors.approveBy(EditSelectedPost._id, data)
            onsuccess(false)
            getData()
            toast.success(result.message)

        } catch (error) {
            console.error('Error:', error)
            const errorMessage =
                error.response?.data?.message || error.message || 'Something went wrong'
            toast.error(errorMessage)
        }

    }
    const [errors, setErrors] = useState({
        chooseType: '',
        description: '',
        status: '',
        chooseTypeId: '',
        locution: '',
        Visibility: '',
        locutionkm: ''
    })
    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Approve Post
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
                                                className="w-full h-full object-cover hover:scale-150 transition-transform duration-1000 "

                                            />
                                        ) : (
                                            <video
                                                src={isExistingImage ? src : URL.createObjectURL(file)}
                                                controls
                                                className="w-full h-full object-cover hover:scale-150 transition-transform duration-1000 "
                                            />
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
                            label='Description'
                            placeholder='Enter Description'
                            disabled
                            value={formData.description}
                            multiline
                            rows={4}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}


                        />
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
                            label='Status'
                            className='text-start'
                            select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}

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
                                disabled
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
                                    <Typography variant='subtitle1' fontWeight={500} disabled>
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
                        <Button variant="contained" size="large" fullWidth onClick={handleSubmit}>
                            {formData.status.charAt(0).toUpperCase() + formData.status.slice(1).toLowerCase()} Post
                        </Button>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Approve
