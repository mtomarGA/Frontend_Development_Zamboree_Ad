'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Card, Tooltip } from '@mui/material';
import BannerSevice from '@/services/premium-listing/banner.service'
import { toast } from 'react-toastify';
import EditKeywordManager from './Keyword';
import EditLocationSelection from './Location';
import EditBannerListingInvoice from './amount';
import EditBasicDetail from './basic-details';
import { set } from 'date-fns';

export default function EditMultiTabForm({ setModalOpen, getBanner, banner }) {

  console.log(banner);


  const bannerId = banner?._id

  const [tabIndex, setTabIndex] = useState(0);
  const [businessKeyword, setBusinessKeyword] = useState();
  // Form state for all tabs with proper initialization
  const [formData, setFormData] = useState({
    basicDetails: {
      vendorId: '', validity: '', publishDate: "", image: "", perDayPrice: "", bannerPackage: ""
    },
    status: "",
    keywords: { keywords: [] }, // Properly initialized
    location: { country: "", selectedCity: '', selectedState: '', area: [] },
    amount: { TAX18: '', Subtotal: '', RoundOFF: '', EstimateTotal: '' },
  });

  const [location, setLocation] = useState({
    country: "",
    selectedCity: '',
    selectedState: '',
    area: []
  });

  useEffect(() => {
    if (banner?.basicDetails) {
      setFormData((prev) => ({
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          bannerPackage: banner?.basicDetails?.bannerPackage || '',
          companyName: banner?.basicDetails?.companyName || "",
          vendorId: banner?.basicDetails?.vendorId || '',
          validity: banner?.basicDetails?.validity || '',
          publishDate: banner?.basicDetails?.publishDate || '',
          image: banner?.basicDetails?.image || '',
          vendor: banner?.basicDetails?.vendor || "",
          perDayPrice: banner?.basicDetails?.perDayPrice || ''
        },
      }));
    }
    if (banner?.keywords) {
      setFormData(prev => ({
        ...prev,
        keywords: banner.keywords.map(element => element)
      }));
    }
    setFormData((prev) => ({
      ...prev,
      status: banner.status
    }));

    if (banner?.amount) {
      setFormData((prev) => ({
        ...prev,
        amount: {
          ...prev.amount,
          TAX18: banner?.amount?.TAX18 || '',
          Subtotal: banner?.amount?.Subtotal || '',
          RoundOFF: banner?.amount?.RoundOFF || '',
          EstimateTotal: banner?.amount?.EstimateTotal || ''
        },
      }))
    }
  }, [banner]);


  // Handler for basic details
  const handleBasicDetails = (basicDetailsData) => {
    setFormData((prev) => ({
      ...prev,
      basicDetails: {
        ...prev.basicDetails,
        ...basicDetailsData,
      },
    }));
  };

  // Safe handler for keywords
  const handleKeyword = async (keywords) => {
    const keywordNames = keywords.map((element) => element?.name);

    setFormData((prev) => ({
      ...prev,
      keywords: keywordNames, // Storing an array of names
    }));
  };


    const GetLocution = async (LocationData) => { 
      
      console.log(LocationData,"LocationDataLocationDataLocationData");
      
      
    setFormData((prev) => ({
      ...prev,
      location: LocationData
    }))
  }

  const getKeyKeyword = (keywords) => {
    setBusinessKeyword(keywords)
  };


  // Robust validation functions
  const isBasicDetailsValid = () => {
    const { vendorId, validity, perDayPrice, image } = formData.basicDetails || {};
    return vendorId && validity && perDayPrice && image;
  };


  const getPrice = (priceDetail) => {
    setFormData((prev) => ({
      ...prev,
      amount: priceDetail
    }))
  }



  const isKeywordsValid = () => {
    const keywords = formData.keywords;
    return Array.isArray(keywords) && keywords.length > 0;
  };

  const isLocationValid = () => {
    const { displayLocation} = formData.location || {};
    return displayLocation;
  };

  const isAmountValid = () => {
    const { TAX18, Subtotal, RoundOFF, EstimateTotal } = formData.amount || {};
    return TAX18 && Subtotal && RoundOFF && EstimateTotal;
  };

  // Tab disable logic with proper checks
  const getTabDisabledState = (tabNumber) => {
    switch (tabNumber) {
      case 1: return !isBasicDetailsValid();
      case 2: return !isBasicDetailsValid() || !isKeywordsValid();
      case 3: return !isBasicDetailsValid() || !isKeywordsValid() || !isLocationValid();
      default: return false;
    }


  };

  // Safe tab change handler
  const handleTabChange = (event, newValue) => {
    if (getTabDisabledState(newValue)) {
      return;
    }
    setTabIndex(newValue);
  };

  const handlePreviousClick = async () => {
    setTabIndex(tabIndex - 1)
  }
  // Generic change handler
  const handleChange = (section, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value,
      },
    }));
  };

  // Next button handler with validation
  const handleNextClick = async (e) => {
    let currentTabValid = false;
    switch (tabIndex) {
      case 0: currentTabValid = isBasicDetailsValid(); break;
      case 1: currentTabValid = isKeywordsValid(); break;
      case 2: currentTabValid = isLocationValid(); break;
      case 3: currentTabValid = isAmountValid(); break;
      default: currentTabValid = false;
    }
    if (tabIndex < 3) {
      setTabIndex(tabIndex + 1);
    } else {

      console.log(formData, "formDataformData");



      const result = await BannerSevice.updateBanner(banner?._id, formData);
      setModalOpen(false)
      toast.success(result?.message)
      getBanner()
    }
  };

  useEffect(() => {
    if (banner?.location) {
      // console.log(banner.location, 'location'); // Corrected console.log for clarity

      setLocation({
        country: banner.location.country || null,
        city: banner.location.city || null,
        state: banner.location.state || null,
        area: banner.location.area.map((area) => ({
          _id: area._id || null,
          areaName: area.name || null,
          latitude: area.latitude,
          longitude: area.longitude,
        })),
      });
    }
  }, [banner]);

  // console.log("formData", formData);

  return (
    <Card className="shadow-none p-4">
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        className="mb-6"
      >
        <Tab label="Basic Details" />
        <Tooltip
          title={!isBasicDetailsValid() ? "Complete Basic Details first" : ""}
          placement="top"
        >
          <span>
            <Tab
              label="Keywords"
              disabled={getTabDisabledState(1)}
            />
          </span>
        </Tooltip>
        <Tooltip
          title={
            !isBasicDetailsValid() ? "Complete Basic Details first" :
              !isKeywordsValid() ? "Complete Keywords first" : ""
          }
          placement="top"
        >
          <span>
            <Tab
              label="Location"
              disabled={getTabDisabledState(2)}
            />
          </span>
        </Tooltip>
        <Tooltip
          title={
            !isBasicDetailsValid() ? "Complete Basic Details first" :
              !isKeywordsValid() ? "Complete Keywords first" :
                !isLocationValid() ? "Complete Location first" : ""
          }
          placement="top"
        >
          <span>
            <Tab
              label="Amount"
              disabled={getTabDisabledState(3)}
            />
          </span>
        </Tooltip>
      </Tabs>

      <form>
        {tabIndex === 0 && (
          <EditBasicDetail
            data={formData.basicDetails}
            handleNextClick={handleNextClick}
            onChange={handleChange('basicDetails')}
            besicFormData={handleBasicDetails}
            getKeyKeyword={getKeyKeyword}
          />
        )}
        {tabIndex === 1 && (
          <EditKeywordManager
            data={formData?.keywords || []}
            handlePreviousClick={handlePreviousClick}
            onChange={handleChange('keywords')}
            handleNextClick={handleNextClick}
            businessKeyword={businessKeyword}
            handleKeyword={handleKeyword}
          />
        )}

        {tabIndex === 2 && (
          <EditLocationSelection
            handlePreviousClick={handlePreviousClick}
            data={location}
            handleNextClick={handleNextClick}
            GetLocution={GetLocution}
            onChange={handleChange('location')}
          />
        )}

        {tabIndex === 3 && (
          <EditBannerListingInvoice
            getBanner={getBanner}
            setOpen={setModalOpen}
            bannerId={bannerId}
            handlePreviousClick={handlePreviousClick}
            formData={formData}
            getPrice={getPrice}
            data={formData.amount}
            onChange={handleChange('amount')}
          />
        )}

        <Box className="mt-6 flex justify-between">
          {tabIndex >= 3 && (
            <Button variant="outlined" onClick={handlePreviousClick}>
              Previous
            </Button>
          )}

          <span>
            {tabIndex === 3 && <Button
              variant="contained"
              color="primary"
              onClick={handleNextClick}

            >
              {tabIndex === 3 ? 'Submit' : 'Next'}
            </Button>}
          </span>
        </Box>
      </form>
    </Card>
  );
}
