// React Imports
import { useEffect, useState, useRef } from 'react'

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
import GetPaidPackages from "@/services/premium-listing/paidPackage.service"
import { toast } from 'react-toastify'
import { parseISO, isValid, intervalToDuration, addMonths, format, addDays } from 'date-fns'
import CustomTextField from '@core/components/mui/TextField'
import ImageCloud from '@/services/imageService'

const PaidBasicDetail = ({ onsuccess, besicFormData, getKeyKeyword, handleNextClick, data }) => {
    const [formData, setFormData] = useState({
        vendorId: data.vendorId || '',
        paidListingPackage: data.paidListingPackage || '',
        order: data.order || 'STANDARD SUPPLIER',
        perDayPrice: data.perDayPrice || '',
        publishDate: format(data.publishDate || new Date(), 'yyyy-MM'),
        validity: data.validity || '',
    })

    const [showInfo, setShowInfo] = useState(false)
    const [errors, setErrors] = useState({
        vendorId: '',
        paidListingPackage: '',
        perDayPrice: '',
    })
    const [image, setImage] = useState(null)
    const [urlLoading, setUrlLoding] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [packages, setPackage] = useState([])
    const searchRef = useRef(null)
    const [keyword, setKyeword] = useState()

    const isVendorSelectedFromDropdown = useRef(false);

    useEffect(() => {
        getKeyKeyword(keyword)
    }, [keyword, getKeyKeyword])

            //              const result = await ProposalGeneratePaidListing.generateproposal(PaidListingId, data);
            //   toast.success(result.message);
            //   getPaidListing();
   
    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (formData.vendorId && !keyword) { // Only fetch if vendorId is present and keyword isn't already set
                try {
                    const response = await SearchVendar.getsearch({ search: formData.vendorId });
                    if (response && Array.isArray(response.data) && response.data.length > 0) {
                        const selectedItem = response.data.find(item => item.vendorId === formData.vendorId);
                        if (selectedItem) {
                            setKyeword(selectedItem.keywords);
                            setFormData(prev => ({
                                ...prev,
                                companyName: selectedItem?.companyInfo?.companyName || '',
                                phoneNo: selectedItem?.contactInfo?.phoneNo || '',
                                email: selectedItem?.contactInfo?.email || '',
                                metaCategory: selectedItem?.companyInfo?.businessCategory?.name || '',
                                businessStatus: selectedItem?.companyInfo?.businessCategory?.status || ''
                            }));
                            setShowInfo(true);
                        }
                    }
                } catch (error) {
                    toast.error('Failed to fetch initial vendor details');
                }
            }
        };
        if (data.vendorId) {
            fetchVendorDetails();
        }
    }, [data.vendorId, formData.vendorId, keyword]); 

    const debouncedSearch = debounce(async (value) => {
        if (isVendorSelectedFromDropdown.current) {
            isVendorSelectedFromDropdown.current = false;
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
    }, 500)


    const validateForm = () => {
        const newErrors = {}
        const { vendorId, paidListingPackage, perDayPrice } = formData

        // Vendor ID validation
        if (!vendorId) newErrors.vendorId = 'Vendor ID or Mobile Number is required'
        else if (!/^(\d{10}|[a-zA-Z0-9]+)$/.test(vendorId.toString().trim())) {
            newErrors.vendorId = 'Enter a valid mobile number (10 digits) or ID'
        }

        // Banner Package validation
        if (!paidListingPackage) newErrors.paidListingPackage = 'Banner package is required'

        // Per Day Price validation
        if (!perDayPrice) newErrors.perDayPrice = 'Per day price is required'
        else if (isNaN(perDayPrice) || Number(perDayPrice) <= 0) {
            newErrors.perDayPrice = 'Please enter a valid positive number'
        }

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
        // console.log(formData, 'Form Datavvvvvvv');
            besicFormData(formData)
            if (onsuccess) {
                onsuccess()
            }
      
    }

    const handleSaveAndNext = () => {
        handleSave();
        handleNextClick();
    };


    const handleChange = (field, value) => {
        isVendorSelectedFromDropdown.current = false;
        setFormData(prev => ({ ...prev, [field]: value }))

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handlePackageChange = (e) => {
       
        
        const selectedPackage = packages.find(pkg => pkg.name === e.target.value)
        console.log('selectedPackage', selectedPackage);
        

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
                const validityDateRange = `${formattedStart} To ${formattedEnd}`;
                setFormData(prev => ({
                    ...prev,
                    paidListingPackage: e.target.value,
                    perDayPrice: selectedPackage.price,
                    validity: selectedPackage?.valideDate,
                    order: selectedPackage?.order || 'STANDARD SUPPLIER'
                }));

            } catch (error) {
                toast.error('Failed to calculate package dates');
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


    const handleVendorSelect = (item) => {
        isVendorSelectedFromDropdown.current = true;
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

    const getPackage = async () => {
        try {
            const Packages = await GetPaidPackages.getAllPaidPackage()
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
                            value={formData.paidListingPackage}
                            onChange={handlePackageChange}
                            error={!!errors.paidListingPackage}
                            helperText={errors.paidListingPackage}
                            SelectProps={{
                                // Conditionally render displayEmpty based on whether a package is selected
                                displayEmpty: formData.paidListingPackage === "",
                                renderValue: formData.paidListingPackage !== "" ? undefined : () => "Select Package"
                            }}
                        >
                            {/* Conditionally render "Select Package" MenuItem */}
                            {formData.paidListingPackage === "" && (
                                <MenuItem value="">Select Package</MenuItem>
                            )}
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
                            disabled={formData.vendorId === '' || formData.paidListingPackage === '' || formData.perDayPrice === ''}
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

export default PaidBasicDetail
