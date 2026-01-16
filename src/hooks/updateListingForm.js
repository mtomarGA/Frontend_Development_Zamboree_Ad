'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

import businessNatureService from '@/services/business/businessNature.service'
import businessStatusService from '@/services/business/businessStatus.service'
import gstTurnoverService from '@/services/business/gstTurnover.service'
import categoryService from '@/services/category/category.service'
import employeeNoService from '@/services/business/employeeNo.service'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import bankService from '@/services/business/bank.service'
import Image from '@/services/imageService'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'
import { useSession } from 'next-auth/react'

// Add these constants at the top of your useAddListingForm.js file
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Then your existing initTimingFormData
const initTimingFormData = {
    bankerName: '',
    // displayHours: true,
    payments: [],
    timings: Object.fromEntries(
        weekDays.map(day => [
            day,
            {
                open: '09:00',
                close: '17:00',
                is24Hours: false,
                isClosed: day === 'Sunday'
            }
        ])
    )
}

// Initial form data structures
const initialFormData = {
    companyName: '',
    establishYear: '',
    companyCeo: '',
    businessNature: '',
    businessCategory: '',
    businessSubCategory: '',
    employeeNumber: '',
    businessLegal: '',
    isEmailVerify: false,
    isPhoneVerify: false,
    isAlternateVerify: false,
    gstTurnOver: '',
    aboutUs: '',
    // homeLandline: '',
    officeLandline: '',
    tollFreeNumber: '',
    email: '',
    phoneNo: '',
    alternateNo: '',
    url: '',
    country: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
    address: '',
    // displayHours: '',
    day: '',
    openTime: '',
    closeTime: '',
    isClosed: '',
    isOpen24Hours: '',
    paymentOptions: {
        cash: '',
        debitCard: '',
        creditCard: '',
        masterCard: '',
        visaCard: '',
        americanExpressCard: '',
        dinersClubCard: '',
        moneyOrders: '',
        travellersCheque: '',
        cheques: '',
        financingAvailable: '',
        upi: ''
    },
    bankerName: '',
    weekDays: [],
    keywords: [],
    googleLocation: {
        latitude: '',
        longitude: ''
    },
    socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedIn: '',
        youTube: '',
        pinterest: ''
    },
    businessImages: [
        {
            images: ''
        }
    ],
    logo: '',
    latitude: '',
    longitude: '',
    passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
}

const initCompanyFormData = {
    companyName: '',
    establishYear: '',
    companyCeo: '',
    businessNature: '',
    businessCategory: '',
    businessSubCategory: '',
    employeeNumber: '',
    businessLegal: '',
    // companyWebsite: '',
    aboutUs: '',
    gstTurnOver: '',
}
const initContactFormData = {
    // homeLandline: '',
    officeLandline: '' || null,
    tollFreeNumber: '' || null,
    email: '' || null,
    phoneNo: '' || null,
    alternateNo: '' || null,
    isEmailVerify: false,
    isPhoneVerify: false
}

const initUrlFormData = {
    url: ''
}

const initLocationFormData = {
    country: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
    address: ''
}

const initKeywordsFormData = {
    keywords: []
}

const initImageData = {
    businessImages: [],
    logo: ''
}

const initGoogleMapData = {
    latitude: '',
    longitude: ''
}

const initSocialLinksData = {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
    youTube: '',
    pinterest: ''
}

const initPasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
}

const getInitialErrors = fields => {
    const errors = {}

    for (const key in fields) {
        errors[key] = ''
    }

    return errors
}

const UpdateListingFormContext = createContext()

const transformBusinessHoursToTimings = (businessHoursArray = []) => {
    const timings = {}
    businessHoursArray.forEach(({ day, openTime, closeTime, isOpen24Hours, isClosed }) => {
        timings[day] = {
            open: openTime || '09:00',
            close: closeTime || '17:00',
            is24Hours: isOpen24Hours || false,
            isClosed: isClosed || false
        }
    })
    return timings
}

