'use client';

import { useState } from 'react';
import { Tabs, Tab, Box, Button, Card, Tooltip } from '@mui/material';
import BasicDetail from './basic-detail';
import KeywordListing from './Keyword';
import LocationSelection from './Location';
import BannerListingInvoice from './Amount';
import BannerSevice from '@/services/premium-listing/banner.service'
import { toast } from 'react-toastify';

export default function MultiTabForm({ setModalOpen, getBanner }) {
  const [tabIndex, setTabIndex] = useState(0);

  // Form state for all tabs with proper initialization
  const [formData, setFormData] = useState({
    basicDetails: {
      vendorId: '', validity: '', publishDate: "", image: "", expireDate: ""
    },
    status: "PENDING",
    keywords: { keywords: [] }, // Properly initialized
    location: { country: "", selectedCity: '', selectedState: '', area: [] },
    amount: { TAX18: '', Subtotal: '', RoundOFF: '', EstimateTotal: '' },
  });
  const [businessKeyword, setBusinessKeyword] = useState();





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
console.log(formData,'formData');


  const GetLocution = async (LocationData) => {
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
    const { displayLocation, selectedAreas, selectedCities, selectedCity } = formData.location || {};
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
      console.log(formData,"ffff");
      
      const result = await BannerSevice.createBanner(formData)
      setModalOpen(false)
      toast.success(result?.message)
      getBanner()
    }
  };

  const handlePreviousClick = async () => {
    setTabIndex(tabIndex - 1)
  }

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
          <BasicDetail
            data={formData.basicDetails}
            handleNextClick={handleNextClick}
            onChange={handleChange('basicDetails')}
            besicFormData={handleBasicDetails}
            getKeyKeyword={getKeyKeyword}
          />
        )}
        {tabIndex === 1 && (
          <KeywordListing
            handlePreviousClick={handlePreviousClick}
            handleNextClick={handleNextClick}
            data={formData.keywords}
            onChange={handleChange('keywords')}
            businessKeyword={businessKeyword}
            handleKeyword={handleKeyword}
          />
        )}
        {tabIndex === 2 && (
          <LocationSelection
            handlePreviousClick={handlePreviousClick}
            handleNextClick={handleNextClick}
            data={formData.location}
            GetLocution={GetLocution}
            onChange={handleChange('location')}
          />
        )}
        {tabIndex === 3 && (
          <BannerListingInvoice
            handlePreviousClick={handlePreviousClick}
            formData={formData}
            getPrice={getPrice}
            data={formData.amount}
            onChange={handleChange('amount')}
          />
        )}

        <Box className="mt-6 flex gap-2 justify-between">
          {tabIndex === 3 && <Button variant="outlined" onClick={handlePreviousClick}>
            Previous
          </Button>}
          <Tooltip
            title={
              tabIndex === 0 && !isBasicDetailsValid() ? "Complete Basic Details" :
                tabIndex === 1 && !isKeywordsValid() ? "Complete Keywords" :
                  tabIndex === 2 && !isLocationValid() ? "Complete Location" :
                    tabIndex === 3 && !isAmountValid() ? "Complete Amount" : ""
            }
            placement="top"
          >
            <span>
              {tabIndex === 3 && <Button
                variant="contained"
                color="primary"
                onClick={handleNextClick}

              >
                {tabIndex === 3 ? 'Submit' : 'Next'}
              </Button>}
            </span>
          </Tooltip>
        </Box>
      </form>
    </Card>
  );
}
