// 'use client'
// import {
//     Card,
//     CardHeader,
//     CardContent,
//     Typography,
//     Grid,
//     TextField,
//     Checkbox,
//     FormControlLabel,
//     Button,
//     Box,
//     Avatar,
//     Divider
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { PhotoCamera, CheckCircle, Cancel } from '@mui/icons-material';
// import ImageService from "@/services/imageService"
// import { toast } from 'react-toastify';

// const InvoiceSettingForm = ({ addInvoice, fetcheddata, updateSetting }) => {

//     console.log(addInvoice, fetcheddata, updateSetting);


//     const [data, setData] = useState({
//         icon: "",
//         company_name: '',
//         address: '',
//         terms: '',
//         signature: '',
//         company_gst_number: '',
//         company_pan_number: '',

//     });

//     console.log(data, "sss")
//     useEffect(() => {
//         if (fetcheddata) {
//             setData(fetcheddata);
//         }
//     }, [fetcheddata]);


//     const [formErrors, setFormErrors] = useState({});

//     const validateFields = (data) => {
//         let errors = {}
//         if (!data.icon) errors.icon = 'Icon is required'
//         if (!data.company_name) errors.company_name = 'Company Name is required'
//         if (!data.address) errors.address = 'Address is required'
//         if (!data.terms) errors.terms = 'Terms And Conditions are required'
//         if (!data.company_gst_number) errors.company_gst_number = 'Company GST Number is required'
//         if (!data.company_pan_number) errors.company_pan_number = 'Company PAN Number is required'
//         if (!data.signature) errors.signature = 'Signature is required'
//         return errors
//     }

//     const onchangeimage = async (e) => {
//         const { name, files } = e.target
//         console.log(name, "sss")
//         if (files && files[0]) {
//             const result = await ImageService.uploadImage({ image: files[0] })
//             if (result.data.url) {
//                 setData(prev => ({
//                     ...prev,
//                     [name]: result.data.url
//                 }))
//                 if (formErrors[name]) {
//                     setFormErrors(prev => ({ ...prev, [name]: '' }))
//                 }
//             }
//         }
//     }

//     const handleChange = (event) => {
//         const { name, value, type, checked } = event.target;
//         setData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));

//         // Clear validation error when user starts typing
//         if (formErrors[name]) {
//             setFormErrors(prev => ({ ...prev, [name]: '' }))
//         }
//     };

//     const removeImage = () => {
//         setData(prev => ({
//             ...prev,
//             icon: '',
//         }));
//         // Clear icon error when removing image
//         if (formErrors.icon) {
//             setFormErrors(prev => ({ ...prev, icon: '' }))
//         }
//     };

//     const removeSignatureImage = () => {
//         setData(prev => ({
//             ...prev,
//             signature: '',
//         }));
//         // Clear icon error when removing image
//         if (formErrors.icon) {
//             setFormErrors(prev => ({ ...prev, icon: '' }))
//         }
//     };

//     const handleSubmit = async () => {
//         const errors = validateFields(data);
//         setFormErrors(errors);

//         if (Object.keys(errors).length === 0) {
//             if (fetcheddata._id) {
//                 // Update existing settings
//                 const res = await updateSetting(fetcheddata?._id, data);
//                 if (res.success === true) {
//                     toast.success(res?.message);
//                     return
//                 }
//                 console.log(res, "dd")
//                 toast.error(res?.message);
//             } else {
//                 // Create new settings
//                 const res = await addInvoice(data);
//                 if (res.success === true) {
//                     toast.success(res?.message);
//                     return;
//                 }
//                 toast.error(res?.message);
//             }

//         } else {
//             console.log('Form validation failed:', errors);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-BackgroundPaper p-4">
//             <div className="max-w-6xl mx-auto">
//                 <Typography
//                     variant="h4"
//                     className="mb-2 font-bold text-textPrimary"
//                 >
//                     Invoice Settings
//                 </Typography>

//                 <Card className="shadow-lg rounded-lg bg-paper">
//                     <CardHeader
//                         title="Company Information"
//                         subheader="Update your company details for invoices"
//                         className="bg-cardHeader"
//                         titleTypographyProps={{ className: 'text-textPrimary' }}
//                         subheaderTypographyProps={{ className: 'text-textSecondary' }}
//                     />

