"use client"

import React, { useState } from 'react'
import { Button, Card, Box, Typography, Grid, MenuItem, InputAdornment, IconButton } from '@mui/material'
import maritalStatus from '@/services/customers/maritalstatus'
import CustomTextField from '@/@core/components/mui/TextField'
import { useEmployeeForm } from '../../useEmployeeForm'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
const EmailConfigForm = ({ nextHandle, handleCancel }) => {
    const {
        emailConfig,
        emailConfigErrors,
        handleEmailConfigChange,
        validateEmailConfig,
        isEditMode,
        resetForm,
        tabManagement,
        setTabManagement,
    } = useEmployeeFormContext();

    const [passwordVisile, setpasswordVisile] = useState({
        showPassword: false,
        showConfirmPassword: false
    })
    const handleSubmit = (e) => {
        e.preventDefault()
    setTabManagement(prev => ({
      ...prev,
      General: {
        ...prev.General,
        leave: true,
      }
    }))
    nextHandle()
    }
    return (
        <Card sx={{ p: 4 }} onSubmit={handleSubmit}>
            <Box component="form" noValidate>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    Email Configuration
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="SMTP Host"
                            name="smtp_host"
                            placeholder="Enter SMTP Host"
                            value={emailConfig.smtp_host}
                            onChange={handleEmailConfigChange('smtp_host')}
                            error={!!emailConfigErrors.smtp_host}
                            helperText={emailConfigErrors.smtp_host}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            disabled
                            label="Email"
                            name="smtp_email"
                            placeholder="Enter Email"
                            value={emailConfig.smtp_email}
                            onChange={handleEmailConfigChange('smtp_email')}
                            error={!!emailConfigErrors.smtp_email}
                            helperText={emailConfigErrors.smtp_email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="SMTP Password"
                            name="smtp_password"
                            placeholder="Enter Password"
                            type={passwordVisile.showPassword ? 'text' : 'password'}
                            value={emailConfig.smtp_password}
                            onChange={handleEmailConfigChange('smtp_password')}
                            error={!!emailConfigErrors.smtp_password}
                            helperText={emailConfigErrors.smtp_password}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setpasswordVisile({ ...passwordVisile, showPassword: !passwordVisile.showPassword })}
                                                onMouseDown={e => e.preventDefault()}
                                                aria-label='toggle password visibility'
                                            >
                                                <i className={passwordVisile.showPassword ? 'tabler-eye' : 'tabler-eye-off'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="SMTP Port"
                            name="smtp_port"
                            type="number"
                            placeholder="Enter SMTP Port"
                            value={emailConfig.smtp_port}
                            onChange={handleEmailConfigChange('smtp_port')}
                            error={!!emailConfigErrors.smtp_port}
                            helperText={emailConfigErrors.smtp_port}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="IMAP Host"
                            name="imap_host"
                            placeholder="Enter IMAP Host"
                            type="text"
                            value={emailConfig.imap_host}
                            onChange={handleEmailConfigChange('imap_host')}
                            error={!!emailConfigErrors.imap_port}
                            helperText={emailConfigErrors.imap_port}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="IMAP Port"
                            name="imap_port"
                            placeholder="Enter IMAP Port"
                            type="number"
                            value={emailConfig.imap_port}
                            onChange={handleEmailConfigChange('imap_port')}
                            error={!!emailConfigErrors.imap_port}
                            helperText={emailConfigErrors.imap_port}
                        />
                    </Grid>




                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                    <Button className='m-2' onClick={() => { handleCancel(); resetForm() }} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button className='m-2' type="submit" variant="contained" color="primary">
                        Next
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}

export default EmailConfigForm;
