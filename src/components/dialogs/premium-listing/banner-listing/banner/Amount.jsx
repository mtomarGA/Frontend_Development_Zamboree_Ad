import React, { useEffect, useState, useMemo } from 'react';
import {
  Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableRow, TableHead, Divider
} from '@mui/material';
import { Grid } from '@mui/system';
import { CheckIcon } from 'lucide-react';
import GSTValue from "@/services/premium-listing/gst.service";
import { toast } from "react-toastify";

const BannerListingInvoice = ({ formData, getPrice }) => {
  const [gst, setGst] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const packageName = formData?.basicDetails?.bannerPackage || '';
  const price = Number(formData?.basicDetails?.perDayPrice) || 0;
  const days = Number(formData?.basicDetails?.validity) || 0;

  const totalPrice = price * days;

  // ---- Derived values (auto-recalculate when gst, price, days change) ----
  const {
    gstAmount,
    subtotal,
    decimalPart,
    roundUpAmount
  } = useMemo(() => {
    const gstAmt = (totalPrice * gst / 100);
    const subtotal = totalPrice + gstAmt;

    const formatted = gstAmt.toFixed(2);
    const decimal = formatted.split('.')[1] || '00';

    let rounded = subtotal;
    if (Number(decimal[1]) >= 6) {
      rounded = Math.ceil(subtotal);
    } else {
      rounded = Math.floor(subtotal);
    }

    return {
      gstAmount: gstAmt.toFixed(2),
      subtotal: subtotal.toFixed(2),
      decimalPart: decimal,
      roundUpAmount: rounded.toFixed(2)
    };
  }, [gst, totalPrice]);

  // ---- Send data upward ----
  useEffect(() => {
    getPrice({
      TAX: gstAmount,
      Subtotal: subtotal,
      RoundOFF: decimalPart,
      EstimateTotal: roundUpAmount
    });
  }, [gstAmount, subtotal, decimalPart, roundUpAmount, getPrice]);

  useEffect(() => {
    if (formData?.status === "PROPOSAL") {
      setIsChecked(true);
    }
  }, [formData?.status]);

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

  const handleToggle = () => {
    setIsChecked(prev => !prev);
    console.log(formData?._id, "banner id");
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
            </TableBody>
          </Table>

          <Grid container spacing={2} className="mb-4 flex justify-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <div className="flex justify-between mb-2">
                <Typography>TAX {gst}%</Typography>
                <Typography>₹ {gstAmount}</Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography>Subtotal</Typography>
                <Typography>₹ {subtotal}</Typography>
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
                {isChecked ? 'Proposal Ready' : 'Proposal Invoice'}
              </Button>
            </Grid>
          </Grid> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerListingInvoice;