//                     <CardContent className="p-4">
//                         <Grid container spacing={3}>
//                             {/* Logo Upload Section */}
//                             <Grid item xs={12} md={4}>
//                                 <Typography
//                                     variant="h6"
//                                     className="mb-3 font-semibold text-textPrimary"
//                                 >
//                                     Company Logo
//                                 </Typography>

//                                 <Box className="flex flex-col items-center">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         name='icon'
//                                         onChange={onchangeimage}
//                                         style={{ display: 'none' }}
//                                         id="image-input"
//                                     />

//                                     <label htmlFor="image-input" className="mb-3">
//                                         <Button
//                                             variant="contained"
//                                             component="span"
//                                             startIcon={<PhotoCamera />}
//                                             className="bg-primary hover:bg-primaryDark"
//                                         >
//                                             Upload Logo
//                                         </Button>
//                                     </label>

//                                     {formErrors.icon && (
//                                         <Typography variant="body2" color="error" className="text-sm mb-2">
//                                             {formErrors.icon}
//                                         </Typography>
//                                     )}

//                                     {data.icon ? (
//                                         <Box className="relative">
//                                             <Avatar
//                                                 variant="rounded"
//                                                 className="w-28 h-28 border-2 border-borderColor"
//                                             >
//                                                 <img
//                                                     src={data.icon}
//                                                     alt="Company Logo"
//                                                     width={112}
//                                                     height={112}
//                                                     className="object-contain w-full h-full"
//                                                 />
//                                             </Avatar>
//                                             <Button
//                                                 onClick={removeImage}
//                                                 color="error"
//                                                 size="small"
//                                                 className="absolute -top-2 -right-2 min-w-0 p-1 bg-paper shadow-md"
//                                             >
//                                                 <Cancel fontSize="small" />
//                                             </Button>
//                                         </Box>
//                                     ) : (
//                                         <Avatar
//                                             variant="rounded"
//                                             className="w-28 h-28 bg-background border-2 border-dashed border-borderColor"
//                                         >
//                                             <Typography className="text-textSecondary text-center text-sm">
//                                                 No Logo Selected
//                                             </Typography>
//                                         </Avatar>
//                                     )}
//                                 </Box>

//                                 <Box className="flex flex-col items-center my-2">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         name='signature'
//                                         onChange={onchangeimage}
//                                         style={{ display: 'none' }}
//                                         id="signature-input"
//                                     />

//                                     <label htmlFor="signature-input" className="mb-3">
//                                         <Button
//                                             variant="contained"
//                                             component="span"
//                                             startIcon={<PhotoCamera />}
//                                             className="bg-primary hover:bg-primaryDark"
//                                         >
//                                             Upload Signature
//                                         </Button>
//                                     </label>

//                                     {formErrors.signature && (
//                                         <Typography variant="body2" color="error" className="text-sm mb-2">
//                                             {formErrors.signature}
//                                         </Typography>
//                                     )}

//                                     {data.signature ? (
//                                         <Box className="relative">
//                                             <Avatar
//                                                 variant="rounded"
//                                                 className="w-28 h-28 border-2 border-borderColor"
//                                             >
//                                                 <img
//                                                     src={data.signature}
//                                                     alt="Company Logo"
//                                                     width={112}
//                                                     height={112}
//                                                     className="object-contain w-full h-full"
//                                                 />
//                                             </Avatar>
//                                             <Button
//                                                 onClick={removeSignatureImage}
//                                                 color="error"
//                                                 size="small"
//                                                 className="absolute -top-2 -right-2 min-w-0 p-1 bg-paper shadow-md"
//                                             >
//                                                 <Cancel fontSize="small" />
//                                             </Button>
//                                         </Box>
//                                     ) : (
//                                         <Avatar
//                                             variant="rounded"
//                                             className="w-28 h-28 bg-background border-2 border-dashed border-borderColor"
//                                         >
//                                             <Typography className="text-textSecondary text-center text-sm">
//                                                 No Signature Selected
//                                             </Typography>
//                                         </Avatar>
//                                     )}
//                                 </Box>
//                             </Grid>

//                             <Divider
//                                 orientation="vertical"
//                                 flexItem
//                                 className="hidden md:block border-borderColor"
//                             />

//                             {/* Company Details Section */}
//                             <Grid item xs={12} md={7} className="pl-0 md:pl-4">
//                                 <Typography
//                                     variant="h6"
//                                     className="mb-3 font-semibold text-textPrimary"
//                                 >
//                                     Company Details
//                                 </Typography>

