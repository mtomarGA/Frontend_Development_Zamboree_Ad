import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableRow, TableHead, Divider } from '@mui/material';
import { Grid } from '@mui/system';
import { CheckIcon } from 'lucide-react';
import ProposalGenerateBanner from "@/services/premium-listing/banner.service";
import { toast } from 'react-toastify';
import GSTValue from "@/services/premium-listing/gst.service";

const EditBannerListingInvoice = ({ formData, getPrice, setOpen, getBanner, bannerId }) => {
  const [gst, setGst] = useState(18); // default until API loads
  const [isChecked, setIsChecked] = useState(false);
  const [priceData, setPriceData] = useState({});

  const packageName = formData?.basicDetails?.bannerPackage || "";
  const price = Number(formData?.basicDetails?.perDayPrice) || 0;
  const days = Number(formData?.basicDetails?.validity) || 0;
  const totalPrice = price * days;

  // Fetch GST from backend
  const GetGSTPrice = async () => {
    try {
      const result = await GSTValue.getGSTValue();
      if (result?.data?.length > 0) {
        setGst(Number(result.data[0]?.GST) || 18);
      }
    } catch (err) {
      toast.error("Failed to fetch GST value");
    }
  };

  useEffect(() => {
    GetGSTPrice();
  }, []);

  // Recalculate invoice whenever totalPrice or gst changes
  useEffect(() => {
    const gstAmount = ((totalPrice * gst) / 100).toFixed(2);
    const subtotal = (totalPrice + Number(gstAmount)).toFixed(2);

    let roundedTotal = Math.round(subtotal); // proper rounding
    const decimalPart = Number(subtotal.split(".")[1] || 0);

    // Round-off calculation
    if (decimalPart >= 50) {
      roundedTotal = Math.ceil(subtotal);
    } else {
      roundedTotal = Math.floor(subtotal);
    }

    const updatedPriceData = {
      TAX: `${gst}%`,
      TAXAmount: gstAmount,
      Subtotal: subtotal,
      RoundOFF: `0.${decimalPart}`,
      EstimateTotal: roundedTotal.toFixed(2)
    };

    setPriceData(updatedPriceData);
    getPrice(updatedPriceData);
  }, [gst, totalPrice]);

  // const handleToggle = async () => {
  //   setIsChecked(!isChecked);
  //   const data = {
  //     status: "PROPOSAL",
  //     proposalDate: new Date().toISOString()
  //   };
  //   const result = await ProposalGenerateBanner.proposalGenerate(bannerId, data);
  //   toast.success(result.message);
  //   setOpen();
  //   getBanner();
  // };

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

          <Grid container spacing={2} className="mb-4 flex justify-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="flex justify-between mb-2">
                <Typography>TAX {gst}%</Typography>
                <Typography>₹ {priceData.TAXAmount}</Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography>Subtotal</Typography>
                <Typography>₹ {priceData.Subtotal}</Typography>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between mb-2 font-bold">
                <Typography>Round OFF</Typography>
                <Typography>₹ {priceData.RoundOFF}</Typography>
              </div>
              <div className="flex justify-between mb-4">
                <Typography>Estimate Total (mr)</Typography>
                <Typography>₹ {priceData.EstimateTotal}</Typography>
              </div>
            </Grid>
          </Grid>

          <Divider className="my-4" />

          {/* <Grid container spacing={2} justifyContent="flex-end">
            {formData?.status !== "PROPOSAL" && (
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
                  {isChecked ? 'Proposal Ready' : 'Generate Proposal'}
                </Button>
              </Grid>
            )}
          </Grid> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBannerListingInvoice;
