// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper} from '@mui/material'
// Third-party Imports
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import Story from '@/services/posts/story.service'
import getVendor from '@/services/utsav/banner/HomeBannerServices'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../../DialogCloseButton'
import GoogleMapLocation from '../GoogleLocution'

const EditStory = ({ EditSelectedStory, onsuccess, getData }) => {

    // State for vendor data and search
    const [vendorData, setVendorData] = useState([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [vendorDetail, setVendorDetail] = useState(null)

    // Form data state
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

    // Error state
    const [errors, setErrors] = useState({
        chooseType: '',
        status: '',
        chooseTypeId: '',
        locution: '',
        Visibility: '',
        locutionkm: ''
    })

    // Google Maps state
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [imageLoader, setimageLoader] = useState(false)
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
                chooseTypeId: EditSelectedStory.chooseTypeId?._id || '',
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
             setQuery(EditSelectedStory.chooseTypeId?.vendorId||EditSelectedStory.chooseTypeId?.gurudwara_id||EditSelectedStory.chooseTypeId?.temple_id||EditSelectedStory.chooseTypeId?.mosque_id ||"Admin")
            setVendorDetail(EditSelectedStory.chooseTypeId?._id)
        }
    }, [EditSelectedStory])

    // Fetch vendor data
    useEffect(() => {
        const GetVendar = async () => {
            const data = { search: query };
            const SearchVendar = await getVendor.getsearch(data);
            setVendorData(SearchVendar.data);
        };

        if (query?.trim()) {
            GetVendar();
        }
    }, [query]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!query || query?.trim() === '') {
                setResults([]);
                return;
            }


            const filtered = vendorData.filter(item => {
                return (
                    item.vendorId.toLowerCase().includes(query.toLowerCase()) ||
                    item.companyInfo?.companyName?.toLowerCase().includes(query.toLowerCase()) ||
                    item.contactInfo?.phoneNo?.toLowerCase().includes(query.toLowerCase())
                )
            })

            setResults(filtered)
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [query, vendorData])

    // Handle vendor detail selection
    const handleGetVendorDetail = (id) => {
        const selectedVendor = vendorData.find(item => item._id === id)
        setVendorDetail(selectedVendor)
    }
    // Handle file upload
    const handleFileChange = async (event) => {
        const files = event.target.files
        const updatedFiles = Array.from(files)
        const newImageSrcList = []
        let isValid = true
        let errorMessages = []

        updatedFiles.forEach(file => {
            const fileType = file.type
            const fileSize = file.size

            if (fileType.startsWith('image') && fileSize > 5 * 1024 * 1024) {
                isValid = false
                errorMessages.push(`${file.name} exceeds the 5MB size limit for images.`)
            }

            if (fileType.startsWith('video') && fileSize > 50 * 1024 * 1024) {
                isValid = false
                errorMessages.push(`${file.name} exceeds the 50MB size limit for videos.`)
            }

            if (isValid) {
                newImageSrcList.push(URL.createObjectURL(file))
            }
        })

        setimageLoader(true)

        const ImageURL = await Image.uploadMultipleImage(updatedFiles)

        console.log(ImageURL.data)
        ImageURL.data.map((url) => {
            setFormData(prev => ({
                ...prev,
                imgSrcList: [...prev.imgSrcList, url?.url],
                images: [...prev.images, url?.url],
            }))
        })
        setimageLoader(false)
    }

    // Handle image reset
    const handleResetImages = () => {
        setFormData(prev => ({ ...prev, imgSrcList: [], images: [] }))
    }

    // Handle single image delete
    const handleSingleDelete = idx => {
        setFormData(prev => ({
            ...prev,
            imgSrcList: prev.imgSrcList.filter((_, index) => index !== idx),
            images: prev.images.filter((_, index) => index !== idx)
        }))
    }

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
        if (validateForm()) {
            try {
                console.log(formData,"formDataformData");
                

                const id = EditSelectedStory._id
                const result = await Story.updateStory(id, formData)
                onsuccess(false)
                getData()
                toast.success(result.message)

            } catch (error) {

                const errorMessage =
                    error.response?.data?.message || error.message || 'Something went wrong'
                toast.error(errorMessage)
            }
        } else {
            toast.error('Please fix the errors.')
        }
    }

    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Edit Story
                </Typography>

                <Grid container spacing={6}>
                    {/* File Upload Section */}
                    <Grid size={{ xs: 12 }}>
                        <div className='flex flex-grow flex-col gap-4 text-start'>
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' variant='contained'>
                                    Upload Photos & Videos
                                    <input
                                        type='file'
                                        accept='image/png, image/jpeg, video/mp4, video/webm, video/ogg'
                                        multiple
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Button variant='outlined' color='error' onClick={handleResetImages}>
                                    Delete all
                                </Button>
                            </div>
                            <Typography variant='body2'>
                                Allowed formats: JPG, GIF, PNG, MP4, WebM, or OGG. Maximum image size: 1MB. Maximum
                                video size: 50MB each.
                            </Typography>
                        </div>
                    </Grid>

                    {/* Media Preview Section */}
                    <Grid size={{ xs: 12 }}>
                        <div className='flex flex-wrap gap-4'>
                            {formData.imgSrcList.map((item, idx) => {
                                const url = typeof item === 'string' ? item : item.url;
                                const type = typeof item === 'string'
                                    ? url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) ? 'image'
                                        : url.match(/\.(mp4|webm|ogg)$/i) ? 'video'
                                            : 'unknown'
                                    : item.type;

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
                                            justifyContent: 'center',
                                            backgroundColor: item.loading ? '#f5f5f5' : 'transparent'
                                        }}
                                    >
                                        <DialogCloseButton
                                            className="absolute right-10 top-10 z-40"
                                            onClick={() => handleSingleDelete(idx)}
                                            disableRipple
                                        >
                                            <i className='tabler-x' />
                                        </DialogCloseButton>

                                        {type === 'image' ? (
                                            <img
                                                src={url}
                                                alt={`Upload ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : type === 'video' ? (
                                            <video
                                                src={url}
                                                controls
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ padding: '8px', textAlign: 'center' }}>
                                                <i className='tabler-file' style={{ fontSize: '24px' }} />
                                                <div style={{ fontSize: '12px', marginTop: '4px' }}>Unsupported file</div>
                                            </div>
                                        )}
                                    </div>
                                );
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
                            {/* <MenuItem value='Admin'>Happening Bazaar</MenuItem> */}
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
                            disabled
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            error={!!errors.status}
                            helperText={errors.status}
                        ></CustomTextField>
                    </Grid>

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
                            />

                            {/* Search Results */}
                            {!formData.chooseTypeId && results.length > 0 && (
                                <Paper
                                    elevation={3}
                                    sx={{
                                        mt: 1,
                                        maxHeight: 200,
                                        overflow: 'auto',
                                        borderRadius: 1
                                    }}
                                >
                                    {results.map(item => (
                                        <MenuItem
                                            key={item._id}
                                            onClick={() => {
                                                setQuery(item.vendorId);
                                                setResults([]);
                                                setFormData(prev => ({ ...prev, chooseTypeId: item._id }));
                                                setVendorDetail(item);
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
                                                <Typography variant="body1" fontWeight={500} className='text-start'>
                                                    <strong>Business Id :</strong> {item.vendorId}
                                                </Typography>
                                                {item.companyInfo?.companyName && (
                                                    <Typography variant="body2" color="text.secondary" className='text-start'>
                                                        <strong>BusinessName :</strong>  {item.companyInfo.companyName}
                                                    </Typography>
                                                )}
                                                {item.contactInfo?.phoneNo && (
                                                    <Typography variant="body2" color="text.secondary" className='text-start'>
                                                        <strong>Phone :</strong> {item.contactInfo.phoneNo}
                                                    </Typography>
                                                )}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Paper>
                            )}

                        </Grid>
                    )}
                    {/* Google Maps Section */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <GoogleMapLocation formData={formData} errors={errors} googleMapData={{ latitude: formData.latCoordinate, longitude: formData.langCoordinate }} setFormData={setFormData} />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Button variant='contained' disabled={imageLoader} size='large' fullWidth onClick={handleSubmit}>
                            Update Story
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EditStory
