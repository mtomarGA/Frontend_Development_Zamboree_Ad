// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import RatingSetting from '@views/apps/rating/index'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

const AllRatingTab = dynamic(() => import('@/views/apps/rating/all-rating/all'))
const PendingRatingTab = dynamic(() => import('@/views/apps/rating/all-rating/pending'))
const DoneRatingTab = dynamic(() => import('@/views/apps/rating/all-rating/done'))

// Vars
const tabContentList = () => ({
    allRating: <AllRatingTab />,
    pendingRating: <PendingRatingTab />,
    doneRating: <DoneRatingTab />
})

const RatingSettingPage = () => {
    return (
        <ProtectedRoute permission={'business_rating:view'}>
            <RatingSetting tabContentList={tabContentList()} />
        </ProtectedRoute>
    )
}

export default RatingSettingPage
