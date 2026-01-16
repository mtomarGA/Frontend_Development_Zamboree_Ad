'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button } from '@mui/material'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'
import { useAuth } from '@/contexts/AuthContext'
import manageBusinessService from '@/services/business/manageBusiness.service'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
// import { useAuth } from '@/contexts/AuthContext'

const AddListing = ({ tabContentList }) => {
  // const params = useParams()
  const router = useRouter()
  // Context
  const { hasPermission } = useAuth()

  const {
    socialLinksData,
    handleSocialLinkChange,
    allData
  } = useAddListingFormContext()

  const {
    validateCompany,
    validateUrl,
    validateTiming,
    validateKeywords,
    validateGallery,
    validateGoogleMap,
    // add other validations as you have them
  } = useAddListingFormContext();

  // States
  const [activeTab, setActiveTab] = useState('companyDetail')

  // Tab Order
  const tabOrder = [
    'companyDetail',
    'personalizedUrl',
    'timingPayment',
    'keywords',
    'images',
    'googleMap',
    'socialLinks',
    // 'security'
  ]

  // Validation dispatcher
  const validateCurrentTab = () => {
    switch (activeTab) {
      case 'companyDetail':
        return validateCompany();
      case 'personalizedUrl':
        return validateUrl();
      case 'timingPayment':
        return validateTiming();
      case 'keywords':
        return validateKeywords();
      case 'images':
        return validateGallery();
      case 'googleMap':
        return validateGoogleMap();
      // add more cases as needed
      default:
        return true;
    }
  };

  // Handle tab change via clicks
  // const handleChange = (event, value) => {
  //   if (!validateCurrentTab()) {
  //     return;
  //   }
  //   setActiveTab(value);
  // };

  const handleChange = (event, value) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(value);

    if (nextIndex > currentIndex) {
      // Moving forward: validate
      if (!validateCurrentTab()) {
        return;
      }
    }
    setActiveTab(value);
  };


  const handleNext = () => {
    if (!validateCurrentTab()) {
      return;
    }

    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setActiveTab(nextTab);
    } else {
      handleSubmitBusiness();  
    }
  };

  const handleSubmitBusiness = async () => {
    try {
      const payload = {
        companyFormData: allData.companyFormData,
        contactFormData: allData.contactFormData,
        locationFormData: allData.locationFormData,
        url: allData.url,
        displayHours: allData.displayHours,
        businessHours: allData.businessHours,
        paymentOptions: allData.paymentOptions,
        bankerName: allData.bankerName,
        keywordsFormData: allData.keywordsFormData,
        googleMapData: allData.googleMapData,
        socialLinksData: allData.socialLinksData,
        logo: allData.logo,
        businessImages: allData.businessImages,
        attributes: allData.attributes,
        BusinessBrand: allData.businessBrand,
      }
      console.log(payload, "payload");

      const res = await manageBusinessService.addBusiness(payload)
      if (res.statusCode === 201) {
        toast.success(res.message)
        router.push(`/en/apps/listing/all-listing`);
      } else {
        toast.error("Something Went Wrong")
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
      toast.error(errorMessage)
    }
  };


  const isLastTab = tabOrder.indexOf(activeTab) === tabOrder.length - 1;

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab label='Company Detail' icon={<i className='tabler-users' />} iconPosition='start' value='companyDetail' />
            <Tab label='Personalized Url' icon={<i className='tabler-link' />} iconPosition='start' value='personalizedUrl' />
            {/* <Tab label='Location Info' icon={<i className='tabler-current-location' />} iconPosition='start' value='locationInfo' /> */}
            <Tab label='Timing & Payment' icon={<i className='tabler-building-bank' />} iconPosition='start' value='timingPayment' />
            <Tab label='Keywords' icon={<i className='tabler-building-bank' />} iconPosition='start' value='keywords' />
            <Tab label='Images' icon={<i className='tabler-photo' />} iconPosition='start' value='images' />
            <Tab label='Google Map' icon={<i className='tabler-gps' />} iconPosition='start' value='googleMap' />
            <Tab label='Social Links' icon={<i className='tabler-share' />} iconPosition='start' value='socialLinks' />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
        <Grid >
          <Box display="flex" justifyContent="flex-end" mt={2}>
            {hasPermission("partner_all_partner:add") &&
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {isLastTab ? 'Save Business' : 'Save & Next'}
              </Button>}
          </Box>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AddListing
