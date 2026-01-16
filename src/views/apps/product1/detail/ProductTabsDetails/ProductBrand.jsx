'use client'

import React, { useEffect, useState } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'

// Services
import BrandGet from "@/services/product/product-brand"
import AttributeGet from '@/services/attribute/attribute.service'
import CustomTextField from '@core/components/mui/TextField'
import RichTextEditor from './ProductDescription'
import { useproductContext } from '@/contexts/productContext'

const GroupCategoryTab = () => {
  const { handleFormChange, formData ,updateProductId} = useproductContext()
  const Id = formData?.categoryId

  // local UI state
  const [brandList, setBrandList] = useState([])
  const [attributeList, setAttributeList] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState({})

  // Fetch brands
  const getBrandNames = async () => {
    if (!Id) return
    try {
      const resp = await BrandGet.getBRandByCategoryId(Id)
      const Brands = resp?.data ?? []
      const flatBrands = Brands.map(b => ({ _id: b._id, name: b.name }))

      if (formData?.brand && !flatBrands.find(b => b._id === formData.brand)) {
        flatBrands.unshift({ _id: formData.brand, name: formData.brand })
      }

      setBrandList(flatBrands)
    } catch (err) {
      console.error('getBrandNames error', err)
    }
  }

  // Fetch attributes
  const getAttributeByCategoryId = async () => {
    if (!Id) return
    try {
      const resp = await AttributeGet.getAttributeByCatId(Id)
      const attrs = resp?.data ?? []
      setAttributeList(attrs)

      if (formData?.attributes && Object.keys(formData.attributes).length) {
        setSelectedAttributes(formData.attributes)
      } else {
        const initial = attrs.reduce((acc, att) => {
          acc[att._id] = ''
          return acc
        }, {})
        setSelectedAttributes(initial)
      }
    } catch (err) {
      console.error('getAttributeByCategoryId error', err)
    }
  }

  useEffect(() => {
    if (Id) {
      getBrandNames()
      getAttributeByCategoryId()
    } else {
      setBrandList([])
      setAttributeList([])
      setSelectedAttributes({})
    }
  }, [Id])

  useEffect(() => {
    if (formData?.attributes && Object.keys(formData.attributes).length) {
      setSelectedAttributes(prev => ({ ...prev, ...formData.attributes }))
    }
  }, [formData?.attributes])

  const handleAttributeChange = (id, value) => {
    setSelectedAttributes(prev => {
      const updated = { ...prev, [id]: value }
      handleFormChange('attributes', updated)
      return updated
    })
  }

  return (
    <>
      {/* Product Brand */}
      <Card className=''>
        <CardHeader title="Product Brand" />
        <CardContent>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Brand Name"
              placeholder="Select Brand"
              value={formData?.brand ?? ''}
              onChange={e => handleFormChange('brand', e.target.value)}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) return <em>Select Brand</em>
                    const selectedItem = brandList.find(item => item._id === selected)
                    return selectedItem ? selectedItem.name : selected
                  }
                }
              }}
            >
              <MenuItem value="Generic">Generic</MenuItem>
              {Array.isArray(brandList) &&
                brandList.map(item => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
            </CustomTextField>
          </Grid>
        </CardContent>
      </Card>

      {/* Product Description */}
      <Card>
        <CardHeader title="Product Description" />
        <Card className='p-2 py-5 shadow-none'>
          <RichTextEditor
            value={formData?.description ?? ''}
            onChange={(val) => handleFormChange('description', val)}
          />
        </Card>
      </Card>

      {/* Product Attributes */}
      <Card>
        <CardHeader title="Related Attributes" />
        <CardContent>
          <Grid container spacing={3}>
            {attributeList?.map(attribute => (
              <Grid size={{ xs: 12, sm: 6 }} key={attribute._id}>
                <FormControl fullWidth>
                  <InputLabel id={`attr-label-${attribute._id}`}>
                    {attribute.name}{attribute.mandatory ? ' *' : ''}
                  </InputLabel>
                  <Select
                    labelId={`attr-label-${attribute._id}`}
                    value={selectedAttributes[attribute._id] ?? ''}
                    disabled={updateProductId}
                    label={`${attribute.name}${attribute.mandatory ? ' *' : ''}`}
                    onChange={e => handleAttributeChange(attribute._id, e.target.value)}
                    displayEmpty
                  >
                    {/* <MenuItem value="" disabled>
                      Select {attribute.name}
                    </MenuItem> */}
                    {Array.isArray(attribute.values) && attribute.values.map(val => (
                      <MenuItem
                        key={val._id}
                        value={val._id} // ✅ Use value ID instead of text
                      >
                        {val.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default GroupCategoryTab
