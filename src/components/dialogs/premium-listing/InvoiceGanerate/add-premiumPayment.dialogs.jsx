"use client";
import { useState } from "react";
import { Grid, Typography, TextField, Button, MenuItem } from "@mui/material";
import AddFixedPayment from "@/services/premium-listing/fixedListing.service";
import AddpaidPayment from "@/services/premium-listing/paidListing.service";
import AddBannerPayment from "@/services/premium-listing/banner.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function PaymentForm({ setEditModalOpen, invoiceData }) {
    console.log(invoiceData);
    const router = useRouter();
    const amountDue = invoiceData?.amount?.totalPriceWithDiscount || 0;
    const InvoiceId = invoiceData?.InvoiceId || "";

    const [paymentMode, setPaymentMode] = useState("CASH");
    const [chequeId, setChequeId] = useState("");
    const [chequeIssueDate, setChequeIssueDate] = useState("");
    const [transactionId, setTransactionId] = useState("");


    // Error state
    const [errors, setErrors] = useState({});

    const today = new Date().toISOString().split("T")[0];

    const validate = () => {
        const newErrors = {};

        if (!paymentMode) newErrors.paymentMode = "Payment mode is required";

        if (paymentMode === "UPI" && !transactionId) {
            newErrors.transactionId = "Transaction ID is required for UPI payments";
        }

        if (paymentMode === "CHEQUE") {
            if (!chequeId) newErrors.chequeId = "Cheque ID is required";
            if (!chequeIssueDate) newErrors.chequeIssueDate = "Cheque issue date is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return; // stop submission if validation fails
        let Id = invoiceData?._id
        const paymentDetails = {
            status: "PAID",
            paymentMode,
            paymentDate: today,
            amountReceived: amountDue,
            ...(paymentMode === "CHEQUE" && { chequeId, chequeIssueDate }),
            ...(paymentMode === "UPI" && { transactionId }),
        };
        if (invoiceData?.type == "PaidListing") {
            const result = await AddpaidPayment.addPaymentInvoice(Id, paymentDetails);
            toast.success(result.message || "Payment recorded successfully");
            setEditModalOpen(false)
        } else if (invoiceData?.type == "Banner") {
            const result = await AddBannerPayment.addPaymentInvoice(Id, paymentDetails);
            toast.success(result.message || "Payment recorded successfully");
            setEditModalOpen(false)
        } else {
            const result = await AddFixedPayment.addPaymentInvoice(Id, paymentDetails);
            toast.success(result.message || "Payment recorded successfully");
            setEditModalOpen(false)
        }
        router.push('/en/apps/listingInvoice/invoice-list')

    };

    const resetForm = () => {
        setPaymentMode("CASH");
        setChequeId("");
        setChequeIssueDate("");
        setTransactionId("");
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg w-full mx-auto mt-10">
            <Typography variant="h6" className="mb-4 font-bold">
                Record Payment for {InvoiceId}
            </Typography>

            <Grid container spacing={3}>
                {/* Payment Mode */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Payment Mode"
                        select
                        required
                        fullWidth
                        variant="outlined"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        error={!!errors.paymentMode}
                        helperText={errors.paymentMode}
                        className="mb-3"
                    >
                        <MenuItem value="" disabled>
                            Select Mode
                        </MenuItem>
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="CHEQUE">Cheque</MenuItem>
                    </TextField>
                </Grid>

                {/* Amount Received */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Amount Received"
                        required
                        disabled
                        fullWidth
                        variant="outlined"
                        defaultValue={amountDue}
                        className="mb-3"
                    />
                </Grid>

                {/* UPI Transaction ID */}
                {paymentMode === "UPI" && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Transaction ID"
                            required
                            fullWidth
                            variant="outlined"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            error={!!errors.transactionId}
                            helperText={errors.transactionId}
                            className="mb-3"
                        />
                    </Grid>
                )}

                {/* Cheque Details */}
                {paymentMode === "CHEQUE" && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cheque ID"
                                required
                                fullWidth
                                variant="outlined"
                                value={chequeId}
                                onChange={(e) => setChequeId(e.target.value)}
                                error={!!errors.chequeId}
                                helperText={errors.chequeId}
                                className="mb-3"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cheque Issue Date"
                                type="date"
                                required
                                fullWidth
                                variant="outlined"
                                value={chequeIssueDate}
                                onChange={(e) => setChequeIssueDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.chequeIssueDate}
                                helperText={errors.chequeIssueDate}
                                className="mb-3"
                            />
                        </Grid>
                    </>
                )}

                {/* Payment Date */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Payment Date"
                        type="date"
                        required
                        fullWidth
                        variant="outlined"
                        value={today}
                        disabled
                        InputLabelProps={{ shrink: true }}
                        className="mb-3"
                    />
                </Grid>
                {/* Action Buttons */}
                <Grid item xs={12} className="flex justify-end gap-3 mt-4">
                    <Button
                        onClick={() => setEditModalOpen(false)}
                        type="button"
                        variant="contained"
                        color="error"
                        className="min-w-[80px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        className="min-w-[80px]"
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
