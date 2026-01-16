import { Box, Button, Card, CardContent, CardMedia, Divider, InputAdornment, MenuItem, TextField, Typography } from "@mui/material"
import { Grid } from "@mui/system"
import Image from "next/image";
import Paid from "@/services/premium-listing/paidListing.service"
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
import ProposalGeneratePaidListing from "@/services/premium-listing/paidListing.service";
import companyData from "@/services/premium-listing/banner.service"
import { toast } from "react-toastify";
import CustomTextField from "@/@core/components/mui/TextField";
const PaidListingDetail = ({ paidListingId, setModelDetail, getPaidListing }) => {

    const [discount, setDiscount] = useState(0);
    const [clientNote, setClientNote] = useState("");
     const [condition, setCondition] = useState("")
    const [discountType, setDiscountType] = useState("%");
    const [terms, setTerms] = useState([]);
    const [company, setCompany] = useState([])
    const [clientNoteArray, setClientNoteArray] = useState([]);
    const [PaidData, setPaidDataData] = useState()
    useEffect(() => {
        setPaidDataData(paidListingId)
    }, [paidListingId])
    const getSingleBanner = async (paidListingId) => {
        const result = await Paid.getSinglePaidListing(paidListingId);
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
        setPaidDataData(result.data || [])
        if (!result?.data?.termsAndConditions.length > 0) {
            OurCopmanyDeta()
        }
    }
    useEffect(() => {
        if (paidListingId) {
            const bannerId = paidListingId
            getSingleBanner(bannerId);

        }
    }, [paidListingId])
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
   useEffect(() => {
        const termsArray = Array.isArray(company?.proposal_terms)
            ? company.proposal_terms
            : [];
        setTerms(termsArray);
        setCondition(termsArray.join("\n"));
    }, [company]);
    const OurCopmanyDeta = async () => {
        const result = await companyData.CompanyDetails()
        setCompany(result?.data[0])
    }


    const total = PaidData?.amount?.EstimateTotal || 0;
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
        console.log(data, "datadata");

        const result = await ProposalGeneratePaidListing.generateproposal(paidListingId, data);
        toast.success(result.message);
        getPaidListing()
        setModelDetail(false);
    }


    return (
        <Box className="">
            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Basic Details
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }} md={4}>
                    <Card className="shadow-none ">
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
                                    {PaidData?.basicDetails?.paidListingPackage || "N/A"}
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
                                    {PaidData?.basicDetails?.vendorId || "N/A"}
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
                                    {PaidData?.basicDetails?.companyName}
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
                                    ₹ {PaidData?.basicDetails?.perDayPrice || "N/A"}
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
                                    {dayjs(PaidData?.basicDetails?.publishDate).format('DD MMM YYYY')}
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
                                    {PaidData?.basicDetails?.validity + " days"}
                                </Typography>
                            </CardContent>
                        </Box>

                    </Card>
                </Grid>

            </Grid>

            <Divider />
            <Typography variant="h5" className="mb-6 text-center   font-bold">
                Keywords
            </Typography>
            <Grid container spacing={4}>
                <Grid container spacing={2}>
                    {PaidData?.keywords?.map((keyword, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CardContent className="p-2 text-start">
                                <Typography variant="body2" color="text.secondary">
                                    {index + 1}. {keyword || "N/A"}
                                </Typography>
                            </CardContent>
                        </Grid>
                    ))}
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
                                    {PaidData?.location?.country?.name || "N/A"}
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
                                    {PaidData?.location?.state?.name || "N/A"}
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
                                    {PaidData?.location?.city?.name || "N/A"}
                                </Typography>
                            </CardContent>

                        </Box>
                        <Box>
                            <CardContent className="flex flex-col gap-2 md:flex-row flex-1 p-4 text-start">
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    className="md:mr-4"
                                >
                                    {"Area :"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {PaidData?.location?.area.map((area) => area.name).join(' , ') || "N/A"}
                                </Typography>
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
                                    ₹    {PaidData?.amount?.Subtotal || "N/A"}
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
                                    ₹ {PaidData?.amount?.TAX18 || "N/A"}
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
                                    ₹ 0. {PaidData?.amount?.RoundOFF}
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
                                    ₹ {PaidData?.amount?.EstimateTotal}
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
                                    value={discount}
                                    disabled={PaidData?.status !== "PENDING"}
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
                                                    disabled={PaidData?.status !== "PENDING"}
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
                                    disabled={PaidData?.status !== "PENDING"}
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
                                    disabled={PaidData?.status !== "PENDING"}
                                    label="Terms & Conditions"
                                    variant="outlined"
                                    value={condition}
                                    onChange={handleCondition}
                                />
                            </Grid>
                        </Grid>
                        {PaidData?.status === "PENDING" &&
                            <Grid item className="mt-3">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleProposal}
                                >
                                    Convert To Proposal
                                </Button>
                            </Grid>}
                    </Card>
                </Grid>

            </Grid>
        </Box>
    )
}

export default PaidListingDetail
