// pages/employee-leave-reply.js


import {
    Box,
    Container,
    Typography,
} from '@mui/material';
// use @mui/material Grid, not @mui/system
import { format } from 'date-fns';
import { Grid } from '@mui/system';


// Helper function to safely format dates
function formatDate(dateInput) {
    if (!dateInput) return '—';

    const date = new Date(dateInput);
    if (isNaN(date)) return 'Invalid date';
    return format(date, 'dd MMM yyyy');
}

export default function ComplaintDetails({ complaintData }) {
    console.log(complaintData, "details")

    return (
        <Container maxWidth="md">
            <Typography variant="h4" className="mb-4" gutterBottom>
                Details
            </Typography>

            <Grid container spacing={3} className="mb-4">
                {[
                    { label: 'Complaint From', value: complaintData?.complaintFrom?.name || '—' },
                    { label: 'Complaint Against', value: complaintData?.complaintAgainst?.name || '—' },
                    { label: 'Complain Type', value: complaintData?.complainType?.name || '—' },
                    { label: 'Complain Date', value: formatDate(complaintData?.createdAt) },
                    { label: 'Complaint Title', value: complaintData?.complaintTitle || '—' },
                    { label: 'Description', value: complaintData?.description || '—' },
                ].map((item, index) => (
                    <>

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
                    </>
                ))}
            </Grid>
        </Container>
    );
}
