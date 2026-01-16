import { Box, Button, Card, CardContent, CardMedia, Divider, InputAdornment, MenuItem, TextField, Typography } from "@mui/material"
import { Grid } from "@mui/system"
import FixedListingDetails from "@/services/premium-listing/fixedListing.service"
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import CustomTextField from "@/@core/components/mui/TextField";
import companyData from "@/services/premium-listing/banner.service"
const FixedListingDetail = ({ FixedListing, getFixedListing, setModelDetail }) => {

    const [discount, setDiscount] = useState(0);
    const [clientNote, setClientNote] = useState("");
    const [discountType, setDiscountType] = useState("%");
    const [terms, setTerms] = useState([]);
    const [clientNoteArray, setClientNoteArray] = useState([]);
    const [condition, setCondition] = useState("")

    const [FixedListingData, setFixedListingData] = useState()
    const [company, setCompany] = useState([])
    useEffect(() => {
        setFixedListingData(FixedListing)
    }, [FixedListing])
    const getSingleFixedListing = async (FixedListing) => {
        const result = await FixedListingDetails.getSingleFixedListing(FixedListing)
        // console.log(result, 'resultresult');
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
        setFixedListingData(result.data || [])
        if (!result?.data?.termsAndConditions?.length) {
            OurCopmanyDeta();
        }
    }
    useEffect(() => {
        if (FixedListing) {
            getSingleFixedListing(FixedListing);
        }
    }, [FixedListing])

    const OurCopmanyDeta = async () => {
        const result = await companyData.CompanyDetails()
        setCompany(result?.data[0])
    }
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
    const totalEstimate = FixedListingData?.amount?.EstimateTotal || 0;
    const totalWithDiscount =
        discountType === "%"
            ? totalEstimate - (discount / 100) * totalEstimate
            : discountType === "fixed"
                ? totalEstimate - discount
                : totalEstimate;

    const handleProposal = async () => {
        const data = {
            status: "PROPOSAL",
            proposalDate: new Date().toISOString(),
            descount: discount,
            clientNote: clientNoteArray,
            termsAndConditions: terms,
            discountType: discountType,
            totalwithDescount: totalWithDiscount
        };
        console.log(data, "datadata");

        const result = await FixedListingDetails.sendProposal(FixedListing, data);
        toast.success(result.message);
        getFixedListing()
        setModelDetail(false)
    }


    const allAreaNames = [];
    if (FixedListingData?.location?.keywords) {
        FixedListingData.location.keywords.forEach(item => {
            if (item?.areas) {
                item.areas.forEach(areaItem => {
                    if (areaItem?.areaId?.name) {
                        allAreaNames.push(areaItem);
                    }
                });
            }
        });
    }
    const allRows = FixedListingData?.location?.keywords?.flatMap(keyword =>
        keyword.areas.map(areaItem => ({
            areaName: areaItem.areaId?.name,
            keywordName: keyword.keyName,
            position: areaItem.position,
        }))
    ) || []; // Fallback to empty array

    const showTwoTables = allRows.length > 5;
    const firstHalf = allRows.slice(0, Math.ceil(allRows.length / 2));
    const secondHalf = allRows.slice(Math.ceil(allRows.length / 2));



    return (
        <Box className="">
            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Basic Details
            </Typography>
            <Grid container spacing={4}>
                {[
                    {
                        label: "Package:",
                        value: FixedListingData?.basicDetails?.FixedListing || "N/A",
                    },
                    {
                        label: "Business Id:",
                        value: FixedListingData?.basicDetails?.vendorId || "N/A",
                    },
                    {
                        label: "Business Name:",
                        value: FixedListingData?.basicDetails?.companyName || "N/A",
                    },
                    {
                        label: "Company Name:",
                        value: FixedListingData?.basicDetails?.vendor?.companyInfo?.companyName || "N/A",
                    },
                    {
                        label: "Publish Date:",
                        value: dayjs(FixedListingData?.basicDetails?.publishDate).format('DD MMM YYYY'),
                    },
                    {
                        label: "Validity:",
                        value: FixedListingData?.basicDetails?.validity + " days" || "N/A",
                    },
                ].map((item, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col md:flex-row gap-2 p-4 text-start">
                                <Typography gutterBottom variant="h6" component="div" className="md:mr-4">
                                    {item.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" className="mb-6 text-center  font-bold">
                Location
            </Typography>

            {/* Table Header */}
            <Grid container className="bg-gray-100 border-b border-gray-300  px-3 font-semibold">
                <div className="w-60 py-3 px-2  border-gray-300 text-start">
                    <Typography className="text-sm text-gray-800 font-bold">Area</Typography>
                </div>
                <div className="w-40 py-3 px-2 text-start border-gray-300 ">
                    <Typography className="text-sm text-gray-800 font-bold">Position</Typography>
                </div>
                <div className="w-40 py-3 px-2 text-start  border-gray-300">
                    <Typography className="text-sm text-gray-800 font-bold">Price</Typography>
                </div>
                <div className="w-40 py-3 px-2  text-start">
                    <Typography className="text-sm text-gray-800 font-bold">Keyword</Typography>
                </div>

            </Grid>
            {/* Data Rows */}
            {FixedListingData?.location?.keywords?.flatMap((keyword, keywordIndex) =>
                keyword.areas.map((areaItem, areaIndex) => (
                    <Grid
                        key={`${keywordIndex}-${areaIndex}`}
                        container
                        className='border-b border-gray-200  px-3 transition'
                    >
                        {/* Area */}
                        <div className="w-60 py-4 px-2  border-gray-200 text-start">
                            <Typography className="text-sm ">
                                {areaItem?.areaId?.name || "N/A"}
                            </Typography>
                        </div>
                        {/* Position */}
                        <div className="w-40 py-4 px-2  text-start">
                            <Typography className="text-sm ">
                                {areaItem?.position || "N/A"}
                            </Typography>
                        </div>
                        <div className="w-40 py-4 px-2  text-start">
                            <Typography className="text-sm ">
                                ₹  {areaItem?.budget || "00.00"}
                            </Typography>
                        </div>
                        {/* Keyword */}
                        <div className="w-40 py-4 px-2  border-gray-200 text-start">
                            <Typography className="text-sm ">
                                {keyword?.keyName || "N/A"}
                            </Typography>
                        </div>


                    </Grid>
                ))
            )}

            <Typography variant="h5" className="my-6 text-center  font-bold">
                Amount
            </Typography>
            <Grid container spacing={2}>
                {[
                    { label: FixedListingData?.basicDetails?.FixedListing, value: FixedListingData?.basicDetails?.perDayPrice },
                    { label: "Fixed Posation Sub Total", value: (FixedListingData?.amount?.Subtotal) - (FixedListingData?.basicDetails?.perDayPrice) || "N/A" },
                    { label: "SubTotal ", value: FixedListingData?.amount?.Subtotal || "N/A" },
                    { label: "TAX 18 %", value: FixedListingData?.amount?.TAX18 || "N/A" },
                    { label: "Round OFF", value: `0.${FixedListingData?.amount?.RoundOFF}` },
                    { label: "Total Amount", value: FixedListingData?.amount?.EstimateTotal }
                ].map((item, idx) => (
                    <Grid item xs={12} md={6} lg={4} key={idx}>
                        <Card className="shadow-none h-full">
                            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <Typography variant="h6" component="div">
                                    {item.label}:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹ {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Divider />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                        fullWidth
                        label="Discount"
                        variant="outlined"
                        value={discount}
                        disabled={FixedListingData?.status !== "PENDING"}
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
                                        disabled={FixedListingData?.status !== "PENDING"}
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
                        disabled={FixedListingData?.status !== "PENDING"}
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
                        disabled={FixedListingData?.status !== "PENDING"}
                        label="Terms & Conditions"
                        variant="outlined"
                        value={condition}
                        onChange={handleCondition}
                    />
                </Grid>
            </Grid>

            {FixedListingData?.status === "PENDING" &&
                <Grid className="mt-2">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProposal}
                    >
                        Convert To Proposal
                    </Button>
                </Grid>
            }
        </Box>
    )
}

export default FixedListingDetail
