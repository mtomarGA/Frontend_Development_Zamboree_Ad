'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Card, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
// Removed `set` from `date-fns` as it was unused and likely a typo.
import FixedListingService from "@/services/premium-listing/fixedListing.service"
import EditFixedListingInvoice from './EditFixedAmount';
import LocationSelection from './EditFixedLocation';
import EditKeywordManager from './EditFixedKeyword';
import EditBasicDetail from './EditFixedBasicDetail';

export default function EditMultiTabForm({ setModalOpen, getFixedListing, FixedPosation }) {
    const fixedListingId = FixedPosation?._id;


    const [tabIndex, setTabIndex] = useState(0);
    const [businessKeyword, setBusinessKeyword] = useState([]); // Initialize as an empty array
    // Form state for all tabs with proper initialization
    const [formData, setFormData] = useState({
        basicDetails: {
            vendorId: '',
            validity: '',
            publishDate: "",
            perDayPrice: "",
            vendor: "",
            FixedListing: ""
        },
        status: "PENDING",
        keywords: {
            keywords: [] // This will now hold objects like { keyName: "...", _id: "..." }
        },
        location: {
            country: "",
            selectedCity: '',
            selectedState: '',
            area: []
        },
        amount: {
            TAX18: '',
            Subtotal: '',
            RoundOFF: '',
            EstimateTotal: '',
            TAXPER: ''
        },
    });

    const [location, setLocation] = useState({
        country: null, // Initialize as null or appropriate default for country object
        city: null,    // Initialize as null or appropriate default for city object
        state: null,   // Initialize as null or appropriate default for state object
        selectedAreas: [], // This seems redundant if city is an object, consider consolidating
        selectedCity: '', // This also seems redundant, ensure clear purpose
        selectedState: ''
    });

    // --- EFFECT TO INITIALIZE FORMDATA FROM FixedPosation PROP ---
    useEffect(() => {

        setFormData({
            basicDetails: {
                vendorId: FixedPosation.basicDetails?.vendorId || '',
                validity: FixedPosation.basicDetails?.validity || '',
                publishDate: FixedPosation.basicDetails?.publishDate || '',
                vendor: FixedPosation.basicDetails?.vendor || '',
                perDayPrice: FixedPosation.basicDetails?.perDayPrice || '',
                FixedListing: FixedPosation.basicDetails?.FixedListing || ''
            },
            status: FixedPosation.status || "PENDING", // Use FixedPosation.status directly
            keywords: {
                keywords: FixedPosation.location?.keywords?.map(kw => // Corrected path to keywords
                    kw.keyName,
                ) || []
            },
            location: {
                country: FixedPosation.location?.country?.name || '',
                selectedCity: FixedPosation.location?.city?.name || '',
                selectedState: FixedPosation.location?.state?.name || '',
                // Flatten areas if they are nested under keywords, otherwise access directly
                area: FixedPosation.location?.area?.map(a => ({ _id: a._id, name: a.name })) || []
            },
            amount: {
                TAX18: FixedPosation.amount?.TAX18 || '',
                Subtotal: FixedPosation.amount?.Subtotal || '',
                RoundOFF: FixedPosation.amount?.RoundOFF || '',
                EstimateTotal: FixedPosation.amount?.EstimateTotal || '',
                TAXPER: FixedPosation.amount?.TAXPER || ""
            },
        });

        // Initialize location state separately as it seems to be used by LocationSelection
        setLocation({
            country: FixedPosation.location?.country || null,
            city: FixedPosation.location?.city || null,
            state: FixedPosation.location?.state || null,
            keywords: FixedPosation.location?.keywords || [],

        });

        setBusinessKeyword(FixedPosation.keywords?.keywords?.map(kw => ({
            name: kw.keyName,
        })) || []);


    }, [FixedPosation]);






    const handlePreviousClick = () => {
        setTabIndex(prevIndex => prevIndex - 1); // Use functional update for previous state
    };

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
    const handleKeyword = (keywords) => {


        // Assuming keywords is an array of objects like { name: "...", _id: "..." }
        setFormData((prev) => ({
            ...prev,
            keywords: {
                keywords: keywords.map(kw => ({ kw }))
            },
        }));
    };

    const GetLocution = (LocutionData) => {
        setFormData((prev) => ({
            ...prev,
            location: LocutionData
        }));
        setLocation(LocutionData); // Update the local location state as well if it's mirrored
    };

    const getKeyKeyword = (keywords) => {
        setBusinessKeyword(keywords);
    };





    // Robust validation functions
    const isBasicDetailsValid = () => {
        const { vendorId, validity, perDayPrice } = formData.basicDetails || {};
        return Boolean(vendorId && validity && perDayPrice); // Use Boolean for explicit conversion
    };

    const getPrice = (priceDetail) => {
        setFormData((prev) => ({
            ...prev,
            amount: priceDetail
        }));
    };

    const isKeywordsValid = () => {
        // Ensure formData.keywords.keywords is an array and has elements
        return Array.isArray(formData.keywords?.keywords) && formData.keywords.keywords.length > 0;
    };

    const isLocationValid = () => {
        const { country, selectedCity, selectedState, area } = formData.location || {};
        // Validate based on the fields that are truly required for a valid location
        return Boolean(country && selectedCity && selectedState && Array.isArray(area) && area.length > 0);
    };

    const isAmountValid = () => {
        const { TAX18, Subtotal, RoundOFF, EstimateTotal } = formData.amount || {};
        return Boolean(TAX18 && Subtotal && RoundOFF && EstimateTotal);
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
        if (getTabDisabledState(newValue) && newValue !== 0) { // Allow navigation to tab 0 always
            return;
        }
        setTabIndex(newValue);
    };
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
    const handleNextClick = async () => { // Removed `e` as it's not used
        let currentTabValid = false;
        switch (tabIndex) {
            case 0: currentTabValid = isBasicDetailsValid(); break;
            case 1: currentTabValid = isKeywordsValid(); break;
            case 2: currentTabValid = isLocationValid(); break;
            case 3: currentTabValid = isAmountValid(); break;
            default: currentTabValid = false;
        }

        // if (!currentTabValid) {
        //     toast.error("Please complete the current tab before proceeding.");
        //     return;
        // }

        if (tabIndex < 3) {
            setTabIndex(prevIndex => prevIndex + 1); // Use functional update
        } else {


            const paidListingId = FixedPosation?._id;

       
            if (formData?.basicDetails?.vendor) {
                     console.log(formData, "formDataformDataformData");
                const result = await FixedListingService.updateFixedListing(paidListingId, formData);
                setModalOpen(false);
                toast.success(result?.message || "Fixed Listing updated successfully!");
                getFixedListing();
            }



        }
    };






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

            <form onSubmit={(e) => e.preventDefault()}> {/* Added onSubmit to prevent default form submission */}
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
                        handlePreviousClick={handlePreviousClick}
                        data={formData.keywords?.keywords} // Pass the array of keywords directly
                        handleNextClick={handleNextClick}
                        onChange={handleChange('keywords')} // This might need adjustment if EditKeywordManager has complex internal state
                        businessKeyword={businessKeyword}
                        handleKeyword={handleKeyword}
                    />
                )}

                {tabIndex === 2 && (
                    <LocationSelection
                        handlePreviousClick={handlePreviousClick}
                        handleNextClick={handleNextClick}
                        keywords={formData.keywords?.keywords}
                        data={location} // Pass the separate location state
                        GetLocution={GetLocution}
                    // onChange={handleChange('location')} // This general onChange might not work well for location objects
                    />
                )}

                {tabIndex === 3 && (
                    <EditFixedListingInvoice
                        handlePreviousClick={handlePreviousClick}
                        fixedListingId={fixedListingId}
                        formData={formData} // Consider passing only necessary data to avoid prop drilling
                        getPrice={getPrice}
                        getFixedListing={getFixedListing}
                        data={formData?.amount}
                        setModalOpen={setModalOpen}
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
