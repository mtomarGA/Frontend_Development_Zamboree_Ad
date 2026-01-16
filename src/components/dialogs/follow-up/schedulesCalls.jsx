// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

// Icons
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import PhoneCallbackOutlined from '@mui/icons-material/PhoneCallbackOutlined'
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import BusinessOutlined from '@mui/icons-material/BusinessOutlined'
import NotesOutlined from '@mui/icons-material/NotesOutlined'
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useEffect, useState } from 'react'
import FollowUpCallService from '@/services/follow-up/followupCallService'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab'
import { Typography, useMediaQuery, useTheme } from '@mui/material'

const ScheduledCallsView = ({ open, id, handleClose }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await FollowUpCallService.getById(id)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching call data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData()
    } else {
      setData(null)
      setLoading(false)
    }
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const getCallIcon = (callType) => {
    return callType === 'outgoing' ? (
      <PhoneOutlined fontSize='small' />
    ) : (
      <PhoneCallbackOutlined fontSize='small' />
    )
  }

  const hasFollowUps = data?.followup_calls_associated?.length > 0
  const isCallEnded = data?.isClosed

  return (
    <Dialog
      fullScreen={isSmallScreen}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          [theme.breakpoints.up('sm')]: {
            minHeight: '60vh',
            maxHeight: '90vh'
          }
        }
      }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex items-center gap-2 px-4 pt-6 sm:px-6'>
        <PhoneOutlined color='primary' />
        <span>Scheduled Calls Timeline</span>
      </DialogTitle>

      <DialogContent dividers sx={{
        px: { xs: 2, sm: 4 },
        py: 2,
        [theme.breakpoints.down('sm')]: {
          px: 1
        }
      }}>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
            <CircularProgress />
          </Box>
        ) : data ? (
          <Timeline position={isSmallScreen ? 'right' : 'alternate'} sx={{ my: 0, p: 0 }}>
            {/* Root Call */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='primary' sx={{ boxShadow: 'none' }}>
                  {getCallIcon(data?.call_type)}
                </TimelineDot>
                {hasFollowUps && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ pb: 4, px: { xs: 1, sm: 3 } }}>
                <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Initial Call - {data?.call_label}
                  </Typography>
                  <Chip
                    label={data?.call_type}
                    size='small'
                    color={data?.call_type === 'outgoing' ? 'primary' : 'success'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Box display='flex' alignItems='center' gap={1} mt={0.5} mb={2}>
                  <AccessTimeOutlined fontSize='small' color='disabled' />
                  <Typography variant='caption' color='text.secondary'>
                    {formatDate(data?.call_date)}
                  </Typography>
                </Box>

                {data?.call_note && (
                  <Box
                    bgcolor={theme.palette.action.hover}
                    p={2}
                    borderRadius={1}
                    mb={2}
                  >
                    <Box display='flex' alignItems='center' gap={1} mb={1}>
                      <NotesOutlined fontSize='small' color='disabled' />
                      <Typography variant='subtitle2' color='text.secondary'>
                        Call Notes
                      </Typography>
                    </Box>
                    <Typography variant='body2'>
                      {data?.call_note}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box display='flex' flexDirection='column' gap={1.5}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <BusinessOutlined fontSize='small' color='disabled' />
                    <Typography variant='body2'>
                      <strong>Business:</strong> {data?.business_id?.companyInfo?.companyName || 'N/A'}
                    </Typography>
                  </Box>

                  <Box display='flex' alignItems='center' gap={1}>
                    <PersonOutlined fontSize='small' color='disabled' />
                    <Typography variant='body2'>
                      <strong>CEO:</strong> {data?.business_id?.companyInfo?.companyCeo || 'N/A'}
                    </Typography>
                  </Box>

                  {/* <Box display='flex' alignItems='center' gap={1}>
                    <PersonOutlined fontSize='small' color='disabled' />
                    <Typography variant='body2'>
                      <strong>Created By:</strong> {data?.createdBy?.email || 'N/A'}
                    </Typography>
                  </Box> */}
                  <Box display='flex' alignItems='center' gap={1}>
                    <AccessTimeOutlined fontSize='small' color='disabled' />
                    <Typography variant='caption' color='text.secondary'>
                      <strong>Created At:</strong> {formatDate(data?.createdAt)}
                    </Typography>
                  </Box>
                  {<Box display='flex' alignItems='center' gap={1}>
                    <AccessTimeOutlined fontSize='small' color='disabled' />
                    <Typography variant='caption' color='text.secondary'>
                      <strong>Actual Call At:</strong> {formatDate(data?.updatedAt)}
                    </Typography>
                  </Box>}
                </Box>
              </TimelineContent>
            </TimelineItem>

            {/* Follow-up Calls */}
            {hasFollowUps && (
              data.followup_calls_associated.map((followup, index) => (
                <TimelineItem key={followup._id}>
                  <TimelineSeparator>
                    <TimelineDot color={followup.isClosed ? 'success' : 'grey'} sx={{ boxShadow: 'none' }}>
                      {followup.isClosed ? (
                        <CheckCircleOutline fontSize='small' />
                      ) : (
                        <ScheduleOutlined fontSize='small' />
                      )}
                    </TimelineDot>
                    {index < data.followup_calls_associated.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ pb: 4, px: { xs: 1, sm: 3 } }}>
                    <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {followup.isClosed ? 'Completed Follow-up' : 'Scheduled Follow-up'}
                      </Typography>
                      {followup.isClosed && (
                        <Chip
                          label="Completed"
                          size='small'
                          color='success'
                          variant='outlined'
                        />
                      )}
                    </Box>

                    <Box display='flex' alignItems='center' gap={1} mb={2}>
                      <AccessTimeOutlined fontSize='small' color='disabled' />
                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(followup?.call_date)}
                      </Typography>
                    </Box>

                    <Box bgcolor={theme.palette.action.hover} p={2} borderRadius={1} mb={2}>
                      <Typography variant='body2' color='text.secondary'>
                        {followup.isClosed
                          ? 'This follow-up call has been completed.'
                          : `Follow-up scheduled from last call on ${formatDate(data?.last_call_date)}.`}
                      </Typography>

                      {/* {followup.call_note && (
                        <>
                          <Divider sx={{ my: 1.5 }} />
                          <Typography variant='body2'>
                            {followup.call_note}
                          </Typography>
                        </>
                      )} */}
                    </Box>
                    {
                      followup?.call_note && (
                        <Box
                          bgcolor={theme.palette.action.hover}
                          p={2}
                          borderRadius={1}
                          mb={2}
                        >
                          <Box display='flex' alignItems='center' gap={1} mb={1}>
                            <NotesOutlined fontSize='small' color='disabled' />
                            <Typography variant='subtitle2' color='text.secondary'>
                              Call Notes
                            </Typography>
                          </Box>
                          <Typography variant='body2'>
                            {followup?.call_note}
                          </Typography>
                        </Box>
                      )}

                    {/* <Box display='flex' alignItems='center' gap={1}>
                      <PersonOutlined fontSize='small' color='disabled' />
                      <Typography variant='body2'>
                        <strong>Created By:</strong> {data?.createdBy?.email || 'N/A'}
                      </Typography>
                    </Box> */}
                    <Box display='flex' alignItems='center' gap={1}>
                      <AccessTimeOutlined fontSize='small' color='disabled' />
                      <Typography variant='caption' color='text.secondary'>
                        <strong>Created At:</strong> {formatDate(followup?.createdAt)}
                      </Typography>
                    </Box>
                    {followup?.updatedAt && (
                      <Box display='flex' alignItems='center' gap={1}>
                        <AccessTimeOutlined fontSize='small' color='disabled' />
                        <Typography variant='caption' color='text.secondary'>
                          <strong>Actual Call At:</strong> {formatDate(followup?.updatedAt)}
                        </Typography>
                      </Box>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))
            )}
            {isCallEnded && (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='success' sx={{ boxShadow: 'none' }}>
                    <CheckCircleOutline fontSize='small' />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 4, px: { xs: 1, sm: 3 } }}>
                  <Paper elevation={0} sx={{
                    p: 3,
                    bgcolor: 'action.hover',
                    textAlign: 'center'
                  }}>
                    <Stack alignItems='center' spacing={2}>
                      <CheckCircleOutline sx={{ fontSize: 48 }} />
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Calls Ended
                      </Typography>
                      <Typography variant='body2'>
                        This call sequence has been marked as completed with no further follow-ups scheduled.
                      </Typography>
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
              // ) 
              // : (
              //   <TimelineItem>
              //     <TimelineSeparator>
              //       <TimelineDot color='grey' sx={{ boxShadow: 'none' }}>
              //         <ScheduleOutlined fontSize='small' />
              //       </TimelineDot>
              //     </TimelineSeparator>
              //     <TimelineContent sx={{ pb: 4, px: { xs: 1, sm: 3 } }}>
              //       <Paper elevation={0} sx={{ 
              //         p: 3, 
              //         bgcolor: 'action.hover',
              //         textAlign: 'center'
              //       }}>
              //         <Stack alignItems='center' spacing={2}>
              //           <ScheduleOutlined sx={{ fontSize: 48, color: 'text.secondary' }} />
              //           <Typography variant='h6' sx={{ fontWeight: 600 }}>
              //             No Follow-ups Scheduled
              //           </Typography>
              //           <Typography variant='body2' color='text.secondary'>
              //             There are currently no follow-up calls scheduled for this sequence.
              //           </Typography>
              //         </Stack>
              //       </Paper>
              //     </TimelineContent>
              //   </TimelineItem>
            )}
          </Timeline>
        ) : (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
            <Typography color='text.secondary'>No call data available</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScheduledCallsView
