import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CustomTextField from '@core/components/mui/TextField'
import { MenuItem } from '@mui/material'

import productGroupService from '@/services/product/productGroup'
import { useParams } from 'next/navigation'
import { useproductContext } from '@/contexts/productContext'

const ProductGroupSelection = () => {

  const { handleFormChange, formData } = useproductContext()
  const [group, setGroup] = useState([])

  const router = useParams()

  const fetchProductGroups = async () => {
    const Id = router.id

      const groups = await productGroupService.getApproveGroupByBusiness(Id)
      setGroup(groups.data || [])
   
  }

  useEffect(() => {
    fetchProductGroups()
  }, [])

  const generateSeoSlug = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')   // spaces → underscores
      .replace(/[^\w-]/g, '') // remove non-word chars except underscore
  }

  useEffect(() => {
    if (formData.productName) {
      const seoSlug = generateSeoSlug(formData.productName)
      handleFormChange('slug', seoSlug)
    }
  }, [formData.productName])



  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Product Group
        </Typography>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField
            select
            fullWidth
            label="Product Group"
            value={formData.group}
            onChange={e => handleFormChange('group', e.target.value)}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: selected => {
                  if (selected === '') {
                    return <p style={{ color: '#888' }}>Select Product Group</p>
                  }
                  const selectedItem = group.find(item => item._id === selected)
                  return selectedItem ? selectedItem.name : ''
                }
              }
            }}
          >
            <MenuItem value="" disabled>
              Select Product Group
            </MenuItem>
            {Array.isArray(group) &&
              group.map(product => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
          </CustomTextField>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductGroupSelection
