'use client'

import { useState, useEffect, useRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'

// IMPORT APIS
import Image from '@/services/imageService'

// Component Imports
import manageBusinessService from '@/services/business/manageBusiness.service'
import productGroupService from "@/services/product/productGroup"

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { Box } from '@mui/material'
import FileUploader from '@/components/FileUploader'

const initialData = {
    // businessId: '',
    name: '',
    status: 'INACTIVE',
    image: ''
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddProductGroup = ({ open, setOpen, data, onSuccess }) => {
    const params = useParams()
    const businessId = params?.id

    const [userData, setUserData] = useState(data || initialData)
    const [imageLoader, setimageLoader] = useState(false)

    console.log(businessId, "data data");

    useEffect(() => {
        if (data) {
            setUserData({
                name: data?.name || '',
                image: data?.image?.url || '',
                businessId: data?.businessId?._id || businessId,
                status: data?.status || 'ACTIVE'
            })
        } else {
            setUserData({
                name: '',
                image: '',
                status: 'ACTIVE',
                businessId: businessId
            })
        }
    }, [data, businessId, open])
    console.log(userData, "userDatauserDatauserData");



    useEffect(() => {
        console.log('Received businessId prop:', businessId)
    }, [businessId])

    const handleClose = () => {
        setOpen(false)
        // setUserData(initialData)
        setUserData({ ...initialData, businessId })
    }



    const handleSubmit = async e => {
        e.preventDefault()

        if (!userData.image || !userData.businessId || !userData.name || !userData.status) {
            toast.error('Please fill all required fields.')
            return
        }

        const payload = {
            businessId: userData.businessId,
            name: userData.name,
            status: userData.status,
            image: userData.image?.target?.value
        }

        try {
            let res
            if (data?._id) {
                res = await productGroupService.updateProductGroup(data._id, payload)
            } else {
                res = await productGroupService.addProductGroup(payload)
            }

            if (res) {
                toast.success(`Product Group ${data ? 'updated' : 'created'} successfully.`)
                onSuccess?.()
                handleClose()
            } else {
                throw new Error('Unexpected response')
            }
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to add product group.')
        }
    }


    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            maxWidth='sm'
            scroll='body'
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogCloseButton onClick={handleClose} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle variant='h3' className='text-center'>
                Add Product Group
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={4}>
                        {/* <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Select Vendor*'
                                value={userData.businessId}
                                onChange={e => setUserData({ ...userData, businessId: e.target.value })}
                            >
                                <MenuItem value='disabled'>Select Vendor</MenuItem>
                                {businessList && businessList.map((item, index) => (
                                    <MenuItem key={index} value={item?._id}>{item?.vendorId}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                                fullWidth
                                label='Group Name *'
                                placeholder='Enter Product Group Name'
                                value={userData.name}
                                onChange={e => setUserData({ ...userData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Status*'
                                value={userData.status}
                                onChange={e => setUserData({ ...userData, status: e.target.value })}
                            >
                                <MenuItem value='' disabled>
                                    Select Status
                                </MenuItem>
                                {statusOptions.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    padding: 2,
                                    height: '100%',
                                }}
                            >


                                <FileUploader
                                    acceptedFiles={['image/jpeg', 'image/png']}
                                    // error_text={errors.main_image}
                                    initialFile={userData.image?.target?.main_image}
                                    label="Upload Temple Main Image"
                                    name="main_image"
                                    folderName="Spiritual/Hinduism/Temple"
                                    onFileSelect={(fileUrl) =>
                                        setUserData(prev => ({ ...prev, image: fileUrl }))
                                    }
                                    cropSize={{ width: 800, height: 600 }}
                                    isWatermark={false}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions className='justify-center'>
                    {!imageLoader && (
                        <Button variant='contained' type='submit'>
                            Submit
                        </Button>
                    )}
                    <Button variant='tonal' color='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddProductGroup
