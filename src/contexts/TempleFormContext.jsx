'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import countryService from '@/services/location/country.services';
import stateService from '@/services/location/state.services';
import CityService from '@/services/location/city.service';
import HinduService from '@/services/spritual/hinduService';
import { useRouter } from 'next/navigation';
import areaService from '@/services/location/area.services';


// --- Initial State Definitions ---
const initialFormData = {
    temple_name: '',
    main_image: '',
    about_us: '',
    about_temple: [{
        title: '',
        content: ''
    }],
    area: '',
    city: '',
    state: '',
    country: '',
    google_map_url: '',
    contact_number: '',
};

const initSocialMediaData = {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedIn: '',
}


const inittimingFormData = {
    darshan: [{
        title: '',
        start: '',
        end: ''
    }],
    aarti: [{
        title: '',
        start: '',
        end: ''
    }],
}

const initGoogleMapData = {
    latitude: '',
    longitude: ''
}

const initDonationData = {
    image: '',
    description: '',
    button_text: '',
    button_link: '',
    imageId: ''
}

const initSecurityData = {
    email: '',
    password: '',
    phoneNumber: '',
    status: "PENDING",
    templeStatus: "ACTIVE"
}



const getInitialErrors = (fields) => {
    const errors = {};
    for (const key in fields) {
        errors[key] = '';
    }
    return errors;
};

// --- Create Context ---
const TempleFormContext = createContext();

