// React Imports
import { useEffect, useState, useRef } from 'react'
// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Divider, Paper, Box, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import Polls from '@/services/posts/polls.service'
import SpritualServices from '@/services/posts/spritual.service'
import { toast } from 'react-toastify'
import getVendor from '@/services/utsav/banner/HomeBannerServices'
import CustomTextField from '@core/components/mui/TextField'
import GoogleMapLocation from './GoogleLocution'

const CreatePolls = ({ onsuccess, getData }) => {
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
        chooseTypeModel: "",
        locution: '',
        locutionkm: '',
        latCoordinage: '',
        langCoordinagee: ''
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

    // Google Maps state
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')

    const [googleMapData, setGoogleMapData] = useState({
        lattitute: '',
        longitude: ''
    })
    const [googleMapErrors, setGoogleMapErrors] = useState({
        lattitute: '',
        longitude: ''
    })

    // Fetch vendor data
    useEffect(() => {
        const GetVendor = async () => {
            const data = { search: query };
            const SearchVendor = await getVendor.getsearch(data);
            setVendorData(SearchVendor.data);
        };

        if (formData?.chooseType === "Business" && query?.trim()) {
            GetVendor();
        }
    }, [query, formData?.chooseType]);


    useEffect(() => {
        const getHinduMandir = async () => {
            const result = await SpritualServices.searchHinduTabmple(query);
            setVendorData(result.data)
        };

        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "temples" &&
            query?.trim()
        ) {
            getHinduMandir();
        }
    }, [query, formData?.chooseType, formData?.chooseTypeModel]);



    useEffect(() => {
        const getSikhMandir = async () => {
            const result = await SpritualServices.SearchGurudwara(query);
            setVendorData(result.data)
        };
        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "gurudwaras" &&
            query?.trim()
        ) {
            getSikhMandir();
        }

    }, [query, formData?.chooseType, formData?.chooseTypeModel])


    useEffect(() => {
        const getChurchMandir = async () => {
            const result = await SpritualServices.SearchChurch(query);
            setVendorData(result.data)
        };

        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "christian_temple" &&
            query?.trim()
        ) {
            getChurchMandir();
        }
    }, [query, formData?.chooseType, formData?.chooseTypeModel])




    useEffect(() => {
        const getJinalayaMandir = async () => {
            const result = await SpritualServices.SearchJain(query);
            setVendorData(result.data)
        };

        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "jain_temples" &&
            query?.trim()
        ) {
            getJinalayaMandir();
        }
    }, [query, formData?.chooseType, formData?.chooseTypeModel])




    useEffect(() => {
        const getChaityaMandir = async () => {
            const result = await SpritualServices.SearchChaitya(query);
            setVendorData(result.data)
        };

        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "buddhism_temples" &&
            query?.trim()
        ) {
            getChaityaMandir();
        }
    }, [query, formData?.chooseType, formData?.chooseTypeModel])

    useEffect(() => {
        const getIsalamMandir = async () => {
            const result = await SpritualServices.SearchIslam(query);
            setVendorData(result.data)
        };



        if (
            formData?.chooseType === "Mandir" &&
            formData?.chooseTypeModel === "NearByMosque" &&
            query?.trim()
        ) {
            getIsalamMandir();
        }
    }, [query, formData?.chooseType, formData?.chooseTypeModel])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query?.trim() === '') {
                setResults([])
                return
            }

            // console.log(vendorDetail, "vendorDatavendorData");


            const filtered = vendorData.filter(item => {
                console.log(item, "dasdsdsddssd");

                return (
                    item.vendorId || item?.temple_id?.toLowerCase().includes(query.toLowerCase()) ||
                    item.companyInfo?.companyName || item?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.contactInfo?.phoneNo || item?.contact_number?.toLowerCase().includes(query.toLowerCase())
                )
            })

            setResults(filtered)
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [query, vendorData])






    const validateForm = () => {
        const newErrors = {}
        const { chooseType, question, chooseTypeId, locution, locutionkm, status } = formData

        if (!chooseType) newErrors.chooseType = 'User Type is required'
        if (!chooseTypeId) newErrors.chooseTypeId = 'User  Id is required'
        if (!question) newErrors.question = 'questionis required'
        if (!locution) newErrors.locution = 'Location is required'
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
                    lngCoordinate: formData.langCoordinagee,
                    latCoordinate: formData.latCoordinage,
                    locution: formData.locution,
                    locutionkm: formData.locutionkm,
                    status: formData.status,
                    chooseTypeModel: formData.chooseTypeModel
                };

                console.log(payload, 'sdsdsdsddw')


                const result = await Polls.addPolls(payload);
                toast.success(result.message);
                onsuccess(false)
                getData()
            } catch (error) {
                console.error('Error:', error);
                getData();
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
                toast.error(errorMessage);
            }
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

    console.log(formData, "formDatatatattaa");



    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Create Polls
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
                    <Grid size={{ xs: 12, md: 9 }}>
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
                    <Grid size={{ xs: 12, md: 3 }}>
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
                            value={formData.chooseType}
                            onChange={e => setFormData({ ...formData, chooseType: e.target.value, chooseTypeModel: e.target.value })}
                            error={!!errors.chooseType}
                            helperText={errors.chooseType}
                            SelectProps={{
                                displayEmpty: true,
                                renderValue: (selected) => {
                                    if (!selected) {
                                        return <span>Select Sub Choose Type</span>;
                                    }
                                    // Optional: Capitalize or format
                                    return selected;
                                },
                            }}
                        >
                            <MenuItem value="" disabled>-- Created For --</MenuItem>
                            {/* <MenuItem value="Admin">Happening Bazaar</MenuItem> */}
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Mandir">Spritual</MenuItem>
                        </CustomTextField>
                    </Grid>

                    {/* Status Selection */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Status"
                            className='text-start'
                            disabled
                            value={'PENDING'}
                            onChange={e => setFormData({ ...formData, status: "PENDING" })}
                            error={!!errors.status}
                            helperText={errors.status}
                        />
                    </Grid>


                    {formData.chooseType === "Mandir" && (
                        <RadioGroup
                            row
                            aria-label="controlled"
                            name="controlled"
                            value={formData.chooseTypeModel}

                            onChange={(e) =>
                                setFormData({ ...formData, chooseTypeModel: e.target.value })
                            }
                        >
                            <FormControlLabel value="temples" control={<Radio />} label="Mandir (Hindu)" />
                            <FormControlLabel value="gurudwaras" control={<Radio />} label="Gurudwara (Sikh) " />
                            <FormControlLabel value="christian_temple" control={<Radio />} label="Church (Christian)" />
                            <FormControlLabel value="jain_temples" control={<Radio />} label="Jinalaya (Jain)" />
                            <FormControlLabel value="buddhism_temples" control={<Radio />} label="Chaitya (Buddhism)" />
                            <FormControlLabel value="NearByMosque" control={<Radio />} label="Masjid (Ishlam)" />
                        </RadioGroup>
                    )}

                    {(formData.chooseType === "Business" || formData.chooseType === "Mandir") && (
                        <Grid size={{ xs: 12, md: 12 }}>
                            <CustomTextField
                                fullWidth
                                label={`Search ${formData.chooseType} ID`}
                                placeholder={`Enter ${formData.chooseType} ID`}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                disabled={!!formData.chooseTypeId}
                                error={!!errors.chooseTypeId}
                                helperText={errors.chooseTypeId}
                            />

                            {/* Search Results */}
                            <Paper
                                elevation={3}
                                sx={{
                                    mt: 1,
                                    maxHeight: 250,
                                    overflow: 'auto',
                                    display: results.length ? 'block' : 'none',
                                    borderRadius: 1
                                }}
                            >
                                {results.length > 0 && !vendorDetail && (
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            mt: 1,
                                            maxHeight: 200,
                                            overflow: 'auto',
                                            display: 'block',
                                            borderRadius: 1
                                        }}
                                    >
                                        {results.map(item => (
                                            console.log(item?._id, "itemsssssss"),

                                            <MenuItem
                                                key={item._id}
                                                onClick={() => {
                                                    setQuery(item?.vendorId || item?.temple_id || item?.gurudwara_id || item?.mosque_id); // show selected ID in input
                                                    setFormData(prev => ({ ...prev, chooseTypeId: item._id }));
                                                    setVendorDetail(item);
                                                    setResults([]);
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
                                                    {item?.vendorId ? (
                                                        <Typography variant="body2" color="text.secondary" className="text-start">
                                                            <strong>Business Id :</strong> {item.vendorId}
                                                        </Typography>
                                                    ) : item?.temple_id || item?.gurudwara_id || item?.mosque_id ? (
                                                        <Typography variant="body2" color="text.secondary" className="text-start">
                                                            <strong>Temple Id :</strong> {item?.temple_id || item?.gurudwara_id || item?.mosque_id}
                                                        </Typography>
                                                    ) : null}

                                                    {item?.companyInfo?.companyName || item?.name && (
                                                        <Typography variant="body2" color="text.secondary" className='text-start'>
                                                            <strong>Name :</strong>  {item?.companyInfo?.companyName || item?.name}
                                                        </Typography>
                                                    )}
                                                    {item?.contactInfo?.phoneNo || item?.contact_number && (
                                                        <Typography variant="body2" color="text.secondary" className='text-start'>
                                                            <strong>Phone No :</strong> {item?.contactInfo?.phoneNo || item?.contact_number}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Paper>
                                )}

                            </Paper>
                        </Grid>
                    )}

                    {/* Vendor/Mandir Details Display */}
                    {vendorDetail && (formData.chooseType === "Business" || formData.chooseType === "Mandir") && (
                        <Grid size={{ xs: 12 }} className="mt-6">
                            <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        {formData.chooseType} Information
                                    </Typography>
                                </Grid>
                                <Divider />
                                <Grid size={{ xs: 12 }} container direction="column" spacing={1}>
                                    <Grid container direction="row" justifyContent="space-between">
                                        <Typography>{formData.chooseType} ID:</Typography>
                                        <Typography>{vendorDetail.vendorId || vendorDetail?.temple_id || vendorDetail?.mosque_id || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="space-between">
                                        <Typography>Mobile No:</Typography>
                                        <Typography>{vendorDetail.contactInfo?.phoneNo || vendorDetail?.contact_number || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="space-between">
                                        <Typography>Name:</Typography>
                                        <Typography>{vendorDetail?.companyInfo?.companyName || vendorDetail?.name || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="space-between">
                                        <Typography>Email:</Typography>
                                        <Typography>{vendorDetail.contactInfo?.email || vendorDetail?.user_id?.email || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )}



                    {/* Google Maps Section */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <GoogleMapLocation formData={formData} errors={errors} googleMapData={{ latitude: formData.latCoordinage, longitude: formData.langCoordinagee }} setFormData={setFormData} />
                    </Grid>
                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
                        <Button
                            variant='contained'
                            size='large'
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Create Polls
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default CreatePolls
