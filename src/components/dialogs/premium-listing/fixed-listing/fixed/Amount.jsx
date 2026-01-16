import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableRow, TableHead, Divider } from '@mui/material';
import { Grid } from '@mui/system';
import { CheckIcon } from 'lucide-react';
import GSTValue from "@/services/premium-listing/gst.service"

const BannerListingInvoice = ({ formData, getPrice, handlePreviousClick }) => {
  const [gst, setGst] = useState(0); // GST percentage
  const [isChecked, setIsChecked] = useState(false);

  // Extract values
  const keywordPrice = Number(formData?.location?.totalPrice) || 0;
  const packageName = formData?.basicDetails?.FixedListing;
  const price = Number(formData?.basicDetails?.perDayPrice) || 0;
  const days = Number(formData?.basicDetails?.validity) || 0;

  // Base calculations
  const fixedKeywordPrice = keywordPrice * days;
  const totalPrice = price * days;
  const displayRoundedTotal = totalPrice + fixedKeywordPrice;

  // GST calculations
  const gstPercentage = Number(gst) || 0;
  const gstAmount = (displayRoundedTotal * gstPercentage) / 100;
  const totalPriceWithGST = displayRoundedTotal + gstAmount;

  // Round off logic
  const formatted = gstAmount.toFixed(2);
  const decimalPart = formatted.split('.')[1] || '00';

  let roundUpAmount = totalPriceWithGST;
  if (Number(decimalPart) >= 6) {
    roundUpAmount = Math.ceil(totalPriceWithGST).toFixed(2);
  } else {
    roundUpAmount = Math.floor(totalPriceWithGST).toFixed(2);
  }

  // Store price data
  const [priceData, setPriceData] = useState({
    TAX18: '',
    Subtotal: '',
    RoundOFF: '',
    EstimateTotal: '',
    TAXPER:""
  });

  useEffect(() => {
    setPriceData({
      TAX18: gstAmount||'',
      Subtotal: displayRoundedTotal||'',
      EstimateTotal: roundUpAmount,
      RoundOFF: decimalPart,
      TAXPER:gst
    });
  }, [gstAmount, decimalPart, displayRoundedTotal, roundUpAmount]);

  useEffect(() => {
    getPrice(priceData);
  }, [priceData]);

  // Fetch GST value
  const GetGSTPrice = async () => {
    const result = await GSTValue.getGSTValue();
    if (result?.data?.length > 0) {
      setGst(Number(result.data[0]?.GST) || 0); // Use first GST from API
    }
  };

  useEffect(() => {
    GetGSTPrice();
  }, []);

  // Handlers
  const handlePrivious = () => {
    handlePreviousClick();
  };

  const handleToggle = () => {
    setIsChecked(prev => !prev);
    if (!isChecked) {
      console.log('Invoice generation initiated');
      // Your API call or logic here
    }
  };

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
              <TableRow>
                <TableCell>{packageName}</TableCell>
                <TableCell align="right">₹ {price}</TableCell>
                <TableCell align="right">{days} days</TableCell>
                <TableCell align="right">₹ {totalPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fixed Keyword Price</TableCell>
                <TableCell align="right">₹ {keywordPrice}</TableCell>
                <TableCell align="right">{days} days</TableCell>
                <TableCell align="right">₹ {fixedKeywordPrice}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Grid container spacing={2} className="mb-4 flex justify-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="flex justify-between mb-2">
                <Typography>Subtotal</Typography>
                <Typography>₹ {displayRoundedTotal.toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography>TAX {gstPercentage}%</Typography>
                <Typography>₹ {gstAmount.toFixed(2)}</Typography>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between mb-2 font-bold">
                <Typography>Round OFF</Typography>
                <Typography>₹ 0.{decimalPart}</Typography>
              </div>
              <div className="flex justify-between mb-4">
                <Typography>Estimate Total</Typography>
                <Typography>₹ {roundUpAmount}</Typography>
              </div>
            </Grid>
          </Grid>

          <Divider className="my-4" />

          {/* <Grid container spacing={2} justifyContent="flex-end">
            <Grid>
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

export default BannerListingInvoice;
