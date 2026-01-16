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

import manageBusinessService from '@/services/business/manageBusiness.service'
import productService from "@/services/product/product"
import productGroupService from '@/services/product/productGroup'

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderMultiple from './fileUploaderMultiple'
import { Box } from '@mui/material'

const statusOptions = ['PENDING', 'APPROVED', 'REJECTED']

const AddProductInfo = ({ open, setOpen, data, onSuccess }) => {


    

    const params = useParams()
    const businessId = params?.id

    const initialData = {
        businessId: businessId,
        groupId: '',
        name: '',
        stock: '',
        actualPrice: '',
        offerPrice: '',
        description: '',
        status: 'PENDING',
        images: ''
    }

    const [userData, setUserData] = useState(data || initialData)
    const [imageLoader, setimageLoader] = useState(false)
    const [businessList, setBusinessList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [originalData, setOriginalData] = useState(null);


    useEffect(() => {
        if (data) {
            const normalizedData = {
                name: data?.name || '',
                stock: data?.stock || '',
                actualPrice: data?.actualPrice || '',
                offerPrice: data?.offerPrice || '',
                images: data?.images?.map(img => img.url) || [],
                businessId: data?.businessId?._id || businessId,
                groupId: data?.productGroupId?._id || '',
                description: data?.description || '',
                status: data.status || 'PENDING'
            };

            setUserData(normalizedData);
            setOriginalData(normalizedData);
        } else {
            setUserData(initialData);
            setOriginalData(null);
        }
    }, [data, open])

    const handleClose = () => {
        setOpen(false)
        setUserData(initialData)
    }

    useEffect(() => {
        getGroupList(businessId)
    }, [businessId])

    const getGroupList = async (businessId) => {
        try {
            const res = await productService.getActiveGroupByVendorId(businessId)
            setGroupList(res?.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const isDataChanged = () => {
        if (!originalData) return true; // Always allow create

        if (
            userData.name !== originalData.name ||
            userData.stock !== originalData.stock ||
            userData.actualPrice !== originalData.actualPrice ||
            userData.offerPrice !== originalData.offerPrice ||
            userData.groupId !== originalData.groupId ||
            userData.description !== originalData.description
        ) {
            return true;
        }

        const origImages = (originalData.images || []).slice().sort();
        const newImages = (userData.images || []).slice().sort();
        if (origImages.length !== newImages.length) return true;
        for (let i = 0; i < origImages.length; i++) {
            if (origImages[i] !== newImages[i]) return true;
        }

        return false;
    };


    const handleSubmit = async e => {
        e.preventDefault()
     
        
        if (!userData.groupId || !userData.businessId || !userData.name || !userData.stock || !userData.actualPrice || !userData.offerPrice) {
            toast.error('Please fill all required fields.')
            return
        }

        const payload = {
            businessId: userData.businessId,
            groupId: userData.groupId,
            name: userData.name,
            stock: userData.stock,
            actualPrice: userData.actualPrice,
            offerPrice: userData.offerPrice,
            description: userData.description,
            images: userData.images,
            status: userData.status,
        }

 

        try {
            let res
            if (data?._id) {
                res = await productService.updateProduct(data._id, payload)
            } else {
                res = await productService.addProduct(payload)
            }

            if (res) {
                toast.success(`Product ${data ? 'updated' : 'created'} successfully.`)
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
                {`${data ? 'Update' : 'Add'} Product`}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Select Product Group*'
                                value={userData.groupId}
                                onChange={e => setUserData({ ...userData, groupId: e.target.value })}
                            >
                                <MenuItem value='disabled'>Select Product Group</MenuItem>
                                {groupList && groupList.map((item, index) => (
                                    <MenuItem key={index} value={item?._id}>{item?.name}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                fullWidth
                                label='Product Name*'
                                placeholder='Enter Product Name'
                                value={userData.name}
                                onChange={e => setUserData({ ...userData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                select
                                fullWidth
                                label='Stock Status*'
                                placeholder='Enter Product Stock'
                                value={userData.stock}
                                onChange={e => setUserData({ ...userData, stock: e.target.value })}
                            >
                                <MenuItem disabled='disabled' >Stock Status</MenuItem>
                                <MenuItem defaultValue={'AVAILABLE'} value='AVAILABLE'>Available</MenuItem>
                                <MenuItem value='OUT OF STOCK'>Out Of Stock</MenuItem>
                            </CustomTextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                fullWidth
                                label='Actual Price*'
                                placeholder='Enter Actual Price'
                                value={userData.actualPrice}
                                onChange={e => setUserData({ ...userData, actualPrice: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                fullWidth
                                label='Offer Price*'
                                placeholder='Enter Offer Price'
                                value={userData.offerPrice}
                                onChange={e => setUserData({ ...userData, offerPrice: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                                fullWidth
                                multiline
                                rows={4} // Adjust rows as needed
                                label='Product Description*'
                                placeholder='Enter Product Description'
                                value={userData.description}
                                onChange={e => setUserData({ ...userData, description: e.target.value })}
                            />
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
                                <FileUploaderMultiple
                                    initialFiles={userData.images || []}
                                    onFileSelect={(fileUrls) => setUserData((prev) => ({ ...prev, images: fileUrls }))}
                                    error_text={!userData.images?.length ? 'At least one image is required' : ''}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                select
                                disabled
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


                    </Grid>
                </DialogContent>
                <DialogActions className='justify-center'>
                    {!imageLoader && (
                        <Button variant='contained' disabled={!isDataChanged() || imageLoader} type='submit'>
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

export default AddProductInfo
