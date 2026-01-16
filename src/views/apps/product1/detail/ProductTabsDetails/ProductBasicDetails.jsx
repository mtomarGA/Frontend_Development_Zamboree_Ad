'use client'

import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Chip,
  Collapse,
  IconButton
} from '@mui/material'
import { ExpandLess, ExpandMore, ArrowForwardIos } from '@mui/icons-material'
import ProductCategory from '@/services/product/productCategory'

// Custom Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useproductContext } from '@/contexts/productContext'
import SlugCheck from '@/services/product/product1'

const BasicInfoTab = () => {
  const { setCategoryName, categoryName, handleFormChange, formData,updateProductId } = useproductContext()
  
  
// console.log(updateProductId,"productIdproductIdproductId");




  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const [categorySearchResults, setCategorySearchResults] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [openCategories, setOpenCategories] = useState({})

  const dropdownRef = useRef(null)

  // Fetch categories
  const getCategory = async (search) => {
  try {
    const res = await ProductCategory.searchCategory(search)
    console.log(res, "resresresres")

    const data = res?.data || []

    const withBreadcrumb = data.map(cat => ({
      ...cat,
      breadcrumb: [
        ...(cat.parents?.map(p => p.name) || []), // ✅ Extract parent names
        cat.name
      ].join(' → ')
    }))

    setAllCategories(data)
    setCategorySearchResults(withBreadcrumb)
  } catch (err) {
    console.error(err)
    setAllCategories([])
    setCategorySearchResults([])
  }
}


  // Watch searchQuery and fetch categories
  useEffect(() => {
    if (categorySearchQuery?.trim() !== '') {
      getCategory(categorySearchQuery)
    } else {
      setCategorySearchResults([])
    }
  }, [categorySearchQuery])

  // Build hierarchical category tree
  const buildCategoryTree = (categories) => {
    const categoryMap = {}
    const roots = []

    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, children: [] }
    })

    categories.forEach(cat => {
      if (cat.parents && cat.parents.length > 0) {
        cat.parents.forEach(parent => {
          const parentCat = categoryMap[parent._id]
          if (parentCat && !parentCat.children.find(c => c._id === cat._id)) {
            parentCat.children.push(categoryMap[cat._id])
          }
        })
      } else {
        roots.push(categoryMap[cat._id])
      }
    })

    return roots
  }

  const categoryTree = buildCategoryTree(allCategories)
  useEffect(() => {
    const fetchCategoryById = async () => {
      if (formData.categoryId && !categoryName?.length) {
        try {
          const res = await ProductCategory.getCategoryById(formData.categoryId) 
          const cat = res?.data
          if (cat) {
            const withBreadcrumb = {
              ...cat,
              breadcrumb: [...(cat.parents || []), cat.name].join(' → ')
            }
            setCategoryName([withBreadcrumb])   
            setSelectedCategories([withBreadcrumb])
            setCategorySearchQuery(withBreadcrumb.breadcrumb)
          }
        } catch (err) {
          console.error("Error fetching category:", err)
        }
      }
    }

    fetchCategoryById()
  }, [formData.categoryId])

  // Expand top-level categories
  useEffect(() => {
    const expanded = {}
    allCategories.forEach(cat => {
      if (!cat.parents || cat.parents.length === 0) expanded[cat._id] = true
    })
    setOpenCategories(expanded)
  }, [allCategories])

  const handleCategoryToggle = (categoryId) => {
    setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  const handleSelectCategory = (cat) => {
    handleFormChange('categoryId', cat._id)   
    setCategoryName([cat])                    
    setSelectedCategories([cat])               
    setCategorySearchQuery(cat.breadcrumb)    
    setCategorySearchResults([])             
  }

  const handleRemoveCategory = (id) => {
    handleFormChange('categoryId', '')
    setCategoryName([])
    setSelectedCategories([])
    setCategorySearchQuery('')
  }


  const checkSlug = async (productName) => {
    const businessId = formData.businessId
    const data = {
      productName: productName
    }
    const result = await SlugCheck.checkSlug(businessId, data)
    handleFormChange('slug', result.data)
  }
  useEffect(() => {
    if (formData.productName) {
      const delayDebounceFn = setTimeout(() => {
        checkSlug(formData.productName)
      }, 2000)
      return () => clearTimeout(delayDebounceFn)
    }
  }, [formData.productName])




  // Sync selected category from context
  useEffect(() => {
    if (categoryName && categoryName.length > 0) {
      const cat = categoryName[0]
      setSelectedCategories([cat])
      setCategorySearchQuery(cat.breadcrumb)
    } else {
      setSelectedCategories([])
      setCategorySearchQuery('')
    }
  }, [categoryName])

  // Render category tree recursively
  const renderCategoryTree = (categories, level = 0) =>
    categories.map(cat => (
      <div key={cat._id}>
        <ListItem
          disablePadding
          sx={{ pl: level * 2 + 2, display: 'flex', alignItems: 'center' }}
        >
          {cat.children.length > 0 ? (
            <IconButton
              size="small"
              onClick={() => handleCategoryToggle(cat._id)}
              sx={{ mr: 0.5 }}
            >
              {openCategories[cat._id] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : (
            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowForwardIos sx={{ fontSize: 14, color: 'text.disabled' }} />
            </Box>
          )}
          <ListItemButton onClick={() => handleSelectCategory(cat)} sx={{ flex: 1 }}>
            <ListItemText primary={[...(cat.parents || []), cat.name].join(' → ')} />
          </ListItemButton>
        </ListItem>
        {cat.children.length > 0 && (
          <Collapse in={openCategories[cat._id]} timeout="auto" unmountOnExit>
            {renderCategoryTree(cat.children, level + 1)}
          </Collapse>
        )}
      </div>
    ))

  // Debounced input for search
  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => setValue(initialValue), [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => onChange(value), debounce)
      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  return (
    <Card>
      <CardHeader title="Basic Details" />
      <CardContent>
        <Grid container spacing={6} className="mbe-6">
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              fullWidth
              label="Product Name*"
              placeholder="iPhone 14"
              value={formData.productName}
              onChange={e => handleFormChange('productName', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', boxShadow: 'none' }} ref={dropdownRef}>
              <DebouncedInput
                fullWidth
                label="Search & Select Category*"
                placeholder="Search category name"
                value={categorySearchQuery}
                onChange={val => setCategorySearchQuery(val)}
                className="mb-2"
                disabled={updateProductId}
                sx={{ boxShadow: 'none' }}
              />
              <span className="text-red-500 italic">
                Product Category is not editable after add
              </span>
              {categorySearchQuery?.trim() === '' && categoryTree.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{ mt: 1, maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
                >
                  <List dense>{renderCategoryTree(categoryTree)}</List>
                </Paper>
              )}

              {categorySearchResults.length > 0 && categorySearchQuery?.trim() !== '' && (
                <Paper
                  elevation={0}
                  sx={{ mt: 1, maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
                >
                  <List dense>
                    {categorySearchResults.map(cat => (
                      <ListItem key={cat._id} disablePadding>
                        <ListItemButton onClick={() => handleSelectCategory(cat)}>
                          <ListItemText primary={cat.breadcrumb} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {selectedCategories.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2">Selected Category</Typography>
                  <Box className="flex gap-2 flex-wrap mt-1">
                    {selectedCategories.map(cat => (
                      <Chip
                        key={cat._id}
                        label={cat.breadcrumb}
                        disabled={updateProductId}
                        onDelete={() => handleRemoveCategory(cat._id)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BasicInfoTab
