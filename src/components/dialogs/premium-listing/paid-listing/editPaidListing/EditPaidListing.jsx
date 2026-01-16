'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Card, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import { set } from 'date-fns';
import PaidListingService from "@/services/premium-listing/paidListing.service"
import EditPaidBasicDetail from './EditPaidListingDetails';
import EditPaidKeywordManager from './EditPaidListingKeyword';
import EditPaidLocationSelection from './EditPaidLocution';
import EditPaidListingInvoice from './Amount';

export default function EditMultiTabForm({ setModalOpen, getPaidListing, paidListing }) {
    const PaidListingId = paidListing._id

    const [tabIndex, setTabIndex] = useState(0);
    const [businessKeyword, setBusinessKeyword] = useState();
    // Form state for all tabs with proper initialization
    const [formData, setFormData] = useState({
        basicDetails: {
            vendorId: '', validity: '', publishDate: "", perDayPrice: "", paidListingPackage
                : ""
        },
        status: "PENDING",
        keywords: { keywords: [] }, // Properly initialized
        location: { country: "", selectedCity: '', selectedState: '', area: [] },
        amount: { TAX18: '', Subtotal: '', RoundOFF: '', EstimateTotal: '',TAXPER:"" },
    });

    const [location, setLocation] = useState({
        displayLocation: '',
        selectedAreas: [],
        selectedCities: [],
        selectedCity: '',
        selectedState: ''
    });


    const handlePreviousClick = async () => {
        setTabIndex(tabIndex - 1)
    }

    useEffect(() => {
        if (paidListing?.basicDetails) {
            setFormData((prev) => ({
                ...prev,
                basicDetails: {
                    ...prev.basicDetails,
                    paidListingPackage: paidListing?.basicDetails?.paidListingPackage || '',
                    companyName: paidListing?.basicDetails?.companyName,
                    vendorId: paidListing?.basicDetails?.vendorId || '',
                    validity: paidListing?.basicDetails?.validity || '',
                    publishDate: paidListing?.basicDetails?.publishDate || '',
                    perDayPrice: paidListing?.basicDetails?.perDayPrice || ''
                },
            }));
        }
        if (paidListing?.keywords) {
            setFormData(prev => ({
                ...prev,
                keywords: paidListing.keywords.map(element => element)
            }));
        }
        if (paidListing?.amount) {
            setFormData((prev) => ({
                ...prev,
                amount: {
                    ...prev.amount,
                    TAX18: paidListing?.amount?.TAX18 || '',
                    Subtotal: paidListing?.amount?.Subtotal || '',
                    RoundOFF: paidListing?.amount?.RoundOFF || '',
                    EstimateTotal: paidListing?.amount?.EstimateTotal || '',
                    TAXPER: paidListing?.amount?.TAXPER
                },
            }))
        }
    }, [paidListing]);


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
        const { vendorId, validity, perDayPrice } = formData.basicDetails || {};
        return vendorId && validity && perDayPrice;
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
            console.log(formData,"Assssssssssss");
            
            const paidListingId = paidListing?._id
            const result = await PaidListingService.updatePaidListing(paidListingId, formData)
            setModalOpen(false)
            toast.success(result?.message)
            getPaidListing()
        }
    };

    useEffect(() => {
        if (paidListing?.location) {
            setLocation({
                country: paidListing.location.country || null,
                city: paidListing.location.city || null,
                state: paidListing.location.state || null,
                area: paidListing.location.area.map((area) => ({
                    areaId: area._id || null,
                    areaName: area.name || null,
                })),
            });
        }

    }, [paidListing]);


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
                    <EditPaidBasicDetail
                        data={formData.basicDetails}
                        handleNextClick={handleNextClick}
                        onChange={handleChange('basicDetails')}
                        besicFormData={handleBasicDetails}
                        getKeyKeyword={getKeyKeyword}
                    />
                )}
                {tabIndex === 1 && (
                    <EditPaidKeywordManager
                        handlePreviousClick={handlePreviousClick}
                        data={formData?.keywords}
                        handleNextClick={handleNextClick}
                        onChange={handleChange('keywords')}
                        businessKeyword={businessKeyword}
                        handleKeyword={handleKeyword}
                    />
                )}

                {tabIndex === 2 && (
                    <EditPaidLocationSelection
                        handlePreviousClick={handlePreviousClick}
                        handleNextClick={handleNextClick}
                        data={location}
                        GetLocution={GetLocution}
                        onChange={handleChange('location')}
                    />
                )}

                {tabIndex === 3 && (
                    <EditPaidListingInvoice
                        handlePreviousClick={handlePreviousClick}
                        PaidListingId={PaidListingId}
                        getPaidListing={setModalOpen}
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
