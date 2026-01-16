// React Imports
import { useEffect, useState, useRef, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, IconButton, debounce } from '@mui/material'
import SearchVendar from '@/services/utsav/banner/HomeBannerServices'
import GetPackages from "@/services/premium-listing/package.service"
import { toast } from 'react-toastify'
import { parseISO, isValid, intervalToDuration, addMonths, format, addDays } from 'date-fns'
import CustomTextField from '@core/components/mui/TextField'
import ImageCloud from '@/services/imageService'

const BasicDetail = ({ onsuccess, besicFormData, getKeyKeyword, handleNextClick, data }) => {
    const [formData, setFormData] = useState({
        vendorId: data.vendorId || '',
        bannerPackage: data.bannerPackage || '',
        perDayPrice: data.perDayPrice || '',
        publishDate: format(data.publishDate || new Date(), 'yyyy-MM'),
        validity: data.validity || '',
        image: data.image || ''
    })

    const [showInfo, setShowInfo] = useState(false)
    const [errors, setErrors] = useState({
        vendorId: '',
        bannerPackage: '',
        perDayPrice: '',
        image: ""
    })
    const [image, setImage] = useState(null)
    const [urlLoading, setUrlLoding] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [packages, setPackage] = useState([])
    const searchRef = useRef(null)
    const [keyword, setKyeword] = useState()

    useEffect(() => {
        getKeyKeyword(keyword)
    }, [keyword, getKeyKeyword])

    const debouncedSearch = useCallback(
        debounce(async (value) => {
            if (formData.vendor && value === formData.vendorId) {
                return;
            }

            if (!value || value.length <= 2) {
                setSearchResults([])
                setShowDropdown(false)
                return
            }

            try {
                const response = await SearchVendar.getsearch({ search: value })
                if (response && Array.isArray(response.data)) {
                    setSearchResults(response.data)
                    setShowDropdown(true)
                } else {
                    setSearchResults([])
                    setShowDropdown(false)
                }
            } catch (error) {
                toast.error('Failed to fetch search results')
                setSearchResults([])
                setShowDropdown(false)
            }
        }, 500),
        [formData.vendor, formData.vendorId]
    );

    // This useEffect will run when formData.vendorId is available and not empty
    useEffect(() => {
        if (formData.vendorId) {
            setShowInfo(true); // Set showInfo to true when vendorId is available
        } else {
            setShowInfo(false); // Optionally set to false if vendorId becomes empty
        }
    }, [formData.vendorId]);


    const validateForm = () => {
        const newErrors = {}
        const { vendorId, bannerPackage, perDayPrice, image } = formData

        // Vendor ID validation
        if (!vendorId) newErrors.vendorId = 'Vendor ID or Mobile Number is required'
        else if (!/^(\d{10}|[a-zA-Z0-9]+)$/.test(vendorId.toString().trim())) {
            newErrors.vendorId = 'Enter a valid mobile number (10 digits) or ID'
        }

        // Banner Package validation
        if (!bannerPackage) newErrors.bannerPackage = 'Banner package is required'

        // Per Day Price validation
        if (!perDayPrice) newErrors.perDayPrice = 'Per day price is required'
        else if (isNaN(perDayPrice) || Number(perDayPrice) <= 0) {
            newErrors.perDayPrice = 'Please enter a valid positive number'
        }

        // Image validation
        if (!image) newErrors.image = 'Please upload an image'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const UploadImage = async (image) => {
        setUrlLoding(true)
        const formData = new FormData()

        formData.append('image', image)
        try {
            const Image = await ImageCloud.uploadImage(formData)
            setFormData(prev => ({
                ...prev,
                image: Image.data.url
            }))
        } catch (error) {
            toast.error('Failed to upload image')
        } finally {
            setUrlLoding(false)
        }
    }

    const handleSave = () => {

        besicFormData(formData)
        if (onsuccess) {
            onsuccess()
        }

    }

    const handleSaveAndNext = () => {
        handleNextClick()
        handleSave()
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }






    const handlePackageChange = (e) => {
        const selectedPackage = packages.find(pkg => pkg.name === e.target.value)

        if (selectedPackage) {
            try {
                const today = new Date();
                // Start from today's date, not the first day of the month
                const publishDateStart = new Date(today);
                const validityDateNum = Number(selectedPackage?.valideDate);
                const validityDays = validityDateNum;
                const expiryDate = addDays(publishDateStart, validityDays);
                if (!isValid(expiryDate)) {
                    throw new Error('Invalid expiry date calculation');
                }

                const formattedStart = format(publishDateStart, 'dd-MMM-yyyy');
                const formattedEnd = format(expiryDate, 'dd-MMM-yyyy'); // Use expiryDate here, not validityDateNum
                const validityDateRange = `${formattedStart}  To  ${formattedEnd}`;
                setFormData(prev => ({
                    ...prev,
                    bannerPackage: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: selectedPackage?.valideDate
                }));

                // ...rest of your code
            } catch (error) {
                toast.error('Failed to calculate package dates');
                setFormData(prev => ({
                    ...prev,
                    bannerPackage: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: 'Invalid date range'
                }));
            }

        } else {
            // If package not found, clear perDayPrice and set bannerPackage anyway
            setFormData(prev => ({
                ...prev,
                bannerPackage: e.target.value,
                perDayPrice: '',
                validity: ''
            }))
        }
    }


    const handleVendorSelect = (item) => {
        setKyeword(item?.keywords)
        setFormData(prev => ({
            ...prev,
            vendorId: item.vendorId,
            vendor:item._id,
            companyName: item?.companyInfo?.companyName || '',
            phoneNo: item?.contactInfo?.phoneNo || '',
            email: item?.contactInfo?.email || '',
            metaCategory: item?.companyInfo?.businessCategory?.name || '',
            businessStatus: item?.companyInfo?.businessCategory?.status || ''
        }))
        setShowDropdown(false)
        setSearchResults([])
        setShowInfo(true)
    }

    useEffect(() => {
        const fetchVendorKeywords = async () => {
            if (!formData.vendorId || keyword) return;

            try {
                const response = await SearchVendar.getsearch({ search: formData.vendorId });
                const selectedItem = response?.data?.find(item => item.vendorId === formData.vendorId);

                if (selectedItem) {
                    setFormData(prev => ({
                        ...prev,
                        vendor: selectedItem._id,
                        companyName: selectedItem?.companyInfo?.companyName || '',
                        phoneNo: selectedItem?.contactInfo?.phoneNo || '',
                        email: selectedItem?.contactInfo?.email || '',
                        metaCategory: selectedItem?.companyInfo?.businessCategory?.name || '',
                        businessStatus: selectedItem?.companyInfo?.businessCategory?.status || ''
                    }));

                    if (selectedItem.keywords) {
                        setKyeword(selectedItem.keywords);
                    }
                    setShowInfo(true);
                } else if (data.keywords) {
                    setKyeword(data.keywords);
                }
            } catch (error) {
                console.error("Error auto-fetching vendor keywords:", error);
            }
        };

        fetchVendorKeywords();
    }, [formData.vendorId, keyword, data.keywords]);


    const getPackage = async () => {
        try {
            const Packages = await GetPackages.getAllPackage()
            setPackage(Packages?.data || [])
        } catch (error) {
            console.error('Error fetching packages:', error)
            setPackage([])
        }
    }

    useEffect(() => {
        getPackage()
    }, [])

    return (
        <Card className='shadow-none'>
            <CardContent>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Enter Parent ID or Mobile Number"
                            placeholder="Search Business "
                            value={formData.vendorId}
                            onChange={(e) => {
                                const value = e.target.value
                                handleChange('vendorId', value)
                                debouncedSearch(value)
                            }}
                            error={!!errors.vendorId}
                            helperText={errors.vendorId}
                            inputRef={searchRef}
                        />
                    </Grid>
                    {showDropdown && searchResults.length > 0 && (
                        <Paper
                            style={{
                                position: 'absolute',
                                zIndex: 999,
                                width: searchRef.current ? searchRef.current.offsetWidth : '100%',
                                maxHeight: 200,
                                overflowY: 'auto',
                                marginTop: '40px'
                            }}
                            elevation={3}
                        >
                            {searchResults.map((item, index) => (
                                <Box
                                    key={index}
                                    p={1.5}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f0f0f0' },
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                        alignItems: 'center'
                                    }}
                                    onClick={() => handleVendorSelect(item)}
                                >
                                    <Typography variant="body2" sx={{ width: '30%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.vendorId}
                                    </Typography>
                                    <Typography variant="body2" sx={{ width: '30%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item?.contactInfo?.phoneNo ? `(${item.contactInfo.phoneNo})` : ''}
                                    </Typography>
                                    <Typography variant="body2" sx={{ width: '40%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item?.companyInfo?.companyName || 'N/A'}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}

                    {showInfo && (
                        <Card className='w-full p-10 flex flex-col'>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <Divider className='my-6' />
                                <Typography variant='h6' className='mb-4'>Display Info</Typography>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Vendor ID</Typography>
                                    <Typography variant="body1">{formData.vendorId}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Mobile</Typography>
                                    <Typography variant="body1">{formData.phoneNo}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Business Name</Typography>
                                    <Typography variant="body1">{formData.companyName}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Email ID</Typography>
                                    <Typography variant="body1">{formData.email}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Meta Category</Typography>
                                    <Typography variant="body1">{formData.metaCategory}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                    <Typography variant="subtitle2" className='font-bold'>Business Status</Typography>
                                    <Typography variant="body1">{formData.businessStatus}</Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    )}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            className="text-start"
                            select
                            fullWidth
                            label="Banner Package"
                            value={formData.bannerPackage}
                            onChange={handlePackageChange}
                            error={!!errors.bannerPackage}
                            helperText={errors.bannerPackage}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: formData.bannerPackage !== "" ? undefined : () => "Select Package"
                            }}
                        >
                            <MenuItem value="">Select Package</MenuItem>
                            {packages.map((item) => (
                                <MenuItem className='px-5' key={item._id || item.name} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Per Day Price"
                            value={formData.perDayPrice}
                            onChange={e => handleChange('perDayPrice', e.target.value)}
                            type="number"
                            disabled
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Validity"
                            value={formData.validity ? `${formData.validity} Days` : ''}
                            disabled
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box className="flex items-center gap-4">
                            <Button
                                variant="outlined"
                                component="label"
                                className={`${!image ? 'mt-4' : ''}`}
                            >
                                Upload Banner
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            setImage(file)
                                            UploadImage(file)
                                            if (errors.image) {
                                                setErrors(prev => ({ ...prev, image: '' }))
                                            }
                                        }
                                    }}
                                />
                            </Button>

                            {(image || formData.image) && (
                                <Box className="relative">
                                    <Box
                                        className="rounded-md overflow-hidden border"
                                        sx={{ width: 80, height: 80 }}
                                    >
                                        <img
                                            src={formData.image || null}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setImage(null)
                                            handleChange('image', '')
                                        }}
                                        disableRipple
                                        className="absolute top-5 right-5 bg-white"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        {errors.image && (
                            <Typography color="error" variant="caption" className="mt-1 text-red-600 text-start">
                                {errors.image}
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>

                        <Button
                            variant="contained"
                            color="primary"
                            disabled={formData.vendorId === '' || formData.bannerPackage === '' || formData.perDayPrice === '' || !formData.image || urlLoading || formData.validity === ''}

                            onClick={handleSaveAndNext}
                        >
                            Save & Next
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default BasicDetail