//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label="Company Name"
//                                             name="company_name"
//                                             value={data.company_name || ''}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!formErrors.company_name}
//                                             helperText={formErrors.company_name}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />
//                                     </Grid>

//                                     <Grid item xs={12} >
//                                         <TextField
//                                             className='my-2'
//                                             label="Address"
//                                             name="address"
//                                             value={data?.address || ''}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             multiline
//                                             rows={2}
//                                             size="small"
//                                             error={!!formErrors.address}
//                                             helperText={formErrors.address}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label="Email"
//                                             name="email"
//                                             value={data.email || ''}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!formErrors.email}
//                                             helperText={formErrors.email}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} className='my-2'>
//                                         <TextField
//                                             label="Contact Number"
//                                             name="contact_no"
//                                             value={data.contact_no || ''}
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 // Allow only digits
//                                                 if (/^\d*$/.test(value)) {
//                                                     handleChange(e);
//                                                 }
//                                             }}
//                                             inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 15 }} // optional maxLength
//                                             fullWidth
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!formErrors.contact_no}
//                                             helperText={formErrors.contact_no}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />

//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label="Company GST Number"
//                                             name="company_gst_number"
//                                             value={data.company_gst_number || ''}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!formErrors.company_gst_number}
//                                             helperText={formErrors.company_gst_number}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} className='my-2'>
//                                         <TextField
//                                             label="Company Pan Number"
//                                             name="company_pan_number"
//                                             value={data.company_pan_number || ''}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             size="small"
//                                             error={!!formErrors.company_pan_number}
//                                             helperText={formErrors.company_pan_number}
//                                             InputLabelProps={{ className: 'text-textSecondary' }}
//                                             InputProps={{ className: 'text-textPrimary' }}
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                         </Grid>

//                         <Divider className="my-4 border-borderColor" />

//                         {/* Terms and Conditions Section */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 <Typography variant="h6" className="mb-2 font-semibold text-textPrimary">
//                                     Terms & Conditions
//                                 </Typography>

//                                 <TextField
//                                     label="Invoice Terms"
//                                     name="terms"
//                                     className='my-2'
//                                     value={data?.terms || ''}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     variant="outlined"
//                                     multiline
//                                     rows={3}
//                                     size="small"
//                                     error={!!formErrors.terms}
//                                     helperText={formErrors.terms}
//                                     placeholder="Enter your standard invoice terms and conditions..."
//                                     InputLabelProps={{ className: 'text-textSecondary' }}
//                                     InputProps={{ className: 'text-textPrimary' }}
//                                 />

//                                 <TextField
//                                     label="Events Terms"
//                                     name="event_terms"
//                                     className='my-2'
//                                     value={data?.event_terms || ''}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     variant="outlined"
//                                     multiline
//                                     rows={3}
//                                     size="small"
//                                     error={!!formErrors.event_terms}
//                                     helperText={formErrors.event_terms}
//                                     placeholder="Enter your standard Events terms and conditions..."
//                                     InputLabelProps={{ className: 'text-textSecondary' }}
//                                     InputProps={{ className: 'text-textPrimary' }}
//                                 />

//                                 <TextField
//                                     label="Proposal Terms"
//                                     name="proposal_terms"
//                                     className='my-2'
//                                     value={data?.proposal_terms || ''}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     variant="outlined"
//                                     multiline
//                                     rows={3}
//                                     size="small"
//                                     error={!!formErrors.proposal_terms}
//                                     helperText={formErrors.proposal_terms}
//                                     placeholder="Enter your standard Proposal terms and conditions..."
//                                     InputLabelProps={{ className: 'text-textSecondary' }}
//                                     InputProps={{ className: 'text-textPrimary' }}
//                                 />

//                                 {/* <FormControlLabel
//                                     control={
//                                         <Checkbox
//                                             name="termsAndConditions"
//                                             checked={data?.termsAndConditions || ''}
//                                             onChange={handleChange}
//                                             color="primary"
//                                             size="small"
//                                         />
//                                     }
//                                     // label={
//                                     //     <span className="text-sm text-textPrimary">
//                                     //         I confirm that the information provided is accurate and agree to the{' '}
//                                     //         <a href="#" className="text-primary hover:underline">terms and conditions</a>
//                                     //     </span>
//                                     // }
//                                     className="mt-2"
//                                 /> */}
//                             </Grid>
//                         </Grid>
//                     </CardContent>
//                 </Card>

