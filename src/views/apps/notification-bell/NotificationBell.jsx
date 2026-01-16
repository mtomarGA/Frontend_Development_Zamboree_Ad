'use client'
import React, { useState } from 'react'
import { IconButton, Badge, Menu, MenuItem, Typography, Box } from '@mui/material'
import { Bell, Check } from 'lucide-react'
import { useNotificationContext } from '@/services/notification-bell/notificationService'

export default function NotificationBell() {
    const [anchorEl, setAnchorEl] = useState(null)
    const { notifications, markAsRead } = useNotificationContext()

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={notifications?.length || 0} color="error">
                    <Bell size={22} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications && notifications.length > 0 ? (
                    notifications.map((note, index) => (
                        <MenuItem key={index} divider>
                            {/* ✅ Flex box to separate text & button */}
                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                <Typography variant="body2">{note.message}</Typography>
                                <IconButton
                                    edge="end"
                                    size="small"
                                    color="success"
                                    sx={{ ml: 2 }} // ✅ left space
                                    onClick={() => markAsRead(note._id)}
                                >
                                    <Check size={18} />
                                </IconButton>
                            </Box>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem onClick={handleClose}>No new Notifications</MenuItem>
                )}
            </Menu>
        </div>
    )
}
