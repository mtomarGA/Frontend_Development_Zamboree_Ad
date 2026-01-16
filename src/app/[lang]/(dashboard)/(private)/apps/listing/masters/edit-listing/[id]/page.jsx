'use client'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { UpdateListingProvider } from '@/hooks/updateListingForm'
import manageBusinessService from '@/services/business/manageBusiness.service'
import EditListing from '@/views/apps/listing/edit-listing/index'
// import AddListing from '@views/apps/listing/add-listing'

// Dynamic imports for tabs
const CompanyDetailTab = dynamic(() => import('@/views/apps/listing/edit-listing/companyDetail'))
const PersonalizedUrlTab = dynamic(() => import('@/views/apps/listing/edit-listing/personalizedUrl'))
// const LocationInfoTab = dynamic(() => import('@/views/apps/listing/edit-listing/LocationInfo'))
const ReviewRatingTab = dynamic(() => import('@/views/apps/listing/edit-listing/ReviewRating'))
const TimingPaymentTab = dynamic(() => import('@/views/apps/listing/edit-listing/TimingPayment'))
const FollowingTab = dynamic(() => import('@/views/apps/listing/edit-listing/Following'))
const KeywordsTab = dynamic(() => import('@/views/apps/listing/edit-listing/Keywords'))
const ImagesTab = dynamic(() => import('@/views/apps/listing/edit-listing/Images/index'))
const GoogleMapTab = dynamic(() => import('@/views/apps/listing/edit-listing/GoogleMap'))
const SocialLinksTab = dynamic(() => import('@/views/apps/listing/edit-listing/SocialLink'))
const FollowUpsTab = dynamic(() => import('@/views/apps/listing/edit-listing/FollowUps'))
const EnquiriesTab = dynamic(() => import('@/views/apps/listing/edit-listing/Enquiries'))
const SecurityMap = dynamic(() => import('@/views/apps/listing/edit-listing/Security'))

// Tab content mapping
const tabContentList = {
    companyDetail: <CompanyDetailTab />,
    personalizedUrl: <PersonalizedUrlTab />,
    timingPayment: <TimingPaymentTab />,
    keywords: <KeywordsTab />,
    images: <ImagesTab />,
    googleMap: <GoogleMapTab />,
    socialLinks: <SocialLinksTab />,
    // locationInfo: <LocationInfoTab />,
    reviewRating: <ReviewRatingTab />,
    following: <FollowingTab />,
    followUps: <FollowUpsTab />,
    enquiries: <EnquiriesTab />,
    security: <SecurityMap />
}

const EditListingPage = ({ params }) => {
    const { id } = React.use(params);

    const [initialData, setInitialData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchListingData = async () => {
            try {
                setLoading(true)
                const response = await manageBusinessService.getBusinessById(id)


                const data = response.data
                // console.log(data, "responseresponse");
                // Transform the API response to match your form structure
                const transformedData = {
                    companyFormData: {
                        companyName: data.companyInfo.companyName,
                        establishYear: data.companyInfo.establishYear,
                        companyCeo: data.companyInfo.companyCeo,
                        businessNature: data.companyInfo?.businessNature?._id ?? '',
                        businessCategory: data.companyInfo?.businessCategory?._id ?? '',
                        businessSubCategory: data.companyInfo?.businessSubCategory?._id ?? '',
                        employeeNumber: data.companyInfo?.employeeNumber?._id ?? '',
                        businessLegal: data.companyInfo?.businessLegal?._id ?? '',
                        gstTurnOver: data.companyInfo?.gstTurnOver?._id ?? '',
                        companyWebsite: data.companyInfo?.companyWebsite,
                        aboutUs: data.companyInfo?.aboutUs,
                    },
                    contactFormData: {
                        homeLandline: data?.contactInfo?.homeLandline,
                        officeLandline: data?.contactInfo?.officeLandline,
                        tollFreeNumber: data?.contactInfo?.tollFreeNumber,
                        email: data?.contactInfo?.email,
                        phoneNo: data?.contactInfo?.phoneNo,
                        alternateNo: data?.contactInfo?.alternateNo,
                        isEmailVerify: data?.contactInfo?.isEmailVerify,
                        isPhoneVerify: data?.contactInfo?.isPhoneVerify,
                        isAlternateVerify: data?.contactInfo?.isAlternateVerify,

                    },
                    urlFormData: data,
                    locationFormData: {
                        country: data.locationInfo?.country || '',
                        state: data.locationInfo?.state || '',
                        city: data.locationInfo?.city || '',
                        area: data.locationInfo?.area || '',
                        pincode: data.locationInfo?.pincode || '',
                        address: data.locationInfo?.address || ''
                    },
                    displayHours: data.displayHours,
                    businessHours: data.businessHours,
                    paymentOptions: data.paymentOptions,
                    bankerName: data.bankerName?._id,
                    keywordsFormData: data.keywords || [],
                    googleMapData: {
                        latitude: data.googleLocation?.latitude,
                        longitude: data.googleLocation?.longitude
                    },
                    socialLinksData: data.socialLinks,
                    businessImageList: data.businessImages || [],
                    logoImage: data.logo || '',
                    coverImage: data.coverImage || '',
                    attributes: data.attributes || {},
                    businessBrand: data.BusinessBrand
                }

                setInitialData(transformedData)

            } catch (err) {
                console.error('Failed to fetch listing:', err)
                setError('Failed to load listing data')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchListingData()
        }
    }, [id])


    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center'>
                    <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                    <p className='mt-2'>Loading listing data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center text-danger'>
                    <i className='fas fa-exclamation-circle fa-3x mb-3'></i>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <UpdateListingProvider initialData={initialData}>
            <EditListing tabContentList={tabContentList} />
        </UpdateListingProvider>
    )
}

export default EditListingPage
