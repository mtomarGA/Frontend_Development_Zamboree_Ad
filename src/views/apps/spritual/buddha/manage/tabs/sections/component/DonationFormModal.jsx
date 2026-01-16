'use client'

import { useEffect, useState } from 'react'

// MUI
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Utils
import dayjs from 'dayjs'
import { Box } from '@mui/material'
import FileUploader from './FileUploader'

const DonationFormModal = ({
    open,
    setOpen,
    data,
    handleAdd,
    handleUpdate
}) => {
    const [formData, setFormData] = useState({
        donorName: '',
        amount: '',
        date: '',
        status: 'Pending',
        main_image: null
    })

    useEffect(() => {
        if (data) {
            setFormData({
                donorName: data.donorName || '',
                amount: data.amount || '',
                date: data.date ? dayjs(data.date).format('YYYY-MM-DD') : '',
                status: data.status || 'Pending'
            })
        } else {
            setFormData({
                donorName: '',
                amount: '',
                date: '',
                status: 'Pending'
            })
        }
    }, [data])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        const payload = { ...formData }
        if (data?._id) {
            handleUpdate({ ...data, ...payload })
        } else {
            handleAdd(payload)
        }
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
            <DialogTitle>{data ? 'Edit Donation' : 'Add Donation'}</DialogTitle>
            <DialogContent className='flex flex-col gap-4 pt-4'>
                <TextField
                    label='Donor Name'
                    name='donorName'
                    value={formData.donorName}
                    onChange={handleChange}
                    fullWidth
                />
                <Box
                    sx={{
                        width: '100%',
                        height: 200,
                        border: `1px dashed ${false ? 'red' : '#ccc'}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        fontSize: 14,
                        textAlign: 'center',
                    }}
                >
                    <FileUploader
                        onFileSelect={(file) => {
                            handleChange('main_image')({ target: { value: file } })
                        }}
                        // errors={errors}
                    />
                </Box>
                <TextField
                    label='Date'
                    name='date'
                    type='date'
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    select
                    label='Status'
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                >
                    <MenuItem value='Pending'>Pending</MenuItem>
                    <MenuItem value='Completed'>Completed</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color='secondary'>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant='contained'>
                    {data ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DonationFormModal
