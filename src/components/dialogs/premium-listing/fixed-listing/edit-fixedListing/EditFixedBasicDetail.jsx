// React Imports
import { useEffect, useState, useRef, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, debounce } from '@mui/material'
import SearchVendar from '@/services/utsav/banner/HomeBannerServices' // API service for vendor search
import GetPackages from "@/services/premium-listing/paidPackage.service"
import { toast } from 'react-toastify'
import { parseISO, isValid, addDays, format } from 'date-fns'
import CustomTextField from '@core/components/mui/TextField'

const EditBasicDetail = ({ onsuccess, besicFormData, getKeyKeyword, data, handleNextClick }) => {
    const [formData, setFormData] = useState({
        vendorId: '',
        FixedListing: '',
        perDayPrice: '',
        publishDate: format(new Date(), 'yyyy-MM'),
        validity: '',
        companyName: '',
        phoneNo: '',
        email: '',
        metaCategory: '',
        businessStatus: '',
    })

    const normalizePackageName = (name) => {
        const mapping = {
            "Second Paid Package": "Second Fixed Listing",
            "First Paid Listing": "First Fixed Package"
        };
        return mapping[name] || name;
    };

    useEffect(() => {
        if (data) {
            setFormData(prev => ({
                ...prev,
                vendorId: data.vendorId || '',
                FixedListing: normalizePackageName(data.FixedListing) || '',
                perDayPrice: data.perDayPrice || '',
                publishDate: data.publishDate ? format(parseISO(data.publishDate), 'yyyy-MM') : format(new Date(), 'yyyy-MM'),
                validity: data.validity || '',
                companyName: data.companyName || '',
                phoneNo: data.phoneNo || '',
                email: data.email || '',
                metaCategory: data.metaCategory || '',
                businessStatus: data.businessStatus || ''
            }))
        }
    }, [data]);


    const [showInfo, setShowInfo] = useState(false)
    const [errors, setErrors] = useState({
        vendorId: '',
        FixedListing: '',
        perDayPrice: '',
    })


    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [packages, setPackage] = useState([])
    const searchRef = useRef(null)

    // ✅ Debounced manual search
    const debouncedSearch = useCallback(
        debounce(async (value) => {
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
        []
    )

    // ✅ Auto search & select vendor if vendorId is pre-filled
    useEffect(() => {
        const autoSearchVendor = async () => {
            if (formData.vendorId && formData.vendorId.length > 2) {
                try {
                    const response = await SearchVendar.getsearch({ search: formData.vendorId })
                    if (response && Array.isArray(response.data) && response.data.length > 0) {
                        const firstVendor = response.data[0]

                        // Auto-select vendor
                        handleVendorSelect(firstVendor)

                        // Pass keywords to parent
                        if (firstVendor.keywords && Array.isArray(firstVendor.keywords)) {
                            getKeyKeyword(firstVendor.keywords)
                        }
                    }
                } catch (error) {
                    console.error('Auto vendor fetch failed:', error)
                }
            }
        }

        autoSearchVendor()
    }, [formData.vendorId])

    const validateForm = () => {
        const newErrors = {}
        const { vendorId, FixedListing, perDayPrice } = formData

        if (!vendorId) newErrors.vendorId = 'Vendor ID or Mobile Number is required'
        if (!FixedListing) newErrors.FixedListing = 'Banner package is required'

        if (!perDayPrice) newErrors.perDayPrice = 'Per day price is required'
        else if (isNaN(perDayPrice) || Number(perDayPrice) <= 0) {
            newErrors.perDayPrice = 'Please enter a valid positive number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (validateForm()) {
            besicFormData(formData)
            if (onsuccess) onsuccess()
        } 
    }

    const handleNextClicks = () => {
        handleSave()
        handleNextClick()
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handlePackageChange = (e) => {
        const selectedPackage = packages.find(pkg => pkg.name === e.target.value)

        if (selectedPackage) {
            try {
                const today = new Date()
                const validityDateNum = Number(selectedPackage?.valideDate)
                const expiryDate = addDays(today, validityDateNum)

                if (!isValid(expiryDate)) throw new Error('Invalid expiry date calculation')

                setFormData(prev => ({
                    ...prev,
                    FixedListing: e.target.value || data.FixedListing,
                    perDayPrice: selectedPackage.price,
                    validity: selectedPackage?.valideDate
                }))
            } catch (error) {
                toast.error('Failed to calculate package dates')
                setFormData(prev => ({
                    ...prev,
                    FixedListing: e.target.value || data.FixedListing,
                    perDayPrice: '',
                    validity: ''
                }))
            }
        } else {
            setFormData(prev => ({
                ...prev,
                FixedListing: e.target.value || data.FixedListing,
                perDayPrice: '',
                validity: ''
            }))
        }
    }

    const handleVendorSelect = (item) => {
        const newFormData = {
            ...formData,
            vendorId: item.vendorId,
            companyName: item?.companyInfo?.companyName || '',
            phoneNo: item?.contactInfo?.phoneNo || '',
            email: item?.contactInfo?.email || '',
            metaCategory: item?.companyInfo?.businessCategory?.name || '',
            businessStatus: item?.companyInfo?.businessCategory?.status || ''
        }
        setFormData(newFormData)
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
                            <Box sx={{ display: 'block', whiteSpace: 'nowrap' }}>
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
                                            alignItems: 'center',
                                            minWidth: 600
                                        }}
                                        onClick={() => {
                                            handleVendorSelect(item)
                                            if (item.keywords) getKeyKeyword(item.keywords)
                                        }}
                                    >
                                        <Typography variant="body2">{item.vendorId}</Typography>
                                        <Typography variant="body2">{item?.contactInfo?.phoneNo}</Typography>
                                        <Typography variant="body2">{item?.companyInfo?.companyName || 'N/A'}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}

                    {showInfo && (
                        <Card className="w-full p-10 flex flex-col">
                            <Divider className="my-6" />
                            <Typography variant="h6" className="mb-4">
                                Display Info
                            </Typography>
                            <Box sx={{ width: '100%' }}>
                                <Grid container spacing={2}>
                                    {[
                                        { label: 'Vendor ID', value: formData.vendorId },
                                        { label: 'Mobile', value: formData.phoneNo },
                                        { label: 'Business Name', value: formData.companyName },
                                        { label: 'Email ID', value: formData.email },
                                        { label: 'Meta Category', value: formData.metaCategory },
                                        { label: 'Business Status', value: formData.businessStatus },
                                    ].map((field, index) => (
                                        <Grid key={index} item xs={12} sm={6} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {field.label}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {field.value || '—'}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Card>
                    )}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Paid Package"
                            className="text-start"
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
                                <MenuItem key={item._id || item.name} value={item.name}>{item.name}</MenuItem>
                            ))}
                        </CustomTextField>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Per Day Price"
                            value={formData.perDayPrice ? `₹ ${formData.perDayPrice}` : ''}
                            disabled
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
                            disabled={
                                formData.vendorId === '' ||
                                formData.FixedListing === '' ||
                                formData.perDayPrice === '' ||
                                formData.validity === ''
                            }
                            onClick={handleNextClicks}
                        >
                            Save & Next
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EditBasicDetail
