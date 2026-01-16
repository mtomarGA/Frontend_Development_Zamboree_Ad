'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
    Card,
    Button,
    CardContent,
    DialogActions,
    MenuItem,
    CardHeader
} from '@mui/material';
import CustomTextField from '@core/components/mui/TextField';
import { toast } from 'react-toastify';
import FixedPackageService from '@/services/premium-listing/fixedPackage.service';

const AddFixedPackage = ({ onsuccess, getPackage }) => {
    const [formData, setFormData] = useState({
        name: '',
        status: 'ACTIVE',
        description: '',
        price: '',
        valideDate: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        status: '',
        description: '',
        price: ''
    });

    const handleSave = async () => {
        const newErrors = {
            name: formData.name ? '' : 'Package name is required',
            status: formData.status ? '' : 'Status is required',
            description: formData.description ? '' : 'Description is required',
            price: formData.price ? '' : 'Price is required',
            valideDate: formData.valideDate ? '' : "Validity Date required"
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(error => error !== '');
        if (!hasError) {
            const result = await FixedPackageService.addPackage(formData)
            onsuccess(false)
            getPackage()
            toast.success(result?.message)
        }
        else {
            toast.error("fixed Error")
        }


    };

    return (
        <Card className='shadow-none'>
            <CardHeader title='Create Fixed Package' />
            <CardContent>

                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label='Package Name'
                            placeholder='Enter Package Name'
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            label="Status"
                            value={formData.status}  // Default to ACTIVE if formData.status is empty
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            error={!!errors.status}
                            helperText={errors.status}
                            disabled
                            sx={{
                                '& .MuiSelect-select': {
                                    textAlign: 'left',
                                },
                            }}
                        >

                        </CustomTextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Description"
                            placeholder="Enter Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            error={!!errors.description}
                            helperText={`${formData.description.length}/500`}
                            multiline
                            minRows={3}
                            inputProps={{ maxLength: 500 }}
                        />
                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            type="text" // Use text here to allow control of input, number type allows some unwanted characters
                            label="Per Day Price"
                            placeholder="Enter Per Day Price"
                            value={formData.price}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                if (value.length <= 10) {
                                    setFormData(prev => ({ ...prev, price: value }));
                                }
                            }}
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CustomTextField
                            fullWidth
                            type="text"
                            label="Validity Days"
                            placeholder="Enter Days"
                            value={formData.valideDate}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ''); // remove non-digits
                                if (value.length <= 10) {
                                    setFormData(prev => ({ ...prev, valideDate: value })); // use cleaned value here
                                }
                            }}
                            error={!!errors.valideDate}
                            helperText={errors.valideDate}
                        />


                    </Grid>

                </Grid>
            </CardContent>

            <DialogActions>
                <Button variant='contained' onClick={handleSave}>
                    Save
                </Button>
            </DialogActions>
        </Card>
    );
};

export default AddFixedPackage;
