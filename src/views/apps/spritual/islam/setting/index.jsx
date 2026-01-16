'use client'

import { useEffect, useState } from 'react'
import { Grid, Typography, Card, Button, Autocomplete } from '@mui/material'
import FileUploader from './components/FileUploader'
import ImageService from '@/services/imageService'
import CustomTextField from '@/@core/components/mui/TextField'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { useAuth } from '@/contexts/AuthContext'
import IslamSettingService from '@/services/spritual/islamSetting'
import ImageCropDialog from '@/components/dialogs/image-crop'
import { ORIENTATION_TO_ANGLE, getRotatedImage, getCroppedImg } from '@/utils/canvasUtils'
import { getOrientation } from 'get-orientation/browser'
import { set } from 'date-fns'
import { m } from 'framer-motion'

const IslamSetting = () => {
    const { hasPermission } = useAuth()
    const [loading, setLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    const [SearchData, setSearchData] = useState([])
    const [uploadingStatus, setUploadingStatus] = useState({});

    const [zoom, setZoom] = useState(1)
    const [cropSize, setCropSize] = useState({ width: 400, height: 100 })

    // Image cropping states
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [imageCropDialogOpen, setImageCropDialogOpen] = useState(false)
    const [currentCropContext, setCurrentCropContext] = useState(null) // To track what's being cropped
    const [rotation, setRotation] = useState(0) // Add rotation state

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const showCroppedImage = async () => {
        try {
            const croppedImageUrl = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )

            return croppedImageUrl
        } catch (e) {
            console.error('Error cropping image:', e)
            throw e
        }
    }

    const handleClose = () => {
        setImageCropDialogOpen(false)
        setImageSrc(null)
        setCurrentCropContext(null)
        setCrop({ x: 0, y: 0 })
        setCroppedAreaPixels(null)
        setZoom(1)
    }

    const handleCropConfirm = async (croppedImage) => {
        if (!croppedImage) {
            console.error('No cropped image available for upload')
            return
        }
        if (!currentCropContext) {
            console.error('No crop context available to determine where to upload the image')
            return
        }
        if (!croppedImage || !currentCropContext) return

        try {
            const { section, key, type, dataKey, index } = currentCropContext

            // Convert cropped image to File object for upload
            const response = await fetch(croppedImage)
            const blob = await response.blob()
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

            // Upload the cropped image
            const formData = new FormData()
            formData.append('image', file)
            const uploaded = await ImageService.uploadImage(formData)

            // Update the appropriate state based on context
            if (section === 'chants') {
                handleChantChange(key, type, uploaded.data.url)
            } else if (section === 'ad_slider') {
                const updatedAds = [...settings.ad_slider]
                updatedAds[index] = { ...updatedAds[index], image: uploaded.data.url }
                setSettings(prev => ({ ...prev, ad_slider: updatedAds }))
            } else if (dataKey) {
                handleImageChange(section, dataKey, type, uploaded.data.url)
            } else {
                handleSimpleImageChange(section, type, uploaded.data.url)
            }

            handleClose()
        } catch (error) {
            console.error('Error uploading cropped image:', error)
        }
    }


    const [inputValue, setInputValue] = useState('')

    const defaultImage = { web_image: '', mobile_image: '' }
    const defaultChant = { title: '', audioURL: '', web_image: '', mobile_image: '' }

    const [settings, setSettings] = useState({
        home: { ...defaultImage },
        home_page: { ...defaultImage },
        featured: {
            sifat: { ...defaultImage },
            tasbih: { ...defaultImage },
            qibla: { ...defaultImage },
            duas: { ...defaultImage },
            mosque: { ...defaultImage },
            maqaah_live: { ...defaultImage },
        },
        donation: { ...defaultImage, link: '' },
        makkah_live_url: '',
    })

    const fetchSettings = async () => {
        try {
            const response = await IslamSettingService.getSettings()
            console.log('Fetched settings:', response);

            if (response) {
                const { _id, updatedAt, updatedBy, createdBy, createdAt, updatedByModel, _v, ...rest } = response.data
                setSettings(rest)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }
    console.log('settings:', settings);


    useEffect(() => {
        fetchSettings()
    }, [])

    const setUploaderLoading = (key, value) => {
        setUploadingStatus(prev => ({ ...prev, [key]: value }));
    };

    const isUploaderLoading = (key) => uploadingStatus[key] || false;


    const handleImageChange = (section, key, type, url) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: {
                    ...prev[section][key],
                    [type]: url,
                },
            },
        }))
    }

    const handleSimpleImageChange = (section, type, url) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [type]: url,
            },
        }))
    }

    const handleChantChange = (tab, field, value) => {
        setSettings(prev => ({
            ...prev,
            chants: {
                ...prev.chants,
                [tab]: {
                    ...prev.chants[tab],
                    [field]: value,
                },
            },
        }))
    }

    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const onImageSelect = async (file, cropContext) => {
        let imageDataUrl = await readFile(file)

        try {
            // apply rotation if needed
            const orientation = await getOrientation(file)
            const rotationAngle = ORIENTATION_TO_ANGLE[orientation]
            if (rotationAngle) {
                imageDataUrl = await getRotatedImage(imageDataUrl, rotationAngle)
            }
            setRotation(rotationAngle || 0)
        } catch (e) {
            console.warn('failed to detect the orientation')
            setRotation(0)
        }

        setImageSrc(imageDataUrl)
        setCurrentCropContext(cropContext)
        console.log('Current crop context:', cropContext);

        switch (cropContext.fieldKey) {
            case 'tab1_mobile_image':
                setCropSize({ width: 400, height: 300 });
                break;
            case 'tab2_mobile_image':
                setCropSize({ width: 800, height: 300 });
                break;
            case 'festival_mobile_image':
            case 'festival_web_image':
            case 'dharmik_gyaan_mobile_image':
            case 'dharmik_gyaan_web_image':
            case 'mandir_page_mobile_image':
            case 'mandir_page_web_image':
                setCropSize({ width: 400, height: 300 });
                break;
            default:
                setCropSize({ width: 400, height: 300 });
        }
        // if (cropContext.section === 'featured') {
        //     setCropSize({ width: 400, height: 400 });
        // }
        // if (cropContext.section === 'chants') {
        //     setCropSize({ width: 400, height: 200 });
        // }
        // if (cropContext.section === 'ad_slider') {
        //     setCropSize({ width: 400, height: 150 });

        // }

        setImageCropDialogOpen(true);
    }

    const renderImageFields = (section, dataKey) =>
        ['web_image', 'mobile_image'].map(type => {
            const fieldKey = dataKey ? `${section}_${dataKey}_${type}` : `${section}_${type}`;
            console.log(section)
            console.log(dataKey);
            return (
                <Grid item xs={12} sm={6} key={fieldKey}>
                    <FileUploader
                        key={fieldKey}
                        label={type === 'web_image' ? 'Web Image' : 'Mobile Image'}
                        initialFile={settings[section][type] || settings[section][dataKey]?.[type]}
                        imageUploading={isUploaderLoading(fieldKey)}
                        setImageUploading={(val) => setUploaderLoading(fieldKey, val)}
                        onFileSelect={async (file) => {
                            if (file) {
                                const cropContext = {
                                    section,
                                    key: dataKey,
                                    type,
                                    dataKey,
                                    fieldKey
                                }
                                onImageSelect(file, cropContext)
                            }
                        }}
                    />
                </Grid>
            );
        });


    const handleSubmit = async () => {
        setLoading(true)
        try {
            // Add your submit logic here, e.g., send `settings` data to backend API

            console.log('Submitting settings:', settings)
            await IslamSettingService.updateSettings(settings)
            // await api.submitSettings(settings)
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            try {
                const response = await CouponRoute.getSearchBusiness({ search: searchValue })
                setSearchData(response.data || [])
            } catch (error) {
                setSearchData([])
            }
        } else {
            setSearchData([])
        }
    }



    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h4">Islam Settings</Typography>
            </Grid>

            {/* Home Section */}
            <Grid item xs={12}>
                <Card className="p-4">
                    <Typography variant="h6">Icons</Typography>
                    <Grid container spacing={2}>
                        {renderImageFields('home')}
                    </Grid>
                </Card>
            </Grid>
            {/* Home Section */}
            <Grid item xs={12}>
                <Card className="p-4">
                    <Typography variant="h6">Home Page</Typography>
                    <Grid container spacing={2}>
                        {renderImageFields('home_page')}
                    </Grid>
                </Card>
            </Grid>


            {/* Featured Sections */}
            <Typography variant="h6">Featured Sections</Typography>
            {Object.keys(settings.featured).map(key => (
                <Grid item xs={12} key={key}>
                    <Card className="p-4">
                        <Typography variant="h6">{key.replaceAll('_', ' ').toUpperCase()}</Typography>
                        <Grid container spacing={2}>
                            {renderImageFields('featured', key)}
                        </Grid>
                    </Card>
                </Grid>
            ))}


            {/* Additional Pages */}

            {['donation'].map((section) => (
                <Grid item xs={12} key={section}>
                    <Card className="p-4">
                        <Typography variant="h6">{section.replaceAll('_', ' ').toUpperCase()}</Typography>
                        <Grid container spacing={2}>
                            {renderImageFields(section)}
                        </Grid>
                        <CustomTextField
                            label="Link"
                            value={settings[section].link || ''}
                            onChange={(e) => handleSimpleImageChange(section, 'link', e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Card>

                </Grid>
            ))}
            <Grid item xs={12} key={'makkah_live_link'}>
                <Card className="p-4">
                    <Typography variant="h6">Makkah Live Link</Typography>
                    <CustomTextField
                        label="Link"
                        value={settings.makkah_live_url || ''}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            makkah_live_url: e.target.value
                        }))}
                        // onChange={(e) => handleSimpleImageChange(section, 'link', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
                {hasPermission('spiritual_islam_setting:edit') && <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading || imageUploading || Object.values(uploadingStatus).some(status => status)}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>}
            </Grid>
            {/* Image Crop Dialog */}
            <ImageCropDialog
                open={imageCropDialogOpen}
                imageSrc={imageSrc}
                crop={crop}
                setCrop={setCrop}
                onCropComplete={onCropComplete}
                handleClose={handleClose}
                showCroppedImage={showCroppedImage}
                onConfirm={handleCropConfirm}
                zoom={zoom}
                setZoom={setZoom}
                cropSize={cropSize}
            />
        </Grid>
    )
}

export default IslamSetting
