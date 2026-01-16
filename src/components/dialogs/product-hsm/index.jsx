
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Image from '@/services/imageService'
import CategoryService from '@/services/product/productCategory'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import HSNCodeService from "@/services/product/product-hsn-service"

const ProductHSNDialoag = ({ onsuccess, getProductHSN, EditSelectedHSN }) => {
 

    // Categories
    const [Category, setRelatedCategory] = useState([])

    // Form data
    const [formData, setFormData] = useState({
        hsn: '',
        description: []
    })

    useEffect(() => {
        if (EditSelectedHSN) {
            setFormData({
                hsn: EditSelectedHSN?.hsnCode || "",
                description:EditSelectedHSN.description
            })

          
        }
    }, [EditSelectedHSN])

    // Errors
    const [errors, setErrors] = useState({})

   

  

       

 
  
    // Validate form
    const validateForm = () => {
        const newErrors = {}
        if (!formData.hsn) newErrors.hsn = 'Brand HSN is required'
        if (!formData.description)
            newErrors.description = 'Description is required'
    

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle submit
    const handleSubmit = async () => {
        if (validateForm()) {
            if (EditSelectedHSN?._id) {
                const id=EditSelectedHSN?._id
                const result = await HSNCodeService.updateHSNCode(id,formData)
                toast.success(result.message)
            } else {
                const result = await HSNCodeService.addHSNCode(formData)
                toast.success(result.message)
            }
            getProductHSN()
            onsuccess(false)
        }
    }

    return (
        <Card className="shadow-none">
            <CardContent>
                <Typography variant="h4" sx={{ mb: 4 }}>
                   HSN Code
                </Typography>

                <Grid container spacing={6}>
               
                

                    {/* Brand Name */}
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="HSN Code"
                            placeholder="Enter HSN Code"
                            value={formData.hsn}
                            onChange={(e) =>
                                setFormData({ ...formData, hsn: e.target.value })
                            }
                            error={!!errors.hsn}
                            helperText={errors.hsn}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="description"
                            placeholder="Enter description Code"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Grid>

                  


                    {/* Submit */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleSubmit}
                        
                        >
                            {EditSelectedHSN?._id ? "Update Brand" : "Create Brand"}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ProductHSNDialoag
