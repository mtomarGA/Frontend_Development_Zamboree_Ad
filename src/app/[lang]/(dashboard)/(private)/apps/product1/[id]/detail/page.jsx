'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import productService from "@/services/product/product"
import product1Service from '@/services/product/product1'
import AddEditProductForm from '@views/apps/product1/detail/page'
import { ProductFormProvider, useproductContext } from '@/contexts/productContext'


const PageWrapper = () => {
    return (
        <ProductFormProvider >
            <AddEditProductPage />
        </ProductFormProvider>
    )
}


const AddEditProductPage = () => {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { fetchProduct, productData, setProductData, loading, error } = useproductContext()
    const businessId = params?.id
    const productId = searchParams.get('id')


    useEffect(() => {
        fetchProduct(productId)
    }, [productId, businessId])

    if (loading) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                    <CircularProgress className="mb-4" />
                    <Typography variant='h6'>
                        Loading Product Data...
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="text-center">
                    <Typography variant='h4' className='mb-4 text-center text-error'>
                        Error
                    </Typography>
                    <Typography className='mb-6'>{error}</Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography className="text-2xl font-semibold mb-6 text-center">
                    {productId ? "Update Product" : "Add New Product"}
                </Typography>

                {productData && (
                    <AddEditProductForm
                        productData={productData}
                        productId={productId}
                        businessId={businessId}
                        isEditMode={!!productId}
                    />
                )}
            </CardContent>
        </Card>
    )
}

export default PageWrapper
