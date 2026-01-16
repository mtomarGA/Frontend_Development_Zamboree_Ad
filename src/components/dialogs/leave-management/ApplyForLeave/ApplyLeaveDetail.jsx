// pages/employee-leave-reply.js

import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Box,
    Button,
    Container,
    DialogContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
// use @mui/material Grid, not @mui/system
import { format } from 'date-fns';
import { Grid } from '@mui/system';

import LeaveManagementService from '@/services/leave-management/ApplyForLeave';

// Helper function to safely format dates
function formatDate(dateInput) {
    if (!dateInput) return '—';

    const date = new Date(dateInput);
    if (isNaN(date)) return 'Invalid date';
    return format(date, 'dd MMM yyyy');
}

export default function ApplyLeaveDetail({ empData }) {
    const [leaveInfo, setLeaveInfo] = useState(null);

    useEffect(() => {
        const fetchLeaveInfo = async () => {
            if (empData?.employee?._id && empData?.leaveType?._id) {
                try {
                    const res = await LeaveManagementService.getLeftLeave(empData.employee._id, empData.leaveType._id);
                    setLeaveInfo(res.data);
                } catch (error) {
                    console.error('Failed to fetch leave info:', error);
                }
            }
        };

        fetchLeaveInfo();
    }, [empData]);

    const totalLeaves = leaveInfo?.leaveType?.allowLeave || 0;
    const usedLeaves = leaveInfo?.totalLeave || 0;
    const leftLeaves = totalLeaves - usedLeaves;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" className="mb-4" gutterBottom>
                Details
            </Typography>

            {/* Employee Info */}
            <Grid container spacing={2} className="mb-4">
                {[
                    { label: 'Name', value: empData?.employee?.name || '—' },
                    { label: 'Employee Id', value: empData?.employee?.employee_id || '—' },
                    { label: 'Leave Type', value: empData?.leaveType?.name || '—' },
                    { label: 'Used Leaves', value: usedLeaves },
                    { label: 'Left Leaves', value: leftLeaves },
                    { label: 'Leave Start', value: formatDate(empData?.startDate) },
                    { label: 'Leave End', value: formatDate(empData?.endDate) },
                    { label: 'Total Days', value: empData.totalLeave },
                    { label: 'Applied On', value: formatDate(empData?.createdAt) },
                    { label: 'Reason', value: empData?.reason || '—' },
                    { label: 'Status', value: empData?.status || '—' },
                    { label: 'Response', value: empData?.response || '—' },
                ].map((item, index) => (
                    <>
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
                    </>
                ))}
            </Grid>
        </Container>
    );
}
