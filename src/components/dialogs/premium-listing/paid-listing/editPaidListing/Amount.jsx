import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Divider,
  Grid
} from '@mui/material';
import { CheckIcon } from 'lucide-react';
import ProposalGeneratePaidListing from "@/services/premium-listing/paidListing.service";
import GSTValue from "@/services/premium-listing/gst.service";
import { toast } from 'react-toastify';

const EditPaidListingInvoice = ({ data, formData, getPrice, PaidListingId, getPaidListing }) => {
  const [gst, setGst] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  // Extract values
  const packageName = formData?.basicDetails.paidListingPackage;
  const price = Number(formData?.basicDetails?.perDayPrice) || 0;
  const days = Number(formData?.basicDetails?.validity) || 0;

  // Total price calculations
  const totalPrice = price * days;

  // GST Amount
  const gstAmount = useMemo(() => ((totalPrice * gst) / 100), [totalPrice, gst]);

  // Total including GST
  const totalPriceWithGST = totalPrice + gstAmount;

  // Rounding logic
  const roundedTotal = Math.round(totalPriceWithGST * 100) / 100;
  const decimalPart = Number((roundedTotal % 1).toFixed(2).split('.')[1]); // e.g., 0.06 -> 6

  const roundUpAmount = decimalPart >= 6
    ? Math.ceil(roundedTotal).toFixed(2)
    : Math.floor(roundedTotal).toFixed(2);

  const displayRoundedTotal = roundedTotal.toFixed(2);

  // Fetch GST value from API
  const GetGSTPrice = async () => {
    try {
      const result = await GSTValue.getGSTValue();
      if (result?.data?.length > 0) {
        setGst(Number(result.data[0]?.GST) || 0);
      }
    } catch (err) {
      toast.error("Failed to fetch GST value");
    }
  };

  useEffect(() => {
    GetGSTPrice();
  }, []);

  // Prepare price data for parent
  const priceData = useMemo(() => ({
    TAX18: gstAmount.toFixed(2),
    Subtotal: displayRoundedTotal,
    EstimateTotal: roundUpAmount,
    RoundOFF: decimalPart,
    TAXPER: gst,
  }), [gstAmount, displayRoundedTotal, roundUpAmount, decimalPart, gst]);

  useEffect(() => {
    getPrice(priceData);
  }, [priceData, getPrice]);

  // Handle invoice toggle
  // const handleToggle = async () => {
  //   setIsChecked(!isChecked);

  //   try {
  //     const data = {
  //       status: "PROPOSAL",
  //       proposalDate: new Date().toISOString(),
  //     };
  //     const result = await ProposalGeneratePaidListing.generateproposal(PaidListingId, data);
  //     toast.success(result.message);
  //     getPaidListing();
  //   } catch (err) {
  //     toast.error("Failed to generate proposal");
  //   }
  // };

  // // Set checkbox if already PROPOSAL
  // useEffect(() => {
  //   if (formData.status === "PROPOSAL") {
  //     setIsChecked(true);
  //   }
  // }, [formData?.status]);

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
            </TableBody>
          </Table>

          <Grid container spacing={2} className="mb-4" justifyContent="flex-end">
            <Grid item xs={12} md={6}>
              <div className="flex justify-between mb-2">
                <Typography>TAX {gst}%</Typography>
                <Typography>₹ {gstAmount.toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography>Subtotal</Typography>
                <Typography>₹ {displayRoundedTotal}</Typography>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between mb-2 font-bold">
                <Typography>Round OFF</Typography>
                <Typography>₹ {(Number("0." + decimalPart)).toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between mb-4">
                <Typography>Estimate Total (mr)</Typography>
                <Typography>₹ {roundUpAmount}</Typography>
              </div>
            </Grid>
          </Grid>

          <Divider className="my-4" />

          {/* <Grid container justifyContent="flex-end">
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
