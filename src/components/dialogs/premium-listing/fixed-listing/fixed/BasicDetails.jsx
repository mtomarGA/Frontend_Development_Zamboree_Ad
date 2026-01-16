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
import SearchVendar from '@/services/utsav/banner/HomeBannerServices' // Assuming this service has a method for single vendor lookup
import GetPackages from "@/services/premium-listing/paidPackage.service"
import { toast } from 'react-toastify'
import { parseISO, isValid, intervalToDuration, addMonths, format, addDays } from 'date-fns'
import CustomTextField from '@core/components/mui/TextField'

const BasicDetail = ({ onsuccess, besicFormData, getKeyKeyword, handleNextClick, data }) => {
    const [formData, setFormData] = useState({
        vendorId: data.vendorId || '',
        FixedListing: data.FixedListing || '',
        perDayPrice: data.perDayPrice || '',
        publishDate: format(data.publishDate || new Date(), 'yyyy-MM'),
        validity: data.validity || '',
        vendor: data.vendor || null,
        companyName: data.companyName || '',
        phoneNo: data.phoneNo || '',
        email: data.email || '',
        metaCategory: data.metaCategory || '',
        businessStatus: data.businessStatus || ''
    })

    const [showInfo, setShowInfo] = useState(!!data.vendor)
    const [errors, setErrors] = useState({
        vendorId: '',
        FixedListing: '',
        perDayPrice: '',
    })
    const [urlLoading, setUrlLoding] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [packages, setPackage] = useState([])
    const searchRef = useRef(null)
    const [keyword, setKyeword] = useState()

    // Memoize debouncedSearch to prevent re-creation on every render
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

    // Effect for triggering search based on formData.vendorId (for user input)
    useEffect(() => {
        if (!formData.vendor || (formData.vendor && formData.vendorId !== data.vendorId)) {
            debouncedSearch(formData.vendorId);
        } else if (formData.vendor && data.vendorId && !showInfo) {
            setShowInfo(true);
        }
    }, [formData.vendorId, formData.vendor, data.vendorId, debouncedSearch, showInfo]);

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

    useEffect(() => {
        getKeyKeyword(keyword)
    }, [keyword, getKeyKeyword])


    const validateForm = () => {
        const newErrors = {}
        const { vendorId, FixedListing, perDayPrice } = formData

        if (!vendorId) newErrors.vendorId = 'Vendor ID or Mobile Number is required'
        else if (!/^(\d{10}|[a-zA-Z0-9]+)$/.test(vendorId.toString().trim())) {
            newErrors.vendorId = 'Enter a valid mobile number (10 digits) or ID'
        }

        if (!FixedListing) newErrors.FixedListing = 'Paid package is required'

        if (!perDayPrice) newErrors.perDayPrice = 'Per day price is required'
        else if (isNaN(perDayPrice) || Number(perDayPrice) <= 0) {
            newErrors.perDayPrice = 'Please enter a valid positive number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
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

        if (field === 'vendorId' && formData.vendor && value !== formData.vendorId) {
            setFormData(prev => ({
                ...prev,
                vendor: null, // Clear the selected vendor ID
                // Optionally clear other display info if you want it to disappear immediately
                companyName: '',
                phoneNo: '',
                email: '',
                metaCategory: '',
                businessStatus: ''
            }));
            setShowInfo(false); // Hide the display info card
            setKyeword(undefined); // Clear keywords
        }

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handlePackageChange = (e) => {
        const selectedPackage = packages.find(pkg => pkg.name === e.target.value)

        if (selectedPackage) {
            try {
                const today = new Date();
                const publishDateStart = new Date(today);
                const validityDateNum = Number(selectedPackage?.valideDate);
                const validityDays = validityDateNum;
                const expiryDate = addDays(publishDateStart, validityDays);
                if (!isValid(expiryDate)) {
                    throw new Error('Invalid expiry date calculation');
                }

                const formattedStart = format(publishDateStart, 'dd-MMM-yyyy');
                const formattedEnd = format(expiryDate, 'dd-MMM-yyyy');
                setFormData(prev => ({
                    ...prev,
                    FixedListing: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: selectedPackage?.valideDate
                }));

            } catch (error) {
                toast.error('Failed to calculate package dates');
                setFormData(prev => ({
                    ...prev,
                    FixedListing: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: 'Invalid date range'
                }));
            }

        } else {
            setFormData(prev => ({
                ...prev,
                FixedListing: e.target.value,
                perDayPrice: '',
                validity: ''
            }))
        }
    }

    const handleVendorSelect = (item) => {
        setKyeword(item?.keywords) // This is already correctly setting keywords on explicit selection
        setFormData(prev => ({
            ...prev,
            vendorId: item.vendorId,
            vendor: item?._id,
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

    const getPackage = async () => {
        try {
            const Packages = await GetPackages.getAllPaidPackage()
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
                                const value = e.target.value;
                                handleChange('vendorId', value);

                                if (value.length > 2 && (!formData.vendor || value !== data.vendorId)) {
                                    debouncedSearch(value);
                                } else if (value.length <= 2) {
                                    setSearchResults([]);
                                    setShowDropdown(false);
                                } else if (formData.vendor && value === data.vendorId) {
                                    setShowDropdown(false);
                                }
                            }}
                            error={!!errors.vendorId}
                            helperText={errors.vendorId}
                            inputRef={searchRef}
                            InputProps={{
                                endAdornment: formData.vendor && (
                                    <IconButton
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                vendorId: '',
                                                vendor: null,
                                                companyName: '',
                                                phoneNo: '',
                                                email: '',
                                                metaCategory: '',
                                                businessStatus: ''
                                            }));
                                            setShowInfo(false);
                                            setSearchResults([]);
                                            setShowDropdown(false);
                                            setKyeword(undefined); // Clear keywords when clearing vendor
                                        }}
                                        edge="end"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                ),
                            }}
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
                            label="Paid Package"
                            value={formData.FixedListing}
                            onChange={handlePackageChange}
                            error={!!errors.FixedListing}
                            helperText={errors.FixedListing}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: formData.FixedListing !== "" ? undefined : () => "Select Package"
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


                    <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={formData.vendorId === '' || formData.FixedListing === '' || formData.perDayPrice === '' || urlLoading || formData.validity === ''}

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
