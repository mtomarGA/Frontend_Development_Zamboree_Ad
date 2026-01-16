'use client'
import React, { useState, useEffect } from 'react'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip,
    Avatar,
    Link,
    Rating,
    Stack,
} from '@mui/material'
import { useParams } from 'next/navigation';
import EventService from '@/services/event/event_mgmt/event';

const Show = () => {
    const { id } = useParams();

    // show data by id
    const [formData, setFormData] = useState([

    ]);



    const ShowData = async () => {
        const response = await EventService.getbyid(id)
        if (response.success === true) {
            const data = response?.data;

            if (data.dateType === 'single') {
                data.startDateTime = [new Date(data.startDateTime)]
                data.endDateTime = [new Date(data.endDateTime)]
            } else {
                data.startDateTime = data.startDateTime.map(date => new Date(date))
                data.endDateTime = data.endDateTime.map(date => new Date(date))
            }
            setFormData(data);
        }
    }

    useEffect(() => {
        ShowData()
    }, [])

    // format date
    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate);
        const formattedDate = date.toLocaleDateString('en-GB');
        return formattedDate
    }




    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Event Details</Typography>
            <Grid container spacing={3}>
                {/* General Info */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>General Information</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Chip label="On sale" color="success" size="small" />
                                <Info label="Title" value={formData?.event_title} />
                                <Info label="Organizer" value={formData?.organizer?.companyInfo?.companyName} />
                                <Info label="Event ID" value={formData?.eventNo || ''} />
                                <Info label="Creation date" value={expiryDateFun(formData?.createdAt)} />
                                <Info label="Update date" value={expiryDateFun(formData?.updatedAt)} />
                                {/* <Info label="Views" value={formData?.views} /> */}
                                {/* <Info label="Added to favorites by" value={formData?.favorites} /> */}
                                <Info label="Category" value={formData?.event_category?.categoryname} />
                                {/* <Info label="Audiences" value={formData?.audiences} /> */}
                                <Info label="Country" value={formData?.country?.name} />
                                <Info label="Youtube video" value={formData?.youtube_link} />
                                <Info label="Publicly show attendees" value={formData?.attendees} />

                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Event Dates */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Event Dates: {formData?.dateType?.toUpperCase()} </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>

                                {formData?.startDateTime?.map((item, index) => (
                                    <Info label={`Start date ${index + 1}`} value={item?.toLocaleString() || ''} key={index} />
                                ))}
                                {formData?.endDateTime?.map((item, index) => (
                                    <Info label={`End date ${index + 1}`} value={item?.toLocaleString() || ''} key={index} />
                                ))}


                                <Chip label="On sale" color="success" size="small" />
                                <Info label="Sales" value="1122" />
                                <Info label="Reference" value="" />

                                <Info label="Venue" value={formData?.venue} />
                                <Info label="Address:" value={formData?.address} />
                                <Info label="Tickets types" value={formData?.ticketType} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Images */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Images</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Typography variant="subtitle2">Main Image</Typography>
                                <Stack direction="row" spacing={1}>

                                    <Avatar src={formData?.thumbnail} alt='thumbnail' />

                                </Stack>

                                <Typography variant="subtitle2">Gallery</Typography>
                                <Stack direction="row" spacing={1}>
                                    {formData?.gallery_image?.map((item, index) => (
                                        <Avatar src={item?.url} key={index} />
                                    ))}

                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tickets */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Tickets</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Info label="Name" value="" />
                                <Chip label="On sale" color="success" size="small" />
                                <Info label="Sales" value="" />
                                <Info label="Tickets left" value="" />
                                <Info label="Quantity" value="" />
                                <Info label="Price" value="" />
                                <Info label="Tickets per attendee" value="" />
                                <Info label="Sales start date" value="" />
                                <Info label="Sales end date" value="" />
                                <Info label="Currently in cart" value="" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contact & Social */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Contact & Social media</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Info label="Website link" value={<Link href={formData?.external_link} target="_blank">{formData?.external_link}</Link>} />
                                <Info label="Email" value={formData?.contact_email} />
                                <Info label="Phone number" value={formData?.contact_number} />
                                <Info label="Facebook" value={formData?.facebook} />
                                <Info label="Twitter" value={formData?.twitter} />
                                <Info label="Instagram" value={formData?.instagram} />

                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reviews */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Reviews</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Info label="Count" value="1" />
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{ mr: 1 }}>Rating:</Typography>
                                    <Rating value={5} readOnly />
                                    <Typography sx={{ ml: 1 }}>5 out of 5 stars</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

const Info = ({ label, value }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight={600} color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" textAlign="right">
            {value}
        </Typography>
    </Box>
)

export default Show
