import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableRow, TableHead, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { Grid } from '@mui/system';
import { CheckIcon } from 'lucide-react';
import GSTValue from "@/services/premium-listing/gst.service"

const EditPaidListingInvoice = ({ formData, getPrice, handlePreviousClick }) => {

    const [gst, setGst] = useState()

    const packageName = formData?.basicDetails.bannerPackage
    const price = Number(formData?.basicDetails?.perDayPrice) || 0;
    const days = Number(formData?.basicDetails?.validity) || 0;
    const totalPrice = price * days;
    const totalPriceWithGST = totalPrice * 1.18;
    // Round to 2 decimal places (optional, for currency)
    const roundedTotal = Math.round(totalPriceWithGST * 100) / 100;
    const displayRoundedTotal = roundedTotal.toFixed(2);
    const originalPrice = totalPrice;
    const gstPercentage = gst;
    const gstAmount = ((originalPrice * gstPercentage) / 100).toFixed(2)
    let roundUpAmmount = roundedTotal

    const [isChecked, setIsChecked] = useState(false);
    const formatted = Number(gstAmount).toFixed(2); // Guarantees "111.60", "5.00", etc.
    const decimalPart = formatted.split('.')[1];
    // const decimalPart = gstAmount.toString().split('.')[1] || '00';

    if (decimalPart >= 6) {
        roundUpAmmount = Math.ceil(roundUpAmmount).toFixed(2) || '00'
    } else {

        roundUpAmmount = Math.floor(roundUpAmmount).toFixed(2) || '00'
    }

    const GetGSTPrice = async () => {
        const result = await GSTValue.getGSTValue()
        result.data.map((gst) => {
            const value = gst?.GST?.toString();
            setGst(value)
        })

    }
    useEffect(() => {
        GetGSTPrice()
    }, [])


    const [priceData, setPriceData] = useState({
        TAX18: '',
        Subtotal: "",
        RoundOFF: '',
        EstimateTotal: '',
         TAXPER:'',
    })



    useEffect(() => {
        setPriceData(prev => ({
            ...prev,
            TAX18: gstAmount,
            Subtotal: displayRoundedTotal || '',
            EstimateTotal: roundUpAmmount || '',
            RoundOFF: decimalPart,
             TAXPER:gst
        }));
    }, [gstAmount, decimalPart,displayRoundedTotal,roundUpAmmount]); // add dependencies here

    useEffect(() => {
        getPrice(priceData)
    }, [priceData])

   


    const handleToggle = () => {
        setIsChecked(!isChecked);
        // Add invoice generation logic when toggled ON
        if (!isChecked) {
            console.log('Invoice generation initiated');
            // Your API call or logic here
        }
    };

    const handleRemoveKeyword = async () => {
        handlePreviousClick()
    }


    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card elevation={3} className="mb-6 shadow-none">
                <CardContent>
                    <Table className="mb-6">
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-bold">Package Name</TableCell>
                                <TableCell className="font-bold" align="right">Per Day Value</TableCell>
                                <TableCell className="font-bold" align="right">Total Days</TableCell>
                                <TableCell className="font-bold" align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow >
                                <TableCell>{packageName}</TableCell>
                                <TableCell align="right">₹ {price}</TableCell>
                                <TableCell align="right">{days} days</TableCell>
                                <TableCell align="right">₹ {totalPrice}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>

                    <Grid container spacing={2} className="mb-4 flex justify-end">
                        {/* <Grid size={{ xs: 12, md: 6 }}></Grid> */}
                        <Grid size={{ xs: 12, md: 6 }}>

                            <div className="flex justify-between mb-2">
                                <Typography>TAX {gst}%</Typography>
                                <Typography>₹ {gstAmount}</Typography>
                            </div>
                            <div className="flex justify-between mb-2">
                                <Typography>Subtotal</Typography>
                                <Typography>₹ {displayRoundedTotal}</Typography>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between mb-2 font-bold">
                                <Typography>Round OFF</Typography>
                                <Typography>₹ 0.{decimalPart}</Typography>
                            </div>
                            <div className="flex justify-between mb-4">
                                <Typography>Estimate Total</Typography>
                                <Typography>₹ {roundUpAmmount}</Typography>
                            </div>
                        </Grid>
                    </Grid>

                    <Divider className="my-4" />

                    {/* <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant={isChecked ? 'contained' : 'outlined'}
                                color="primary"
                                startIcon={isChecked ? <CheckIcon /> : null}
                                onClick={handleToggle}
                                sx={{
                                    textTransform: 'none',
                                    transition: 'all 0.3s ease',
                                    fontWeight: isChecked ? 'bold' : 'normal'
                                }}
                            >
                                {isChecked ? 'Invoice Ready' : 'Generate Invoice'}
                            </Button>
                        </Grid>
                    </Grid> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default EditPaidListingInvoice;
