"use client"

import React, { useState } from 'react'
import { Button, Card, Box, Typography, Grid, MenuItem, InputAdornment, IconButton } from '@mui/material'
import maritalStatus from '@/services/customers/maritalstatus'
import CustomTextField from '@/@core/components/mui/TextField'
import { useEmployeeForm } from '../../useEmployeeForm'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
const SecurityForm = ({ nextHandle, handleCancel }) => {
    const {
        securityFormData,
        securityErrors,
        handleSecurityChange,
        validateSecurity,
        isEditMode,
        resetForm,
        tabManagement,
        setTabManagement,
    } = useEmployeeFormContext();

    const handleSubmit = (e) => {
        e.preventDefault()
        const validSecurity = validateSecurity()
        if (!validSecurity && !isEditMode) return
        console.log('Security Data:', securityFormData)
        setTabManagement(prev => ({
            ...prev,
            General: {
                ...prev.General,
                document: true,
            }
        }))
        nextHandle()
    }
    const [passwordVisile, setpasswordVisile] = useState({
        showPassword: false,
        showConfirmPassword: false
    })

    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    Security Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Username"
                            name="username"
                            placeholder="Enter Username"
                            value={securityFormData.username}
                            onChange={handleSecurityChange('username')}
                            error={!!securityErrors.username}
                            helperText={securityErrors.username}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Password"
                            name="password"
                            placeholder="Enter Password"
                            type={passwordVisile.showPassword ? 'text' : 'password'}
                            value={securityFormData.password}
                            onChange={handleSecurityChange('password')}
                            error={!!securityErrors.password}
                            helperText={securityErrors.password}
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
                            label="Confirm Password"
                            name="Confirm Password"
                            placeholder="Enter Confirm Password"
                            type={passwordVisile.showConfirmPassword ? 'text' : 'password'}
                            value={securityFormData.confirmPassword}
                            onChange={handleSecurityChange('confirmPassword')}
                            error={!!securityErrors.confirmPassword}
                            helperText={securityErrors.confirmPassword}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setpasswordVisile({ ...passwordVisile, showConfirmPassword: !passwordVisile.showConfirmPassword })}
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
                            select
                            fullWidth
                            label="Login Access"
                            value={securityFormData.loginAccess}
                            onChange={(e) => handleSecurityChange('loginAccess')(e)}
                            error={!!securityErrors.loginAccess}
                            helperText={securityErrors.loginAccess}
                        >
                            <MenuItem value={true} >Allow</MenuItem>
                            <MenuItem value={false} >Block</MenuItem>
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            fullWidth
                            label="Attendance Type"
                            value={securityFormData.attendance_type}
                            onChange={(e) => handleSecurityChange('attendance_type')(e)}
                            error={!!securityErrors.attendance_type}
                            helperText={securityErrors.attendance_type}
                        >
                            <MenuItem value={"manual"} >Manual</MenuItem>
                            <MenuItem value={"online"} >Online</MenuItem>
                        </CustomTextField>
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

export default SecurityForm;
