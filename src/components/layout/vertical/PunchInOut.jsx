'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Box,
  Typography,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  MenuList,
  Snackbar,
  Alert
} from '@mui/material'
import { useSettings } from '@/@core/hooks/useSettings'
import { FingerprintIcon } from 'lucide-react'
import punchService from '@/services/attendance/punchInOut.service'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'

const PunchInOut = () => {
  const [punchInTime, setPunchInTime] = useState(null)
  const [punchOutTime, setPunchOutTime] = useState(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' })

   const { user } = useAuth()
  
  useEffect(() => {
    const fetchTodayPunch = async () => {
      const data = await punchService.getTodayStatus()
      setPunchInTime(data.data.punchIn.time)
      setPunchOutTime(data.data.punchOut.time)

    }
    fetchTodayPunch()
  }, [])

  const anchorRef = useRef(null)
  const { settings } = useSettings()

  
  

  const formatTime = isoString => {
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const formattedHours = String(hours).padStart(2, '0')
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`
  }

  const handlePunch = async type => {
    // ✅ Prevent punching twice
    if ((type === 'in' && punchInTime) || (type === 'out' && punchOutTime)) {
      setToast({
        open: true,
        message: `Already punched ${type === 'in' ? 'in' : 'out'}!`,
        severity: 'warning'
      })
      return
    }

    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude?.toFixed(6)
        const lng = pos.coords.longitude?.toFixed(6)

        if (!lat || !lng) {
          setError('Unable to fetch current location.')
          return
        }

        const time = new Date().toISOString()

        try {
          const payload = { type, time, latitude: Number(lat), longitude: Number(lng) }
          await punchService.punchIn(payload)

          // ✅ store raw ISO string, not formatted
          if (type === 'in') {
            setPunchInTime(time)
          } else {
            setPunchOutTime(time)
          }

          setError('')
          setToast({
            open: true,
            message: `Punch ${type === 'in' ? 'in' : 'out'} successful!`,
            severity: 'success'
          })
        } catch (err) {
          const msg = err?.response?.data?.message || err?.message || 'Failed to punch. Please try again.'
          setError(msg)
          setToast({ open: true, message: msg, severity: 'error' })
        }
      },
      () => setError('Please allow location access.')
    )
  }

  const handleDropdownOpen = () => setOpen(prev => !prev)
  const handleDropdownClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return
    setOpen(false)
  }

  const handleToastClose = () => setToast({ ...toast, open: false })

  return (
    <>
     {user?.userId?.attendance_type!=="manual"&& <Button ref={anchorRef} onClick={handleDropdownOpen} variant='contained'>
        <FingerprintIcon />
      </Button>}

      <Popper open={open} transition disablePortal anchorEl={anchorRef.current} className='min-is-[220px] !mbs-3 z-[1]'>
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleDropdownClose}>
                <MenuList>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      p: 2
                    }}
                  >
                    <Typography variant='h5'>Attendance</Typography>

                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handlePunch('in')}
                      disabled={!!punchInTime}
                    >
                      Punch In {punchInTime && `(${formatTime(punchInTime)})`}
                    </Button>

                    <Button
                      variant='contained'       
                      onClick={() => handlePunch('out')}
                      disabled={!!punchOutTime}
                      sx={{ mt: 2 }}
                    >
                      Punch Out {punchOutTime && `(${formatTime(punchOutTime)})`}
                    </Button>

                    {error && (
                      <Typography variant='body2' color='error' sx={{ mt: 2 }}>
                        {error}
                      </Typography>
                    )}
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PunchInOut
