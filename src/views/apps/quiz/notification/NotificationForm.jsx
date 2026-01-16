'use client'

import React, { useState } from 'react'
import { Email, Sms, Notifications } from "@mui/icons-material";
import { Paper, Typography, Grid, TextField, Box, Button, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField';
import OptionMenu from '@/@core/components/option-menu';

function NotificationForm() {
    const [formData, setFormData] = useState({
        method: "email",
        recipientType: "all",
        subject: "",
        message: "",
        startFrom: "",
        perBatch: "",
        coolingPeriod: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (!formData.subject) errors.subject = "Subject is required";
        if (!formData.message) errors.message = "Message is required";
        if (!formData.startFrom) errors.startFrom = "Start From is required";
        if (!formData.perBatch) errors.perBatch = "Per Batch is required";
        if (!formData.coolingPeriod) errors.coolingPeriod = "Cooling Period is required";
        return errors;
    };

    const handleMethodChange = (_, newMethod) => {
        if (newMethod !== null) {
            setFormData(prev => ({ ...prev, method: newMethod }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        console.log("Form submitted:", formData);
        // Here you would typically send the data to your API
    };

    return (
        <div>
            <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <OptionMenu options={[{ text: 'Edit', icon: 'tabler-edit' }, { text: 'Delete', icon: 'tabler-trash' }]} />
                </Box>
                <Typography variant="h6" gutterBottom>
                    Notification to Verified Users
                </Typography>

                <ToggleButtonGroup
                    value={formData.method}
                    exclusive
                    onChange={handleMethodChange}
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value="email">
                        <Email sx={{ mr: 1 }} /> Send Via Email
                    </ToggleButton>
                    <ToggleButton value="sms">
                        <Sms sx={{ mr: 1 }} /> Send Via SMS
                    </ToggleButton>
                    <ToggleButton value="firebase">
                        <Notifications sx={{ mr: 1 }} /> Send Via Firebase
                    </ToggleButton>
                </ToggleButtonGroup>

                <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                        <CustomTextField
                            fullWidth
                            select
                            label="Being Sent To"
                            name="recipientType"
                            value={formData.recipientType}
                            onChange={handleInputChange}
                            required
                            error={!!formErrors.recipientType}
                            helperText={formErrors.recipientType}
                        >
                            <MenuItem value="all">All Users</MenuItem>
                            <MenuItem value="verified">Verified Users</MenuItem>
                            <MenuItem value="inactive">Inactive Users</MenuItem>
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField
                            fullWidth

                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            error={!!formErrors.subject}
                            helperText={formErrors.subject}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextField
                            fullWidth

                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            // value={formData.message}
                            onChange={handleInputChange}
                            error={!!formErrors.message}
                            helperText={formErrors.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth

                            label="Start From (User ID)"
                            name="startFrom"
                            // value={formData.startFrom}
                            onChange={handleInputChange}
                            error={!!formErrors.startFrom}
                            helperText={formErrors.startFrom}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth

                            label="Per Batch"
                            name="perBatch"
                            type="number"
                            value={formData.perBatch}
                            onChange={handleInputChange}
                            error={!!formErrors.perBatch}
                            helperText={formErrors.perBatch}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            // required
                            label="Cooling Period (Seconds)"
                            name="coolingPeriod"
                            type="number"
                            value={formData.coolingPeriod}
                            onChange={handleInputChange}
                            error={!!formErrors.coolingPeriod}
                            helperText={formErrors.coolingPeriod}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default NotificationForm
