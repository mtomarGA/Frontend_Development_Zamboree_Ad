"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, TextField, Typography, Button } from "@mui/material";
import NEWGST from "@/services/premium-listing/gst.service";
import { toast } from "react-toastify";
import { Grid } from "@mui/system";

export default function GstPriceForm({ setModalOpen, gstTextService, EditSelectedGST }) {
    const [message, setMessage] = useState("");
    const [gstPercent, setGstPercent] = useState("");

    useEffect(() => {
        if (EditSelectedGST?._id) {
            setGstPercent(EditSelectedGST?.gstPrice);
            setMessage(EditSelectedGST?.message);
        }
    }, [EditSelectedGST]);

    const handleCalculate = async () => {
        const data = {
            gstPrice: gstPercent,
            message: message,
        };
        if (EditSelectedGST?._id) {
            const Id = EditSelectedGST?._id
            const result = await NEWGST.updateGSTDetails(Id, data)
            toast.success(result.message)
        } else {
            const result = await NEWGST.addNewGST(data)
            toast.success(result.message)
        }
        setModalOpen(false)
        gstTextService()

    };

    return (
        <div className="flex justify-center items-center p-4">

            <CardContent>
                <Typography variant="h6" className="text-center mb-4 font-semibold">
                    {EditSelectedGST?._id ? "Update GST Price" : "Add GST Price"}
                </Typography>

                <Grid container spacing={2}>
                    {/* GST % */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            fullWidth
                            type="text"
                            label="GST %"
                            value={gstPercent}
                            onChange={(e) => {
                                const rawVal = e.target.value;
                                const digitsOnly = rawVal.replace(/\D/g, ""); // keep only numbers
                                setGstPercent(digitsOnly);
                            }}
                        />
                    </Grid>

                    {/* Message */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Grid>

                    {/* Button */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="rounded-xl"
                            onClick={handleCalculate}
                        >
                            {EditSelectedGST?._id ? "Update GST" : "Add GST"}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>

        </div>
    );
}
