// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import EnquirySetting from '@views/apps/enquiry/index'

const AllEnquiryTab = dynamic(() => import('@/views/apps/enquiry/all-enquiry/all'))
const PendingEnquiryTab = dynamic(() => import('@/views/apps/enquiry/all-enquiry/pending'))
const DoneEnquiryTab = dynamic(() => import('@/views/apps/enquiry/all-enquiry/done'))

// Vars
const tabContentList = () => ({
    allEnquiry: <AllEnquiryTab />,
    pendingEnquiry: <PendingEnquiryTab />,
    doneEnquiry: <DoneEnquiryTab />
})

const EnquirySettingsPage = () => {
    return <EnquirySetting tabContentList={tabContentList()} />
}

export default EnquirySettingsPage
