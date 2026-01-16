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
import ViewComment from '@/services/posts/report.service'
import Comment from '@/services/posts/comment.service'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';



const ViewCommentReport = ({ ViewSelectedReport, setEditModalOpen, onSuccess }) => {
    const id = ViewSelectedReport?.commentId?._id
    console.log(id,"idid");
    
    const [rightData, setRightData] = useState(null)
    const [data, setData] = useState()
    const viewReportData = async () => {

        const result = await ViewComment.getSinglePostCommentReport(id)
        console.log(result,"resultresult");
        
        setRightData(result.data[0])
        setData(result.data)
    }
    useEffect(() => {
        if (id) {
            viewReportData()
        }
    }, [id])

    const handleDelete = async (reportId) => {
        const result = await ViewComment.deleteCommentReport(reportId)
        viewReportData()
        toast.success(result.message)
    };

    const handleDeleteComment = async (data) => {
        const commentId = data?.commentId._id
        const result = await Comment.deleteCommentAndReport(commentId)
        onSuccess()
        setEditModalOpen(false)
        toast.success(result.message)
    }



    return (
        <div className="p-4">
            <Typography variant="h5" className="mb-4 font-semibold">
                Comment Report Detail
            </Typography>

            <Grid container spacing={2}>
                {/* Left Section */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card>
                        <CardHeader
                            title={
                                <div className="flex gap-2">
                                    <Button variant="contained" color="warning" size="small" onClick={() => handleDeleteComment(rightData)}>
                                        Delete Comment
                                    </Button>
                                </div>
                            }
                        />
                        <Typography variant="h5" className="mb-4 font-semibold">
                            Reported For
                        </Typography>
                        <CardContent className="space-y-2">
                            <Grid
                                sx={{
                                    width: { xs: '110%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                <Typography fontWeight={500} color="text.secondary">Comment</Typography>
                                <Typography> {rightData?.commentId?.message}</Typography>

                            </Grid>
                            <Grid
                                sx={{
                                    width: { xs: '100%' },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 0 }
                                }}>
                                {rightData?.commentId?.postId?._id &&
                                    (<>
                                        <Typography fontWeight={500} color="text.secondary">Comment By</Typography>
                                        <Typography> {`${rightData?.commentId?.userId?.firstName||""} ${rightData?.commentId?.userId?.lastName||""}`}</Typography>
                                    </>) 
                                }

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
                                <Typography fontWeight={500} color="text.secondary">User Id</Typography>
                                <Typography>{rightData?.commentId?.userId?.userId}</Typography>
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
                                <Typography fontWeight={500} color="text.secondary">City</Typography>
                                <Typography>{rightData?.commentId?.userId?.city?.name}</Typography>
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
                                {rightData?.commentId?.postId?._id && <><Typography fontWeight={500} color="text.secondary">Phone Number</Typography>
                                    <Typography>{rightData?.commentId?.userId?.phone}</Typography></>}
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
                                {
                                    rightData?.commentId?.postId?._id && (<><Typography fontWeight={500} color="text.secondary">Status update by</Typography>
                                        <Typography>{rightData?.commentId?.userId?.email}</Typography></>)
                                }

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

                                {rightData?.commentId?.postId?._id ? (
                                    <>
                                        <Typography fontWeight={500} color="text.secondary">POST ID</Typography>
                                        <Typography>{rightData?.commentId?.postId?.postId}</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography fontWeight={500} color="text.secondary">POLLS ID</Typography>
                                        <Typography>{rightData?.commentId?.pollsId?._id}</Typography>
                                    </>
                                )}


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
                                {
                                    rightData?.commentId?.postId?._id ? (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">Post Created By</Typography>
                                            <Typography>
                                                {(rightData?.commentId?.postId?.createdBy?.firstName || '') + ' ' + (rightData?.commentId?.postId?.createdBy?.lastName || '')}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">Poll Created By</Typography>
                                            <Typography>
                                                {(rightData?.commentId?.pollsId?.createdBy?.firstName || '') + ' ' + (rightData?.commentId?.pollsId?.createdBy?.lastName || '')}
                                            </Typography>
                                        </>
                                    )
                                }

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
                                {
                                    rightData?.commentId?.postId?._id ? (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">Post Creater Type</Typography>
                                            <Typography>
                                                {rightData?.commentId?.postId?.createdBy?.userType}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">POLLS Creater Type</Typography>
                                            <Typography>{rightData?.commentId?.pollsId?.chooseType}</Typography>
                                        </>
                                    )
                                }

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
                                {
                                    rightData?.commentId?.postId?._id ? (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">Post Creater Email</Typography>
                                            <Typography>
                                                {rightData?.commentId?.postId?.createdBy?.email}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography fontWeight={500} color="text.secondary">POLLS Creater Email</Typography>
                                            <Typography>{rightData?.commentId?.pollsId?.createdBy?.email}</Typography>
                                        </>
                                    )
                                }

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Section */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardHeader title="Comment Reported By" />
                        <CardContent>
                            <Grid sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {/* Removed <TableCell>#</TableCell> */}
                                            <TableCell>Reported By</TableCell>
                                            <TableCell>City</TableCell>
                                            <TableCell>Reported At</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Phone Number</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {data?.map((commentedBy, index) => {


                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {`${commentedBy?.userId?.firstName||""} ${commentedBy?.userId?.lastName||""}`}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {commentedBy?.userId?.city?.name}
                                                    </TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                        {commentedBy?.userId?.createdAt
                                                            ? new Date(commentedBy.userId.createdAt).toLocaleString('en-GB', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            maxWidth: 300,
                                                            overflow: 'hidden',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {commentedBy?.message?.message}
                                                    </TableCell>


                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>{commentedBy?.status}</TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>{commentedBy?.userId?.phone}</TableCell>
                                                    <TableCell style={{ maxWidth: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>{commentedBy?.userId?.email}</TableCell>
                                                    <TableCell className={''}>
                                                        <Tooltip title="Delete">
                                                            <i
                                                                className="tabler-trash text-red-600 text-2xl cursor-pointer"
                                                                onClick={() => handleDelete(commentedBy?._id)}
                                                            />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </div >
    );
};

export default ViewCommentReport;
