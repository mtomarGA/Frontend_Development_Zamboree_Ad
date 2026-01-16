// pages/employee-leave-reply.js


import {
    Box,
    Container,
    Divider,
    Typography,
} from '@mui/material';
// use @mui/material Grid, not @mui/system
import { format } from 'date-fns';
import { Grid } from '@mui/system';
import React from 'react';


// Helper function to safely format dates
function formatDate(dateInput) {
    if (!dateInput) return '—';

    const date = new Date(dateInput);
    if (isNaN(date)) return 'Invalid date';
    return format(date, 'dd MMM yyyy');
}

export default function WarningDetails({ warningData }) {

    return (
        <Container maxWidth="md">
            <Typography variant="h4" className="mb-4" gutterBottom>
                Details
            </Typography>

            <Grid container spacing={3} className="mb-4">
                {[

                    { label: 'Warning To', value: warningData?.warningTo?.name || '—' },
                    { label: 'Warning Type', value: warningData?.warningType?.name || '—' },
                    { label: 'Warning Date', value: formatDate(warningData?.createdAt) },
                    { label: 'Warning Subject', value: warningData?.subject || '—' },
                    { label: 'Description', value: warningData?.description || '—' },
                    { label: 'Status', value: warningData?.status || '—' },

                ].map((item, index) => (
                    <React.Fragment key={item.label}>

                        {/* Divider BEFORE "Status" field */}
                        {item.label === 'Status' && (
                            <Grid size={{ xs: 12, md: 12 }}>
                                <Divider className="my-2" />
                            </Grid>
                        )}

                        <Grid size={{ xs: 6, md: 6 }}>
                            <Typography variant="h6" className="text-start">
                                {item.label}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }}>
                            <Box
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                }}
                            >
                                <Typography variant="body2" className="font-medium">
                                    {item.value}
                                </Typography>
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Container>
    );
}
