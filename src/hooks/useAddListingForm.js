'use client'
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

import businessNatureService from '@/services/business/businessNature.service'
import businessStatusService from '@/services/business/businessStatus.service'
import categoryService from '@/services/category/category.service'
import employeeNoService from '@/services/business/employeeNo.service'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'
import bankService from '@/services/business/bank.service'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'
import Image from '@/services/imageService'
import gstTurnoverService from '@/services/business/gstTurnover.service'
import EmployeeSugestedCat from "@/services/business/service/serviceCategory.service"
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
  gstNumber: "",
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
  logoImage: '',
  coverImage: '',
  businessImages: [],
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
  gstNumber: '',
  establishYear: '',
  companyCeo: '',
  businessNature: '',
  businessCategory: '',
  businessSubCategory: '',
  employeeNumber: '',
  businessLegal: '',
  // companyWebsite: '',
  aboutUs: '',
  attributes: {}
}
const initContactFormData = {
  // homeLandline: '',
  officeLandline: '',
  tollFreeNumber: '',
  email: '',
  phoneNo: '',
  alternateNo: '',
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
  logo: '',
  coverImage: ''
}

const initGoogleMapData = {
  latitude: '',
  longitude: '',
  google_map_url: ''
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

const AddListingFormContext = createContext()

export const AddListingProvider = ({ onSuccess, children }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState(getInitialErrors(initialFormData))

  const [companyFormData, setCompanyFormData] = useState(initCompanyFormData)
  const [businessBrand,setBusinessBrand]=useState({
    BusinessBrandName:""
  })
  const [companyErrors, setCompanyErrors] = useState(getInitialErrors(initCompanyFormData))
  const [turnover, setTurnover] = useState([])
  const [contactFormData, setContactFormData] = useState(initContactFormData)
  const [contactErrors, setContactErrors] = useState(getInitialErrors(initContactFormData));

  const [urlFormData, setUrlFormData] = useState(initUrlFormData)
  const [urlErrors, setUrlErrors] = useState(getInitialErrors(initUrlFormData))

  const [locationFormData, setLocationFormData] = useState(initLocationFormData)
  const [locationErrors, setLocationErrors] = useState(getInitialErrors(initLocationFormData))

  const [timingFormData, setTimingFormData] = useState(initTimingFormData)
  const [timingErrors, setTimingErrors] = useState(getInitialErrors(initTimingFormData))

  const [keywordsFormData, setKeywordsFormData] = useState(initKeywordsFormData)
  const [keywordsErrors, setKeywordsErrors] = useState(getInitialErrors(initKeywordsFormData))

  const [logoImage, setLogoImage] = useState(null);
  // const [coverImage, setCoverImage] = useState(null);
  const [businessImageList, setBusinessImageList] = useState([]);
  const [galleryErrors, setGalleryErrors] = useState({});

  const [googleMapData, setGoogleMapData] = useState(initGoogleMapData)
  const [googleMapErrors, setGoogleMapErrors] = useState(initGoogleMapData)

  const [socialLinksData, setSocialLinksData] = useState(initSocialLinksData);

  const [keywordsList, setKeywordsList] = useState([])

  const [passwordData, setPasswordData] = useState(initPasswordData)
  const [passwordErrors, setPasswordErrors] = useState(initPasswordData)

  const [businessNature, setBusinessNature] = useState([])
  const [legalStatus, setLegalStatus] = useState([])
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
  const [categoryTree, setCategoryTree] = useState([])



// console.log(businessBrand,"businessBrandbusinessBrand");

  const allData = {
    companyFormData,
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
    // coverImage: coverImage,
    passwordData,
    attributes: companyFormData.attributes
  }

  console.log(allData, "allDataallDataallData");
  // console.log(urlFormData, "keywordsFormDatakeywordsFormDatakeywordsFormData");

  useEffect(() => {
    getBusinessNature()
    getLegalStatus()
    getEmployeeNumber()
    getBusinessCategory()
    getTurnover()
    getCountries()
    getStates()
    getCities()
    getAreas()
    getBankerName()
    getServiceCategory()
  }, [])


  // useEffect(() => {
  //   const getServiceCatData = async () => {
  //     if (companyFormData.businessCategory) {
  //       const categoryId = companyFormData.businessCategory;
  //       const res = await serviceCategoryService.getSingleCategory(categoryId);
  //       setKeywordsList(res?.data?.keywords || []);
  //       console.log('Attribute list:', res?.data?.keywords);
  //       // setCategoryTree(res.data);
  //     }
  //   };

  //   getServiceCatData();
  // }, [companyFormData.businessCategory]);

  // Start Getting data From services
  const getBusinessNature = async () => {
    const res = await businessNatureService.getBusinessNatures()

    setBusinessNature(res.data)
  }

  const getBusinessCategory = async () => {
    // const res = await EmployeeSugestedCat.getCategories()

    // setCategory(res.data)
  }
  const { data: sessionData, status } = useSession()
  // console.log(sessionData, "sessionDatasessionData");

  // service category
  const getServiceCategory = async () => {


    const payload = {
      categories: sessionData?.user?.categories
    }

    // console.log(sessionData, 'payload (categories from session)')

    try {
      const res = await serviceCategoryService.getEmploryeeSagestedCat(payload)
      // console.log(res, 'response from getEmploryeeSagestedCat')

      setCategoryTree(res.data)
    } catch (err) {
      console.error('Error fetching service categories:', err)
    }
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
      'gstNumber',
      'establishYear',
      'companyCeo',
      'businessNature',
      'businessCategory',
      // 'businessSubCategory',
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

    if (!companyFormData.companyName.trim()) {
      newErrors.companyName = 'company Name is required'
      valid = false
    }
    if (!companyFormData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is required'
      valid = false
    }

    if (!companyFormData.establishYear.trim()) {
      newErrors.establishYear = 'Establish Year is required'
      valid = false
    }

    if (!companyFormData.companyCeo.trim()) {
      newErrors.companyCeo = 'company CEO is required'
      valid = false
    }

    if (!companyFormData.businessNature.trim()) {
      newErrors.businessNature = 'Business Nature is required'
      valid = false
    }

    if (!companyFormData.businessCategory.trim()) {
      newErrors.businessCategory = 'Business Category is required'
      valid = false
    }

    // if (!companyFormData.businessSubCategory.trim()) {
    //   newErrors.businessSubCategory = 'Business Sub Category is required'
    //   valid = false
    // }

    if (!companyFormData.employeeNumber.trim()) {
      newErrors.employeeNumber = 'Employee Number is required'
      valid = false
    }

    if (!companyFormData.businessLegal.trim()) {
      newErrors.businessLegal = 'Business Legal Status is required'
      valid = false
    }

    // if (!companyFormData.companyWebsite.trim()) {
    //   newErrors.companyWebsite = 'Website Url is required'
    //   valid = false
    // }

    if (!companyFormData.aboutUs.trim()) {
      newErrors.aboutUs = 'About us is required'
      valid = false
    }

    // if (!contactFormData.email.trim()) {
    //   newErrors.email = 'Email is required'
    //   valid = false
    // }

    if (!contactFormData.phoneNo || !contactFormData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone Number is required';
      valid = false;
    } else if (contactFormData.isPhoneVerify === false) {
      newErrors.phoneNo = 'First Verify Your Phone Number';
      valid = false;
    }

    setCompanyErrors(newErrors)

    return valid
  }

  const validateLocation = () => {
    const newErrors = getInitialErrors(initLocationFormData)
    let valid = true

    if (!locationFormData.country.trim()) {
      newErrors.country = 'Country is required'
      valid = false
    }

    if (!locationFormData.state.trim()) {
      newErrors.state = 'State is required'
      valid = false
    }

    if (!locationFormData.city.trim()) {
      newErrors.city = 'City is required'
      valid = false
    }

    if (!locationFormData.area.trim()) {
      newErrors.area = 'Area is required'
      valid = false
    }

    if (!locationFormData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
      valid = false
    }

    if (!locationFormData.address.trim()) {
      newErrors.address = 'Address is required'
      valid = false
    }

    setLocationErrors(newErrors)

    return valid
  }

  const validateUrl = () => {
    const newErrors = getInitialErrors(initialFormData)
    let valid = true

    if (!urlFormData.url.trim()) {
      newErrors.url = 'URL is required'
      valid = false
    }

    setUrlErrors(newErrors)

    return valid
  }

  const validateTiming = () => {
    const newErrors = {}
    let valid = true

    if (!timingFormData.bankerName.trim()) {
      newErrors.bankerName = 'Banker Name is required'
      valid = false
    }

    if (timingFormData) {
      // Validate timings if displayHours is true
      for (const day of weekDays) {
        const dayTiming = timingFormData.timings[day]

        if (!dayTiming.isClosed && !dayTiming.is24Hours) {
          if (!dayTiming.open || !dayTiming.close) {
            newErrors.timings = 'Please set opening and closing times'
            valid = false
            break
          }
        }
      }
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
    if (!logoImage) errors.logoImage = ' Image is required';
    // if (!coverImage) errors.coverImage = 'Image is required';
    if (businessImageList.length === 0) errors.businessImageList = 'At least one business image is required';
    setGalleryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateGoogleMap = () => {
    const newErrors = getInitialErrors(initGoogleMapData)
    let valid = true

    if (!googleMapData.latitude.trim()) {
      newErrors.latitude = 'latitude  is required'
      valid = false
    }

    if (!googleMapData.longitude.trim()) {
      newErrors.longitude = 'Longitude is required'
      valid = false
    }

    setGoogleMapErrors(newErrors)

    return valid
  }

  const validatePassword = () => {
    const newErrors = { ...initPasswordData }
    let valid = true

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
      valid = false
    }

    if (!passwordData.newPassword.trim()) {
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

  // Add these handler functions
  const handleSocialLinkChange = (platform, value) => {
    setSocialLinksData(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors(getInitialErrors(initialFormData))
    setCompanyFormData(initCompanyFormData)
    setCompanyErrors(getInitialErrors(initCompanyFormData))
  }

  const handleCompanyChange = field => e => {
    const value = e.target.value

    setCompanyFormData(prev => ({ ...prev, [field]: value }))

    if (companyErrors[field]) {
      setCompanyErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleContactChange = field => e => {
    const value = e.target.value


    console.log(value, "valuevaluevalue");


    setContactFormData(prev => {
      // Start with a copy of the previous state
      const newState = { ...prev };

      // Update the specific field that triggered the change
      newState[field] = value;

      // Now, handle the resetting of verification flags based on the field being changed
      if (field === 'email') {
        newState.isEmailVerify = false; // Reset email verification if email changes
      } else if (field === 'phoneNo') {
        newState.isPhoneVerify = false; // Reset phone verification if phone changes
      } else if (field === 'alternateNo') {
        newState.isAlternateVerify = false; // Reset alternate phone verification if alternateNo changes
      }

      // Return the updated state
      return newState;
    });

    // Clear errors for the changed field
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

  // const handleLocationChange = field => e => {
  //   const value = e.target.value

  //   setLocationFormData(prev => ({ ...prev, [field]: value }))

  //   if (locationErrors[field]) {
  //     setLocationErrors(prev => ({ ...prev, [field]: '' }))
  //   }

  //   // Fetch dependent data when a location field changes
  //   if (field === 'country') {
  //     getStates(value) // value should be country ID
  //   } else if (field === 'state') {
  //     getCities(value) // value should be state ID
  //   } else if (field === 'city') {
  //     getAreas(value) // value should be city ID
  //   }
  // }

  const handleLocationChange = (data) => {
    setLocationFormData(prev => ({ ...prev, ...data }))
  }

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
    setGoogleMapData((prev) => ({
      ...prev,
      ...newData
    }))
  }

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


  const getTurnover = async () => {
    const res = await gstTurnoverService.getAllGstTurnovers()
    setTurnover(res.data)
  }


  const handleSecurityChange = () => { }

  const value = {
    handleChange,
    handleSubmit,

    handleCompanyChange,
    handleContactChange,
    companyFormData,
    contactFormData,
    setUrlFormData,
    companyErrors,
    contactErrors,
    validateCompany,
    setContactVerified,

    handleUrlChange,
    urlFormData,
    urlErrors,
    validateUrl,

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
    keywordsList,
    turnover,
    // imageErrors,
    // handleBusinessImagesChange,
    // handleCoverImageChange,
    logoImage,
    setLogoImage,
  
    businessImageList,
    setBusinessImageList,
    galleryErrors,
    setGalleryErrors,
    validateGallery,

    handleGoogleMapChange,
    googleMapData,
    googleMapErrors,
    validateGoogleMap,

    socialLinksData,
    // socialLinksErrors,
    handleSocialLinkChange,
    // addSocialLink,
    // removeSocialLink,
    // validateSocialLinks,

    passwordData,
    passwordErrors,
    handlePasswordChange,
    validatePassword,

    businessNature,
    legalStatus,
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
    categoryTree,
    allData,
    setBusinessBrand,
    businessBrand,
    handleSecurityChange,
    validate, // Expose validation functions
    onSuccess
  }


  return <AddListingFormContext.Provider value={value}>{children}</AddListingFormContext.Provider>
}

// --- Custom Hook for Consuming Context ---
export const useAddListingFormContext = () => {
  const context = useContext(AddListingFormContext)

  if (context === undefined) {
    throw new Error('useAddListingFormContext must be used within an AddListingFormContext')
  }


  return context
}