export const UpdateListingProvider = ({ onSuccess, children, initialData }) => {
    const [formData, setFormData] = useState(initialData || initialFormData)
    const [errors, setErrors] = useState(getInitialErrors(initialFormData))

    const [categoryTree, setCategoryTree] = useState([])

    const [companyFormData, setCompanyFormData] = useState(initialData.companyFormData || initCompanyFormData)
    const [companyErrors, setCompanyErrors] = useState(getInitialErrors(initialData || initCompanyFormData))
    const [businessBrand, setBusinessBrand] = useState({
        BusinessBrandName: ""
    })
    const [contactFormData, setContactFormData] = useState(initialData.contactFormData || initContactFormData)
    const [contactErrors, setContactErrors] = useState(getInitialErrors(initialData || initContactFormData))

    const [urlFormData, setUrlFormData] = useState(initialData.urlFormData || initUrlFormData)
    const [gstNumbers, setGSTNumber] = useState(initialData.urlFormData || initUrlFormData)
    const [urlErrors, setUrlErrors] = useState(getInitialErrors(initialData.urlFormData || initUrlFormData))
    const [gstError, setgstErrors] = useState(getInitialErrors(initialData.urlFormData || initUrlFormData))

    const [locationFormData, setLocationFormData] = useState(initialData?.locationFormData || initLocationFormData)
    const [locationErrors, setLocationErrors] = useState(getInitialErrors(initialData.locationFormData || initLocationFormData))

    const [timingFormData, setTimingFormData] = useState(() => ({
        // displayHours: initialData.displayHours ?? true,
        timings: transformBusinessHoursToTimings(initialData.businessHours || []),
        payments: initialData.paymentOptions || [],
        bankerName: initialData.bankerName || ''
    }))

    const [timingErrors, setTimingErrors] = useState(getInitialErrors(initialData.timingFormData || initTimingFormData))

    // const [keywordsFormData, setKeywordsFormData] = useState(initialData.keywordsFormData || initKeywordsFormData)
    const [keywordsFormData, setKeywordsFormData] = useState({
        keywords: initialData.keywordsFormData || [],
    });

    const [keywordsErrors, setKeywordsErrors] = useState(getInitialErrors(initialData.keywordsFormData || initKeywordsFormData))

    const [logoImage, setLogoImage] = useState(initialData.logoImage || null);

    const [businessImageList, setBusinessImageList] = useState(initialData.businessImageList || []);

    const [attributes, setAttributes] = useState(initialData.attributes || {});

    const [galleryErrors, setGalleryErrors] = useState({});
    const [removedBusinessImageIds, setRemovedBusinessImageIds] = useState([]);

    const [googleMapData, setGoogleMapData] = useState(initialData.googleMapData || initGoogleMapData)
    const [googleMapErrors, setGoogleMapErrors] = useState(initialData.googleMapData || initGoogleMapData)

    const [socialLinksData, setSocialLinksData] = useState(initialData.socialLinksData || initSocialLinksData)
    // const [socialLinksErrors, setSocialLinksErrors] = useState([])

    const [passwordData, setPasswordData] = useState(initPasswordData)
    const [passwordErrors, setPasswordErrors] = useState(initPasswordData)

    const [businessNature, setBusinessNature] = useState([])
    const [legalStatus, setLegalStatus] = useState([])
    const [turnover, setTurnover] = useState([])
    const [employeeNumber, setEmployeeNumber] = useState([])
    const [category, setCategory] = useState([])
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [areas, setAreas] = useState([])
    const [isStatesLoading, setIsStatesLoading] = useState(false)
    const [isCitiesLoading, setIsCitiesLoading] = useState(false)
    const [isAreasLoading, setIsAreasLoading] = useState(false)
    const [bankerName, setBankerName] = useState([])
    // console.log(initialData, "update initial data hook");

    useEffect(() => {
        if (initialData) {
            setLogoImage(initialData.logoImage || null);
         
            setBusinessImageList(initialData.businessImageList || []);
            setBusinessBrand(initialData.businessBrand)
        }
    }, [initialData]);

    // const getBusinessImages = () =>
    //     businessImageList.map(item =>
    //         typeof item === 'string'
    //             ? { url: item, status: '' }
    //             : { url: item?.url ?? '', status: item?.status ?? '' }
    //     );

    const getBusinessImages = () =>
        businessImageList.map(item =>
            item
                ? { url: item.url ?? '', status: item.status ?? '' }
                : { url: '', status: '' })



    // const getLogoImage = () =>
    //     typeof logoImage === 'string'
    //         ? { url: logoImage, status: '' }
    //         : { url: logoImage?.url ?? '', status: logoImage?.status ?? '' };

    const getLogoImage = () =>
        logoImage
            ? { url: logoImage.url ?? '', status: logoImage.status ?? '' }
            : { url: '', status: '' }



  

    const { data: sessionData, status } = useSession()
    const payload = {
        categories: sessionData?.user?.categories
    }

    const getServiceCategory = async () => {
        const res = await serviceCategoryService.getEmploryeeSagestedCat(payload)
        setCategoryTree(res.data)
    }

    console.log(initialData,"initialDatainitialDatainitialData");
    

    useEffect(() => {
        if (initialData?.attributes) {
            // Ensure attributes is an object with proper key-value pairs
            const initialAttributes = {};
            Object.entries(initialData.attributes).forEach(([key, value]) => {
                initialAttributes[key] = value;
            });
            setAttributes(initialAttributes);
        }
    }, [initialData]);

    const allData = {
        companyFormData,
        gstNumbers,
        businessBrand,
        contactFormData,
        url: urlFormData.url,
        locationFormData,
        // displayHours: timingFormData.displayHours,
        businessHours: timingFormData.timings,
        paymentOptions: timingFormData.payments,
        bankerName: timingFormData.bankerName,
        keywordsFormData,
        googleMapData,
        socialLinksData,
        businessImages: businessImageList,
        logo: logoImage,
        passwordData,
        attributes: attributes,
    }




    useEffect(() => {
        getBusinessNature()
        getLegalStatus()
        getTurnover()
        getEmployeeNumber()
        getBusinessCategory()
        getCountries()
        getStates()
        getCities()
        getAreas()
        getBankerName()
        getServiceCategory()
    }, [])


    // Start Getting data From services
    const getBusinessNature = async () => {
        const res = await businessNatureService.getBusinessNatures()
        console.log(res);

        setBusinessNature(res.data)
    }

    const getBusinessCategory = async () => {
        const res = await categoryService.getCategories()
        setCategory(res.data)
    }

    const getBusinessSubCategory = async () => {
        const res = await businessNatureService.getBusinessNatures()
        setBusinessNature(res.data)
    }

    const getEmployeeNumber = async () => {
        const res = await employeeNoService.getEmpoyeeNos()
        setEmployeeNumber(res.data)
    }

    const getLegalStatus = async () => {
        const res = await businessStatusService.getBusinessStatuss()
        setLegalStatus(res.data)
    }

    const getTurnover = async () => {
        const res = await gstTurnoverService.getAllGstTurnovers()
        setTurnover(res.data)
    }

    const getCountries = async () => {
        try {
            const res = await countryService.getCountries()
            setCountries(res.data)
        } catch (error) {
            console.error('Failed to fetch countries:', error)
        }
    }

    const getStates = async countryId => {
        try {
            console.log(countryId, "countryId countryId");

            setIsStatesLoading(true)
            const res = await stateService.getStateById(countryId)
            setStates(res.data)
            setCities([]) // Clear cities when country changes
            setAreas([]) // Clear areas when country changes
        } catch (error) {
            console.error('Failed to fetch states:', error)
        } finally {
            setIsStatesLoading(false)
        }
    }

    const getCities = async stateId => {
        try {
            console.log(stateId, "stateId stateId");
            setIsCitiesLoading(true)
            const res = await CityService.getCityById(stateId)
            setCities(res.data)
            setAreas([]) // Clear areas when state changes
        } catch (error) {
            console.error('Failed to fetch cities:', error)
        } finally {
            setIsCitiesLoading(false)
        }
    }

    const getAreas = async cityId => {
        try {
            console.log(cityId, "cityId cityId");
            setIsAreasLoading(true)
            const res = await areaService.getAreas(cityId)
            setAreas(res.data)
        } catch (error) {
            console.error('Failed to fetch areas:', error)
        } finally {
            setIsAreasLoading(false)
        }
    }

    const getBankerName = async () => {
        {
            const res = await bankService.getBanks()
            setBankerName(res.data)
        }
    }

    const setContactVerified = (field, value) => {
        setContactFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // End Services Code

    const validate = () => {
        const newErrors = getInitialErrors(initialFormData)
        let valid = true

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required'
            valid = false
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required'
            valid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
            valid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid'
            valid = false
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required'
            valid = false
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits'
            valid = false
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required'
            valid = false
        }

        const requiredFields = [
            'companyName',
            'establishYear',
            'companyCeo',
            'businessNature',
            'businessCategory',
            'employeeNumber:'
        ]

        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field} is required`
                valid = false
            }
        })

        setErrors(newErrors)

        return valid
    }

    const validateCompany = () => {
        const newErrors = getInitialErrors(initCompanyFormData)
        let valid = true

        if (!companyFormData.companyName || !companyFormData.companyName.trim()) {
            newErrors.companyName = 'Company Name is required'
            valid = false
        }

        if (!companyFormData.establishYear || !companyFormData.establishYear.trim()) {
            newErrors.establishYear = 'Establish Year is required'
            valid = false
        }

        if (!companyFormData.companyCeo || !companyFormData.companyCeo.trim()) {
            newErrors.companyCeo = 'Company CEO is required'
            valid = false
        }

        if (!companyFormData.businessNature || !companyFormData.businessNature.trim()) {
            newErrors.businessNature = 'Business Nature is required'
            valid = false
        }

        if (!companyFormData.businessCategory || !companyFormData.businessCategory.trim()) {
            newErrors.businessCategory = 'Business Category is required'
            valid = false
        }

        // if (!companyFormData.businessSubCategory || !companyFormData.businessSubCategory.trim()) {
        //     newErrors.businessSubCategory = 'Business Sub Category is required'
        //     valid = false
        // }

        if (!companyFormData.employeeNumber || !companyFormData.employeeNumber.trim()) {
            newErrors.employeeNumber = 'Employee Number is required'
            valid = false
        }

        if (!companyFormData.businessLegal || !companyFormData.businessLegal.trim()) {
            newErrors.businessLegal = 'Business Legal Status is required'
            valid = false
        }

        if (!companyFormData.aboutUs || !companyFormData.aboutUs.trim()) {
            newErrors.aboutUs = 'About us is required'
            valid = false
        }

        // if (!contactFormData.email || !contactFormData.email.trim()) {
        //     newErrors.email = 'Email is required'
        //     valid = false
        // }

        if (!contactFormData.phoneNo || !contactFormData.phoneNo.trim()) {
            newErrors.phoneNo = 'Phone Number is required'
            valid = false
        }

        // if (!contactFormData.alternateNo || !contactFormData.alternateNo.trim()) {
        //     newErrors.alternateNo = 'Alternate Number is required'
        //     valid = false
        // }

        setCompanyErrors(newErrors)

        return valid
    }


    const validateLocation = () => {
        const newErrors = getInitialErrors(initLocationFormData)
        let valid = true

        if (!locationFormData.country || !locationFormData.country.trim()) {
            newErrors.country = 'Country is required'
            valid = false
        }

        if (!locationFormData.state || !locationFormData.state.trim()) {
            newErrors.state = 'State is required'
            valid = false
        }

        if (!locationFormData.city || !locationFormData.city.trim()) {
            newErrors.city = 'City is required'
            valid = false
        }

        if (!locationFormData.area || !locationFormData.area.trim()) {
            newErrors.area = 'Area is required'
            valid = false
        }

        if (!locationFormData.pincode || !locationFormData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required'
            valid = false
        }

        if (!locationFormData.address || !locationFormData.address.trim()) {
            newErrors.address = 'Address is required'
            valid = false
        }

        setLocationErrors(newErrors)

        return valid
    }

    const validateUrl = () => {
        const newErrors = getInitialErrors(initialFormData)
        let valid = true

        if (!urlFormData.url || !urlFormData.url.trim()) {
            newErrors.url = 'URL is required'
            valid = false
        }

        setUrlErrors(newErrors)

        return valid
    }

    const validateTiming = () => {
        const newErrors = {}
        let valid = true

        if (!timingFormData.bankerName || !timingFormData.bankerName.trim()) {
            newErrors.bankerName = 'Banker Name is required'
            valid = false
        }

        if (timingFormData.payments.length === 0) {
            newErrors.payments = 'At least one payment method is required'
            valid = false
        }

        setTimingErrors(newErrors)

        return valid
    }

    const validateKeywords = () => {
        const newErrors = getInitialErrors(initKeywordsFormData)
        let valid = true

        if (!keywordsFormData.keywords || keywordsFormData.keywords.length === 0) {
            newErrors.keywords = 'Keywords are required'
            valid = false
        }

        setKeywordsErrors(newErrors)

        return valid
    }

    const validateGallery = () => {
        const errors = {};
        if (!logoImage) errors.logoImage = 'Logo image is required';
        if (businessImageList.length === 0) errors.businessImageList = 'At least one business image is required';
        setGalleryErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateGoogleMap = () => {
        const newErrors = getInitialErrors(initGoogleMapData)
        let valid = true

        if (!googleMapData.latitude || !googleMapData.latitude.trim()) {
            newErrors.latitude = 'latitude is required'
            valid = false
        }

        if (!googleMapData.longitude || !googleMapData.longitude.trim()) {
            newErrors.longitude = 'Longitude is required'
            valid = false
        }

        setGoogleMapErrors(newErrors)

        return valid
    }

    const [uploadingStatus, setUploadingStatus] = useState({
        businessImages: false,
        logo: false,
        coverImage: false,
    });

    const [isImageUploading, setIsImageUploading] = React.useState(false);

    const checkOverallUploadingStatus = (currentUploadingStatus) => {
        return Object.values(currentUploadingStatus).some(status => status === true);
    };

    const handleBusinessImagesChange = async (e) => {
        const files = Array.from(e.target.files || []);
        const uploadedItems = []; // Renamed to store objects, not just URLs

        setUploadingStatus(prev => {
            const newState = { ...prev, businessImages: true };
            setIsImageUploading(checkOverallUploadingStatus(newState));
            return newState;
        });
        setImageErrors(prev => ({ ...prev, businessImages: '' }));

        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await Image.uploadImage(formData);
                if (res?.data?.url) {
                    uploadedItems.push({
                        url: res.data.url,
                        status: "UPLOADED",
                    });
                } else {
                    // Handle case where URL might be missing in successful response
                    setImageErrors(prev => ({ ...prev, businessImages: 'Uploaded, but URL missing for one image.' }));
                }
            } catch (err) {
                setImageErrors(prev => ({ ...prev, businessImages: 'Failed to upload one or more business images.' }));
                console.error('Business image upload failed', err);
            }
        }

        setUploadingStatus(prev => {
            const newState = { ...prev, businessImages: false };
            setIsImageUploading(checkOverallUploadingStatus(newState));
            return newState;
        });


    };

    const validatePassword = () => {
        const newErrors = { ...initPasswordData }
        let valid = true

        if (!passwordData.currentPassword || !passwordData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required'
            valid = false
        }

        if (!passwordData.newPassword || !passwordData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required'
            valid = false
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters'
            valid = false
        } else if (!/[a-z]/.test(passwordData.newPassword) || !/[A-Z]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must contain both lowercase and uppercase letters'
            valid = false
        } else if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one number or symbol'
            valid = false
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            valid = false
        }

        setPasswordErrors(newErrors)

        return valid
    }

    const isValidUrl = url => {
        try {
            new URL(url)

            return true
        } catch {
            return false
        }
    }

    // Add these handler functions
    const handleSocialLinkChange = (platform, value) => {
        setSocialLinksData(prev => ({
            ...prev,
            [platform]: value
        }));
    };


    const resetSocialLinks = () => {
        setSocialLinksData(initSocialLinksData);
    };


    const removeSocialLink = (platform) => {
        setSocialLinksData(prev => ({
            ...prev,
            [platform]: ''
        }));
    };


    const handleCompanyChange = field => e => {
        const value = e.target.value

        setCompanyFormData(prev => ({ ...prev, [field]: value }))

        if (companyErrors[field]) {
            setCompanyErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleContactChange = field => e => {
        const value = e.target.value

        setContactFormData(prev => {
            const newState = { ...prev };
            newState[field] = value;

            if (field === 'email') {
                newState.isEmailVerify = false;
            } else if (field === 'phoneNo') {
                newState.isPhoneVerify = false;
            } else if (field === 'alternateNo') {
                newState.isAlternateVerify = false;
            }

            return newState;
        });

        if (contactErrors[field]) {
            setContactErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleUrlChange = field => e => {
        const value = e.target.value


        setUrlFormData(prev => ({ ...prev, [field]: value }))

        if (urlErrors[field]) {
            setUrlErrors(prev => ({ ...prev, [field]: '' }))
        }
    }
    const gstNumber = field => e => {
        const value = e.target.value

        setGSTNumber(prev => ({ ...prev, [field]: value }))

        if (urlErrors[field]) {
            setgstErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleLocationChange = (newData) => {
        setLocationFormData(prevData => {
            const newState = { ...prevData, ...newData };
            console.log("DEBUG: Context - new locationFormData state:", newState); // Log inside the context
            return newState;
        });
    };

    const handleTimingChange = (dayOrField, field, value) => {
        setTimingFormData(prev => {
            if (field === null) {
                return { ...prev, [dayOrField]: value } // top-level field
            }

            return {
                ...prev,
                timings: {
                    ...prev.timings,
                    [dayOrField]: {
                        ...prev.timings[dayOrField],
                        [field]: value
                    }
                }
            }
        })
    }

    const handleKeywordsChange = (field, value) => {
        setKeywordsFormData(prev => ({ ...prev, [field]: value }))

        if (keywordsErrors[field]) {
            setKeywordsErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleGoogleMapChange = (newData) => {
        setGoogleMapData(prevData => ({ ...prevData, ...newData }));
    };

    const handlePasswordChange = field => e => {
        const value = e.target.value

        setPasswordData(prev => ({ ...prev, [field]: value }))

        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // Handler for payment toggles
    const handlePaymentToggle = method => {
        setTimingFormData(prev => {
            const currentPayments = prev.payments || []

            return {
                ...prev,
                payments: currentPayments.includes(method)
                    ? currentPayments.filter(p => p !== method)
                    : [...currentPayments, method]
            }
        })
    }

    const handleChange = field => e => {
        const value = e.target.value

        setFormData(prev => ({ ...prev, [field]: value }))

        if (field === 'email') {
            handleCompanyChange('username')(e)
        }

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }


    const handleSubmit = e => {
        e.preventDefault()
        const companyValid = validateCompany()
        const urlValid = validateUrl()
        const locationValid = validateLocation()
        const timingValid = validateTiming()
        const keywordValid = validateKeywords()
        const googleMapValid = validateGoogleMap()

        if (!companyValid || !urlValid || !locationValid || !timingValid || !keywordValid || !googleMapValid) return


        // console.log('image data:', imageData)
        console.log('google data:', googleMapData)
        nextHandle()
    }

    const handleSecurityChange = () => { }

    const value = {
        handleChange,
        handleSubmit,

        handleCompanyChange,
        handleContactChange,
        companyFormData,
        contactFormData,
        companyErrors,
        contactErrors,
        validateCompany,
        setUrlFormData,

        handleUrlChange,
        gstNumber,
        urlFormData,
        urlErrors,
        gstNumbers,
        validateUrl,

        setContactVerified,

        handleLocationChange,
        locationFormData,
        locationErrors,
        validateLocation,

        handleTimingChange,
        timingFormData,
        timingErrors,
        validateTiming,
        handlePaymentToggle,

        handleKeywordsChange,
        keywordsFormData,
        keywordsErrors,
        validateKeywords,

        logoImage,
        setLogoImage,
   
        businessImageList,
        setBusinessImageList,
        galleryErrors,
        setGalleryErrors,
        validateGallery,
        removedBusinessImageIds,
        setRemovedBusinessImageIds,

        getBusinessImages,
        getLogoImage,
      

        handleGoogleMapChange,
        googleMapData,
        googleMapErrors,
        validateGoogleMap,

        socialLinksData,
        // socialLinksErrors,
        handleSocialLinkChange,
        // addSocialLink,
        removeSocialLink,
        // validateSocialLinks,

        passwordData,
        passwordErrors,
        handlePasswordChange,
        validatePassword,

        businessNature,
        legalStatus,
        turnover,
        employeeNumber,
        category,
        countries,
        states,
        cities,
        areas,
        isStatesLoading,
        isCitiesLoading,
        isAreasLoading,
        bankerName,
        allData,
        handleSecurityChange,
        validate,
        onSuccess,
        getStates,
        getAreas,
        getCities,
        setBusinessBrand,
        businessBrand,
        attributes,
        setAttributes,
        categoryTree,

        handleAttributeChange: (attributeId) => (event) => {
            setAttributes(prev => ({
                ...prev,
                [attributeId]: event.target.value
            }));
        }
    }


    return <UpdateListingFormContext.Provider value={value}>{children}</UpdateListingFormContext.Provider>
}

// --- Custom Hook for Consuming Context ---
export const useUpdateListingFormContext = () => {
    const context = useContext(UpdateListingFormContext)

    if (context === undefined) {
        throw new Error('useUpdateListingFormContext must be used within an UpdateListingFormContext')
    }


    return context
}
