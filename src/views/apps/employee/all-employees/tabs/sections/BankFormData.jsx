"use client"

import React from 'react'
import { Button, Card, Box, Typography, Grid, MenuItem, InputAdornment, IconButton } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
const BankFormData = ({ nextHandle, handleCancel }) => {
    const {
        bankFormData,
        bankErrors,
        handleBankChange,
        validateBank,
        setTabManagement,
        resetForm,
    } = useEmployeeFormContext();

    const handleSubmit = (e) => {
        e.preventDefault()
        const validSecurity = validateBank()
        if (!validSecurity) return
        console.log('Bank Data:', bankFormData)
        setTabManagement(prev => ({
            ...prev,
            General: {
                ...prev.General,
                email_configuration: true,
            }
        }))

        nextHandle()
    }


    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    Bank Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Acount Holder Name"
                            name='accountHolderName'
                            placeholder="Enter Account Holder Name"
                            value={bankFormData.accountHolderName}
                            onChange={handleBankChange('accountHolderName')}
                            error={!!bankErrors.accountHolderName}
                            helperText={bankErrors.accountHolderName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Account Number"
                            name='accountNumber'
                            placeholder="Enter Account Number"
                            value={bankFormData.accountNumber}
                            onChange={handleBankChange('accountNumber')}
                            error={!!bankErrors.accountNumber}

                            helperText={bankErrors.accountNumber}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Bank Name"
                            name='bankName'
                            placeholder="Enter Bank Name"
                            value={bankFormData.bankName}
                            onChange={handleBankChange('bankName')}
                            error={!!bankErrors.bankName}
                            helperText={bankErrors.bankName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Branch Name"
                            name='branchName'
                            placeholder="Enter Branch Name"
                            value={bankFormData.branchName}
                            onChange={handleBankChange('branchName')}
                            error={!!bankErrors.branchName}
                            helperText={bankErrors.branchName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="IFSC Code"
                            name='ifscCode'
                            placeholder="Enter IFSC Code"
                            value={bankFormData.ifscCode}
                            onChange={handleBankChange('ifscCode')}
                            error={!!bankErrors.ifscCode}
                            helperText={bankErrors.ifscCode}
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

export default BankFormData;