//                 <Box className="flex justify-end mt-4 gap-3">
//                     <Button
//                         variant="outlined"
//                         className="border-borderColor text-textPrimary hover:border-borderDark text-sm"
//                         size="small"
//                     >
//                         Cancel
//                     </Button>
//                     {(fetcheddata._id ? (
//                         <Button
//                             variant="contained"
//                             className="bg-primary hover:bg-primaryDark text-sm text-white"
//                             size="small"
//                             onClick={handleSubmit}

//                         >
//                             Update Settings
//                         </Button>
//                     ) :
//                         <Button
//                             variant="contained"
//                             className="bg-primary hover:bg-primaryDark text-sm text-white"
//                             size="small"
//                             onClick={handleSubmit}
//                         // disabled={!data?.termsAndConditions}
//                         >
//                             Add Settings
//                         </Button>
//                     )}
//                 </Box>
//             </div>
//         </div>
//     );
// };

// export default InvoiceSettingForm;


'use client'
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    Avatar,
    Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PhotoCamera, CheckCircle, Cancel } from '@mui/icons-material';
import ImageService from "@/services/imageService"
import { toast } from 'react-toastify';

const InvoiceSettingForm = ({ addInvoice, fetcheddata, updateSetting }) => {

    console.log(addInvoice, fetcheddata, updateSetting);


    const [data, setData] = useState({
        icon: "",
        company_name: '',
        address: '',
        terms: '',
        event_terms: '',
        proposal_terms: '',
        signature: '',
        company_gst_number: '',
        company_pan_number: '',

    });

    console.log(data, "sss")
    useEffect(() => {
        if (fetcheddata) {
            // Convert array to string for display
            const processedData = {
                ...fetcheddata,
                terms: Array.isArray(fetcheddata.terms)
                    ? fetcheddata.terms.join('\n')
                    : (fetcheddata.terms || ''),
                event_terms: Array.isArray(fetcheddata.event_terms)
                    ? fetcheddata.event_terms.join('\n')
                    : (fetcheddata.event_terms || ''),
                proposal_terms: Array.isArray(fetcheddata.proposal_terms)
                    ? fetcheddata.proposal_terms.join('\n')
                    : (fetcheddata.proposal_terms || '')
            };
            setData(processedData);
        }
    }, [fetcheddata]);


    const [formErrors, setFormErrors] = useState({});

    const validateFields = (data) => {
        let errors = {}
        if (!data.icon) errors.icon = 'Icon is required'
        if (!data.company_name) errors.company_name = 'Company Name is required'
        if (!data.address) errors.address = 'Address is required'
        if (!data.terms || data.terms.trim() === '') errors.terms = 'Terms And Conditions are required'
        if (!data.company_gst_number) errors.company_gst_number = 'Company GST Number is required'
        if (!data.company_pan_number) errors.company_pan_number = 'Company PAN Number is required'
        if (!data.signature) errors.signature = 'Signature is required'
        return errors
    }

    const onchangeimage = async (e) => {
        const { name, files } = e.target
        console.log(name, "sss")
        if (files && files[0]) {
            const result = await ImageService.uploadImage({ image: files[0] })
            if (result.data.url) {
                setData(prev => ({
                    ...prev,
                    [name]: result.data.url
                }))
                if (formErrors[name]) {
                    setFormErrors(prev => ({ ...prev, [name]: '' }))
                }
            }
        }
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        // For terms fields, store as string temporarily (will convert to array on submit)
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear validation error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    };

    const removeImage = () => {
        setData(prev => ({
            ...prev,
            icon: '',
        }));
        // Clear icon error when removing image
        if (formErrors.icon) {
            setFormErrors(prev => ({ ...prev, icon: '' }))
        }
    };

    const removeSignatureImage = () => {
        setData(prev => ({
            ...prev,
            signature: '',
        }));
        // Clear icon error when removing image
        if (formErrors.icon) {
            setFormErrors(prev => ({ ...prev, icon: '' }))
        }
    };

    const handleSubmit = async () => {
        const errors = validateFields(data);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            // Convert string to array for submission
            const submitData = {
                ...data,
                terms: data.terms ? data.terms.split('\n').filter(t => t.trim()) : [],
                event_terms: data.event_terms ? data.event_terms.split('\n').filter(t => t.trim()) : [],
                proposal_terms: data.proposal_terms ? data.proposal_terms.split('\n').filter(t => t.trim()) : [],
            };

            if (fetcheddata._id) {
                // Update existing settings
                const res = await updateSetting(fetcheddata?._id, submitData);
                if (res.success === true) {
                    toast.success(res?.message);
                    return
                }
                console.log(res, "dd")
                toast.error(res?.message);
            } else {
                // Create new settings
                const res = await addInvoice(submitData);
                if (res.success === true) {
                    toast.success(res?.message);
                    return;
                }
                toast.error(res?.message);
            }

        } else {
            console.log('Form validation failed:', errors);
        }
    };

    return (
        <div className="min-h-screen bg-BackgroundPaper p-4">
            <div className="max-w-6xl mx-auto">
                <Typography
                    variant="h4"
                    className="mb-2 font-bold text-textPrimary"
                >
                    Invoice Settings
                </Typography>

                <Card className="shadow-lg rounded-lg bg-paper">
                    <CardHeader
                        title="Company Information"
                        subheader="Update your company details for invoices"
                        className="bg-cardHeader"
                        titleTypographyProps={{ className: 'text-textPrimary' }}
                        subheaderTypographyProps={{ className: 'text-textSecondary' }}
                    />

                    <CardContent className="p-4">
                        <Grid container spacing={3}>
                            {/* Logo Upload Section */}
                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="h6"
                                    className="mb-3 font-semibold text-textPrimary"
                                >
                                    Company Logo
                                </Typography>

                                <Box className="flex flex-col items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name='icon'
                                        onChange={onchangeimage}
                                        style={{ display: 'none' }}
                                        id="image-input"
                                    />

                                    <label htmlFor="image-input" className="mb-3">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<PhotoCamera />}
                                            className="bg-primary hover:bg-primaryDark"
                                        >
                                            Upload Logo
                                        </Button>
                                    </label>

                                    {formErrors.icon && (
                                        <Typography variant="body2" color="error" className="text-sm mb-2">
                                            {formErrors.icon}
                                        </Typography>
                                    )}

                                    {data.icon ? (
                                        <Box className="relative">
                                            <Avatar
                                                variant="rounded"
                                                className="w-28 h-28 border-2 border-borderColor"
                                            >
                                                <img
                                                    src={data.icon}
                                                    alt="Company Logo"
                                                    width={112}
                                                    height={112}
                                                    className="object-contain w-full h-full"
                                                />
                                            </Avatar>
                                            <Button
                                                onClick={removeImage}
                                                color="error"
                                                size="small"
                                                className="absolute -top-2 -right-2 min-w-0 p-1 bg-paper shadow-md"
                                            >
                                                <Cancel fontSize="small" />
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Avatar
                                            variant="rounded"
                                            className="w-28 h-28 bg-background border-2 border-dashed border-borderColor"
                                        >
                                            <Typography className="text-textSecondary text-center text-sm">
                                                No Logo Selected
                                            </Typography>
                                        </Avatar>
                                    )}
                                </Box>

                                <Box className="flex flex-col items-center my-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name='signature'
                                        onChange={onchangeimage}
                                        style={{ display: 'none' }}
                                        id="signature-input"
                                    />

                                    <label htmlFor="signature-input" className="mb-3">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<PhotoCamera />}
                                            className="bg-primary hover:bg-primaryDark"
                                        >
                                            Upload Signature
                                        </Button>
                                    </label>

                                    {formErrors.signature && (
                                        <Typography variant="body2" color="error" className="text-sm mb-2">
                                            {formErrors.signature}
                                        </Typography>
                                    )}

                                    {data.signature ? (
                                        <Box className="relative">
                                            <Avatar
                                                variant="rounded"
                                                className="w-28 h-28 border-2 border-borderColor"
                                            >
                                                <img
                                                    src={data.signature}
                                                    alt="Company Logo"
                                                    width={112}
                                                    height={112}
                                                    className="object-contain w-full h-full"
                                                />
                                            </Avatar>
                                            <Button
                                                onClick={removeSignatureImage}
                                                color="error"
                                                size="small"
                                                className="absolute -top-2 -right-2 min-w-0 p-1 bg-paper shadow-md"
                                            >
                                                <Cancel fontSize="small" />
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Avatar
                                            variant="rounded"
                                            className="w-28 h-28 bg-background border-2 border-dashed border-borderColor"
                                        >
                                            <Typography className="text-textSecondary text-center text-sm">
                                                No Signature Selected
                                            </Typography>
                                        </Avatar>
                                    )}
                                </Box>
                            </Grid>

                            <Divider
                                orientation="vertical"
                                flexItem
                                className="hidden md:block border-borderColor"
                            />

                            {/* Company Details Section */}
                            <Grid item xs={12} md={7} className="pl-0 md:pl-4">
                                <Typography
                                    variant="h6"
                                    className="mb-3 font-semibold text-textPrimary"
                                >
                                    Company Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Company Name"
                                            name="company_name"
                                            value={data.company_name || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            error={!!formErrors.company_name}
                                            helperText={formErrors.company_name}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            className='my-2'
                                            label="Address"
                                            name="address"
                                            value={data?.address || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            size="small"
                                            error={!!formErrors.address}
                                            helperText={formErrors.address}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            value={data.email || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            error={!!formErrors.email}
                                            helperText={formErrors.email}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='my-2'>
                                        <TextField
                                            label="Contact Number"
                                            name="contact_no"
                                            value={data.contact_no || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow only digits
                                                if (/^\d*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 15 }}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            error={!!formErrors.contact_no}
                                            helperText={formErrors.contact_no}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />

                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Company GST Number"
                                            name="company_gst_number"
                                            value={data.company_gst_number || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            error={!!formErrors.company_gst_number}
                                            helperText={formErrors.company_gst_number}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='my-2'>
                                        <TextField
                                            label="Company Pan Number"
                                            name="company_pan_number"
                                            value={data.company_pan_number || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            error={!!formErrors.company_pan_number}
                                            helperText={formErrors.company_pan_number}
                                            InputLabelProps={{ className: 'text-textSecondary' }}
                                            InputProps={{ className: 'text-textPrimary' }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Divider className="my-4 border-borderColor" />

                        {/* Terms and Conditions Section */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="mb-2 font-semibold text-textPrimary">
                                    Terms & Conditions
                                </Typography>

                                <TextField
                                    label="Invoice Terms (Enter each term on a new line)"
                                    name="terms"
                                    className='my-2'
                                    value={data?.terms || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    size="small"
                                    error={!!formErrors.terms}
                                    helperText={formErrors.terms || "Har line ek alag term hogi"}
                                    placeholder="Enter your standard invoice terms and conditions..."
                                    InputLabelProps={{ className: 'text-textSecondary' }}
                                    InputProps={{ className: 'text-textPrimary' }}
                                />

                                <TextField
                                    label="Events Terms (Enter each term on a new line)"
                                    name="event_terms"
                                    className='my-2'
                                    value={data?.event_terms || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    size="small"
                                    error={!!formErrors.event_terms}
                                    helperText={formErrors.event_terms || "Har line ek alag term hogi"}
                                    placeholder="Enter your standard Events terms and conditions..."
                                    InputLabelProps={{ className: 'text-textSecondary' }}
                                    InputProps={{ className: 'text-textPrimary' }}
                                />

                                <TextField
                                    label="Proposal Terms (Enter each term on a new line)"
                                    name="proposal_terms"
                                    className='my-2'
                                    value={data?.proposal_terms || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    size="small"
                                    error={!!formErrors.proposal_terms}
                                    helperText={formErrors.proposal_terms || "Har line ek alag term hogi"}
                                    placeholder="Enter your standard Proposal terms and conditions..."
                                    InputLabelProps={{ className: 'text-textSecondary' }}
                                    InputProps={{ className: 'text-textPrimary' }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Box className="flex justify-end mt-4 gap-3">
                    <Button
                        variant="outlined"
                        className="border-borderColor text-textPrimary hover:border-borderDark text-sm"
                        size="small"
                    >
                        Cancel
                    </Button>
                    {(fetcheddata._id ? (
                        <Button
                            variant="contained"
                            className="bg-primary hover:bg-primaryDark text-sm text-white"
                            size="small"
                            onClick={handleSubmit}

                        >
                            Update Settings
                        </Button>
                    ) :
                        <Button
                            variant="contained"
                            className="bg-primary hover:bg-primaryDark text-sm text-white"
                            size="small"
                            onClick={handleSubmit}
                        >
                            Add Settings
                        </Button>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default InvoiceSettingForm;
