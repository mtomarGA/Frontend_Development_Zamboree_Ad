'use client'

import { useState } from 'react'
// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { useRouter } from 'next/navigation'
import ProductGroupSelection from './ProductTabsDetails/ProductGroup'
import BasicInfoTab from './ProductTabsDetails/ProductBasicDetails'
import OverviewTab from './ProductTabsDetails/Product Information'
import GroupCategoryTab from './ProductTabsDetails/ProductBrand'
import { useproductContext } from '@/contexts/productContext'
import ImagesTab from './ProductTabsDetails/ImageTab'
import VariationsTab from './ProductTabsDetails/VariationsTab'
import ProductDetailsTab from './ProductTabsDetails/ProductDetails'
import ShippingTab from './ProductTabsDetails/Shipping'
import ManufacturingDetails from './ProductTabsDetails/ManufacturingDetails'
import SEODetails from './ProductTabsDetails/SEODetails'
import ProductAddAndUpdate from "@/services/product/product1"
import { toast } from 'react-toastify'

const AddEditProductForm = ({ productId }) => {
  

    const router = useRouter()
    const [activeTab, setActiveTab] = useState('basic')
    const { formData } = useproductContext()
    const tabOrder = ['basic', 'groupCategory', 'details', ]//'shipping', 'Manufacturing', 'seo'
    const currentTabIndex = tabOrder.indexOf(activeTab)
    const isFirstTab = currentTabIndex === 0
    const isLastTab = currentTabIndex === tabOrder.length - 1

    // Centralized validation function
    const validateTab = (tab) => {
        switch (tab) {
            case 'basic':
                if (!formData.hasVariants) {
                    const requiredFields = ['businessId', 'productName', 'images', 'price', 'happeningPrice', 'sku', 'quantity', 'categoryId'];
                    const isAnyEmpty = requiredFields.some(field => {
                        const value = formData[field];
                        return value === '' || value === undefined || (Array.isArray(value) && value.length === 0);
                    });
                    if (isAnyEmpty) {
                        toast.error('Please fill all required fields for basic product');
                        return false;
                    }
                } else {
                    const variantFieldsFilled = formData.variants?.length > 0 && formData.productVariations?.length > 0;
                    const basicFieldsFilled = ['businessId', 'categoryId', 'productName'].every(field => {
                        const value = formData[field];
                        return value !== '' && value !== undefined && (!Array.isArray(value) || value.length > 0);
                    });
                    if (!variantFieldsFilled || !basicFieldsFilled) {
                        toast.error('Please fill all required fields and add at least one variant and product variation');
                        return false;
                    }
                }
                break;

            case 'groupCategory':
                const requiredFieldsGroup = ['brand', 'description'];
                if (requiredFieldsGroup.some(field => !formData[field] || formData[field] === '')) {
                    toast.error('Please fill all required fields in Brand & Description');
                    return false;
                }
                break;

            case 'details':
                const requiredFieldsDetails = ['gst', 'hsnCode', 'height', 'length', 'width', 'packageWeight'];
                if (requiredFieldsDetails.some(field => !formData[field] || formData[field] === '')) {
                    toast.error('Please fill all required fields in Product Details');
                    return false;
                }
                break;

            case 'shipping':
                const requiredFieldsShipping = ['shipingPrice', 'returnPolicy'];
                if (requiredFieldsShipping.some(field => !formData[field] || formData[field] === '')) {
                    toast.error('Please fill all required fields in Shipping Details');
                    return false;
                }
                break;

            case 'Manufacturing':
                const requiredFieldsManufacturing = ['countryOfOrigin', 'manufacturerDetails', 'packerDetails'];
                if (requiredFieldsManufacturing.some(field => !formData[field] || formData[field] === '')) {
                    toast.error('Please fill all required fields in Manufacturing Details');
                    return false;
                }
                break;

            case 'seo':
                const seoFields = ['metaDescription', 'metaTitle', 'slug'];
                if (seoFields.some(field => !formData[field] || formData[field] === '')) {
                    toast.error('Please fill all required SEO fields');
                    return false;
                }
                break;

            default:
                return true;
        }
        return true;
    }

    // Tab click handler
    const handleTabChange = (event, newValue) => {
        const tabOrder = ['basic', 'groupCategory', 'details', 'shipping', 'Manufacturing', 'seo'];
        const currentTabIndex = tabOrder.indexOf(activeTab);
        const newTabIndex = tabOrder.indexOf(newValue);

        // Allow going back without validation
        if (newTabIndex < currentTabIndex) {
            setActiveTab(newValue);
            return;
        }

        // Only validate if going forward
        if (validateTab(activeTab)) {
            setActiveTab(newValue);
        }
    };

    const goToNextTab = () => {
        if (validateTab(activeTab) && !isLastTab) {
            setActiveTab(tabOrder[currentTabIndex + 1])
        }
    }

    const goToPrevTab = () => {
        if (!isFirstTab) {
            setActiveTab(tabOrder[currentTabIndex - 1])
        }
    }

    const handleSubmit = async () => {
        if (productId) {
        
            const result = await ProductAddAndUpdate.updateProduct1(productId,formData)

            toast.success(result.data.businessId?._id ? 'Product created successfully' : 'Failed to create product')
             router.push(`/en/apps/product1/add-product/${result.data.businessId?._id}`);
        } else {
            console.log(formData,"Sasasasas");
            
            const result = await ProductAddAndUpdate.addProduct1(formData)

            toast.success(result.data.businessId?._id ? 'Product created successfully' : 'Failed to create product')
             router.push(`/en/apps/product1/add-product/${result.data.businessId?._id}`);
        }
    }

    const isSubmitDisabled =
        activeTab === 'seo' &&
        (!formData.slug);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="product form tabs">
                        <Tab label="Product Identity" value="basic" />
                        <Tab label="Product Description" value="groupCategory" />
                        <Tab label="Tax details" value="details" />
                        {/* <Tab label="Shipping Details" value="shipping" />
                        <Tab label="Manufaturing Details" value="Manufacturing" />
                        <Tab label="Product SEO" value="seo" /> */}
                    </TabList>
                </Box>

                <TabPanel value="basic" sx={{ p: 0 }} className='flex gap-7 flex-col'>
                    <ProductGroupSelection />
                    <BasicInfoTab />
                    <VariationsTab />
                    <OverviewTab />
                    <ImagesTab />
                </TabPanel>

                <TabPanel value="groupCategory" sx={{ p: 0 }} className='flex gap-7 flex-col'>
                    <GroupCategoryTab />
                </TabPanel>

                <TabPanel value="details" sx={{ p: 0, mt: 3 }}>
                    <ProductDetailsTab />
                </TabPanel>

                <TabPanel value="shipping" sx={{ p: 0, mt: 3 }}>
                    <ShippingTab />
                </TabPanel>

                <TabPanel value="Manufacturing" sx={{ p: 0, mt: 3 }}>
                    <ManufacturingDetails />
                </TabPanel>

                <TabPanel value="seo" sx={{ p: 0, mt: 3 }}>
                    <SEODetails />
                </TabPanel>
            </TabContext>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                {!isFirstTab && (
                    <Button
                        variant="outlined"
                        onClick={goToPrevTab}
                        startIcon={<i className="tabler-arrow-left" />}
                    >
                        Previous
                    </Button>
                )}

                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    {!isLastTab ? (
                        <Button
                            variant="contained"
                            onClick={goToNextTab}
                            endIcon={<i className="tabler-arrow-right" />}
                        >
                            Save & Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<i className="tabler-check" />}
                            disabled={isSubmitDisabled}
                        >
                            {productId ? 'Update ' : 'Submit'}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default AddEditProductForm