// --- Create Provider Component ---
export const TempleFormProvider = ({ children, onSuccess }) => {
    const router = useRouter()
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState(getInitialErrors(initialFormData))

    const [isEditMode, setIsEditMode] = useState(false);
    const [editTempleId, seteditTempleId] = useState('')

    const [socialMediaData, setSocialMediaData] = useState(initSocialMediaData)
    const [socialMediaErrors, setSocialMediaErrors] = useState(getInitialErrors(initSocialMediaData))

    const [templeTabManager, setTempleTabManager] = useState({
        overview: true,
        timing: false,
        socialmedia: false,
        gallery: false,
        donation: false,
        security: false,
    });




    const [googleMapData, setGoogleMapData] = useState(initGoogleMapData)
    const [googleMapErrors, setGoogleMapErrors] = useState(initGoogleMapData)


    const [bannerImages, setBannerImages] = useState([])
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryErrors, setGalleryErrors] = useState({ bannerImages: '', galleryImages: '' })
    const [tempImageIds, setTempImageIds] = useState([])

    const [donationData, setDonationData] = useState(initDonationData)
    const [donationErrors, setDonationErrors] = useState(getInitialErrors(initDonationData))
    const [donationList, setDonationList] = useState([])



    const [timingFormData, setTimingFormData] = useState(inittimingFormData)
    const [timingErrors, setTimingErrors] = useState(getInitialErrors(inittimingFormData))

    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [areaList, setAreaList] = useState([])

    const [securityFormData, setSecurityFormData] = useState(initSecurityData)
    const [securityErrors, setSecurityErrors] = useState(getInitialErrors(initSecurityData))

    const [emailVerified, setEmailVerified] = useState(false)
    const [mobileVerified, setMobileVerified] = useState(false)

    const [imageId, setImageId] = useState('')



    useEffect(() => {
        getCountry()
        // getRoles()
    }, [])

    console.log("fdf", timingFormData)


    const getCountry = async () => {
        const result = await countryService.getCountries()
        setCountryList(result.data)
    }



    const getStatesbyId = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setStateList(result.data)
    }

    const getCityByStateId = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setCityList(result.data)
    }

    const getAreaByCityId = async (cityId) => {
        const result = await areaService.getAreaById(cityId)
        setAreaList(result.data)
    }

    const handleChange = (field) => (e) => {
        console.log(field, e.target.value);

        const value = e.target.value
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (field === 'email') {
            handleSecurityChange('username')(e)
        }
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const handleSocialMediaChange = field => e => {
        const value = e.target.value
        setSocialMediaData(prev => ({ ...prev, [field]: value }))
        if (socialMediaErrors[field]) {
            setSocialMediaErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleDonationDataChange = (field, value) => {
        setDonationData(prev => ({ ...prev, [field]: value }))
        if (donationErrors[field]) {
            setDonationErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleGoogleMapChange = field => e => {
        const value = e.target.value

        setGoogleMapData(prev => ({ ...prev, [field]: value }))

        if (googleMapErrors[field]) {
            setGoogleMapErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSecurityChange = field => e => {
        const value = e.target.value
        setSecurityFormData(prev => ({ ...prev, [field]: value }))
        if (securityErrors[field]) {
            setSecurityErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.temple_name?.trim()) {
            newErrors.temple_name = 'Temple name is required.'
        }
        if (!formData.about_us?.trim()) {
            newErrors.about_us = 'About Us section is required.'
        }
        if (!formData.area.trim()) {
            newErrors.area = 'Area is required.'
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required.'
        }
        if (!formData.state.trim()) {
            newErrors.state = 'State is required.'
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required.'
        }

        if (formData.about_temple?.length <= 0) {
            newErrors.about_temple = 'Additional section is required.'
        }
        if (!formData.main_image?.trim()) {
            newErrors.main_image = 'Main image is required.'
        }

        if (!formData.google_map_url?.trim()) {
            newErrors.google_map_url = 'Map location is required.'
        }
        if (!formData.contact_number?.trim()) {
            newErrors.contact_number = 'Contact number is required.'
        }

        //contact number validation
        const phoneRegex = /^[0-9]{10}$/; // Adjust regex as per your requirement
        if (!phoneRegex.test(formData.contact_number)) {
            newErrors.contact_number = 'Contact number must be 10 digits.'
        }




        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }


    const validateDonationData = () => {
        const newErrors = getInitialErrors(initDonationData)
        let valid = true
        if (!donationData.image.trim()) {
            newErrors.image = 'Image is required'
            valid = false
        }
        if (!donationData.description.trim()) {
            newErrors.description = 'Description is required'
            valid = false
        }
        if (!donationData.button_text.trim()) {
            newErrors.button_text = 'Button text is required'
            valid = false
        }
        if (!donationData.button_link.trim()) {
            newErrors.button_link = 'Button link is required'
            valid = false
        }
        setDonationErrors(newErrors)
        return valid
    }

    const addDonation = () => {
        setDonationList(prev => [...prev, donationData])
        setDonationData(initDonationData)
    }

    const updateDonation = (index) => {
        setDonationList(prev => prev.map((doc, i) => (i === index ? donationData : doc)))
        setDonationData(initDonationData)
    }


    const removeDonation = (index) => {
        setDonationList(prev => prev.filter((_, i) => i !== index))
    }



    const validateSocialMedia = () => {
        const newErrors = getInitialErrors(initSocialMediaData)
        let valid = true

        if (!socialMediaData.facebook.trim()) {
            newErrors.facebook = 'Facebook URL is required'
            valid = false
        }

        if (!socialMediaData.instagram.trim()) {
            newErrors.instagram = 'Instagram URL is required'
            valid = false
        }

        if (!socialMediaData.youtube.trim()) {
            newErrors.youtube = 'YouTube URL is required'
            valid = false
        }
        if (!socialMediaData.linkedIn.trim()) {
            newErrors.linkedIn = 'LinkedIn URL is required'
            valid = false
        }

        setSocialMediaErrors(newErrors)

        return valid
    }

    useEffect(() => {
        console.log("handlle about temple", formData.about_temple);

    }, [formData])



    const validateGoogleMap = () => {
        const newErrors = getInitialErrors(initGoogleMapData)
        let valid = true

        if (!googleMapData.latitude.trim()) {
            newErrors.latitude = 'Latitude is required'
            valid = false
        }

        if (!googleMapData.longitude.trim()) {
            newErrors.longitude = 'Longitude is required'
            valid = false
        }

        setGoogleMapErrors(newErrors)

        return valid
    }

    const validateSecurity = () => {
        const newErrors = getInitialErrors(initSecurityData)
        let valid = true
        if (!securityFormData.email.trim()) {
            newErrors.email = 'Email is required'
            valid = false
        }
        if (!securityFormData.password.trim()) {
            newErrors.password = 'Password is required'
            valid = false
        }
        if (!securityFormData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
            valid = false
        }
        setSecurityErrors(newErrors)
        return valid
    }



    const validateTiming = () => {
        const newErrors = getInitialErrors(inittimingFormData)
        let valid = true

        if (timingFormData.darshan.length <= 0 || timingFormData.darshan[0].title.length <= 0 || timingFormData.darshan[0].start.length <= 0 || timingFormData.darshan[0].end.length <= 0) {
            newErrors.darshan = 'Morning Darshan is required'
            valid = false
        }

        if (timingFormData.aarti.length <= 0 || timingFormData.aarti[0].title.length <= 0 || timingFormData.aarti[0].start.length <= 0 || timingFormData.aarti[0].end.length <= 0) {
            newErrors.aarti = 'Evening Darshan is required'
            valid = false
        }

        setTimingErrors(newErrors)

        return valid
    }

    const validateGalleryImages = () => {
        const newErrors = {}
        let valid = true

        if (bannerImages.length <= 0) {
            newErrors.bannerImages = 'Banner images are required'
            valid = false
        }
        if (galleryImages.length <= 0) {
            newErrors.galleryImages = 'Gallery images are required'
            valid = false
        }

        setGalleryErrors(newErrors)

        return valid
    }


    const handleLoadData = async (data) => {
        console.log("data", data);

        setFormData({
            temple_name: data.name,
            main_image: data.image,
            about_us: data.about,
            area: data.location.area,
            city: data.location?.city?._id || '',
            state: data.location?.state?._id || '',
            country: data.location?.country?._id || '',
            contact_number: data.contact_number,
            about_temple: data.additional_info,
            google_map_url: data.location?.google_map_url || ''
        }
        )

        setTempleTabManager({
            overview: true,
            timing: true,
            socialmedia: true,
            gallery: true,
            donation: true,
            security: true
        })

        setEmailVerified(data.user_id.emailVerified)
        setMobileVerified(data.user_id.phoneVerified)


        seteditTempleId(data._id)



        setIsEditMode(true)
        setGoogleMapData(
            {
                latitude: data.location.latitude,
                longitude: data.location.longitude
            })
        setSocialMediaData({
            facebook: data.social_links.facebook.split('/').pop(),
            linkedIn: data.social_links.linkedIn.split('/').pop(),
            instagram: data.social_links.instagram.split('/').pop(),
            youtube: data.social_links.youtube.split('/').pop()
        })
        setSecurityFormData({
            email: data.user_id.email,
            phoneNumber: data.user_id.phone,
            status: data.user_id.status,
            templeStatus: data.status,
        })

        setTimingFormData({
            darshan: data.timings.darshan,
            aarti: data.timings.aarti
        })
        setBannerImages(data.gallery_images.banner)
        setGalleryImages(data.gallery_images.gallery)
        setDonationList(data.donation)
        if (data.location?.country) {
            await getStatesbyId(data.location?.country?._id); // await to ensure state list is populated
        }
        if (data.location) {
            await getCityByStateId(data.location?.state?._id); // await to ensure city list is populated
            await getAreaByCityId(data.location?.city?._id); // await to ensure area list is populated
        }
    }

    // --- Form Reset Function ---
    const resetForm = () => {
        setFormData(initialFormData);
        setSocialMediaData(initSocialMediaData);
        setGoogleMapData(initGoogleMapData);
        setSecurityFormData(initSecurityData);
        setTimingFormData(inittimingFormData);
        setBannerImages([]);
        setGalleryImages([]);
        setDonationList([]);
        setDonationData(initDonationData);
        setDonationErrors(getInitialErrors(initDonationData));
        setSocialMediaErrors(getInitialErrors(initSocialMediaData));
        setGoogleMapErrors(getInitialErrors(initGoogleMapData));
        setTimingErrors(getInitialErrors(inittimingFormData));
        setSecurityErrors(getInitialErrors(initSecurityData));
        setImageId('');
        setIsEditMode(false);
        seteditTempleId('');
        setTempleTabManager({
            overview: true,
            timing: false,
            socialmedia: false,
            gallery: false,
            donation: false,
            security: false,
        });
        setEmailVerified(false);
        setMobileVerified(false);
        // Reset errors

        // Reset form errors


        setErrors(getInitialErrors(initialFormData));

        // Reset fetched lists that depend on selections if necessary
        setStateList([]);
        setCityList([]);
    };

    const handleSubmit = async () => {

        //remove image id from donation data
        const updatedDonationList = donationList.map(item => {
            const { imageId, ...rest } = item;
            return rest;
        });
        setDonationList(updatedDonationList)

        const body = {
            ...formData,
            ...socialMediaData,
            ...googleMapData,
            donationData: updatedDonationList,
            ...securityFormData,
            aarti: timingFormData.aarti,
            darshan: timingFormData.darshan,
            banner_images: bannerImages,
            gallery_images: galleryImages,

        }
        console.log('Final Body:', body);
        // Perform the API call or any other action with the form data
        if (isEditMode) {
            const ress = await HinduService.updateTemple(editTempleId, body);
            console.log('Response:', ress);
        } else {
            const ress = await HinduService.createTemple(body);
            console.log('Response:', ress);
        }
        setTempleTabManager({
            overview: true,
            timing: false,
            socialmedia: false,
            gallery: false,
            donation: false,
            security: false,
        })
        resetForm() // Reset the form after submission
        onSuccess && onSuccess()
        router.push("/en/apps/spritual/hinduism/manage")
    }
    console.log("goofle map data", googleMapData);



    // --- Context Value ---
    const value = {
        formData,
        errors,
        handleChange,

        countryList,
        stateList,
        cityList,
        

        getStatesbyId, // Expose if needed directly by components
        getCityByStateId, // Expose if needed directly by components
        areaList,
        getAreaByCityId, // Expose if needed directly by components
        validate, // Expose validation functions

        handleSubmit, // Expose the main submit handler

        resetForm,
        handleGoogleMapChange,
        googleMapData,
        googleMapErrors,
        validateGoogleMap,

        handleSocialMediaChange,
        socialMediaData,
        socialMediaErrors,
        validateSocialMedia,


        bannerImages, setBannerImages,
        galleryImages, setGalleryImages, validateGalleryImages, galleryErrors, setGalleryErrors,
        donationData, setDonationData,
        donationErrors, setDonationErrors,
        donationList,
        removeDonation,
        validateDonationData,
        addDonation,
        updateDonation,
        handleDonationDataChange,

        handleSecurityChange,
        securityFormData,
        securityErrors,
        validateSecurity,

        timingFormData,
        setTimingFormData,
        tempImageIds, setTempImageIds,
        validateTiming,
        timingErrors, setTimingErrors,

        mobileVerified, setMobileVerified,
        emailVerified, setEmailVerified,

        imageId, setImageId,

        handleLoadData, isEditMode,
        templeTabManager, setTempleTabManager

    };

    return (
        <TempleFormContext.Provider value={value}>
            {children}
        </TempleFormContext.Provider>
    );
};

// --- Custom Hook for Consuming Context ---
export const useTempleContext = () => {
    const context = useContext(TempleFormContext);
    if (context === undefined) {
        throw new Error('useTempleFormContext must be used within an TempleFormProvider');
    }
    return context;
};
