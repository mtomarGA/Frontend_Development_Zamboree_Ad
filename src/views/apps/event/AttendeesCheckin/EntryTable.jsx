'use client'
import { Button } from '@mui/material'
import React from 'react'
import {
  Box,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material'
import CheckInTable from './CheckInTable'

function EntryTable({ fetchEvent, eventData, arrayid, AllTickets, Selecteddate ,GetBookedUser }) {
  // Total booked quantity from AllTickets
  console.log(AllTickets, "AllTickets")
  const totalAttendees = Array.isArray(AllTickets)
    ? AllTickets.reduce((sum, t) => sum + (t?.quantity || 0), 0)
    : 0

  // Sum of checked-in from variation + withoutVariationBooked[] + freeBookedTickets[]
  const checkedIn = (() => {
    if (Array.isArray(AllTickets)) {
      return AllTickets.reduce((sum, t) => sum + (t?.userCheckin || 0), 0)
    }
    return 0
  })()

  const percentage =
    totalAttendees > 0 ? Math.round((checkedIn / totalAttendees) * 100) : 0

  const dateformat = (date) => {
    const d = new Date(date)
    return d.toString()
  }

  return (
    <div className='shadow p-2'>
      <div className='text-center text-2xl'>Attendees Check In Detail Page</div>

      {[eventData].map((item, i) => (
        <div key={i} className='flex flex-row justify-between items-center shadow m-2 my-4 p-2 rounded'>
          <div className='mx-2'>
            <img src={item?.thumbnail} alt="" className='w-20 h-20 rounded' />
          </div>

          <div className='flex flex-col mx-2'>
            <p className='text-yellow-300'>{item?.event_title}</p>
            <div><strong>When:</strong> <span>{dateformat(item?.startDateTime?.[arrayid])}</span></div>
            <div><strong>Where:</strong> <span>{item?.address}</span></div>
          </div>

          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={120}
                thickness={5}
                sx={{
                  color:
                    percentage < 50 ? 'error.main'
                      : percentage < 75 ? 'warning.main'
                        : 'success.main'
                }}
              />
              <Box
                sx={{
                  top: 0, left: 0, bottom: 0, right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" component="div">
                  {percentage}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" mt={1}>
              {checkedIn} / {totalAttendees}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total attendees check-in
            </Typography>
          </Grid>
        </div>
      ))}

      <CheckInTable
        fetchEvent={fetchEvent}
        AllTickets={AllTickets}
        Selecteddate={Selecteddate}
        GetBookedUser={GetBookedUser}
      />
    </div>
  )
}

export default EntryTable
