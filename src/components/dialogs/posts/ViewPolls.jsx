import React from 'react';
import Grid from '@mui/material/Grid2'
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Card
} from '@mui/material';

const PollDetail = ({ singlePolls }) => {
    console.log(singlePolls, 'singlePolls');

    // Assuming singlePolls is an array with at least one element
    const singlePoll = singlePolls[0];

    const pollData = {
        title: singlePoll.question,
        question: singlePoll.question,
        endTime: "22/03/2024 11:59 PM",
        creator: singlePoll.createdBy.fullName,
        options: singlePoll.options.map((option, index) => ({
            id: index + 1,
            title: option.option,
            voteCount: option.votes
        })),
        totalVotes: singlePoll.options.reduce((sum, option) => sum + (option.votes || 0), 0) // Summing all votes

    };

    console.log(pollData);

    return (
        <Card container justifyContent="center" className='shadow-none'>
            <Grid size={{ xs: 12, md: 10, lg: 8, xl: 6 }} className='text-start'>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                    {/* Header */}
                    <Typography variant="h4" component="h1" textAlign="center" sx={{
                        mb: 3,
                        fontWeight: 'medium',

                    }}>
                        Poll Detail : {pollData.title}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    {/* Question Section */}
                    <Grid container spacing={1} mb={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" fontWeight="medium">
                                Question :
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                {pollData.question}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} mb={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" fontWeight="medium">
                                Created By:
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                {pollData.creator}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Total Votes */}
                    <Grid container spacing={1} mb={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" component="h3" fontWeight="medium" mb={2}>
                                Total Poll Vote Count:
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                {pollData.totalVotes}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    {/* Results Table */}
                    <TableContainer component={Paper} elevation={0} >
                        <Table aria-label="poll results table">
                            <TableHead sx={{ backgroundColor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Vote Count</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pollData.options.map((option) => (
                                    <TableRow
                                        key={option.id}

                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{option.title}</TableCell>
                                        <TableCell align="right">{option.voteCount}</TableCell>
                                        <TableCell align="right">
                                            {pollData.totalVotes > 0
                                                ? `${Math.round((option.voteCount / pollData.totalVotes) * 100)}%`
                                                : '0%'
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Card>
    );
};

export default PollDetail;
