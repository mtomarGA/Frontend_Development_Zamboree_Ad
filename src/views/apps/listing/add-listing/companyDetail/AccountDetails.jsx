'use client'

import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import OtpVerification from './OtpVerification'
import BusinessBrand from "@/services/business/service/business-brand.service"
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import serviceAttributeService from '@/services/business/service/serviceAttribute.service'
import BusinessDescription from "@/services/business/businessStatus.service"
import PersonalizedURLCheck from "@/services/business/manageBusiness.service"
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, InputAdornment } from '@mui/material'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

const FormLayoutsSeparator = ({ nextHandle }) => {
  const [subCategories, setSubCategories] = useState([])
  const [prompt, setPrompt] = useState("");
  const [EditModalOpen, setEditModalOpen] = useState(false)
  const [isAttributesLoading, setIsAttributesLoading] = useState(false)
  const [attributes, setAttributes] = useState([]);
  const [businessBrands, setBusinessBrands] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  // const [category, setCategory] = useState()

  const {
    companyFormData,
    contactFormData,
    companyErrors,
    contactErrors,
    handleCompanyChange,
    handleContactChange,
    validateCompany,
    businessNature,
    legalStatus,
    turnover,
    setUrlFormData,
    employeeNumber,
    categoryTree,
    setContactVerified,
    setBusinessBrand,
    businessBrand
  } = useAddListingFormContext()







  const handleSubmit = e => {
    e.preventDefault()

    const isValid = validateCompany()

    if (!isValid) return

    if (typeof nextHandle === 'function') {
      nextHandle()
    } else {
      console.warn('nextHandle not available:', nextHandle)
    }
  }

  const newPersonalizedURL = async (name) => {
    const result = await PersonalizedURLCheck.checkPresonalizedURL(name)
    setUrlFormData(prev => ({ ...prev, url: result.data }))
  }

  useEffect(() => {
    if (companyFormData?.companyName) {
      setTimeout(() => {
        newPersonalizedURL(companyFormData?.companyName)
      }, 2000)
    }
  }, [companyFormData])

  const buildCategoryOptions = (nodes = [], level = 0, path = []) => {
    const options = []
    nodes.forEach(node => {
      const currentPath = [...path, node.name]
      options.push({
        value: node._id,
        name: node.name,
        level,
        path: currentPath.join(' > '),
        searchableText: currentPath.join(' ').toLowerCase()
      })
      if (node.children && node.children.length) {
        options.push(...buildCategoryOptions(node.children, level + 1, currentPath))
      }
    })
    return options
  }
  const categoryOptions = useMemo(() => buildCategoryOptions(categoryTree || []), [categoryTree])

  useEffect(() => {
    if (companyFormData.businessCategory) {
      fetchServiceAttributes(companyFormData.businessCategory);
      fetchBrandService(companyFormData.businessCategory);
    } else {
      setAttributes([]);
      handleCompanyChange('attributes')({ target: { value: {} } });
    }
  }, [companyFormData.businessCategory]);

  const renderCategoryOptions = (nodes, level = 0) => {
    return nodes.flatMap(node => {
      const indentation = '\u00A0\u00A0'.repeat(level)

      const items = [
        <MenuItem key={node._id} value={node._id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {indentation}
            <FiberManualRecordOutlinedIcon style={{ fontSize: '0.6rem', marginRight: 4 }} />
            {node.name}
          </div>
        </MenuItem>
      ]

      if (node.children && node.children.length > 0) {
        items.push(...renderCategoryOptions(node.children, level + 1))
      }

      return items
    })
  }

  const fetchSubCategories = async categoryId => {
    try {
      setIsSubCategoriesLoading(true)
      const res = await subCategoryService.getByCategoryId(categoryId)
      setSubCategories(res.data)
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
      setSubCategories([])
    } finally {
      setIsSubCategoriesLoading(false)
    }
  }

  const fetchServiceAttributes = async (categoryId) => {
    try {
      setIsAttributesLoading(true);
      const res = await serviceAttributeService.getServiceAttributeByCatId(categoryId);
      setAttributes(res.data);
      const initialAttributes = { ...companyFormData.attributes };
      res.data.forEach(attr => {
        if (!initialAttributes[attr._id]) {
          initialAttributes[attr._id] = '';
        }
      });

      handleCompanyChange('attributes')({ target: { value: initialAttributes } });
    } catch (error) {
      console.error('Failed to fetch service attributes:', error);
      setAttributes([]);
    } finally {
      setIsAttributesLoading(false);
    }
  };

  const fetchBrandService = async (categoryId) => {
    const result = await BusinessBrand.getBussinessBrandUsingCat(categoryId)
    setBusinessBrands(result?.data)
  }


  const handleAttributeChange = (attributeId) => (event) => {
    const newAttributes = {
      ...companyFormData.attributes,
      [attributeId]: event.target.value
    };
    handleCompanyChange('attributes')({ target: { value: newAttributes } });
  };

  const handleCategoryChange = e => {
    handleCompanyChange('businessCategory')(e)
    handleCompanyChange('businessSubCategory')({ target: { value: '' } })
  }

  const handleAI = async () => {
    setLoadingAI(true); // start loading
    const rawData = { ...companyFormData };
    const mappedData = {
      ...rawData,
      businessNature: businessNature?.find(x => x._id === rawData.businessNature)?.name || rawData.businessNature,
      employeeNumber: employeeNumber?.find(x => x._id === rawData.employeeNumber)?.name || rawData.employeeNumber,
      businessLegal: legalStatus?.find(x => x._id === rawData.businessLegal)?.name || rawData.businessLegal,
      gstTurnOver: turnover?.find(x => x._id === rawData.gstTurnOver)?.name || rawData.gstTurnOver,
      businessCategory: categoryTree ? findCategoryName(categoryTree, rawData.businessCategory) : rawData.businessCategory,
    };

    handleCompanyChange("aboutUs")({ target: { value: "Loading..." } });
    const result = await BusinessDescription.getBusinessDescription(mappedData);
    if (result?.description) {
      handleCompanyChange("aboutUs")({ target: { value: result.description } });
    }

  };


  // Helper: find category name recursively
  const findCategoryName = (nodes, id) => {
    for (const node of nodes) {
      if (node._id === id) return node.name;
      if (node.children && node.children.length) {
        const childName = findCategoryName(node.children, id);
        if (childName) return childName;
      }
    }
    return id;
  };


  const handlePrompt = async () => {
    setLoadingAI(true);
    handleCompanyChange("aboutUs")({ target: { value: "Loading..." } });
    setEditModalOpen(false)
    const result = await BusinessDescription.getBusinessDescription({ prompt });
    setPrompt("")
    if (result?.description) {
      handleCompanyChange("aboutUs")({ target: { value: result.description } });
    }

  }
  //getEmploryeeSagestedCat

  return (
    <Card>
      <Divider />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-bold' sx={{ fontSize: '1rem' }}>
                1. COMPANY PROFILE
              </Typography>
            </Grid>

            {/* Company Information Fields */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label={
                  <>
                    Company Name <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                placeholder='Ex: Easy solutions pvt ltd'
                name='companyName'
                value={companyFormData.companyName}
                onChange={handleCompanyChange('companyName')}
                error={!!companyErrors.companyName}
                helperText={companyErrors.companyName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppReactDatepicker
                showYearPicker
                selected={companyFormData.establishYear ? new Date(companyFormData.establishYear, 0) : null}
                id='establish-year-picker'
                dateFormat='yyyy'
                onChange={date => {
                  handleCompanyChange('establishYear')({ target: { value: date.getFullYear().toString() } })
                }}
                customInput={
                  <CustomTextField
                    fullWidth
                    label={
                      <>
                        Year Of Establishment <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                    error={!!companyErrors.establishYear}
                    helperText={companyErrors.establishYear}
                  />
                }
                placeholderText='Ex: 19XX'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label={
                  <>
                    Company CEO Name <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                placeholder='Ex: Peter parker '
                name='companyCeo'
                value={companyFormData.companyCeo}
                onChange={handleCompanyChange('companyCeo')}
                error={!!companyErrors.companyCeo}
                helperText={companyErrors.companyCeo}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label={
                  <>
                    Nature Of Business <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                value={companyFormData.businessNature}
                onChange={handleCompanyChange('businessNature')}
                error={!!companyErrors.businessNature}
                helperText={companyErrors.businessNature}
              >
                <MenuItem value='' disabled>
                  Select Business Nature
                </MenuItem>
                {businessNature &&
                  businessNature.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>

              <Autocomplete
                fullWidth
                size='small'
                options={categoryOptions}
                value={
                  categoryOptions.find(o => o.value === companyFormData.businessCategory) || null
                }
                onChange={(_, newValue) => {
                  handleCategoryChange({ target: { value: newValue?.value || '' } })
                }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={option => option?.name || ''}
                filterOptions={(options, { inputValue }) => {
                  const q = inputValue.trim().toLowerCase()
                  if (!q) return options
                  return options.filter(opt => opt.searchableText.includes(q))
                }}
                ListboxProps={{
                  style: { maxHeight: 250, overflowY: 'auto' }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: option.level * 12 }}>
                      <FiberManualRecordOutlinedIcon style={{ fontSize: '0.6rem', marginRight: 4 }} />
                      {option.name}
                    </div>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label={
                      <>
                        Business Category <span style={{ color: 'red' }}>*</span>{' '}
                      </>
                    }
                    placeholder='Search & select category'
                    error={!!companyErrors.businessCategory}
                    helperText={companyErrors.businessCategory}
                  />
                )}
                clearOnEscape
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label={
                  <>
                    Number Of Employee <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                value={companyFormData.employeeNumber}
                onChange={handleCompanyChange('employeeNumber')}
                error={!!companyErrors.employeeNumber}
                helperText={companyErrors.employeeNumber}
              >
                <MenuItem value='' disabled>
                  Select Employee Number
                </MenuItem>
                {employeeNumber &&
                  employeeNumber.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label={
                  <>
                    Business Legal Status <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                value={companyFormData.businessLegal}
                onChange={handleCompanyChange('businessLegal')}
                error={!!companyErrors.businessLegal}
                helperText={companyErrors.businessLegal}
              >
                <MenuItem value='' disabled>
                  Select Legal Status
                </MenuItem>
                {legalStatus &&
                  legalStatus.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Company Website'
                placeholder='Ex: http://www.website.com'
                value={companyFormData.companyWebsite}
                onChange={handleCompanyChange('companyWebsite')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Yearly Turnover'
                value={companyFormData.gstTurnOver}
                onChange={handleCompanyChange('gstTurnOver')}
                error={!!companyErrors.gstTurnOver}
                helperText={companyErrors.gstTurnOver}
              >
                <MenuItem value='' disabled>Select Yearly Turnover</MenuItem>
                {turnover && turnover.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label={
                  <>
                    GST Number <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                placeholder="Ex:27AAAPL1234C1Z1"
                name="GST Number"
                value={companyFormData.gstNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // allow only alphabets and numbers
                  const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '');
                  handleCompanyChange('gstNumber')({
                    target: { value: sanitizedValue },
                  });
                }}
                error={!!companyErrors.gstNumber}
                helperText={companyErrors.gstNumber || "Only letters and numbers are allowed"}
              />
            </Grid>
            {businessBrands?.length > 0 && <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Brand Franchisee'
                value={businessBrand}
                onChange={(e) => setBusinessBrand(e.target.value)}
              >
                <MenuItem value='' disabled>No Business Brand Franchisee</MenuItem>
                {businessBrands?.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>}

            <Grid size={{ xs: 12 }}>
              <Box>
                {/* Full width CustomTextField */}
                <CustomTextField
                  fullWidth
                  rows={6}
                  multiline
                  label={
                    <>
                      About Us <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  placeholder="Write Something about Business and Services"
                  value={companyFormData.aboutUs}
                  onChange={handleCompanyChange('aboutUs')}
                  error={!!companyErrors.aboutUs}
                  helperText={companyErrors.aboutUs}
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                    disabled={
                      !companyFormData?.companyName &&
                      !companyFormData?.establishYear &&
                      !companyFormData?.companyCeo &&
                      !companyFormData?.businessNature
                    }
                    onClick={handleAI}
                  >
                    Ai Assistant
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                    onClick={() => setEditModalOpen(true)}
                  >
                    Write Prompts
                  </Button>

                </Box>
              </Box>
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 4 }} />
              <Typography variant='body2' className='font-bold' sx={{ fontSize: '1rem', mb: 4 }}>
                2. BUSINESS ATTRIBUTES
              </Typography>

              {isAttributesLoading ? (
                <Typography>Loading attributes...</Typography>
              ) : attributes.length > 0 ? (
                <Grid container spacing={6}>
                  {attributes.map((attribute) => {
                    const value = companyFormData.attributes?.[attribute._id] || "";

                    return (
                      <Grid key={attribute._id} size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          select
                          required={attribute.mandatory}
                          label={
                            <>
                              {attribute.name}
                              {attribute.mandatory && <span style={{ color: "red" }}>*</span>}
                            </>
                          }
                          value={value}
                          onChange={handleAttributeChange(attribute._id)}
                          error={attribute.mandatory && !value} // agar empty h to error show karega
                          helperText={
                            attribute.mandatory && !value ? `select mandatory Attribute ${attribute.name}` : ""
                          }
                        >
                          <MenuItem value="">Select {attribute.name}</MenuItem>
                          {attribute.values?.map((value) => (
                            <MenuItem key={value._id} value={value._id}>
                              {value.text}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                    );
                  })}
                </Grid>

              ) : (
                <Typography>No attributes available for this category</Typography>
              )}
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-bold' sx={{ fontSize: '1rem' }}>
                3. CONTACT INFORMATION
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                label='Office Landline'
                placeholder='Ex: 4455xxxxxx'
                value={contactFormData.officeLandline}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    handleContactChange('officeLandline')({ target: { value } })
                  }
                }}
                error={!!contactErrors.officeLandline}
                helperText={contactErrors.officeLandline}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                label='Toll Free Number'
                placeholder='Ex: 4455xxxxxx'
                value={contactFormData.tollFreeNumber}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    handleContactChange('tollFreeNumber')({ target: { value } })
                  }
                }}
                error={!!contactErrors.tollFreeNumber}
                helperText={contactErrors.tollFreeNumber}
              />
            </Grid>

            {/* Email Verification */}
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Email Verification'
                placeholder='Ex: peter@gmail.com'
                name='email'
                type='email'
                value={contactFormData.email}
                onChange={handleContactChange('email')}
                error={!!companyErrors.email}
                helperText={companyErrors.email}
                onVerified={setContactVerified}
                verifyField='isEmailVerify'
                disabled={contactFormData.isEmailVerify}
              />
            </Grid>

            {/* Phone Verification */}
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Primary Number *'
                placeholder='Ex: 5566xxxxxx'
                name='phoneNo'
                type='mobile'
                to='primary'
                value={contactFormData.phoneNo}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    handleContactChange('phoneNo')({ target: { value } })
                  }
                }}
                error={!!companyErrors.phoneNo}
                helperText={companyErrors.phoneNo}
                onVerified={setContactVerified}
                verifyField='isPhoneVerify'
                disabled={contactFormData.isPhoneVerify}
              />
            </Grid>

            {/* Alternate Number Verification */}
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Alternate Number'
                placeholder='Ex: 4455xxxxxx'
                name='alternateNo'
                type='mobile'
                to='alternate'
                value={contactFormData.alternateNo}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    handleContactChange('alternateNo')({ target: { value } })
                  }
                }}
                onVerified={setContactVerified}
                verifyField='isAlternateVerify'
                disabled={contactFormData.isAlternateVerify}
              />
            </Grid>

          </Grid>
        </CardContent>
        <Divider />
      </form>

      <Dialog
        fullWidth
        open={EditModalOpen}
        maxWidth="md"
        scroll="body"
        sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
      >
        <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
          <i className="tabler-x" />
        </DialogCloseButton>
        {/* 
        <DialogTitle variant="h4" className="text-center">
          Write Business Prompt
        </DialogTitle> */}

        <DialogContent className="flex flex-col gap-4">
          <CustomTextField
            fullWidth
            rows={6}
            multiline
            placeholder="Write Business Prompt"
            value={prompt}                  // bind value
            onChange={(e) => setPrompt(e.target.value)} // update state
            error={!!companyErrors.aboutUs}
            helperText={companyErrors.aboutUs}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handlePrompt}
            sx={{ alignSelf: "center" }}
          >
            Generate
          </Button>
        </DialogContent>
      </Dialog>

    </Card>
  )
}

export default FormLayoutsSeparator
