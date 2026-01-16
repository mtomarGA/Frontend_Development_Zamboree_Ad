'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { Grid } from '@mui/system'
import { Button } from '@mui/material'

// Service & Utils
import Payment from "@/services/business/service/paymentBusiness.service"
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'

const PaymentAdd = ({ data, open, setOpen, getAllBusiness }) => {

    const [formData, setFormData] = useState({
        name: '',
        status: ''
    })

    useEffect(() => {
        setFormData({
            name: data?.name,
            status: data?.status
        })
    }, [data])



    const [errors, setErrors] = useState({})

    const handleAdd = async () => {
        if (!formData.name) {
            setErrors({ name: 'Payment method is required' })
            return
        }
        if (!formData.status) {
            setErrors({ status: 'Status is required' })
            return
        }

        if (data?._id) {
            const Id = data?._id
            const updatePayment = await Payment.updateServicePayment(Id, formData)
            toast.success(updatePayment.message)
            getAllBusiness()
            setFormData("")
            setOpen(false)
        } else {
            const addPayment = await Payment.addServicePayment(formData)
            toast.success(addPayment.message)
            getAllBusiness()
            setFormData("")
            setOpen(false)
        }



    }

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={() => setOpen(false)}
            maxWidth='sm'
            scroll='body'
            closeAfterTransition={false}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>

            <DialogTitle
                variant='h4'
                className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-10 sm:pli-16'
            >
                Select Payment Methods
                <Typography component='span' className='flex flex-col items-center'>
                    Supported payment methods
                </Typography>
            </DialogTitle>

            <DialogContent className='pbs-0 sm:pli-16 sm:pbe-20'>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label='Payment Method'
                            placeholder='Enter Payment Method'
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            select
                            fullWidth
                            label='Status'
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            <MenuItem value='ACTIVE'>Approved</MenuItem>
                            <MenuItem value='INACTIVE'>Pending</MenuItem>
                        </CustomTextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <Button onClick={handleAdd} variant='contained'>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentAdd
