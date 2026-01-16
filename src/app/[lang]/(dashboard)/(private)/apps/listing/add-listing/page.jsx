// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AddListing from '@views/apps/listing/add-listing'
import { AddListingProvider } from '@/hooks/useAddListingForm'

const CompanyDetailTab = dynamic(() => import('@/views/apps/listing/add-listing/companyDetail'))
const PersonalizedUrlTab = dynamic(() => import('@/views/apps/listing/add-listing/personalizedUrl'))
// const LocationInfoTab = dynamic(() => import('@/views/apps/listing/add-listing/LocationInfo'))
const TimingPaymentTab = dynamic(() => import('@/views/apps/listing/add-listing/TimingPayment'))
const KeywordsTab = dynamic(() => import('@/views/apps/listing/add-listing/Keywords'))
const ImagesTab = dynamic(() => import('@/views/apps/listing/add-listing/Images/index1'))
const GoogleMapTab = dynamic(() => import('@/views/apps/listing/add-listing/GoogleMap'))
const SocialLinksMap = dynamic(() => import('@/views/apps/listing/add-listing/SocialLink'))
const SecurityMap = dynamic(() => import('@/views/apps/listing/add-listing/Security'))
const BillingPlansTab = dynamic(() => import('@views/apps/listing/add-listing/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/listing/add-listing/notifications'))

// Vars
const tabContentList = () => ({
  companyDetail: <CompanyDetailTab />,
  personalizedUrl: <PersonalizedUrlTab />,
  // locationInfo: <LocationInfoTab />,
  timingPayment: <TimingPaymentTab />,
  keywords: <KeywordsTab />,
  images: <ImagesTab />,
  googleMap: <GoogleMapTab />,
  socialLinks: <SocialLinksMap />,
  security: <SecurityMap />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />
})


const AddListingPage = () => {
  return (<AddListingProvider> <AddListing tabContentList={tabContentList()} /></AddListingProvider>)
}

export default AddListingPage
