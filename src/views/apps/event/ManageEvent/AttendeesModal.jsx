'use client'

import React from 'react'
import {
    Box,

    Card,
    CardContent,
    Avatar,

    Stack,
    Divider
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import EventService from '@/services/event/event_mgmt/event'
import Link from '@/components/Link'
import AttendeesService from '@/services/event/event_mgmt/AttendeesService'





const events = [
    {
        title: 'Adventure In The Jungle',
        date: 'Sun 16 Mar 2025, 5:00 PM EDT',
        location: 'The Big New York Theater: 57th Street 10019 New York, NY, United States',
        image: '/images/jungle1.jpg'
    },
    {
        title: 'Adventure In The Jungle',
        date: 'Mon 17 Mar 2025, 1:00 PM EDT',
        location: 'The Big New York Theater: 57th Street 10019 New York, NY, United States',
        image: '/images/jungle2.jpg'
    },
    {
        title: 'Adventure In The Jungle',
        date: 'Sun 23 Mar 2025, 4:00 PM EDT',
        location: 'Le Grand Hotel: Broadway 10013 New York, NY, United States',
        image: '/images/jungle3.jpg'
    },
    {
        title: 'SuperPower',
        date: 'Fri 28 Mar 2025, 9:00 PM EDT',
        location: 'The Perl Terrace: 46th St 10036 New York, NY, United States',
        image: '/images/superpower.jpg'
    },
    {
        title: 'Gun Man',
        date: 'Mon 28 Apr 2025, 9:00 PM EDT',
        location: 'Online',
        image: '/images/gunman.jpg'
    }
]


const AttendeesModal = ({ open, handleClose, Eventid }) => {

    console.log(Eventid, "attendess")
    const [eventdata, seteventdata] = useState([]);
    const Event = async () => {
        const response = await EventService.getbyid(Eventid);
        console.log(response.data, "sbjhjhs");
        seteventdata([response?.data] || []);
    }

    useEffect(() => {
        if (Eventid) {
            Event()
        }
    }, [open])




    return (
        <>

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                fullWidth
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Attendees Check In
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {/* 
                    {eventdata.map((item, i) => {
                        return (


                            <div key={i} className='flex flex-row justify-between items-center  p-2 shadow rounded '>


                                <div className='mx-2'>
                                    <img src={item?.thumbnail} alt="" className='w-20 h-20 rounded' />
                                </div>
                                <div className='flex flex-col mx-2'>
                                    <p className='text-yellow-300'>{item?.event_title}</p>
                                    <div><strong>When:</strong> <span>"h"</span></div>
                                    <div><strong>Where:</strong> <span>{item?.address}</span></div>
                                </div>

                                <div>
                                    <Button variant='tonal' size='small'>Check In Attendees For This Event Date</Button>
                                </div>


                            </div>
                        )
                    })} */}


                    {eventdata.map((item, i) => (
                        Array.isArray(item.startDateTime) &&
                        item.startDateTime.map((date, j) => (
                            <div
                                key={`${i}-${j}`}
                                className='flex flex-row justify-between items-center p-2 shadow rounded my-2'
                            >
                                <div className='mx-2'>
                                    <img src={item?.thumbnail} alt='' className='w-20 h-20 rounded' />
                                </div>

                                <div className='flex flex-col mx-2'>
                                    <p className='text-yellow-300'>{item?.event_title}</p>
                                    <div>
                                        <strong>When:</strong>{' '}
                                        <span>{new Date(date).toLocaleString('en-GB')}</span>
                                    </div>
                                    <div>
                                        <strong>Where:</strong> <span>{item?.address}</span>
                                    </div>
                                </div>

                                <div>
                                    <Link href={`/en/apps/event/manageEvents/${item._id}/${j}`}>
                                        <Button variant='tonal' size='small'>
                                            Check In Attendees For This Event Date
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ))}



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                    {/* <Button onClick={handleClose} variant='contained'>
                        Save changes
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AttendeesModal
