// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Divider, Paper, debounce, Tabs, MenuItem } from '@mui/material'

// Services & Utils
import SearchVendar from '@/services/utsav/banner/HomeBannerServices'
import GetPaidPackages from "@/services/premium-listing/paidPackage.service"
import ImageCloud from '@/services/imageService'
import { toast } from 'react-toastify'
import { parseISO, isValid, addDays, format } from 'date-fns'
import CustomTextField from '@core/components/mui/TextField'

const EditPaidBasicDetail = ({ onsuccess, besicFormData, getKeyKeyword, data, handleNextClick }) => {
    console.log(data,"datadata");
    
    const [formData, setFormData] = useState({
        vendorId: '',
        paidListingPackage: '',
        perDayPrice: '',
        publishDate: format(new Date(), 'yyyy-MM'),
        validity: '',
    })

    // console.log(formData,"formDataformDataformData");
    

    const [showInfo, setShowInfo] = useState(false)
    const [errors, setErrors] = useState({})
    const [image, setImage] = useState(null)
    const [urlLoading, setUrlLoding] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [packages, setPackage] = useState([])
    const [keyword, setKyeword] = useState()
    const searchRef = useRef(null)

    useEffect(() => { getKeyKeyword(keyword) }, [keyword, getKeyKeyword])

    useEffect(() => {
        if (formData.vendorId) {
            setKyeword(formData.vendorId)
        }
    }, [formData.vendorId])

    useEffect(() => {
        if (data) {
            console.log(data,"datadatadatadata");
            
            setFormData({
                vendorId: data?.vendorId || '',
                paidListingPackage: data?.paidListingPackage || '',
                perDayPrice: data?.perDayPrice || '',
                publishDate: data?.publishDate ? format(parseISO(data.publishDate), 'yyyy-MM') : format(new Date(), 'yyyy-MM'),
                validity: data?.validity || '',
                image: data?.image || '',
                vendor: data?.basicDetails?._id,
                order: data?.basicDetails?.order,
                companyName: data?.companyName || '',
                phoneNo: data?.contactInfo?.phoneNo || '',
                email: data?.contactInfo?.email || '',
                metaCategory: data?.companyInfo?.businessCategory?.name || '',
                businessStatus: data?.companyInfo?.businessCategory?.status || ''
            })
            setShowInfo(true)
            setImage(data?.image || null)
        }
    }, [data])

    // Fetch vendors by search term
    const fetchVendorDetails = async (searchValue) => {
        const response = await SearchVendar.getsearch({ search: searchValue })
        return response?.data || []
    }

    const debouncedSearch = debounce(async (value) => {
        if (!value || value.length <= 2) {
            setSearchResults([])
            setShowDropdown(false)
            return
        }
        try {
            const vendors = await fetchVendorDetails(value)
            if (vendors.length) {
                setSearchResults(vendors)
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
    }, 500)

    const validateForm = () => {
        const newErrors = {}
        const { vendorId, paidListingPackage, perDayPrice } = formData

        if (!vendorId) newErrors.vendorId = 'Vendor ID  is required'
       

        if (!paidListingPackage) newErrors.paidListingPackage = 'Banner package is required'
        if (!perDayPrice) newErrors.perDayPrice = 'Per day price is required'
        else if (isNaN(perDayPrice) || Number(perDayPrice) <= 0) {
            newErrors.perDayPrice = 'Please enter a valid positive number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

  

    const handleVendorSelect = (item) => {
        setKyeword(item?.keywords)
        setFormData(prev => ({
            ...prev,
            vendorId: item.vendorId,
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

    const handleSaveAndNext = async () => {
        if (validateForm()) {
            try {
                // Fetch latest vendor details again
                const vendors = await fetchVendorDetails(formData.vendorId);
                const vendorData = vendors.find(item => item.vendorId === formData.vendorId);

                // console.log(vendorData?.companyInfo,'vendorData?.companyInfovendorData?.companyInfo');
                // Merge vendor details with existing formData
                const updatedData = {
                    ...formData,
                    companyName: vendorData?.companyInfo?.companyName || '',
                    phoneNo: vendorData?.contactInfo?.phoneNo || '',
                    vendor: vendorData._id,
                    email: vendorData?.contactInfo?.email || '',
                    metaCategory: vendorData?.companyInfo?.businessCategory?.name || '',
                    businessStatus: vendorData?.companyInfo?.businessCategory?.status || ''
                };

                

                // Update state for UI
                setFormData(updatedData);
                setShowInfo(true);

                // Pass updated data to parent
                besicFormData(updatedData);

                if (onsuccess) onsuccess();
                handleNextClick();
            } catch (error) {
                toast.error('Failed to fetch vendor details');
                console.error(error);
            }
        } 
    };


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
                const publishDateStart = new Date(today)
                const validityDays = Number(selectedPackage?.valideDate)
                const expiryDate = addDays(publishDateStart, validityDays)
                if (!isValid(expiryDate)) throw new Error('Invalid expiry date calculation')

                setFormData(prev => ({
                    ...prev,
                    paidListingPackage: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: selectedPackage?.valideDate
                }))
            } catch {
                toast.error('Failed to calculate package dates')
                setFormData(prev => ({
                    ...prev,
                    paidListingPackage: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: 'Invalid date range'
                }))
            }
        } else {
            setFormData(prev => ({
                ...prev,
                paidListingPackage: e.target.value,
                perDayPrice: '',
                validity: ''
            }))
        }
    }

    const getPackage = async () => {
        try {
            const Packages = await GetPaidPackages.getAllPaidPackage()
            setPackage(Packages?.data || [])
        } catch {
            console.error('Error fetching packages')
            setPackage([])
        }
    }

    useEffect(() => { getPackage() }, [])


    // console.log(formData,"formssssssssssssssssssss");
    

    return (
        <Card className='shadow-none'>
            <CardContent>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Enter Parent ID or Mobile Number"
                            placeholder="Search Business"
                            value={formData.vendorId}
                            onChange={(e) => {
                                const value = e.target.value
                                handleChange('vendorId', value)
                                debouncedSearch(value || data?.vendorId)
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
                                <Tabs
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
                                </Tabs>
                            ))}
                        </Paper>
                    )}

                    {showInfo && (
                        <Card className='w-full p-10 flex flex-col'>
                            <Grid size={{ xs: 12 }}>
                                <Divider className='my-6' />
                                <Typography variant='h6' className='mb-4'>Display Info</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                {[
                                    { label: 'Vendor ID', value: formData.vendorId },
                                    { label: 'Mobile', value: formData.phoneNo },
                                    { label: 'Business Name', value: formData.companyName },
                                    { label: 'Email ID', value: formData.email },
                                    { label: 'Meta Category', value: formData.metaCategory },
                                    { label: 'Business Status', value: formData.businessStatus }
                                ].map((info, idx) => (
                                    <Grid key={idx} size={{ xs: 12, md: 6 }} className='flex justify-between'>
                                        <Typography variant="subtitle2" className='font-bold'>{info.label}</Typography>
                                        <Typography variant="body1">{info.value}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    )}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Banner Package"
                            value={formData.paidListingPackage}
                            onChange={handlePackageChange}
                            error={!!errors.paidListingPackage}
                            helperText={errors.paidListingPackage}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: formData.paidListingPackage !== "" ? undefined : () => "Select Package"
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

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!formData.vendorId || !formData.paidListingPackage || !formData.perDayPrice}
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

export default EditPaidBasicDetail
