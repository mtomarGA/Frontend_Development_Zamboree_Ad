
'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import BusinessBrand from "@/services/business/service/business-brand.service"
import Autocomplete from '@mui/material/Autocomplete'
import subCategoryService from '@/services/category/subCategory.service'
import serviceAttributeService from '@/services/business/service/serviceAttribute.service'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'
import PersonalizedURLCheck from "@/services/business/manageBusiness.service"
import BusinessDescription from "@/services/business/businessStatus.service"
import CustomTextField from '@core/components/mui/TextField'
import OtpVerification from './OtpVerification'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { Box, Dialog, DialogContent } from '@mui/material'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

const FormLayoutsSeparator = () => {
  const [subCategories, setSubCategories] = useState([])
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(false)
  const [availableAttributes, setAvailableAttributes] = useState([])
  const [EditModalOpen, setEditModalOpen] = useState(false)
  const [isAttributesLoading, setIsAttributesLoading] = useState(false)
  const [businessBrands, setBusinessBrands] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [prompt, setPrompt] = useState("");
  const {
    companyFormData,
    contactFormData,
    companyErrors,
    contactErrors,
    validateCompany,
    handleCompanyChange,
    handleContactChange,
    businessNature,
    legalStatus,
    turnover,
    gstNumbers,
    employeeNumber,
    category,
    setContactVerified,
    attributes,
    handleAttributeChange,
    categoryTree,
    setUrlFormData,
    setBusinessBrand,
    businessBrand
  } = useUpdateListingFormContext()






  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateCompany()

    if (!isValid) return
  }

  // console.log(businessBrand, "businessBrandbusinessBrandbusinessBrand");
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

  const fetchBrandService = async (categoryId) => {
    // console.log(categoryId,"categoryIdcategoryId");

    const result = await BusinessBrand.getBussinessBrandUsingCat(categoryId)
    setBusinessBrands(result?.data)
  }

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value

    handleCompanyChange('businessCategory')({ target: { value: selectedCategoryId } })
    handleCompanyChange('businessSubCategory')({ target: { value: '' } })

    setIsSubCategoriesLoading(true)
    const res = await subCategoryService.getSubCategories(selectedCategoryId)
    setSubCategories(res.data || [])
    setIsSubCategoriesLoading(false)

    // Fetch attributes when category changes
    fetchAttributes(selectedCategoryId)
  }
  const newPersonalizedURL = async (name) => {
    const result = await PersonalizedURLCheck.checkPresonalizedURL(name)
    // console.log(result,"resultresultresult");

    setUrlFormData(prev => ({ ...prev, url: result.data }))
  }

  useEffect(() => {
    if (companyFormData?.companyName) {
      setTimeout(() => {
        newPersonalizedURL(companyFormData?.companyName)
      }, 2000)
    }
  }, [companyFormData])

  const fetchAttributes = async (categoryId) => {
    if (!categoryId) return;

    setIsAttributesLoading(true);
    try {
      const res = await serviceAttributeService.getServiceAttributeByCatId(categoryId);
      // Ensure we have an array of attributes
      const attributesData = Array.isArray(res.data) ? res.data : [];
      setAvailableAttributes(attributesData);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setIsAttributesLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!companyFormData.businessCategory) return

      setIsSubCategoriesLoading(true)
      const res = await subCategoryService.getByCategoryId(companyFormData.businessCategory)
      setSubCategories(res.data || [])
      setIsSubCategoriesLoading(false)
    }

    fetchSubCategories()
    fetchAttributes(companyFormData.businessCategory)
    fetchBrandService(companyFormData.businessCategory);
  }, [companyFormData.businessCategory])



  // Build flat, searchable options from hierarchical category tree
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

  return (
    <Card>
      <Divider />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-bold' sx={{ fontSize: '1rem' }}>
                1. COMPANY INFORMATION
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Company Name'
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
                    label='Year Of Establishment'
                    error={!!companyErrors.establishYear}
                    helperText={companyErrors.establishYear}
                  />
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Company CEO Name'
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
                label='Nature Of Business'
                value={companyFormData.businessNature}
                onChange={handleCompanyChange('businessNature')}
                error={!!companyErrors.businessNature}
                helperText={companyErrors.businessNature}
              >
                <MenuItem value='' disabled>Select Business Nature</MenuItem>
                {businessNature && businessNature.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
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
            {/* <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Business Sub Category'
                value={companyFormData.businessSubCategory}
                onChange={handleCompanyChange('businessSubCategory')}
                disabled={!companyFormData.businessCategory || isSubCategoriesLoading}
                error={!!companyErrors.businessSubCategory}
                helperText={companyErrors.businessSubCategory}
              >
                <MenuItem value='' disabled>
                  {isSubCategoriesLoading
                    ? 'Loading...'
                    : subCategories.length === 0
                      ? 'No subcategories available'
                      : 'Select Sub Category'}
                </MenuItem>
                {subCategories.length > 0 && subCategories.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))}
              </CustomTextField>
            </Grid> */}
            {/* Attributes Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Number Of Employee'
                value={companyFormData.employeeNumber}
                onChange={handleCompanyChange('employeeNumber')}
                error={!!companyErrors.employeeNumber}
                helperText={companyErrors.employeeNumber}
              >
                <MenuItem value='' disabled>Select Employee Number</MenuItem>
                {employeeNumber && employeeNumber.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Business Legal Status'
                value={companyFormData.businessLegal}
                onChange={handleCompanyChange('businessLegal')}
                error={!!companyErrors.businessLegal}
                helperText={companyErrors.businessLegal}
              >
                <MenuItem value='' disabled>Select Legal Status</MenuItem>
                {legalStatus && legalStatus.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Company Website'
                placeholder='Ex: https://www.website.com '
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
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                label={
                  <>
                    GST Number <span style={{ color: 'red' }}>*</span>{' '}
                  </>
                }
                placeholder="Ex:27AAAPL1234C1Z1"
                name="GST Number"
                value={companyFormData.gstNumber || gstNumbers?.companyInfo?.gstNumber}
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
            {businessBrands?.length>0&& <Grid size={{ xs: 12, sm: 6 }}>
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





            <Divider sx={{ my: 4 }} />


            <Grid size={{ xs: 12, md: 12 }}>
              <Typography
                variant="body2"
                className="font-bold"
                sx={{ fontSize: '1rem' }}
              >
                2. BUSINESS ATTRIBUTES
              </Typography>
            </Grid>

            {availableAttributes.map(attribute => {
              const selectedValue = attributes[attribute._id] || '';
              const selectedValueObj = attribute.values.find(val => val._id === selectedValue);
              const isError = attribute.mandatory && !selectedValue;

              return (
                <Grid item key={attribute._id} size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label={attribute.name}
                    value={selectedValue}
                    onChange={handleAttributeChange(attribute._id)}
                    error={!!companyErrors.attributes?.[attribute._id] || isError}
                    helperText={
                      companyErrors.attributes?.[attribute._id] ||
                      (isError ? 'This field is required' : '')
                    }
                  >
                    <MenuItem value="" disabled>
                      Select {attribute.name}
                    </MenuItem>
                    {attribute.values.map(value => (
                      <MenuItem key={value._id} value={value._id}>
                        {value.text}
                      </MenuItem>
                    ))}
                  </CustomTextField>

                  {selectedValueObj && (
                    <Typography variant="caption" color="textSecondary">
                      Selected: {selectedValueObj.text}
                    </Typography>
                  )}
                </Grid>
              );
            })}

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
                placeholder='Ex: 6767xxxxxx'
                value={contactFormData.officeLandline}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // remove non-digits
                  if (value.length <= 10) {
                    handleContactChange('officeLandline')({ target: { value } });
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
                placeholder='Ex: 7878xxxxxx'
                value={contactFormData.tollFreeNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // remove non-digits
                  if (value.length <= 10) {
                    handleContactChange('tollFreeNumber')({ target: { value } });
                  }
                }}
                error={!!contactErrors.tollFreeNumber}
                helperText={contactErrors.tollFreeNumber}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Email Verification'
                placeholder='Ex: test@gmail.com'
                type='email'
                name='email'
                value={contactFormData.email}
                onChange={handleContactChange('email')}
                error={!!companyErrors.email}
                helperText={companyErrors.email}
                initialVerifiedStatus={contactFormData?.isEmailVerify}
                onVerified={setContactVerified}
                verifyField='isEmailVerify'
                disabled={contactFormData.isEmailVerify}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Primary Number'
                placeholder='Ex: 7878xxxxxx'
                type='mobile'
                name='phoneNo'
                value={contactFormData.phoneNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleContactChange('phoneNo')({ target: { value } });
                  }
                }}
                error={!!companyErrors.phoneNo}
                helperText={companyErrors.phoneNo}
                onVerified={setContactVerified}
                verifyField='isPhoneVerify'
                disabled={contactFormData.isPhoneVerify}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <OtpVerification
                label='Alternate Number'
                placeholder='Ex: 7878xxxxxx'
                name='alternateNo'
                type='mobile'
                value={contactFormData.alternateNo}
                // onChange={handleContactChange('alternateNo')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleContactChange('alternateNo')({ target: { value } });
                  }
                }}
                error={!!contactErrors.alternateNo}
                helperText={contactErrors.alternateNo}
                onVerified={setContactVerified}
                verifyField='isAlternateVerify'
                disabled={contactFormData.isAlternateVerify}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
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
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
