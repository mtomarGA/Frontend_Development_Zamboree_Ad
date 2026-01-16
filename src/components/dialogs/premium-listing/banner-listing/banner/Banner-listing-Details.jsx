import { Box, Button, Card, CardContent, CardMedia, Divider, InputAdornment, MenuItem, TextField, Typography } from "@mui/material"
import { Grid } from "@mui/system"
import Image from "next/image";
import BannerListing from "@/services/premium-listing/banner.service"
import PaidListing from "@/services/premium-listing/paidListing.service"
import GenerateInvoiceBanner from "@/services/premium-listing/banner.service"
import { useEffect, useState } from "react";
import FixedListing from "@/services/premium-listing/fixedListing.service"
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import companyData from "@/services/premium-listing/banner.service"
import ProposalGenerateBanner from "@/services/premium-listing/banner.service";
import CustomTextField from "@/@core/components/mui/TextField";
const BannerListingDetail = ({ banner, closeModel, getBanner }) => {

    const [bannerData, setBannerData] = useState()
    useEffect(() => {
        setBannerData(banner)
    }, [banner])
    const [discount, setDiscount] = useState(0);
    // const [clientNote, setClientNote] = useState();
    const [clientNote, setClientNote] = useState(""); // for TextField
    const [condition, setCondition] = useState("")
    const [discountType, setDiscountType] = useState("%");
    const [terms, setTerms] = useState([]);
    const [clientNoteArray, setClientNoteArray] = useState([]);
    const [company, setCompany] = useState([])
    const handleClientNoteChange = (e) => {
        const value = e.target.value;
        setClientNote(value);
        const linesArray = value
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

        setClientNoteArray(linesArray);
    };
    const handleCondition = (e) => {
        const value = e.target.value;
        const linesArray = value
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

        if (linesArray.length > terms.length) {
            const newLines = linesArray.slice(terms.length);
            setTerms([...terms, ...newLines]);
        } else {
            setTerms(linesArray);
        }
        setCondition(value);
    };

    const getSingleBanner = async (id) => {
        const result = await BannerListing.getSingleBanner(id)
        setDiscountType(result?.data?.discountType || "%")
        setDiscount(result?.data?.descount || "")
        setCondition(
            (result?.data?.termsAndConditions || [])
                .map((item, index) => `${index + 1}. ${item}`)
                .join('\n')
        );
        setClientNote(
            (result?.data?.clientNote || [])
                .map((item, index) => `${index + 1}. ${item}`)
                .join('\n')
        );
        setBannerData(result?.data || [])
        if (!result?.data?.termsAndConditions.length > 0) {
            OurCopmanyDeta()
        }
    }
    useEffect(() => {
        const termsArray = Array.isArray(company?.proposal_terms)
            ? company.proposal_terms
            : [];
        setTerms(termsArray);
        setCondition(termsArray.join("\n"));
    }, [company]);

    const getPaidListing = async (id) => {
        const result = await PaidListing.getSinglePaidListing(id)
        setBannerData(result?.data || [])
    }
    const getFixedListing = async (id) => {
        const result = await FixedListing.getSingleFixedListing(id)
        setBannerData(result?.data || [])
    }
    const OurCopmanyDeta = async () => {
        const result = await companyData.CompanyDetails()
        setCompany(result?.data[0])
    }


    useEffect(() => {
        const Id = banner?._id
        if (banner?.basicDetails?.order) {
            getPaidListing(Id);
            return
        }
        else if (banner?.location?.keywords) {
            getFixedListing(Id)
        }
        else {
            getSingleBanner(banner);
        }
    }, [banner])

    const total = bannerData?.amount?.EstimateTotal || 0;
    let totalWithDiscount = total;

    if (discount && discountType === "%") {
        totalWithDiscount = total - (discount / 100) * total;
    } else if (discount && discountType === "fixed") {
        totalWithDiscount = total - discount;
    }


    const handleProposal = async () => {
        const data = {
            status: "PROPOSAL",
            proposalDate: new Date().toISOString(),
            descount: discount,
            clientNote: clientNoteArray,
            termsAndConditions: terms,
            discountType: discountType,
            totalwithDescount: totalWithDiscount.toFixed(2)
        };
       

        const result = await ProposalGenerateBanner.proposalGenerate(banner, data);
        toast.success(result.message)
        getBanner()
        closeModel(false)

    }


    return (
        <Box className="">
            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Basic Details
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }} md={4}>
                    <Card className="shadow-none ">
                        {bannerData?.basicDetails?.image && <img src={bannerData?.basicDetails?.image} alt="" className="w-full h-[350px]" />}
                        <Divider orientation="" flexItem className="hidden sm:block" />
                        <Box className="flex flex-col md:flex-row gap-2 mt-2">
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Package:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.basicDetails?.bannerPackage ||
                                        bannerData?.basicDetails?.paidListingPackage || bannerData?.basicDetails?.FixedListing || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Business Id :"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.basicDetails?.vendorId || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Business Name"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.basicDetails?.companyName}
                                </Typography>
                            </CardContent>
                        </Box>
                        <Box className="flex flex-col md:flex-row gap-2 mt-2">
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Per Day Price:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹ {bannerData?.basicDetails?.perDayPrice || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Publish Date:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {dayjs(bannerData?.basicDetails?.publishDate).format('DD MMM YYYY')}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Validity:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.basicDetails?.validity + " days"}
                                </Typography>
                            </CardContent>
                        </Box>

                    </Card>
                </Grid>
            </Grid>

            <Divider />
            {bannerData?.keywords && (<Typography variant="h5" className="mb-6 text-center  font-bold">
                Keywords
            </Typography>)}
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }} md={4}>
                    <Card className="shadow-none ">
                        {bannerData?.keywords && (<Box className="flex flex-col md:flex-row gap-2 mt-2">
                            {
                                bannerData?.keywords?.map((keyword, index) => (
                                    <CardContent key={index} className="flex flex-col gap-2 md:flex-row  p-4 text-start">
                                        <Typography variant="body2" color="text.secondary">
                                            {index + 1 + "."} {keyword || "N/A"}
                                        </Typography>
                                    </CardContent>
                                ))
                            }
                        </Box>)}

                    </Card>
                </Grid>

            </Grid>
            <Divider />
            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Location
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }} >
                    <Card className="shadow-none">
                        <Box className="flex flex-wrap items-center gap-4 w-full p-4">
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Country :"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.location?.country?.name || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"State :"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.location?.state?.name || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"City :"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bannerData?.location?.city?.name || "N/A"}
                                </Typography>
                            </CardContent>

                        </Box>
                        <Box>
                            <CardContent className="flex flex-col gap-4 p-4 text-start">
                                {/* Main title */}
                                <Typography gutterBottom variant="h6" component="div">
                                    Area:
                                </Typography>

                                {/* Display areas */}
                                {bannerData?.location?.area && (
                                    <Typography variant="body2" color="text.secondary" className="mb-4">
                                        {bannerData.location.area.map((area) => area.name).join(", ") || "N/A"}
                                    </Typography>
                                )}

                                {/* Keywords section */}
                                {bannerData?.location?.keywords && (
                                    <Box className="flex flex-col gap-4 w-full">
                                        {bannerData.location.keywords.map((keyword, index) => (
                                            <Box
                                                key={index}
                                                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                {/* Optional Keyword header */}
                                                {keyword.name && (
                                                    <Typography
                                                        variant="subtitle1"
                                                        className="mb-2 font-semibold text-gray-700"
                                                    >
                                                        {keyword.name}
                                                    </Typography>
                                                )}

                                                {/* Table headers */}
                                                <Box className="grid grid-cols-3 gap-4 font-semibold border-b border-gray-300 pb-2 mb-2 text-gray-600">
                                                    <Typography variant="body2">Keyword</Typography>
                                                    <Typography variant="body2">Area</Typography>
                                                    <Typography variant="body2">Position</Typography>
                                                </Box>

                                                {/* Table rows */}
                                                {keyword.areas.map((area, idx) => (
                                                    <Box
                                                        key={idx}
                                                        className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <Typography variant="body2" className="text-gray-800">
                                                            {keyword.keyName || "-"}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-gray-800">
                                                            {area?.areaId?.name || "N/A"}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-gray-800">
                                                            {area?.position || "-"}
                                                        </Typography>

                                                    </Box>
                                                ))}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>


                        </Box>

                    </Card>
                </Grid>

            </Grid>
            <Divider />
            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Amount
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }} >
                    <Card className="shadow-none ">

                        <Box className="flex flex-col md:flex-row gap-2 mt-2">
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"SubTotal:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹    {bannerData?.amount?.Subtotal || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"TAX18:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹ {bannerData?.amount?.TAX18 || "N/A"}
                                </Typography>
                            </CardContent>

                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"RoundOFF"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹ 0. {bannerData?.amount?.RoundOFF}
                                </Typography>
                            </CardContent>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"total Amount:"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹ {bannerData?.amount?.EstimateTotal}
                                </Typography>
                            </CardContent>
                        </Box>
                        <Divider />
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CustomTextField
                                    fullWidth
                                    label="Discount"
                                    variant="outlined"
                                    disabled={bannerData?.status !== "PENDING"}
                                    value={discount}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        const digitsOnly = rawVal.replace(/\D/g, '');
                                        setDiscount(digitsOnly);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" sx={{ m: 0 }}>
                                                <TextField
                                                    select
                                                    value={discountType}
                                                    disabled={bannerData?.status !== "PENDING"}
                                                    onChange={(e) => setDiscountType(e.target.value)}
                                                    variant="standard"
                                                    size="small"
                                                    sx={{
                                                        width: 70,
                                                        '& .MuiInputBase-root': {
                                                            border: 'none',
                                                            background: 'transparent',
                                                            fontSize: '14px',
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            padding: 0,
                                                            textAlign: 'center',
                                                        },
                                                        '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                                                            borderBottom: 'none',
                                                        },
                                                        '& fieldset': {
                                                            border: 'none',
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="%">%</MenuItem>
                                                    <MenuItem value="fixed">Fixed</MenuItem>
                                                </TextField>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography className="mt-3">
                                    New total Price : ₹ {totalWithDiscount.toFixed(2)}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <CustomTextField
                                    fullWidth
                                    multiline
                                    disabled={bannerData?.status !== "PENDING"}
                                    rows={3}
                                    label="Client Note"
                                    variant="outlined"
                                    value={clientNote}
                                    onChange={handleClientNoteChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <CustomTextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    disabled={bannerData?.status !== "PENDING"}
                                    label="Terms & Conditions"
                                    variant="outlined"
                                    value={condition}
                                    onChange={handleCondition}
                                />
                            </Grid>
                        </Grid>

                        {bannerData?.status === "PENDING" && (
                            <Grid className="mt-3">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleProposal}
                                >
                                    Convert To Proposal
                                </Button>
                            </Grid>
                        )}
                    </Card>
                </Grid>

            </Grid>
        </Box>
    )
}

export default BannerListingDetail
