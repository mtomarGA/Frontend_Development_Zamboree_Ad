'use client'

import { useEffect, useState } from 'react'
import { Grid, Typography, Card, Button, Autocomplete, IconButton, Box, styled } from '@mui/material'
import FileUploader from './components/FileUploader'
import ImageService from '@/services/imageService'
import CustomTextField from '@/@core/components/mui/TextField'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { set } from 'date-fns'
import hinduSettingService from '@/services/spritual/hinduSetting'
import MusicPlayerSlider from '../../components/MusicPlayer'
import { useAuth } from '@/contexts/AuthContext'
import { ORIENTATION_TO_ANGLE, getRotatedImage, getCroppedImg } from '@/utils/canvasUtils'
import ImageCropDialog from '@/components/dialogs/image-crop'
import { getOrientation } from 'get-orientation/browser'
import SikhSettingService from '@/services/spritual/sikhSetting'


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const SikhSetting = () => {
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
            const { section, key, type, dataKey, index, bannerIndex } = currentCropContext

            // Convert cropped image to File object for upload
            const response = await fetch(croppedImage)
            const blob = await response.blob()
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

            // Upload the cropped image
            const formData = new FormData()
            formData.append('image', file)
            const uploaded = await ImageService.uploadImage(formData, { folder: `Spiritual/Buddhism/Setting` })

            // Update the appropriate state based on context
            if (section === 'chants') {
                const updatedChants = [...settings.chants]
                updatedChants[key] = { ...updatedChants[key], [type]: uploaded.data.url }
                setSettings(prev => ({ ...prev, chants: updatedChants }))
            } else if (section === 'ad_slider') {
                const updatedAds = [...settings.ad_slider]
                updatedAds[index] = { ...updatedAds[index], image: uploaded.data.url }
                setSettings(prev => ({ ...prev, ad_slider: updatedAds }))
            } else if (bannerIndex !== undefined) {
                // Handle array-based sections (mandir_page, aarti_chalisa, etc.)
                const updatedBanners = [...settings[section]]
                updatedBanners[bannerIndex] = { ...updatedBanners[bannerIndex], [type]: uploaded.data.url }
                setSettings(prev => ({ ...prev, [section]: updatedBanners }))
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
        sikhism_page: [{ ...defaultImage }],
        chants: [{ ...defaultChant }],
        featured: {
            // 'gurudwara', "nitnem" , "sikh_guru" , "guru_grant_sahib", "guru_sakhi", 'festival'

            gurudwara: { ...defaultImage },
            nitnem: { ...defaultImage },
            sikh_guru: { ...defaultImage },
            guru_grant_sahib: { ...defaultImage },
            guru_sakhi: { ...defaultImage },
            festival: { ...defaultImage },
            live_darshan: { ...defaultImage },
        },
        ad_slider: [],
        gurudwara : [{ ...defaultImage }],
        nitnem : [{ ...defaultImage }],
        live_darshan : [{ ...defaultImage }],
        sikh_guru : [{ ...defaultImage }],
        guru_grant_sahib : [{ ...defaultImage }],
        guru_sakhi : [{ ...defaultImage }],
        festival : [{ ...defaultImage }],
    
    })
    const [businessDetails, setBusinessDetails] = useState([])

    const fetchSettings = async () => {
        try {
            const response = await SikhSettingService.get()
            console.log('Fetched settings:', response);

            if (response && response.data) {
                const { _id, updatedAt, updatedBy, createdBy, createdAt, updatedByModel, _v, ...rest } = response.data

                // Helper function to ensure array format
                const ensureArray = (data, defaultItem) => {
                    if (!data) return [defaultItem];
                    if (Array.isArray(data)) return data.length > 0 ? data : [defaultItem];
                    // If it's an object (old format), convert to array
                    return [{ ...defaultItem, ...data }];
                };

                // Merge with default structure to ensure all fields exist
                const mergedSettings = {
                    home: { ...defaultImage, ...rest.home },
                    sikhism_page: ensureArray(rest.sikhism_page, defaultImage),
                    chants: ensureArray(rest.chants, defaultChant),
                    featured: {
                       gurudwara: { ...defaultImage, ...rest.featured?.gurudwara },
                       nitnem: { ...defaultImage, ...rest.featured?.nitnem },
                       sikh_guru: { ...defaultImage, ...rest.featured?.sikh_guru },
                       guru_grant_sahib: { ...defaultImage, ...rest.featured?.guru_grant_sahib },
                       guru_sakhi: { ...defaultImage, ...rest.featured?.guru_sakhi },
                       festival: { ...defaultImage, ...rest.featured?.festival },
                       live_darshan: { ...defaultImage, ...rest.featured?.live_darshan },
                    },
                    ad_slider: ensureArray(rest.ad_slider, { image: '', businessId: '' }),
                    gurudwara : ensureArray(rest.gurudwara, { ...defaultImage }),
                    nitnem : ensureArray(rest.nitnem, { ...defaultImage }),
                    sikh_guru : ensureArray(rest.sikh_guru, { ...defaultImage }),
                    guru_grant_sahib : ensureArray(rest.guru_grant_sahib, { ...defaultImage }),
                    guru_sakhi : ensureArray(rest.guru_sakhi, { ...defaultImage }),
                    festival : ensureArray(rest.festival, { ...defaultImage }),
                    live_darshan : ensureArray(rest.live_darshan, { ...defaultImage }),

                }

                setSettings(mergedSettings)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

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

    const handleChantChange = (index, field, value) => {
        setSettings(prev => {
            const updatedChants = [...prev.chants]
            updatedChants[index] = {
                ...updatedChants[index],
                [field]: value,
            }
            return {
                ...prev,
                chants: updatedChants,
            }
        })
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

        // Default crop size
        let newCropSize = { width: 400, height: 300 };

        // Set crop size based on section
        if (cropContext.section === 'featured') {
            newCropSize = { width: 400, height: 400 };
        } else if (cropContext.section === 'chants') {
            newCropSize = { width: 400, height: 200 };
        } else if (cropContext.section === 'ad_slider') {
            newCropSize = { width: 400, height: 150 };
        } else if (['mandir_page', 'aarti_chalisa', 'dharmik_gyaan', 'festival', 'articles', 'live_darshan'].includes(cropContext.section)) {
            newCropSize = { width: 400, height: 300 };
        }

        setCropSize(newCropSize);
        setImageCropDialogOpen(true);
    }


    const renderImageFields = (section, dataKey) => (
        <Grid container spacing={1}>
            {['web_image', 'mobile_image'].map(type => {
                const fieldKey = dataKey ? `${section}_${dataKey}_${type}` : `${section}_${type}`;
                const imageUrl = dataKey
                    ? settings[section]?.[dataKey]?.[type]
                    : settings[section]?.[type];

                return (
                    <Grid item xs={6} key={fieldKey}>
                        <FileUploader
                            key={fieldKey}
                            label={type === 'web_image' ? 'Web' : 'Mobile'}
                            initialFile={imageUrl}
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
            })}
        </Grid>
    );

    const handleSubmit = async () => {
        setLoading(true)
        try {
            console.log('Submitting settings:', settings)
            await SikhSettingService.update(settings)
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Sikh Settings</Typography>
            </Grid>

            {/* Home Section */}
            <Grid item xs={12}>
                <Card className="p-2">
                    <Typography variant="body1" className="mb-1 font-semibold">Home</Typography>
                    {renderImageFields('home')}
                </Card>
            </Grid>

            {/* Hinduism Page */}
            <Grid item xs={12}>
                <Card className="p-2">
                    <Grid container justifyContent={'space-between'} alignItems={'center'} className="mb-1">
                        <Typography variant="body1" className="font-semibold">Sikhism Page</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setSettings(prev => ({
                                    ...prev,
                                    sikhism_page: [...prev.sikhism_page, { ...defaultImage }]
                                }))
                            }}
                        >
                            Add Banner
                        </Button>
                    </Grid>
                    <Grid container spacing={1}>
                        {settings.sikhism_page.map((banner, bannerIndex) => (
                            <Card key={bannerIndex} className="p-1.5 mb-1.5 w-[max-content]" variant="outlined">
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs={12}>
                                        <Grid container justifyContent={'space-between'} alignItems={'center'}>
                                            <Typography variant="caption" className="font-medium">Banner {bannerIndex + 1}</Typography>
                                            {settings.sikhism_page.length > 1 && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {
                                                        const updated = [...settings.sikhism_page]
                                                        updated.splice(bannerIndex, 1)
                                                        setSettings(prev => ({ ...prev, sikhism_page: updated }))
                                                    }}
                                                >
                                                    <i className="tabler-trash text-base" />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                    {['web_image', 'mobile_image'].map(type => {
                                        const fieldKey = `sikhism_page_${bannerIndex}_${type}`;
                                        return (
                                            <Grid item xs={6} key={type}>
                                                <FileUploader
                                                    key={fieldKey}
                                                    label={type === 'web_image' ? 'Web' : 'Mobile'}
                                                    initialFile={banner[type]}
                                                    imageUploading={isUploaderLoading(fieldKey)}
                                                    setImageUploading={(val) => setUploaderLoading(fieldKey, val)}
                                                    onFileSelect={async (file) => {
                                                        if (file) {
                                                            const cropContext = {
                                                                section: 'sikhism_page',
                                                                type,
                                                                bannerIndex,
                                                                fieldKey
                                                            }
                                                            onImageSelect(file, cropContext)
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Card>
                        ))}</Grid>
                </Card>
            </Grid>

            {/* Featured Sections */}
            {/* add a tile to devide the section */}


            {Object.keys(settings.featured).map(key => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                    <Card className="p-2">
                        <Typography variant="body2" className="mb-1 font-semibold">{key.replaceAll('_', ' ').toUpperCase() + " Featured Icon"}</Typography>
                        {renderImageFields('featured', key)}
                    </Card>
                </Grid>
            ))}

            {/* Chant Tabs */}
            <Grid item xs={12}>
                <Card className="p-2">
                    <Grid container justifyContent={'space-between'} alignItems={'center'} className="mb-1">
                        <Typography variant="body1" className="font-semibold">Chants</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setSettings(prev => ({
                                    ...prev,
                                    chants: [...prev.chants, { ...defaultChant }]
                                }))
                            }}
                        >
                            Add Chant
                        </Button>
                    </Grid>
                    <Grid container spacing={1}>
                        {settings.chants.map((chant, chantIndex) => (
                            <Card key={chantIndex} className="p-2 mb-2 w-[50%]" variant="outlined">
                                <Grid container spacing={1}>
                                    {/* Header Row with Title and Delete */}
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item xs>
                                                <CustomTextField
                                                    type="text"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Chant title"
                                                    label={`Chant ${chantIndex + 1}`}
                                                    value={chant.title}
                                                    onChange={(e) => handleChantChange(chantIndex, 'title', e.target.value)}
                                                />
                                            </Grid>
                                            {settings.chants.length > 1 && (
                                                <Grid item>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            const updated = [...settings.chants]
                                                            updated.splice(chantIndex, 1)
                                                            setSettings(prev => ({ ...prev, chants: updated }))
                                                        }}
                                                    >
                                                        <i className="tabler-trash text-base" />
                                                    </IconButton>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>

                                    {/* Audio Upload */}
                                    <Grid item xs={12}>
                                        <Box className="flex items-center gap-2">
                                            <Typography variant="caption" className="text-gray-600 whitespace-nowrap min-w-[45px]">Audio:</Typography>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                size="small"
                                                className="text-xs py-1 px-2"
                                            >
                                                Upload Audio
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept="audio/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0]
                                                        if (!file) return
                                                        const formData = new FormData()
                                                        formData.append('image', file)
                                                        const uploaded = await ImageService.uploadImage(formData, { folder: "Spiritual/Buddhism/Setting" })
                                                        handleChantChange(chantIndex, 'audioURL', uploaded.data.url)
                                                    }}
                                                />
                                            </Button>
                                            {chant.audioURL && (
                                                <Typography variant="caption" className="text-green-600 font-medium">✓</Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Audio Player */}
                                    {chant.audioURL && (
                                        <Grid item xs={12}>
                                            <MusicPlayerSlider audioUrl={chant.audioURL} />
                                        </Grid>
                                    )}

                                    {/* Images */}
                                    {['web_image', 'mobile_image'].map(type => {
                                        const chantKey = `chant_${chantIndex}_${type}`;
                                        return (
                                            <Grid item xs={6} key={type}>
                                                <FileUploader
                                                    key={chantKey}
                                                    label={type === 'web_image' ? 'Web' : 'Mobile'}
                                                    initialFile={chant[type]}
                                                    imageUploading={isUploaderLoading(chantKey)}
                                                    setImageUploading={(val) => setUploaderLoading(chantKey, val)}
                                                    onFileSelect={async (file) => {
                                                        if (!file) return;
                                                        const cropContext = {
                                                            section: 'chants',
                                                            key: chantIndex,
                                                            type,
                                                            fieldKey: chantKey
                                                        }
                                                        onImageSelect(file, cropContext)
                                                    }}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Card>
                        ))} </Grid>
                </Card>
            </Grid>

            {/* Ad Slider */}
            <Grid item xs={12}>
                <Card className="p-2">
                    <Grid container justifyContent={'space-between'} item xs={12} className="mb-1">
                        <Typography variant="body1" className="font-semibold">Ad Slider</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setSettings(prev => ({
                                    ...prev,
                                    ad_slider: [...prev.ad_slider, { image: '', businessId: '' }]
                                }))
                            }}
                        >
                            Add Ad
                        </Button>
                    </Grid>
                    <Grid container spacing={1}>
                        {settings.ad_slider.map((ad, index) => {
                            const adKey = `ad_slider_${index}`;
                            return (
                                <Card key={adKey} className="p-1.5 m-1.5 w-[max-content]" variant="outlined">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item xs={12} className="flex justify-between items-center mb-1">
                                            <Typography variant="caption" className="font-medium">Ad {index + 1}</Typography>
                                            {settings.ad_slider.length > 1 && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {
                                                        const updatedAds = [...settings.ad_slider];
                                                        updatedAds.splice(index, 1);
                                                        setSettings(prev => ({ ...prev, ad_slider: updatedAds }));
                                                    }}
                                                >
                                                    <i className="tabler-trash text-base" />
                                                </IconButton>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FileUploader
                                                label={`Ad ${index + 1}`}
                                                initialFile={ad.image}
                                                imageUploading={isUploaderLoading(adKey)}
                                                setImageUploading={(val) => setUploaderLoading(adKey, val)}
                                                onFileSelect={async (file) => {
                                                    if (!file) {
                                                        //remove ad if no file is selected
                                                        const updatedAds = [...settings.ad_slider];
                                                        updatedAds.splice(index, 1);
                                                        setSettings(prev => ({ ...prev, ad_slider: updatedAds }));
                                                        return;
                                                    };
                                                    const cropContext = {
                                                        section: 'ad_slider',
                                                        index,
                                                        fieldKey: adKey
                                                    }
                                                    onImageSelect(file, cropContext)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {ad.businessId && (
                                                <Grid className="flex w-[max-content] items-center justify-between mt-2">
                                                    <Typography variant="body2">Business Name: {ad.businessId?.companyInfo?.companyName || businessDetails[index] || 'Unknown'}</Typography>
                                                    <IconButton onClick={() => {
                                                        const updatedAds = [...settings.ad_slider];
                                                        updatedAds[index] = { ...updatedAds[index], businessId: '' };
                                                        setSettings(prev => ({ ...prev, ad_slider: updatedAds }));
                                                    }}>
                                                        <i className="tabler-x" />
                                                    </IconButton>
                                                </Grid>
                                            )}
                                            {!ad.businessId && (
                                                <Autocomplete
                                                    className="w-96"
                                                    freeSolo
                                                    options={SearchData}
                                                    filterOptions={(options, state) => {
                                                        const input = state.inputValue.toLowerCase()
                                                        return options.filter((option) => {
                                                            const companyName = option.companyInfo?.companyName?.toLowerCase() || ''
                                                            const vendorId = option.vendorId?.toLowerCase() || ''
                                                            const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || ''
                                                            return (
                                                                companyName.includes(input) ||
                                                                vendorId.includes(input) ||
                                                                phoneNo.includes(input)
                                                            )
                                                        })
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.companyInfo?.companyName ||
                                                        option.vendorId ||
                                                        option.contactInfo?.phoneNo ||
                                                        ''
                                                    }
                                                    onInputChange={(event, newInputValue) => {
                                                        handleSearch(newInputValue)
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        if (newValue && newValue._id) {
                                                            const updatedAds = [...settings.ad_slider]
                                                            updatedAds[index].businessId = newValue._id
                                                            setSettings(prev => ({ ...prev, ad_slider: updatedAds }))
                                                            setBusinessDetails(prev => {
                                                                const updatedDetails = [...prev]
                                                                updatedDetails[index] = newValue.companyInfo.companyName
                                                                return updatedDetails
                                                            })
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            className='w-96'
                                                            label="Search Business"
                                                            variant="outlined"
                                                            placeholder="Type at least 3 characters"
                                                        />
                                                    )}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option._id}>
                                                            {option.companyInfo?.companyName} - {option.vendorId} - {option.contactInfo?.phoneNo}
                                                        </li>
                                                    )}
                                                    noOptionsText={
                                                        inputValue.length < 3
                                                            ? "Type at least 3 characters to search"
                                                            : "No businesses found"
                                                    }
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </Card>
                            );
                        })}
                    </Grid>
                </Card>
            </Grid>

            {/* Additional Pages */}
            {['gurudwara', "nitnem" , "sikh_guru" , "guru_grant_sahib", "guru_sakhi", 'festival', 'live_darshan'].map((section) => (
                <Grid item xs={12} key={section}>
                    <Card className="p-2">
                        <Grid container justifyContent={'space-between'} alignItems={'center'} className="mb-1">
                            <Typography variant="body1" className="font-semibold">{section.replaceAll('_', ' ').toUpperCase() + " Banners"}</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setSettings(prev => ({
                                        ...prev,
                                        [section]: [...prev[section], { ...defaultImage }]
                                    }))
                                }}
                            >
                                Add Banner
                            </Button>
                        </Grid>
                        <Grid container spacing={1}>
                            {settings[section].map((banner, bannerIndex) => (
                                <Card key={bannerIndex} className="p-1.5 mb-1.5 w-[max-content]" variant="outlined">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item xs={12}>
                                            <Grid container justifyContent={'space-between'} alignItems={'center'}>
                                                <Typography variant="caption" className="font-medium">Banner {bannerIndex + 1}</Typography>
                                                {settings[section].length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            const updated = [...settings[section]]
                                                            updated.splice(bannerIndex, 1)
                                                            setSettings(prev => ({ ...prev, [section]: updated }))
                                                        }}
                                                    >
                                                        <i className="tabler-trash text-base" />
                                                    </IconButton>
                                                )}
                                            </Grid>
                                        </Grid>
                                        {['web_image', 'mobile_image'].map(type => {
                                            const fieldKey = `${section}_${bannerIndex}_${type}`;
                                            return (
                                                <Grid item xs={6} key={type}>
                                                    <FileUploader
                                                        key={fieldKey}
                                                        label={type === 'web_image' ? 'Web' : 'Mobile'}
                                                        initialFile={banner[type]}
                                                        imageUploading={isUploaderLoading(fieldKey)}
                                                        setImageUploading={(val) => setUploaderLoading(fieldKey, val)}
                                                        onFileSelect={async (file) => {
                                                            if (file) {
                                                                const cropContext = {
                                                                    section,
                                                                    type,
                                                                    bannerIndex,
                                                                    fieldKey
                                                                }
                                                                onImageSelect(file, cropContext)
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Card>
                            ))}</Grid>
                    </Card>
                </Grid>
            ))}

            {/* Submit Button */}
            <Grid item xs={12}>
                {hasPermission('spiritual_sikh_setting:add') && <Button
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

export default SikhSetting
