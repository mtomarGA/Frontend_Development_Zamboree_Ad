'use client'

import { useEffect, useState } from 'react'
import {
    Card,
    Button,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemText,
    Grid,
    MenuItem,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import searchBusiness from '@/services/utsav/banner/HomeBannerServices'
import AddBankDetails from '@/services/business/manageBusiness.service'
import Bank from "@/services/business/bank.service"

const BankDetailsForm = ({ setModalOpen, getBankDetail, EditSelectedBanck }) => {

    console.log(EditSelectedBanck, "EditSelectedBanckEditSelectedBanck");


    const [vendorData, setVendorData] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [bank, setBank] = useState([])
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            businessSearchId: null,
            name: '',
            bankName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifscCode: '',
            branchName: '',
        },
    })

    // Prefill on edit
    useEffect(() => {
        if (EditSelectedBanck) {
            const bank = EditSelectedBanck?.bankDetails || {}; // ✅ Correct key name
            const company = EditSelectedBanck?.companyInfo || {};

            reset({
                businessSearchId: EditSelectedBanck?._id || null,
                name: bank?.name || '',
                bankName: bank?.bankName || '',
                accountNumber: bank?.accountNumber || '',
                confirmAccountNumber: bank?.confirmAccountNumber || '',
                ifscCode: bank?.IFSCCode || '', // Match input name
                branchName: bank?.branchName || '',
            });

            setInputValue(
                `${company?.companyName || ''} - ${EditSelectedBanck?.vendorId || ''}`
            );
        }
    }, [EditSelectedBanck, reset]);



    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (inputValue?.trim() && !EditSelectedBanck) {
                fetchVendors(inputValue)
            }
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [inputValue])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.vendor-dropdown')) setShowDropdown(false)
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const fetchVendors = async (search) => {
        try {
            setLoading(true)
            const response = await searchBusiness.getsearch({ search })
            setVendorData(response.data || [])
            setShowDropdown(true)
        } catch (err) {
            toast.error('Failed to fetch businesses')
        } finally {
            setLoading(false)
        }
    }

    const getBanks = async () => {
        const result = await Bank.getBanks()


        setBank(result?.data)
    }
    useEffect(() => {
        getBanks()
    }, [EditSelectedBanck?.vendorId])

    const onSubmit = async (data) => {
        if (!data.businessSearchId) {
            toast.error('Please select a business')
            return
        }
        if (data.accountNumber !== data.confirmAccountNumber) {
            toast.error('Account numbers do not match')
            return
        }

        const bankDetails = {
            name: data?.name,
            accountNumber: data?.accountNumber,
            confirmAccountNumber: data?.confirmAccountNumber,
            banckName: data?.bankName,
            IFSCCode: data?.ifscCode,
            branchName: data?.branchName,
        }

        try {
            const businessId = data.businessSearchId
            console.log(bankDetails, "bankDetailsbankDetails");

            const result = await AddBankDetails.addBusinessBankDetails(
                businessId,
                bankDetails
            )
            toast.success(result?.message || 'Bank details saved successfully!')
            getBankDetail()
            setModalOpen(false)
            reset()
            setShowDropdown(false)
        } catch (err) {
            toast.error(
                err?.response?.data?.message || 'Failed to save bank details'
            )
        }
    }

    return (
        <Card className="p-4 shadow-none">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                    {/* Business Selection */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="businessSearchId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <div
                                    className="vendor-dropdown"
                                    style={{ position: 'relative' }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Select Business"
                                        placeholder="Type to search"
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputValue(e.target.value)
                                            field.onChange(null)
                                        }}
                                        onFocus={() => {
                                            if (vendorData.length > 0) setShowDropdown(true)
                                        }}
                                        error={!!errors.businessSearchId}
                                        helperText={
                                            errors.businessSearchId && 'Please select a business'
                                        }
                                    />

                                    {showDropdown && vendorData.length > 0 && (
                                        <Paper
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                zIndex: 999,
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                            }}
                                        >
                                            <List>
                                                {vendorData.map((vendor) => (
                                                    <ListItem
                                                        button
                                                        key={vendor._id}
                                                        onClick={() => {
                                                            field.onChange(vendor._id)
                                                            setInputValue(
                                                                `${vendor.companyInfo?.companyName || ''} - ${vendor.vendorId
                                                                }`
                                                            )
                                                            setShowDropdown(false)
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={`${vendor.companyInfo?.companyName || ''} - ${vendor.vendorId
                                                                }`}
                                                            secondary={vendor?.contactInfo?.phoneNo || ''}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Paper>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>

                    {/* Account Holder Name */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Account Holder Name"
                                    placeholder="Enter Account Holder Name"
                                    error={!!errors.name}
                                    helperText={errors.name && 'This field is required'}
                                />
                            )}
                        />
                    </Grid>

                    {/* Bank Name */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="bankName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label="Bank Name"
                                    placeholder="Select Bank Name"
                                    error={!!errors.bankName}
                                    helperText={errors.bankName && 'This field is required'}
                                    sx={{
                                        '& .MuiInputBase-input': { textAlign: 'left' }, // ensures input text is left aligned
                                    }}
                                >
                                    <MenuItem value="" sx={{ textAlign: 'left' }}>
                                        Select Bank
                                    </MenuItem>
                                    {bank.map((bnk) => (
                                        <MenuItem key={bnk._id} value={bnk._id} sx={{ textAlign: 'left' }}>
                                            {bnk.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>



                    {/* Account Number */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="accountNumber"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Account Number"
                                    placeholder="Enter Account Number"
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber && 'This field is required'}
                                    onChange={(e) =>
                                        field.onChange(e.target.value.replace(/\D/g, ''))
                                    }
                                    value={field.value || ''}
                                />
                            )}
                        />
                    </Grid>

                    {/* Confirm Account Number */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="confirmAccountNumber"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Confirm Account Number"
                                    placeholder="Re-enter Account Number"
                                    error={!!errors.confirmAccountNumber}
                                    helperText={
                                        errors.confirmAccountNumber && 'This field is required'
                                    }
                                    onChange={(e) =>
                                        field.onChange(e.target.value.replace(/\D/g, ''))
                                    }
                                    value={field.value || ''}
                                />
                            )}
                        />
                    </Grid>

                    {/* IFSC Code */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="ifscCode"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="IFSC Code"
                                    placeholder="Enter IFSC Code"
                                    inputProps={{ maxLength: 11 }}
                                    error={!!errors.ifscCode}
                                    helperText={errors.ifscCode && 'This field is required'}
                                />
                            )}
                        />
                    </Grid>

                    {/* Branch Name */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="branchName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Branch Name"
                                    placeholder="Enter Branch Name"
                                    error={!!errors.branchName}
                                    helperText={errors.branchName && 'This field is required'}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            {EditSelectedBanck?.vendorId
                                ? 'Update Bank Details'
                                : 'Save Bank Details'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Card>
    )
}

export default BankDetailsForm
