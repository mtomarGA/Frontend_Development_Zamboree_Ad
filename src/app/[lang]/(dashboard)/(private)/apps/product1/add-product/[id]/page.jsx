// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import ProductSetting from '@views/apps/product1/add-product'

const AddProductTab = dynamic(() => import('@views/apps/product1/add-product/add-product'))
const PendingProductTab = dynamic(() => import('@views/apps/product1/add-product/pending-product'))
const RejectedProductTab = dynamic(() => import('@views/apps/product1/add-product/rejected-product'))

// Vars
const tabContentList = () => ({
    addProduct: <AddProductTab />,
    pendingProduct: <PendingProductTab />,
    rejectedProduct: <RejectedProductTab />
})

const ProductSettingsPage = () => {
    return <ProductSetting tabContentList={tabContentList()} />
}

export default ProductSettingsPage
