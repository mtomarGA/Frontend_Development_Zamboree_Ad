// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import ProductSetting from '@views/apps/product/add-product'

const ProductGroupTab = dynamic(() => import('@views/apps/product/add-product/product-group'))
const AddProductTab = dynamic(() => import('@views/apps/product/add-product/add-product'))
const RejectedProductTab = dynamic(() => import('@views/apps/product/add-product/rejected-product'))

// Vars
const tabContentList = () => ({
    productGroup: <ProductGroupTab />,
    addProduct: <AddProductTab />,
    rejectedProduct: <RejectedProductTab />
})

const ProductSettingsPage = () => {
    return <ProductSetting tabContentList={tabContentList()} />
}

export default ProductSettingsPage
