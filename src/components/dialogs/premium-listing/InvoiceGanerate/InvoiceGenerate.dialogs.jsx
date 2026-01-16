import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

import { Grid } from '@mui/system';
import BannerListing from "@/services/premium-listing/banner.service"
import PaidListing from "@/services/premium-listing/paidListing.service"
import FixedListing from "@/services/premium-listing/fixedListing.service"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
export default function EstimatePage({ invoiceData, invoiceId, setEditModalOpen, Getdatabyid }) {
    const router = useRouter()
 

    const [BusinessInfo, setBusinessInfo] = useState({
        invoiceId: '',
        type: '',
        vendorId: '',
        companyName: '',
        email: '',
        Phone: '',
        Package: "",
        validity: '',
        text: '',
        subTotal: '',
        RoundOFF: '',
        EstimateTotal: '',
        descount: '',
        descountType: "",
        grandTotal: '',
    })
    const today = new Date().toISOString().split('T')[0];

    const [estimateDate, setEstimateDate] = useState(today);
    useEffect(() => {
        if (invoiceData) {
            setBusinessInfo({
                type: invoiceData.type || '',
                vendorId: invoiceData?.basicDetails?.vendor?.vendorId || '',
                companyName: invoiceData?.basicDetails?.vendor?.companyInfo?.companyName || '',
                email: invoiceData?.basicDetails?.vendor?.contactInfo?.email || '',
                Phone: invoiceData?.basicDetails?.vendor?.contactInfo?.phoneNo || '',
                Package: invoiceData?.basicDetails?.bannerPackage || invoiceData.basicDetails?.FixedListing || invoiceData.basicDetails?.paidListingPackage || '',
                validity: invoiceData?.basicDetails?.validity,
                subTotal: invoiceData?.amount?.Subtotal || '0',
                text: invoiceData?.amount?.TAX18 || '0',
                RoundOFF: invoiceData?.amount?.RoundOFF || '0',
                EstimateTotal: invoiceData?.amount?.EstimateTotal || '0',
                descount: invoiceData?.descount || '0',
                descountType: invoiceData?.discountType || "",
                grandTotal: invoiceData?.amount?.totalPriceWithDiscount || '0',
                invoiceId: invoiceId || ''
            });
        }
    }, [invoiceData, invoiceId]);

    const [formData, setFormData] = useState({
        clientNote: "",
        termsAndConditions: ""
    });

    useEffect(() => {
        setFormData({
            clientNote: invoiceData?.clientNote || "",
            termsAndConditions: invoiceData?.termsAndConditions || ""
        });
    }, [invoiceData]);

    const handleInvoiceGanrate = async () => {
        const ListingType = invoiceData.type
        const Id = invoiceData?._id
        const noteArray = Array.isArray(formData?.clientNote)
            ? formData.clientNote
            : (formData?.clientNote || "")
                .split(/[\n,]+/)
                .map((item) => item.trim())
                .filter(Boolean);

        const ConditionArray = Array.isArray(formData?.termsAndConditions)
            ? formData.termsAndConditions
            : (formData?.termsAndConditions || "")
                .split(/[\n,]+/)
                .map((item) => item.trim())
                .filter(Boolean);
        const data = {
            status: "INVOICED",
            InvoiceId: BusinessInfo.invoiceId,
            invoiceDate: new Date().toISOString(),
            clientNote: noteArray,
            termsAndConditions: ConditionArray
        }
        if (ListingType === "Banner") {
            const result = await BannerListing.invoiceGenerate(Id, data)
            toast.success(result.message)
            Getdatabyid()
            setEditModalOpen(false);
        } else if (ListingType === "PaidListing") {
            const result = await PaidListing.generateInvoiced(Id, data)
            toast.success(result.message)
            Getdatabyid()
            setEditModalOpen(false);
        } else {
            const result = await FixedListing.InvoiceGen(Id, data)
            toast.success(result.message)
            Getdatabyid()
            setEditModalOpen(false);
        }
        router.push("/en/apps/listingInvoice/list")
    }


    return (
        <form className="p-6  rounded  w-full max-w-6xl mx-auto">
            <Typography variant="h5" className="mb-6 text-center">
                Convert to Invoice
            </Typography>
            <Grid container spacing={3}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="flex justify-around items-center">
                            <Typography variant="subtitle1" color="text.secondary" className="font-medium">INVOICE ID</Typography>
                            <Typography variant="subtitle1" className="font-medium ">{BusinessInfo.invoiceId}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="flex justify-around items-center">
                            <Typography variant="subtitle1" color="text.secondary" className="font-medium">Listing Type</Typography>
                            <Typography variant="subtitle1" className="font-medium">{BusinessInfo.type}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="flex justify-around items-center">
                            <Typography variant="subtitle1" color="text.secondary" className="font-medium">Business Id</Typography>
                            <Typography variant="subtitle1" className="font-medium">{BusinessInfo?.vendorId}</Typography>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="flex justify-around items-center">
                            <Typography variant="subtitle1" color="text.secondary" className="font-medium">
                                Invoice Date
                            </Typography>
                            <Typography variant="subtitle1" className="font-medium">
                                {estimateDate}
                            </Typography>
                        </div>

                    </Grid>

                    {BusinessInfo?.email && (
                        <Grid size={{ xs: 12, md: 4 }}>
                            <div className="flex justify-around items-center">
                                <Typography variant="subtitle1" color="text.secondary" className="font-medium">Email</Typography>
                                <Typography variant="subtitle1" className="font-medium">{BusinessInfo.email}</Typography>
                            </div>
                        </Grid>
                    )}

                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className="flex justify-around items-center">
                            <Typography variant="subtitle1" color="text.secondary" className="font-medium">Phone</Typography>
                            <Typography variant="subtitle1" className="font-medium">{BusinessInfo?.Phone}</Typography>
                        </div>
                    </Grid>
                </Grid>


                <div className='mx-10 mt-10 w-full flex'>
                    <Grid size={{ xs: 12, sm: 6 }} >
                        <div className='flex flex-col gap-4'>
                            <Typography className='font-medium text-start' color='text.primary'>
                                Proposal To:
                            </Typography>
                            <div className='text-start'>
                                <Typography>{invoiceData?.basicDetails && `${invoiceData?.basicDetails?.vendor?.companyInfo?.companyName}`}</Typography>
                                <Typography>{invoiceData?.basicDetails && `Phone📞:${invoiceData?.basicDetails?.vendor?.contactInfo?.phoneNo}`}</Typography>
                                <Typography>{invoiceData?.basicDetails?.invoiceData?.basicDetails?.vendor?.contactInfo?.email && `Email✉️:${invoiceData?.basicDetails?.vendor?.contactInfo?.email}`}</Typography>
                                <Typography>{`Business ID: ${invoiceData?.basicDetails?.vendor?.vendorId}`}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <div className='flex flex-col gap-4'>
                            <Typography className='font-medium text-start' color='text.primary'>
                                Proposal By:
                            </Typography>
                            <div className='text-start'>
                                <Typography>
                                    {invoiceData?.proposalBy
                                        ? `${invoiceData.proposalBy.employee_id || 'Admin'} `
                                        : invoiceData?.proposalBy
                                            ? `${invoiceData.proposalBy.employee_id || 'Admin'}`
                                            : ''}
                                </Typography>

                            </div>
                        </div>
                    </Grid>
                </div>

                {/* Items Table */}
                <Grid size={{ xs: 12, md: 12 }}>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border  text-sm">
                            <thead>
                                <tr className="border-y ">
                                    <th className="px-3 py-2 border-x ">Package</th>
                                    <th className="px-3 py-2 border-x ">Validity</th>
                                    <th className="px-3 py-2 border-x ">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {items.map((item, index) => ( */}
                                <tr >
                                    <td className="px-1 py-1 border">
                                        <TextField
                                            variant="standard"
                                            value={BusinessInfo?.Package}
                                            disabled
                                            InputProps={{ disableUnderline: true }}
                                            fullWidth
                                        />
                                    </td>
                                    <td className="px-1 py-1 border">
                                        <TextField
                                            variant="standard"
                                            value={`${BusinessInfo.validity} days`}
                                            disabled
                                            InputProps={{ disableUnderline: true }}
                                            fullWidth
                                        />
                                    </td>
                                    <td className="px-1 py-1 border" >
                                        <TextField
                                            variant="standard"
                                            value={`₹ ${BusinessInfo?.EstimateTotal}`}
                                            disabled
                                            InputProps={{ disableUnderline: true }}
                                            fullWidth
                                        />
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </Grid>


                <Grid
                    container
                    justifyContent="flex-end"
                    className=" text-white rounded-lg p-4 max-w-xs ml-auto  w-full"
                >
                    <div className="space-y-1 text-sm w-full">
                        <div className="flex justify-between">
                            <Typography>Subtotal:</Typography>
                            <Typography>₹ {BusinessInfo?.subTotal}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography>GST:</Typography>
                            <Typography>₹ {BusinessInfo?.text}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography>Round OFF:</Typography>
                            <Typography>₹ {BusinessInfo?.RoundOFF}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography>Total:</Typography>
                            <Typography>₹ {BusinessInfo?.EstimateTotal}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography>Discount:</Typography>
                            <Typography>
                                {BusinessInfo?.descountType === '%'
                                    ? `${BusinessInfo?.descount}%`
                                    : `₹ ${BusinessInfo?.descount}`}
                            </Typography>
                        </div>

                        <div className="border-t border-gray-600 my-2"></div>

                        <div className="flex justify-between text-base font-semibold">
                            <Typography>Grand Total:</Typography>
                            <Typography>₹ {Number(BusinessInfo?.grandTotal).toFixed(2)}</Typography>
                        </div>
                    </div>
                </Grid>

                {/* Notes & Terms */}
                <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                        label="Client Note"
                        multiline
                        rows={3}
                        disabled={invoiceData?.status === "INVOICED"}
                        fullWidth
                        value={formData.clientNote}
                        onChange={e => setFormData(prev => ({ ...prev, clientNote: e.target.value }))}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                        label="Terms & Conditions"
                        multiline
                        rows={3}
                        disabled={invoiceData?.status === "INVOICED"}
                        fullWidth
                        value={formData.termsAndConditions}
                        onChange={e => setFormData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
                    />
                </Grid>


                {/* Save/Close Buttons */}
                <Grid size={{ xs: 12, md: 12 }} className="flex justify-end gap-3">
                    <Button variant="outlined" onClick={() => setEditModalOpen(false)}>Close</Button>
                    <Button disabled={invoiceData?.status === "INVOICED"} variant="contained" color="primary" onClick={handleInvoiceGanrate}>Save</Button>
                </Grid>
            </Grid>
        </form>
    );
}
