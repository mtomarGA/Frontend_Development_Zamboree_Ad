'use client';

import { useState } from 'react';
import { Tabs, Tab, Box, Button, Card, Tooltip } from '@mui/material';
import BannerSevice from '@/services/premium-listing/banner.service'
import { toast } from 'react-toastify';
import PaidListingDetail from './Paid-listingAll-Detail';
import PaidKeywordManager from './PaidKeyword';
import PaidLocationSelection from './Paid-listing-Location';
import PaidListingInvoice from './Amount';
import PaidBasicDetail from './PaidBasicDetails';
import PaidListing from "@/services/premium-listing/paidListing.service"

export default function PaidMultiTabForm({ setModalOpen, getBanner }) {
  const [tabIndex, setTabIndex] = useState(0);

  // Form state for all tabs with proper initialization
  const [formData, setFormData] = useState({
    basicDetails: {
      vendorId: '', validity: '', publishDate: "", expireDate: "",vendor:"" ,order:"",
    },
    status: "PENDING",
    keywords: { keywords: [] }, // Properly initialized
    location: { country: "", selectedCity: '', selectedState: '', area: [] },
    amount: { TAX18: '', Subtotal: '', RoundOFF: '', EstimateTotal: '' },
  });
  const [businessKeyword, setBusinessKeyword] = useState();

  console.log(formData, 'Form Data in MultiTabForm');
  

  // Handler for basic details
  const handleBasicDetails = (basicDetailsData) => {
    console.log("Basic Details Data:", basicDetailsData);
    
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


  const GetLocution = async (LocutionData) => {
    setFormData((prev) => ({
      ...prev,
      location: LocutionData
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
      console.log('Submitting form data:', formData);
      const result = await PaidListing.addPaidListing(formData);
      setModalOpen(false)
      toast.success(result?.message)
      getBanner()
    }
  };


  console.log(formData, 'Form Datand nsbds dsjhdns nma');
  

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
          <PaidBasicDetail
            data={formData.basicDetails}
            handleNextClick={handleNextClick}
            tabIndex={tabIndex}
            onChange={handleChange('basicDetails')}
            besicFormData={handleBasicDetails}
            getKeyKeyword={getKeyKeyword}
          />
        )}
        {tabIndex === 1 && (
          <PaidKeywordManager
            handlePreviousClick={handlePreviousClick}
            data={formData.keywords}
            handleNextClick={handleNextClick}
            tabIndex={tabIndex}
            onChange={handleChange('keywords')}
            businessKeyword={businessKeyword}
            handleKeyword={handleKeyword}
          />
        )}
        {tabIndex === 2 && (
          <PaidLocationSelection
            handlePreviousClick={handlePreviousClick}
            data={formData.location}
            handleNextClick={handleNextClick}
            GetLocution={GetLocution}
            onChange={handleChange('location')}
          />
        )}
        {tabIndex === 3 && (
          <PaidListingInvoice
            handlePreviousClick={handlePreviousClick}
            formData={formData}
            getPrice={getPrice}
            data={formData.amount}
            onChange={handleChange('amount')}
          />
        )}

        <Box className="mt-6 flex justify-between gap-2">
          {tabIndex === 3 && (
            <Button variant="outlined" onClick={handlePreviousClick}>
              Previous
            </Button>
          )}
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
              {tabIndex === 3 && (
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextClick}
                    disabled={!isAmountValid()}
                  >
                    Submit
                  </Button>
                </span>
              )}
            </span>
          </Tooltip>
        </Box>
      </form>
    </Card>
  );
}
