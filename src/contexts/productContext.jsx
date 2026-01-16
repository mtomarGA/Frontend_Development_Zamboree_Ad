'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import product1Service from '@/services/product/product1'
import { useParams } from 'next/navigation'
import SlugCheck from '@/services/product/product1'
// --- Initial State Definitions ---




const ProductFormContext = createContext()

export const ProductFormProvider = ({ children }) => {
    const params = useParams()
    const businessId = params?.id

    const [state, setstate] = useState()
    const [productData, setProductData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [categoryName, setCategoryName] = useState('')
    const [updateProductId, setProductId] = useState()

    const [formData, setFormData] = useState({
        businessId: businessId,
        productName: '',
        // thumbnail: '',
        images: [],
        price: '',
        happeningPrice: '',
        sku: '',
        quantity: '',
        categoryId: '',
        brand: "",
        description: '',
        attributes: {},
        gst: '',
        hsnCode: '',
        // shipingPrice: "",
        // length: '',
        // height: '',
        // width: '',
        // packageWeight: '',
        // countryOfOrigin: '',
        // manufacturerDetails: '',
        // packerDetails: '',
        // exchangeReturn: '',
        productVariations: [],
        // returnType: '',
        // replacement: '',
        variants: [],
        group: "",
        hasVariants: false,
        // metadescription: '',
        // metaTitle: '',
        // slug: '',
        // returnPolicy: '',
    })
    //countryOfOrigin
    useEffect(() => {
        if (formData.hasVariants) {
            // If variants enabled, clear price-related fields
            setFormData(prev => ({
                ...prev,
                price: '',
                happeningPrice: '',
                sku: '',
                quantity: '',
                // thumbnail: '',
                images: []
            }));
        }
        else {
            // If variants disabled, clear variant arrays
            setFormData(prev => ({
                ...prev,
                images: [],
                // thumbnail: '',
                variants: [],
                productVariations: []
            }));
        }
    }, [formData.hasVariants]);
    console.log(formData, "formDataformData");

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }


    const fetchProduct = async (productId, businessId) => {
        setProductId(productId)
        if (productId) {
            try {
                setLoading(true)
                const res = await product1Service.getProductById1(productId)
                const product = res.data


                if (product) {
                    const normalizedData = {
                        _id: product._id,
                        productName: product?.productName || '',
                        exchangeReturn: product.exchangeReturn || '',
                        gst: product.gst || '',
                        brand: product?.brand,
                        hsnCode: product.hsnCode || '',
                        description: product.description || '',
                        price: product.price || 0,
                        happeningPrice: product.happeningPrice || 0,
                        categoryId: product.categoryId?._id || product.categoryId || '',
                        businessId: product.businessId?._id || product.businessId || businessId || '',
                        attributes: product.attributes || {},
                        hasVariants: product.hasVariants || false,
                        productVariations: product.productVariations || [],
                        variants: product.variants || [],
                        images: (product.images || []).map(img => img.url),
                        status: product.status || 'PENDING',
                        sku: product.sku || '',
                        group: product?.group,
                        // thumbnail: product?.thumbnail,
                        quantity: product.quantity || product.stockQuantity || 0,
                        length: product?.length || '',
                        height: product?.height || '',
                        width: product?.width || '',
                        packageWeight: product?.Weight || '',
                        shipingPrice: product?.shipingPrice || '',
                        returnType: product?.returnType || '',
                        replacement: product?.replacement || '',
                        returnPolicy: product?.returnPolicy || "",
                        countryOfOrigin: product?.countryOfOrigin || '',
                        manufacturerDetails: product?.manufacturerDetails || '',
                        packerDetails: product?.packerDetails || "",
                        metaTitle: product?.metaTitle || '',
                        metadescription: product?.metadescription || '',

                    }
                    setCategoryName(product?.categoryId)

                    setProductData(normalizedData)
                    setFormData(prev => ({ ...prev, ...normalizedData }));
                }
            } catch (err) {
                console.error('Error fetching product:', err)
                setError('Failed to load product data')
                toast.error('Failed to load product data')
            } finally {
                setLoading(false)
            }
        } else {
            // If no productId, create new product
            setLoading(false)
            setProductData({
                productName: '',
                exchangeReturn: 'NOT RETURN/EXCHANGE',
                gst: '',
                hsnCode: '',
                description: '',
                price: 0,
                happeningPrice: 0,
                categoryId: '',
                businessId: businessId || '',
                attributes: {},
                hasVariants: false,
                productVariations: [],
                variants: [],
                images: [],
                status: 'DRAFT',
                sku: '',
                quantity: 0,
            })
        }
    }







    const value = {
        state,
        setstate,
        fetchProduct,
        productData,
        setProductData,
        loading,
        updateProductId,
        error,
        handleFormChange,
        formData,
        setFormData,
        setCategoryName,
        categoryName
    }

    return (
        <ProductFormContext.Provider value={value}>
            {children}
        </ProductFormContext.Provider>
    )
}




export const useproductContext = () => {
    const context = useContext(ProductFormContext)
    if (!context) {
        throw new Error('useproductContext must be used within a ProductFormProvider')
    }
    return context
}
