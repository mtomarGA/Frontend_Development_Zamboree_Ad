'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import { Box, Button } from '@mui/material'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'
import { useRouter, useParams } from 'next/navigation'
import manageBusinessService from '@/services/business/manageBusiness.service'
import { toast } from 'react-toastify'


const EditListing = ({ tabContentList }) => {

  const params = useParams()
  const businessId = params?.id

  

  const [activeTab, setActiveTab] = useState('companyDetail')
  const [followUpSubTab, setFollowUpSubTab] = useState('meeting')

  const {
    validateCompany,
    validateUrl,
    validateTiming,
    validateKeywords,
    validateGallery,
    validateGoogleMap,
    allData,
    getBusinessImages,
    getLogoImage,
    getCoverImage,
  } = useUpdateListingFormContext();

  // Tab Order
  const tabOrder = [
    'companyDetail',
    'personalizedUrl',
    'timingPayment',
    'keywords',
    'images',
    'googleMap',
    'socialLinks',
    'reviewRating',
    'following',
    'followUps',
    'enquiries'
  ]

  const socialLinksIndex = tabOrder.indexOf('socialLinks');
  const activeIndex = tabOrder.indexOf(activeTab);
  const isAfterSocialLinks = activeIndex === -1 && tabOrder.includes('socialLinks');


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
      case 'socialLinks':
        return true;
      case 'reviewRating':
        return true;
      case 'following':
        return true;
      case 'followUps':
        return true;
      case 'enquiries':
        return true;
      default:
        return true;
    }
  };

  const handleChange = (event, value) => {
    if (!validateCurrentTab()) {
      return;
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
      handleUpdateBusiness();
    }
  };

  // const handleChange = (event, value) => {
  //   setActiveTab(value)
  // }

  const handleUpdateBusiness = async () => {
    // e.preventDefault();

    try {
      const payload = {
        companyFormData: allData.companyFormData,
        contactFormData: allData.contactFormData,
        locationFormData: allData.locationFormData,
        url: allData.url,
        // displayHours: allData.displayHours,
        businessHours: allData.businessHours,
        paymentOptions: allData.paymentOptions,
        bankerName: allData.bankerName,
        keywordsFormData: allData.keywordsFormData,
        googleMapData: allData.googleMapData,
        socialLinksData: allData.socialLinksData,
        logo: getLogoImage(),
        businessImages: getBusinessImages(),
        attributes: allData.attributes,
      }

      console.log(payload, "payload for update");

      let res;
      if (businessId) {
        res = await manageBusinessService.updateBusiness(businessId, payload);
      } else {
        console.log(payload,"payloadpayload");
        
        res = await manageBusinessService.addBusiness(payload);
      }

      if (res.statusCode === 200 || res.statusCode === 201) {
        toast.success(res.message);
        // router.push(`/en/apps/listing/all-listing`);
      } else {
        toast.error(res.message || "Something Went Wrong");
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const handleFollowUpChange = (event, value) => {
    setFollowUpSubTab(value)
  }

  const isLastTab = tabOrder.indexOf(activeTab) === tabOrder.length - 1;


  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab label='Company Detail' icon={<i className='tabler-users' />} iconPosition='start' value='companyDetail' />
            <Tab label='Personalized Url' icon={<i className='tabler-link' />} iconPosition='start' value='personalizedUrl' />
            <Tab label='Timing & Payment' icon={<i className='tabler-building-bank' />} iconPosition='start' value='timingPayment' />
            <Tab label='Keywords' icon={<i className='tabler-tags' />} iconPosition='start' value='keywords' />
            <Tab label='Images' icon={<i className='tabler-photo' />} iconPosition='start' value='images' />
            <Tab label='Google Map' icon={<i className='tabler-gps' />} iconPosition='start' value='googleMap' />
            <Tab label='Social Links' icon={<i className='tabler-world' />} iconPosition='start' value='socialLinks' />
            <Tab label='Review And Rating' icon={<i className='tabler-star' />} iconPosition='start' value='reviewRating' />
            <Tab label='Followed' icon={<i className='tabler-bookmark' />} iconPosition='start' value='following' />
            <Tab label='Follow Ups' icon={<i className='tabler-share' />} iconPosition='start' value='followUps' />
            <Tab label='Enquiries' icon={<i className='tabler-message-circle' />} iconPosition='start' value='enquiries' />
            <Tab label='Security' icon={<i className='tabler-info-circle' />} iconPosition='start' value='security' />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
        <Grid >
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            {activeTab !== 'security' && (
              <>
                {activeTab === 'socialLinks' && (
                  <>
                    <Button variant="contained" color="primary" onClick={handleUpdateBusiness}>
                      Update Business
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleNext}>
                      Next
                    </Button>
                  </>
                )}

                {tabOrder.includes(activeTab) && activeTab !== 'socialLinks' && (
                  <Button variant="contained" onClick={handleNext}>
                    Save & Next
                  </Button>
                )}

                {!tabOrder.includes(activeTab) && activeTab !== 'socialLinks' && (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default EditListing
