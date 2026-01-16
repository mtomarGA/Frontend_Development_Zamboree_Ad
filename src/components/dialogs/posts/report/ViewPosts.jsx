'use client';

import {
    Card,
    CardContent,
    CardHeader,
    Button,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Modal,
    Tooltip,

} from '@mui/material';
import { Grid } from '@mui/system';
import Image from 'next/image';
import ViewReport from '@/services/posts/post.service'
import ViewAllPostReport from '@/services/posts/report.service'
import { useEffect, useState } from 'react';
import PostReport from '@/services/posts/report.service'
import { toast } from 'react-toastify';


const ViewPost = ({ EditSelectedPost, setEditModalOpen, onSuccess }) => {
    const [data, setData] = useState()
    const [rightData, setRightData] = useState()
    const [selectedMedia, setSelectedMedia] = useState();


    console.log(rightData,"rightDatarightDatarightData");
    

    const id = EditSelectedPost?.postId?._id
    const viewReportData = async () => {
        const result = await ViewAllPostReport.getSingleReportByPostId(id)
        console.log(result?.data);
        
        setRightData(result?.data[0]?.postId)
        setData(result.data)
    }
    useEffect(() => {
        if (id) {
            viewReportData()
        }
    }, [id])


    const handleClose = () => {
        setSelectedMedia(null);
    };
    const handleMediaClick = (mediaUrl) => {
        setSelectedMedia([mediaUrl]);
    };

    const handleDelete = async (id) => {
        const result = await PostReport.deletePostReport(id)
        viewReportData()
        toast.success(result.message)

    }

    const handleReject = async (postId) => {
        const result = await ViewReport.postInActive(postId)
        setEditModalOpen(false)
        onSuccess()
        toast.success(result.message)
    }


    return (
        <div className="p-4">
            <Typography variant="h5" className="mb-4 font-semibold">
                Reported Post Detail
            </Typography>

            <Grid container spacing={2}>
                {/* Left Section */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card>
                        <CardHeader
                            title={
                                <div className="flex gap-2">
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        onClick={() => handleReject(rightData?._id)}
                                    >
                                        Reject Post
                                    </Button>
                                </div>
                            }
                        />
                        <CardContent className="space-y-2">
                            <Grid
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Created For</Typography>
                                <Typography>{rightData?.chooseType}</Typography>
                            </Grid>

                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Status</Typography>
                                <Typography>{rightData?.status}</Typography>
                            </Grid>



                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Status update by</Typography>
                                <Typography>{rightData?.approveBy?.email}</Typography>
                            </Grid>

                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Total comment</Typography>
                                <Typography>0</Typography>
                            </Grid>
                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Total views</Typography>
                                <Typography>0</Typography>
                            </Grid>

                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Total Like</Typography>
                                <Typography>2</Typography>
                            </Grid>
                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">POST ID</Typography>
                                <Typography>{rightData?.postId}</Typography>
                            </Grid>
                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Post Created At Locution</Typography>
                                <Typography>{rightData?.locution}</Typography>
                            </Grid>

                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Created At</Typography>
                                <Typography>
                                    {rightData?.createdAt
                                        ? new Date(rightData.createdAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        : ''}
                                </Typography>
                            </Grid>
                            <Grid container
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Updated At</Typography>
                                <Typography>
                                    {rightData?.updatedAt
                                        ? new Date(rightData.updatedAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        : ''}
                                </Typography>
                            </Grid>

                            {rightData?.media&&(<Typography fontWeight={500} mt={2}>Posted Video & Image</Typography>)}
                            <div className="flex flex-wrap gap-4">
                                {rightData?.media?.map((item, idx) => (
                                    <div
                                        key={item.id || idx} // Better to use item.id if available
                                        className="relative group"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: item.loading ? '#f5f5f5' : 'transparent'
                                        }}
                                        onClick={() => {
                                            handleMediaClick(item.url)
                                        }}

                                    >
                                        {/* Loading state */}
                                        {item.loading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                                            </div>
                                        )}

                                        {/* Video case */}
                                        {item.url.includes('video') ? (
                                            <div>
                                                <video
                                                    src={item.url}
                                                    controls
                                                    preload="metadata"
                                                    className="w-full h-full "
                                                />
                                            </div>

                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={`Uploaded media ${idx + 1}`}
                                                className="w-full h-full "
                                            />
                                        )}


                                    </div>
                                ))}
                            </div>

                            {/* Modal for Enlarged View */}
                            <Modal open={!!selectedMedia} onClose={handleClose}>
                                <Box
                                    sx={{
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '50vw',
                                        height: '70vh',
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        borderRadius: 2,
                                        outline: 'none',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {selectedMedia?.map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: item.loading ? '#f5f5f5' : 'transparent',
                                            }}
                                        >
                                            {/* Video case */}
                                            {item.includes('video') ? (
                                                <video
                                                    src={item}
                                                    controls
                                                    preload="metadata"
                                                    className="w-full h-full"
                                                />
                                            ) : (
                                                <img
                                                    src={item}
                                                    alt={`Uploaded media ${idx + 1}`}
                                                    className="w-full h-full "
                                                />
                                            )}
                                        </div>
                                    ))}
                                </Box>
                            </Modal>
                        </CardContent>

                    </Card>
                </Grid>

                {/* Right Section */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardHeader title="Post Reported By" />
                        <CardContent>
                            <Grid sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {/* Removed <TableCell>#</TableCell> */}
                                            <TableCell>Reported By</TableCell>
                                            <TableCell>Reported At</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>City</TableCell>
                                            <TableCell>Area</TableCell>
                                            <TableCell>Action</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    {
                                        <TableBody>
                                            {data?.map((reportedBy, index) => (
                                                <TableRow key={index}>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {`${reportedBy?.reportedBy?.firstName ?? ''} ${reportedBy?.reportedBy?.lastName ?? ''}`}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {reportedBy?.reportedBy?.createdAt
                                                            ? new Date(reportedBy?.reportedBy?.createdAt).toLocaleString('en-GB', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {reportedBy?.message?.message}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {reportedBy?.status}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {reportedBy?.reportedBy?.city?.name}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {reportedBy?.reportedBy?.area?.name}
                                                    </TableCell>
                                                    <TableCell className={''}>
                                                        <Tooltip title="Delete">
                                                            <i
                                                                className="tabler-trash text-red-600 text-2xl cursor-pointer"
                                                                onClick={() => handleDelete(reportedBy?._id)}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    }
                                </Table>
                            </Grid>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ViewPost;
