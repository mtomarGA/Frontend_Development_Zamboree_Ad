// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, TextField } from '@mui/material'
import Polls from '@/services/posts/polls.service'

// Third-party Imports
import { toast } from 'react-toastify'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import GoogleMapLocation from '../GoogleLocution'
import getVendor from '@/services/utsav/banner/HomeBannerServices'
const EditPolls = ({ EditSelectedPost, onsuccess, getData }) => {


    // State for vendor data and search
    const [vendorData, setVendorData] = useState([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [vendorDetail, setVendorDetail] = useState(null)

    // Form data state
    const [formData, setFormData] = useState({
        question: '',
        chooseType: '',
        status: 'PENDING',
        chooseTypeId: '',
        options: [],
        locution: '',
        locutionkm: '',
        latCoordinate: '',
        lngCoordinate: ''
    })

    // Error state
    const [errors, setErrors] = useState({
        chooseType: '',
        question: '',
        status: '',
        chooseTypeId: '',
        locution: '',
        locutionkm: ''
    })

    // Poll options state
    const [options, setOptions] = useState([])
    const [currentOption, setCurrentOption] = useState('')
    // Initialize form data from EditSelectedPost
    useEffect(() => {
        if (EditSelectedPost) {
            setFormData({
                question: EditSelectedPost.question || '',
                chooseType: EditSelectedPost.chooseType || '',
                status: EditSelectedPost.status || 'PENDING',
                chooseTypeId: EditSelectedPost.chooseTypeId || '',
                options: EditSelectedPost.options?.map(opt => opt.option) || [],
                locution: EditSelectedPost.locution || '',
                locutionkm: EditSelectedPost.locationKm || '',
                latCoordinate: EditSelectedPost.latCoordinate || '',
                lngCoordinate: EditSelectedPost.lngCoordinate || ''
            })

            setOptions(EditSelectedPost.options?.map(opt => opt.option) || [])
            setQuery(EditSelectedPost.chooseTypeId?.vendorId)
            setVendorDetail(EditSelectedPost.chooseTypeId?._id)
        }
    }, [EditSelectedPost])

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
            if (!query || query.trim() === '') {
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
    const validateForm = () => {
        const newErrors = {}
        const { chooseType, question, chooseTypeId, locution, locutionkm, status } = formData

        if (!chooseType) newErrors.chooseType = 'User Type is required'
        if (!question) newErrors.question = 'Question is required'
        if (!locution) newErrors.location = 'Location is required'
        if (!status) newErrors.status = 'Status is required'
        if (!locutionkm) newErrors.locutionkm = 'Visibility KM is required'
        if (options.length < 2) newErrors.options = 'At least two options are required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const payload = {
                    question: formData.question,
                    options: options.map(option => ({ option })),
                    chooseType: formData.chooseType,
                    chooseTypeId: formData.chooseTypeId,
                    lngCoordinate: formData.lngCoordinate,
                    latCoordinate: formData.latCoordinate,
                    locution: formData.locution,
                    locutionkm: formData.locutionkm,
                    status: formData.status
                };


                const pollsId = EditSelectedPost._id
                const result = await Polls.updatepolls(payload, pollsId)
                toast.success(result.message);
                onsuccess(false);
                getData();
            } catch (error) {
                console.error('Error:', error);
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
                toast.error(errorMessage);
            }
        } else {
            toast.error('Please fix the errors.');
        }
    }

    // Add new poll option
    const addOption = () => {
        if (currentOption.trim() === '') {
            toast.error('Option cannot be empty')
            return
        }

        setOptions([...options, currentOption])
        setCurrentOption('')
    }

    // Remove poll option
    const removeOption = (index) => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        setOptions(newOptions)
    }

    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Edit Poll
                </Typography>

                <Grid container spacing={6}>
                    {/* question Field */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Poll Question"
                            placeholder="Enter Poll Question"
                            value={formData.question}
                            rows={4}
                            onChange={e => setFormData({ ...formData, question: e.target.value })}
                            error={!!errors.question}
                            helperText={errors.question}
                        />
                    </Grid>

                    {/* Poll Options */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <CustomTextField
                            fullWidth
                            label="Poll Options"
                            placeholder="Enter Option"
                            value={currentOption}
                            rows={4}
                            onChange={e => setCurrentOption(e.target.value)}
                            error={!!errors.options}
                            helperText={errors.options}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Button
                            variant='contained'
                            size='medium'
                            className='mt-4 py-2'
                            fullWidth
                            onClick={addOption}
                        >
                            Add Option
                        </Button>
                    </Grid>

                    {/* Display added options */}
                    {options.length > 0 && (
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Current Options:
                                </Typography>
                                {options.map((option, index) => (
                                    <Box key={index} sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        py: 1,
                                        borderBottom: index < options.length - 1 ? '1px solid #e0e0e0' : 'none'
                                    }}>
                                        <Typography>{option}</Typography>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => removeOption(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    )}

                    {/* User Type Selection */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Created For"
                            className='text-start'
                            disabled
                            value={formData.chooseType}
                            onChange={e => setFormData({ ...formData, chooseType: e.target.value })}
                            error={!!errors.chooseType}
                            helperText={errors.chooseType}
                        >
                            <MenuItem value="" disabled>-- Created For --</MenuItem>
                            {/* <MenuItem value="Admin">Happening Bazaar</MenuItem> */}
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Mandir">Mandir</MenuItem>
                        </CustomTextField>
                    </Grid>

                    {/* Status Selection */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Status"
                            className='text-start'
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                        </CustomTextField>
                    </Grid>

                   

                    {/* Google Maps Section */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <GoogleMapLocation formData={formData} errors={errors} googleMapData={{ latitude: formData.latCoordinate, longitude: formData.lngCoordinate }} setFormData={setFormData} />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
                        <Button
                            variant='contained'
                            size='large'
                            fullWidth
                            onClick={handleSubmit}

                        >
                            Update Poll
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EditPolls
