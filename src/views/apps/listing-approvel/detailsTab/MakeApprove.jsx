import React, { useState } from "react";
import { Box, MenuItem, Select, TextField, FormControl, InputLabel, Button, Grid } from "@mui/material";
import BannerListing from "@/services/premium-listing/banner.service"
import PaidListing from "@/services/premium-listing/paidListing.service"
import Fixedlisting from "@/services/premium-listing/fixedListing.service"
const ApprovalForm = ({ selectedInvoice ,getAllInvoiced}) => {
    const [status, setStatus] = useState("APPROVED");
    const [reason, setReason] = useState("");

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        if (event.target.value !== "failed") setReason("");
    };
    console.log(selectedInvoice);


    const handleSave = async () => {
        const lastPayment = selectedInvoice?.paymentDetails?.[selectedInvoice.paymentDetails.length - 1];
        const lastId = lastPayment?._id;
        console.log(lastPayment);
        const data = {
            status: status,
            message: reason,
            paymentId: lastId
        }
        console.log(data, "datadata");

        const Id = selectedInvoice?._id
        if (selectedInvoice?.type == "BANNER") {
            const result = await BannerListing.approveBanner(Id, data)
            getAllInvoiced()
        } else if (selectedInvoice?.type == "PAID_LISTING") {
            const result = await PaidListing.approvePaidListing(Id, data)
            getAllInvoiced()
        } else {
            const result = await Fixedlisting.approvelFixed(Id, data)
            getAllInvoiced()
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {/* Status Dropdown */}
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                        <InputLabel id="approval-label">Status</InputLabel>
                        <Select
                            labelId="approval-label"
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="APPROVED">Approve</MenuItem>
                            <MenuItem value="failed">Reject</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Reason field (only visible if Reject is selected) */}
                {status === "failed" && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason for rejection"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Grid>
                )}

                {/* Save button */}
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!status || (status === "Reject" && !reason)}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApprovalForm;
