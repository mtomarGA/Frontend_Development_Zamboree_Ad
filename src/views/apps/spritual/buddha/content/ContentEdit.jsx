'use client'

// React Imports
import { use, useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'


// Component Imports
import CustomTextField from '@core/components/mui/TextField'

import { Grid } from '@mui/system'
import { Editor } from '@/components/editor/Editor'
import FileUploader from '../setting/components/FileUploader'
import { MenuItem } from '@mui/material'
import ImageService from '@/services/imageService'
import hinduContentService from '@/services/spritual/hinduContent'
import { useParams, useRouter } from 'next/navigation'
import JainContentService from '@/services/spritual/jainContent'
import BuddhismContentService from '@/services/spritual/buddhaContent'





const ContentEdit = () => {
    const { id } = useParams()
    const router = useRouter()
    // States
    const [loading, setLoading] = useState(false)
    const [imageLoading, setimageLoading] = useState({
        web_image: false,
        mobile_image: false
    })
    const [html, setHtml] = useState("");

    const [data, setData] = useState({
        title: '',
        category: '',
        web_image: '',
        mobile_image: '',
        description: '',
    })
    const [errors, setErrors] = useState({
        title: '',
        category: '',
        web_image: '',
        mobile_image: '',
        description: '',
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await BuddhismContentService.getById(id);
            const content = response.data;
            setData({
                title: content.title || '',
                category: content.category || '',
                web_image: content.web_image || '',
                mobile_image: content.mobile_image || '',
                description: content.description || '',
            })
            setHtml(content.description || '');
        } catch (error) {
            console.error('Error fetching content:', error);

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (id) {
            fetchData();
        } else {
            setLoading(false);

        }
    }, [id])
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }))
    }
    useEffect(() => {
        handleChange({
            target: {
                name: 'description',
                value: html
            }
        })

    }, [html])
    const validateForm = () => {
        let isValid = true
        const newErrors = {}
        if (!data.title.trim()) {
            newErrors.title = 'Title is required'
            isValid = false
        }
        if (!data.category.trim()) {
            newErrors.category = 'Category is required'
            isValid = false
        }
        if (!data.web_image.trim()) {
            newErrors.web_image = 'Web Image is required'
            isValid = false
        }
        if (!data.mobile_image.trim()) {
            newErrors.mobile_image = 'Mobile Image is required'
            isValid = false
        }
        if (!html.trim()) {
            newErrors.description = 'Description is required'
            isValid = false
        }
        setErrors(newErrors)
        return isValid
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setData(prev => ({
            ...prev,
            description: html
        }))
        if (!validateForm()) {
            console.log('Form validation failed:', errors)
            setLoading(false)
            return
        }
        // Submit the form data
        await BuddhismContentService.update(id, data);
        router.push('/en/apps/spritual/buddha/content')


        console.log('Form submitted:', data)

    }

    const categoryList = [
        { value: "aarti_chalisa", label: "Aarti & Chalisa" },
        { value: "dharmik_gyaan", label: "Dharmik & Gyaan" },
        { value: "articles", label: "Articles" }
    ]


    return (
        <Grid className='' container>
            <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                <div>
                    <Typography variant='h4' className='mbe-1'>
                        Add Content
                    </Typography>
                </div>
            </div>
            <Grid className='w-full' item xs={12}>
                {loading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Typography variant='h6'>Loading...</Typography>
                    </div>
                ) : (
                    <Card>
                        <CardContent className='flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between flex-wrap'>
                            {/* create select with menu option */}

                            <CustomTextField
                                fullWidth
                                label='Title'
                                variant='outlined'
                                className='mb-4 sm:mb-0'
                                name='title'
                                placeholder='Enter title'
                                value={data.title}
                                onChange={handleChange}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                            <CustomTextField
                                fullWidth
                                select
                                label='Select Category'
                                className='mb-4 sm:mb-0'
                                variant='outlined'
                                name='category'
                                value={data.category}
                                error={!!errors.category}
                                helperText={errors.category}
                                onChange={handleChange}
                                slotProps={{
                                    select: {
                                        displayEmpty: true,
                                        renderValue: selected => {
                                            if (selected === '') {
                                                return <p>Select Category</p>
                                            }
                                            const selectedItem = categoryList.find(item => item.value === selected)
                                            return selectedItem ? (selectedItem.label) : ''
                                        }
                                    }
                                }}

                            >
                                {categoryList.map((data, index) => (
                                    <MenuItem key={index} value={data.value}>
                                        {data.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>


                            <FileUploader
                                key={'web_image'}
                                label={'Web Image'}
                                initialFile={data.web_image}
                                imageUploading={imageLoading.web_image}
                                setImageUploading={(value) =>
                                    setimageLoading((prev) => ({ ...prev, web_image: value }))
                                }
                                error_text={errors.web_image}
                                name='web_image'
                                onFileSelect={async (file) => {
                                    if (file) {
                                        setimageLoading(prev => ({ ...prev, web_image: true }));
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        const uploaded = await ImageService.uploadImage(formData, { folder: "Spiritual/Buddhism/Content" });
                                        handleChange({
                                            target: {
                                                name: 'web_image',
                                                value: uploaded.data.url
                                            }
                                        });
                                        setimageLoading(prev => ({ ...prev, web_image: false }));
                                    }

                                }} />
                            <FileUploader
                                key={'mobile_image'}
                                label={'Mobile Image'}
                                initialFile={data.mobile_image}
                                imageUploading={imageLoading.mobile_image}
                                error_text={errors.mobile_image}
                                setImageUploading={(value) =>
                                    setimageLoading((prev) => ({ ...prev, mobile_image: value }))
                                }
                                name='mobile_image'
                                onFileSelect={async (file) => {
                                    if (file) {
                                        setimageLoading((prev) => ({ ...prev, mobile_image: true }));
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        const uploaded = await ImageService.uploadImage(formData, { folder: "Spiritual/Buddhism/Content" });
                                        handleChange({
                                            target: {
                                                name: 'mobile_image',
                                                value: uploaded.data.url,
                                            },
                                        });
                                        setimageLoading((prev) => ({ ...prev, mobile_image: false }));
                                    }
                                }}
                            />


                            <Editor error={errors.description} htmlContent={html} setHtmlContent={setHtml} />
                            {/* position button to the right */}


                            <Grid className='flex justify-end w-full '>
                                <Button className=' mt-4 sm:mt-0' disabled={imageLoading.mobile_image || imageLoading.web_image || loading} variant='contained' color='primary' onClick={handleSubmit}>Update</Button>
                                <Button className=' mt-4 sm:mt-0 ms-2' variant='outlined' color='secondary' onClick={() => router.push('/apps/spritual/hinduism/content')}>Cancel</Button>
                            </Grid>
                        </CardContent>



                    </Card>
                )}

            </Grid>
        </Grid>
    )
}

export default ContentEdit;
