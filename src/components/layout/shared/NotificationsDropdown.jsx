'use client'

import { useRef, useState, useEffect } from 'react'

// MUI Imports
import {
  IconButton, Badge, Popper, Fade, Paper, ClickAwayListener,
  Typography, Chip, Tooltip, Divider, Button, Box, Menu, MenuItem
} from '@mui/material'
import { MoreVertical, Check, X } from 'lucide-react'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useMediaQuery from '@mui/material/useMediaQuery'

// Context
import { useNotificationContext } from '@/services/notification-bell/notificationService'

// Scroll Wrapper
const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const NotificationDropdown = () => {
  // Context
  const { notifications, markAsRead, removeNotification, markAllRead, removeAllNotification } = useNotificationContext()

  // States
  const [open, setOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [activeNote, setActiveNote] = useState(null)

  // Vars
  const notificationCount = notifications.filter(note => !note.isRead).length
  const readAll = notifications.every(note => note.isRead)

  // Refs
  const anchorRef = useRef(null)
  const ref = useRef(null)

  // Hooks
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  const handleClose = () => setOpen(false)
  const handleToggle = () => setOpen(prev => !prev)

  // Open 3-dot menu
  const handleMenuOpen = (event, note) => {
    setMenuAnchor(event.currentTarget)
    setActiveNote(note)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
    setActiveNote(null)
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        const availableHeight = window.innerHeight - 100
        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }
    window.addEventListener('resize', adjustPopoverHeight)
  }, [])

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <Badge
          color='error'
          className='cursor-pointer'
          badgeContent={notificationCount}
          invisible={notificationCount === 0}
        >
          <i className='tabler-bell' />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
            className: 'is-full !mbs-3 z-[1] max-bs-[550px] bs-[550px]',
            modifiers: [{ name: 'preventOverflow', options: { padding: themeConfig.layoutPadding } }]
          }
          : { className: 'is-96 !mbs-3 z-[1] max-bs-[550px] bs-[550px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  {/* Header */}
                  <div className='flex items-center justify-between plb-3.5 pli-4 gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      Notifications
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip size='small' variant='tonal' color='primary' label={`${notificationCount} New`} />
                    )}
                    <Tooltip title={readAll ? 'Mark all as unread' : 'Mark all as read'}>
                      {notifications.length > 0 && (
                        <IconButton size='small' onClick={markAllRead} className='text-textPrimary'>
                          <i className={readAll ? 'tabler-mail' : 'tabler-mail-opened'} />
                        </IconButton>
                      )}
                    </Tooltip>

                    <Tooltip title="Delete all notifications">
                      {notifications.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            removeAllNotification();
                          }}
                          className="text-textPrimary"
                        >
                          <i className="tabler-trash" />
                        </IconButton>
                      )}
                    </Tooltip>
                  </div>

                  <Divider />

                  {/* List */}
                  <ScrollWrapper hidden={hidden}>
                    {notifications.length > 0 ? (
                      notifications.map((note, index) => (
                        <div
                          key={note._id}
                          className={classnames(
                            'flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group',
                            { 'border-be': index !== notifications.length - 1 }
                          )}
                        >
                          {/* Blue dot if unread */}
                          {!note.isRead && (
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                marginTop: 8
                              }}
                            />
                          )}

                          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <div className='flex flex-col flex-auto'>
                              <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                                {note.title}
                              </Typography>
                              <Typography variant='caption' color='text.secondary' className='mbe-2'>
                                {note.message}
                              </Typography>
                              <Typography variant='caption' color='text.disabled'>
                                {new Date(note.createdAt).toLocaleString()}
                              </Typography>
                            </div>

                            {/* Three-dot menu */}
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={(e) => handleMenuOpen(e, note)}
                            >
                              <MoreVertical size={18} />
                            </IconButton>
                          </Box>
                        </div>
                      ))
                    ) : (
                      <Typography variant='body2' className='p-4 text-center text-textSecondary'>
                        No new notifications
                      </Typography>
                    )}
                  </ScrollWrapper>

                  <Divider />

                  {/* Footer */}
                  <div className='p-4'>
                    <Button fullWidth variant='contained' size='small'>
                      View All Notifications
                    </Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {activeNote && !activeNote.isRead && (
          <MenuItem
            onClick={() => {
              markAsRead(activeNote._id)
              handleMenuClose()
            }}
          >
            <Check size={16} className="mr-2" /> Mark as Read
          </MenuItem>
        )}
        {activeNote && (
          <MenuItem
            onClick={() => {
              removeNotification(activeNote._id)
              handleMenuClose()
            }}
          >
            <X size={16} className="mr-2" /> Remove
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default NotificationDropdown
