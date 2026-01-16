'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Tab, Box, Typography, Chip, List, ListItem, ListItemText, MenuItem, Button, Paper, IconButton, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Collapse, Grid2, Card, CardMedia, CardContent, CardActions } from '@mui/material'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderMultiple from './fileUploaderMultiple'
import productCategoryService from '@/services/product/productCategory'
import attributeService from '@/services/attribute/attribute.service'
import { v4 as uuidv4 } from 'uuid';
import ImageOptionUploader from './fileUploadSingle'
import ColorOptionPicker from './ColorOptionPicker';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import product1Service from '@/services/product/product1'
import { useParams, useRouter } from 'next/navigation'
import ProductImagesDisplay from './imageDisplay'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)
    useEffect(() => { setValue(initialValue) }, [initialValue])
    useEffect(() => {
        const timeout = setTimeout(() => { onChange(value) }, debounce)
        return () => clearTimeout(timeout)
    }, [value])
    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const AddEditProductForm = ({ initialProductData, productId, onFormSubmit, businessId }) => {
    const initialFormState = {
        businessId,
        gst: '',
        hsnCode: '',
        weight: '',
        styleCode: '',
        exchange: '',
        name: '',
        description: '',
        categoryId: '',
        stock: '',
        actualPrice: '',
        offerPrice: '',
        status: 'PENDING',
        images: [],
        productVariations: [],
        variants: [],
        attributes: []
    }
    // console.log(initialProductData.images, "images images images");

    const animatedComponents = makeAnimated();
    const router = useRouter()

    const [tab, setTab] = useState(0)
    const [formData, setFormData] = useState(initialFormState)
    const [categorySearchQuery, setCategorySearchQuery] = useState('')
    const [categorySearchResults, setCategorySearchResults] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [showVariants, setShowVariants] = useState(false)
    const [selectedVariants, setSelectedVariants] = useState([])
    const [attributeList, setAttributeList] = useState([])
    const [showImages, setShowImages] = useState([])


    useEffect(() => {
        if (categorySearchQuery.trim()) {
            searchCategory(categorySearchQuery)
        } else {
            setCategorySearchResults([])
        }
    }, [categorySearchQuery])

    useEffect(() => {
        if (initialProductData) {
            const mappedAttributes = initialProductData.attributes?.map(attr => ({
                attributeId: attr.attributeId,
                name: attr.name,
                selectedValues: attr.values || [],
                availableValues: attr.values?.map(val => ({ value: val, label: val })) || []
            })) || [];

            const mappedVariations = initialProductData.productVariations?.map(variation => ({
                id: variation.id || uuidv4(),
                name: variation.name,
                type: variation.type,
                options: variation.options.map(option => ({
                    id: option.id || uuidv4(),
                    label: option.label,
                    value: option.value || option.label
                }))
            })) || [];

            const mappedVariants = initialProductData.variants?.map(variant => ({
                id: variant.id || uuidv4(),
                combination: variant.combination.map(comb => ({
                    variationId: comb.variationId,
                    variationName: comb.variationName,
                    variationType: comb.variationType,
                    optionId: comb.optionId,
                    optionLabel: comb.optionLabel,
                    optionValue: comb.optionValue
                })),
                sku: variant.sku,
                price: variant.price,
                specialPrice: variant.specialPrice,
                trackInventory: variant.trackInventory !== false,
                quantity: variant.quantity || 0
            })) || [];

            setFormData(prev => ({
                ...initialFormState,
                ...initialProductData,
                productVariations: mappedVariations,
                categoryId: initialProductData.categoryId?._id || '',
                images: initialProductData.images.map(img => img.url || img),
                variants: mappedVariants,
                attributes: mappedAttributes
            }));

            setShowImages(initialProductData?.images)

            if (initialProductData.categoryId) {
                setSelectedCategories([{
                    _id: initialProductData.categoryId._id,
                    name: initialProductData.categoryId.name,
                    image: initialProductData.categoryId.image,
                    parents: []
                }]);

                attributeService.getAttributeByCatId(initialProductData.categoryId._id)
                    .then(res => setAttributeList(res.data))
                    .catch(err => console.error("Error fetching attributes:", err));
            }

            if (initialProductData.variants?.length > 0) {
                setShowVariants(true);
            }
        }
    }, [initialProductData]);

    useEffect(() => {
        if (formData.productVariations?.length > 0) {
            generateVariants();
        } else {
            setFormData(prev => ({ ...prev, variants: [] }));
        }
    }, [formData.productVariations]);

    const generateVariants = () => {
        if (formData.productVariations.length === 0) {
            setFormData(prev => ({ ...prev, variants: [] }));
            return;
        }

        const validVariations = formData.productVariations.filter(
            variation => variation.options && variation.options.length > 0
        );

        const combinations = cartesianProduct(
            validVariations.map(variation =>
                variation.options
                    .filter(option => option.label.trim() !== '')
                    .map(option => ({
                        variationId: variation.id,
                        variationName: variation.name,
                        variationType: variation.type,
                        optionId: option.id,
                        optionLabel: option.label,
                        optionValue: option.value || option.label
                    }))
            )
        ).filter(combination => combination.length === validVariations.length);

        const newVariants = combinations.map(combination => {
            // Try to find matching existing variant
            const existingVariant = formData.variants.find(v =>
                v.combination &&
                v.combination.length === combination.length &&
                v.combination.every(vComb =>
                    combination.some(cComb =>
                        vComb.optionId === cComb.optionId
                    )
                )
            );

            return existingVariant || {
                id: uuidv4(),
                combination: combination,
                sku: '',
                price: formData.actualPrice || '',
                specialPrice: '',
                trackInventory: true,
                quantity: 0
            };
        });

        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const cartesianProduct = (arrays) => {
        return arrays.reduce((acc, curr) =>
            acc.flatMap(x => curr.map(y => [...x, y])),
            [[]]
        ).filter(arr => arr.length > 0);
    };

    const searchCategory = async (query) => {
        try {
            const res = await productCategoryService.searchCategory(query)
            if (res?.data) setCategorySearchResults(res.data)
        } catch (err) {
            toast.error('Category search failed')
        }
    }

    const handleCategorySelect = async (cat) => {
        setSelectedCategories([cat]); // Only keep one category
        setFormData(prev => ({
            ...prev,
            categoryId: cat._id // Store single ID instead of array
        }));

        // Fetch attributes for the selected category
        const resp = await attributeService.getAttributeByCatId(cat._id);
        console.log(resp.data, "data data data ");
        setAttributeList(resp.data);

        setCategorySearchQuery('');
        setCategorySearchResults([]);
    };

    const handleRemoveCategory = (id) => {
        setSelectedCategories([]);
        setFormData(prev => ({
            ...prev,
            categoryId: ''
        }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileSelect = (fileUrls) => {
        setFormData(prev => ({ ...prev, images: fileUrls }))
    }

    const handleCoverImageUpdate = (updatedImages) => {
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.categoryId) {
            return toast.error("Please select a category");
        }

        if (formData.images.length === 0) {
            return toast.error("Please upload at least one product image");
        }

        // Prepare payload
        const payload = {
            ...formData,
            variants: formData.variants.map(v => ({
                ...v,
                price: Number(v.price),
                specialPrice: v.specialPrice ? Number(v.specialPrice) : null,
                quantity: v.trackInventory ? Number(v.quantity) : 0
            })),
            attributes: formData.attributes.map(attr => ({
                attributeId: attr.attributeId,
                name: attr.name,
                values: Array.isArray(attr.selectedValues) ?
                    attr.selectedValues :
                    [attr.selectedValues].filter(Boolean)
            }))
        };

        try {
            let response;
            if (initialProductData) {
                response = await product1Service.updateProduct1(productId, payload);
                router.push(`/en/apps/product1/add-product/${businessId}`)
                toast.success("Product updated successfully");
            } else {
                response = await product1Service.addProduct1(payload);
                router.push(`/en/apps/product1/add-product/${businessId}`)
                toast.success("Product created successfully");
            }

            // onFormSubmit(response.data);
        } catch (error) {
            console.error("Operation failed:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const renderCategorySearchResult = (cat) => {
        const fullPath = [...(cat.parents || []), cat.name].join(' > ')
        return (
            <ListItem key={cat._id} onClick={() => handleCategorySelect(cat)} sx={{ pl: 2 }}>
                <ListItemText primary={fullPath} />
            </ListItem>
        )
    }

    // --- Variation Handlers ---
    const handleAddVariation = () => {
        setFormData(prev => ({
            ...prev,
            productVariations: [
                ...(prev.productVariations || []),
                { id: uuidv4(), name: '', type: 'text', options: [{ id: uuidv4(), label: '', value: '' }] }
            ]
        }));
    };

    const handleRemoveVariation = (variationId) => {
        setFormData(prev => ({
            ...prev,
            productVariations: (prev.productVariations || []).filter(v => v.id !== variationId)
        }));
    };

    const handleVariationChange = (variationId, field, value) => {
        setFormData(prev => ({
            ...prev,
            productVariations: (prev.productVariations || []).map(v =>
                v.id === variationId ? { ...v, [field]: value } : v
            )
        }));
    };

    const handleAddOption = (variationId) => {
        setFormData(prev => ({
            ...prev,
            productVariations: (prev.productVariations || []).map(v =>
                v.id === variationId
                    ? { ...v, options: [...(v.options || []), { id: uuidv4(), label: '', value: '' }] }
                    : v
            )
        }));
    };

    const handleRemoveOption = (variationId, optionId) => {
        setFormData(prev => ({
            ...prev,
            productVariations: (prev.productVariations || []).map(v =>
                v.id === variationId
                    ? { ...v, options: (v.options || []).filter(o => o.id !== optionId) }
                    : v
            )
        }));
    };

    const handleOptionChange = (variationId, optionId, field, value) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                productVariations: (prev.productVariations || []).map(v =>
                    v.id === variationId
                        ? {
                            ...v,
                            options: (v.options || []).map(o =>
                                o.id === optionId ? { ...o, [field]: value } : o
                            )
                        }
                        : v
                )
            };
            return updated;
        });

        setTimeout(() => {
            if (formData.productVariations?.length > 0) {
                generateVariants();
            }
        }, 100);
    };

    // --- Variant Handlers ---
    const toggleVariants = () => {
        setShowVariants(!showVariants);
        if (!showVariants && formData.productVariations.length > 0) {
            generateVariants();
        }
    };

    const handleVariantChange = (variantId, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.id === variantId ? { ...v, [field]: value } : v
            )
        }));
    };

    // const handleSelectAllVariants = (event) => {
    //     if (event.target.checked) {
    //         const newSelected = formData.variants.map(v => v.id);
    //         setSelectedVariants(newSelected);
    //         return;
    //     }
    //     setSelectedVariants([]);
    // };

    // const handleSelectVariant = (event, id) => {
    //     const selectedIndex = selectedVariants.indexOf(id);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selectedVariants, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selectedVariants.slice(1));
    //     } else if (selectedIndex === selectedVariants.length - 1) {
    //         newSelected = newSelected.concat(selectedVariants.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selectedVariants.slice(0, selectedIndex),
    //             selectedVariants.slice(selectedIndex + 1)
    //         );
    //     }

    //     setSelectedVariants(newSelected);
    // };

    // const handleBulkEdit = (field, value) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         variants: prev.variants.map(v =>
    //             selectedVariants.includes(v.id) ? { ...v, [field]: value } : v
    //         )
    //     }));
    // };

    // // --- Attribute Handlers ---
    // const handleAddAttribute = () => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: [
    //             ...(prev.attributes || []),
    //             {
    //                 id: uuidv4(),
    //                 attributeId: '',
    //                 name: '',
    //                 selectedValues: [],
    //                 availableValues: []
    //             }
    //         ]
    //     }));
    // };

    // const handleAttributeSelect = (selectedOption, attrIndex) => {
    //     const selectedAttribute = attributeList.find(attr => attr._id === selectedOption.value);
    //     if (!selectedAttribute) return;

    //     setFormData(prev => {
    //         const updatedAttributes = [...prev.attributes];
    //         updatedAttributes[attrIndex] = {
    //             ...updatedAttributes[attrIndex],
    //             attributeId: selectedAttribute._id,
    //             name: selectedAttribute.name,
    //             selectedValues: [],
    //             availableValues: selectedAttribute.values.map(val => ({
    //                 value: val.text,
    //                 label: val.text
    //             }))
    //         };
    //         return { ...prev, attributes: updatedAttributes };
    //     });
    // };

    // const handleValueSelect = (selectedOptions, attrIndex) => {
    //     setFormData(prev => {
    //         const updatedAttributes = [...prev.attributes];
    //         updatedAttributes[attrIndex] = {
    //             ...updatedAttributes[attrIndex],
    //             selectedValues: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    //         };
    //         return { ...prev, attributes: updatedAttributes };
    //     });
    // };

    // const handleRemoveAttribute = (attributeId) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: (prev.attributes || []).filter(a => a.id !== attributeId)
    //     }));
    // };

    // const handleAttributeChange = (attributeId, field, value) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: (prev.attributes || []).map(a =>
    //             a.id === attributeId ? { ...a, [field]: value } : a
    //         )
    //     }));
    // };

    // const handleAddAttributeValue = (attributeId) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: (prev.attributes || []).map(a =>
    //             a.id === attributeId
    //                 ? { ...a, values: [...(a.values || []), ''] }
    //                 : a
    //         )
    //     }));
    // };

    // const handleRemoveAttributeValue = (attributeId, valueIndex) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: (prev.attributes || []).map(a =>
    //             a.id === attributeId
    //                 ? { ...a, values: (a.values || []).filter((_, i) => i !== valueIndex) }
    //                 : a
    //         )
    //     }));
    // };

    // const handleAttributeValueChange = (attributeId, valueIndex, value) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         attributes: (prev.attributes || []).map(a =>
    //             a.id === attributeId
    //                 ? {
    //                     ...a,
    //                     values: (a.values || []).map((v, i) =>
    //                         i === valueIndex ? value : v
    //                     )
    //                 }
    //                 : a
    //         )
    //     }));
    // };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 4 }}>
                <Tab label="Categories" />
                <Tab label="Product Details" />
            </Tabs>

            {tab === 0 && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={4} alignItems="stretch" sx={{ flexGrow: 1 }}>
                        {/* Left Column for Category Selection */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <DebouncedInput fullWidth label='Search & Select Category*' placeholder='Search category name' value={categorySearchQuery} onChange={setCategorySearchQuery} className='mb-2' />
                                {categorySearchResults.length > 0 && categorySearchQuery.trim() !== '' && (
                                    <List sx={{ zIndex: 10, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, boxShadow: 3, maxHeight: 200, overflow: 'auto', mt: 1 }}>
                                        {categorySearchResults.map(cat => renderCategorySearchResult(cat))}
                                    </List>
                                )}

                                {selectedCategories.length > 0 && (
                                    <>
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2">Selected Category</Typography>
                                            <Box className="flex gap-2 flex-wrap mt-1">
                                                {selectedCategories.slice(0, 1).map(cat => ( // Only show the first selected category
                                                    <Chip
                                                        key={cat._id}
                                                        label={[...(cat.parents || []), cat.name].join(' > ')}
                                                        onDelete={() => handleRemoveCategory(cat._id)}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2">Category Preview Image</Typography>
                                            <Box
                                                sx={{
                                                    mt: 1,
                                                    height: 300,
                                                    border: '1px dashed #ccc',
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#f8f8f8',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {selectedCategories &&
                                                    selectedCategories[0] &&
                                                    selectedCategories[0].image ? (
                                                    <Box
                                                        component="img"
                                                        src={selectedCategories[0].image}
                                                        alt={`${selectedCategories[0].name} preview`}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = ''; // or set a fallback placeholder URL
                                                        }}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <Typography color="text.secondary" textAlign="center">
                                                        {selectedCategories &&
                                                            selectedCategories[0] &&
                                                            selectedCategories[0].name
                                                            ? `${selectedCategories[0].name} Image Preview (optional)`
                                                            : 'Image Preview (optional)'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Grid>

                        {/* Right Column for Image Upload */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#ffffff', boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                                    Product Images
                                </Typography>
                                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Image Upload Guidelines
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                        <Typography component="li" variant="body2">• Upload clear, high-resolution images</Typography>
                                        <Typography component="li" variant="body2">• Only JPG, PNG, or WEBP formats allowed</Typography>
                                        <Typography component="li" variant="body2">• Minimum resolution: 800x600 pixels</Typography>
                                        <Typography component="li" variant="body2">• Maximum 5 images allowed</Typography>
                                        <Typography component="li" variant="body2">• Avoid watermarks or logos</Typography>
                                        <Typography component="li" variant="body2">• Keep file size below 2MB per image</Typography>
                                    </Box>
                                </Box>
                                <ProductImagesDisplay
                                    showImages={showImages}
                                    productId={productId}
                                    onCoverImageUpdate={handleCoverImageUpdate}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {tab === 1 && (
                <Grid container spacing={4} sx={{ flexGrow: 1 }}>
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* <Typography variant="h6" sx={{ mb: 3 }}>General</Typography> */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        fullWidth
                                        label="GST*"
                                        placeholder="Enter GST"
                                        value={formData.gst}
                                        onChange={handleChange}
                                        name="gst"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        fullWidth
                                        label="HSN Code*"
                                        placeholder="Enter HSN Code"
                                        value={formData.hsnCode}
                                        onChange={handleChange}
                                        name="hsnCode"
                                    >
                                    </CustomTextField>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        fullWidth
                                        label="Weight*"
                                        placeholder="Enter Weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        name="weight"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        fullWidth
                                        label="Style Code/Product Id*"
                                        placeholder="Enter Style Code/Product Id"
                                        type="text"
                                        value={formData.styleCode}
                                        onChange={handleChange}
                                        name="styleCode"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        fullWidth
                                        label="Product Name*"
                                        placeholder="Enter Product Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        name="name"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField
                                        select
                                        fullWidth
                                        label="Exchange/Return*"
                                        name="exchange"
                                        value={formData.exchange}
                                        onChange={handleChange}
                                    >
                                        {["RETURNABLE", "EXCHANGE", "NOT RETURN/EXCHANGE"].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
                                </Grid>

                            </Grid>
                            {/* Product Description */}
                            <CustomTextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Product Description*"
                                value={formData.description}
                                onChange={handleChange}
                                name="description"
                                sx={{ my: 4 }}
                            />

                            {/* --- Variations Section --- */}
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 4, borderBottomWidth: '4px' }} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bolder py-2' color='primary'>Variations</Typography>
                            </Grid>
                            {(formData.productVariations || []).map((variation, varIndex) => (
                                <Paper key={`var_${variation.id}`} elevation={2} sx={{ p: 3, mb: 4, position: 'relative' }}>
                                    <IconButton
                                        aria-label="remove variation"
                                        onClick={() => handleRemoveVariation(variation.id)}
                                        sx={{ position: 'absolute', top: 0, right: 8 }}
                                    >
                                        <i className="tabler-x" />
                                    </IconButton>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                fullWidth
                                                label="Name*"
                                                placeholder="e.g., Color, Size"
                                                value={variation.name}
                                                onChange={(e) => handleVariationChange(variation.id, 'name', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                select
                                                fullWidth
                                                label="Type*"
                                                value={variation.type}
                                                onChange={(e) => handleVariationChange(variation.id, 'type', e.target.value)}
                                            >
                                                <MenuItem value="text">Text</MenuItem>
                                                <MenuItem value="color">Color</MenuItem>
                                                <MenuItem value="image">Image</MenuItem>
                                            </CustomTextField>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>Options</Typography>
                                    {(variation.options || []).map((option, optIndex) => (
                                        <Grid container spacing={2} key={`opt_${option.id}`} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={variation.type === 'color' ? 5 : (variation.type === 'image' ? 5 : 9)}>
                                                <CustomTextField
                                                    fullWidth
                                                    label="Label*"
                                                    placeholder="e.g., Red, Small, Cotton, Front View"
                                                    value={option.label}
                                                    onChange={(e) => handleOptionChange(variation.id, option.id, 'label', e.target.value)}
                                                />
                                            </Grid>

                                            {variation.type === 'color' && (
                                                <Grid item xs={4} >
                                                    <ColorOptionPicker
                                                        initialColor={option.value}
                                                        onChange={(hexColor) => handleOptionChange(variation.id, option.id, 'value', hexColor)}
                                                        label={`Option ${optIndex + 1} Color`}
                                                    />
                                                </Grid>
                                            )}

                                            {variation.type === 'image' && (
                                                <Grid item xs={4} className='pt-5'>
                                                    <ImageOptionUploader
                                                        initialImageUrl={option.value}
                                                        onChange={(url) => handleOptionChange(variation.id, option.id, 'value', url)}
                                                        label={`Option ${optIndex + 1} Image`}
                                                    />
                                                </Grid>
                                            )}

                                            <Grid className='pt-5' item xs={variation.type === 'color' || variation.type === 'image' ? 3 : 3}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleRemoveOption(variation.id, option.id)}
                                                    disabled={(variation.options || []).length <= 1}
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        variant="outlined"
                                        startIcon={<i className="tabler-plus" />}
                                        onClick={() => handleAddOption(variation.id)}
                                        sx={{ mt: 2 }}
                                    >
                                        Add Row
                                    </Button>
                                </Paper>
                            ))}
                            <Grid container justifyContent="flex-start">
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button variant="contained" startIcon={<i className="tabler-plus" />} onClick={handleAddVariation} sx={{ mt: 3 }}>
                                        Add Variation
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Variants Section */}
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 4, borderBottomWidth: '4px' }} />
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant='h6' className='font-bolder py-2' color='primary'>
                                    Variants
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={toggleVariants}
                                    startIcon={<i className={`tabler-chevron-${showVariants ? 'up' : 'down'}`} />}
                                    disabled={!formData.productVariations?.length}
                                >
                                    {showVariants ? 'Hide Variants' : 'Show Variants'}
                                </Button>
                            </Box>

                            <Collapse in={showVariants}>
                                {formData.productVariations?.length > 0 ? (
                                    formData.variants?.length > 0 ? (
                                        <Box sx={{ mb: 3 }}>
                                            {/* Variants Table */}
                                            <TableContainer
                                                component={Paper}
                                                elevation={2}
                                                sx={{ maxHeight: 500, overflow: 'auto' }}
                                            >
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Variant</TableCell>
                                                            <TableCell>Zamboree Price</TableCell>
                                                            <TableCell>Price </TableCell>
                                                            <TableCell>Inventory</TableCell>
                                                            <TableCell>SKU</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {formData.variants.map((variant) => (
                                                            <TableRow
                                                                key={`variant_row_${variant.id}`}
                                                                hover
                                                                selected={selectedVariants.indexOf(variant.id) !== -1}
                                                            >
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        {variant.combination?.map((opt, i) => (
                                                                            <React.Fragment key={i}>
                                                                                {opt.variationType === 'color' && (
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: 16,
                                                                                            height: 16,
                                                                                            backgroundColor: opt.optionValue,
                                                                                            border: '1px solid #ddd',
                                                                                            borderRadius: '50%'
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                {opt.optionLabel}
                                                                                {i < variant.combination.length - 1 && <span>/</span>}
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <CustomTextField
                                                                            size="small"
                                                                            type="number"
                                                                            value={variant.specialPrice}
                                                                            onChange={(e) => handleVariantChange(variant.id, 'specialPrice', e.target.value)}
                                                                            inputProps={{ min: 0, step: 0.01 }}
                                                                            sx={{ minWidth: 100 }}
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <CustomTextField
                                                                        size="small"
                                                                        type="number"
                                                                        value={variant.price}
                                                                        onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                                                        inputProps={{ min: 0, step: 0.01 }}
                                                                        sx={{ minWidth: 100 }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Checkbox
                                                                                checked={variant.trackInventory}
                                                                                onChange={(e) => handleVariantChange(variant.id, 'trackInventory', e.target.checked)}
                                                                                size="small"
                                                                            />
                                                                            <Typography variant="body2">Track Inventory</Typography>
                                                                        </Box>
                                                                        {variant.trackInventory && (
                                                                            <CustomTextField
                                                                                size="small"
                                                                                type="number"
                                                                                value={variant.quantity}
                                                                                onChange={(e) => handleVariantChange(variant.id, 'quantity', e.target.value)}
                                                                                inputProps={{ min: 0 }}
                                                                                sx={{ minWidth: 100 }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <CustomTextField
                                                                        size="small"
                                                                        value={variant.sku}
                                                                        onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                                                                        sx={{ minWidth: 120 }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            No variants generated yet. Add options to your variations to generate variants.
                                        </Typography>
                                    )
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Please add some variations to generate variants
                                    </Typography>
                                )}
                            </Collapse>


                            {/* --- Attributes Section --- */}
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 4, borderBottomWidth: '4px' }} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bolder py-2' color='primary'>Attributes</Typography>
                            </Grid>

                            {attributeList.length > 0 ? (
                                <Grid container spacing={3}>
                                    {attributeList.map((attribute, attrIndex) => (
                                        <Grid item xs={12} sm={6} key={`attr_${attribute._id}_${attrIndex}`}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 3,
                                                    mb: 4,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fafafa'
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        mb: 2,
                                                        fontWeight: 600,
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    {attribute.name} {attribute.mandatory && <span style={{ color: 'red' }}>*</span>}
                                                </Typography>
                                                <Select
                                                    options={attribute.values.map(val => ({
                                                        value: val.text,
                                                        label: val.text
                                                    }))}
                                                    value={formData.attributes
                                                        .find(attr => attr.attributeId === attribute._id)
                                                        ?.selectedValues.map(val => ({ value: val, label: val }))[0] || null}
                                                    onChange={(selected) => {
                                                        const selectedValue = selected ? selected.value : null;
                                                        setFormData(prev => {
                                                            const existingIndex = prev.attributes.findIndex(
                                                                a => a.attributeId === attribute._id
                                                            );

                                                            if (existingIndex >= 0) {
                                                                const updatedAttributes = [...prev.attributes];
                                                                updatedAttributes[existingIndex] = {
                                                                    ...updatedAttributes[existingIndex],
                                                                    selectedValues: selectedValue ? [selectedValue] : []
                                                                };
                                                                return { ...prev, attributes: updatedAttributes };
                                                            } else {
                                                                return {
                                                                    ...prev,
                                                                    attributes: [
                                                                        ...prev.attributes,
                                                                        {
                                                                            id: uuidv4(),
                                                                            attributeId: attribute._id,
                                                                            name: attribute.name,
                                                                            selectedValues: selectedValue ? [selectedValue] : [],
                                                                            availableValues: attribute.values.map(v => v.text)
                                                                        }
                                                                    ]
                                                                };
                                                            }
                                                        });
                                                    }}
                                                    placeholder={`Select ${attribute.name}...`}
                                                    isMulti={false}
                                                    components={animatedComponents}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "No values available"}
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            minHeight: '44px',
                                                            borderColor: state.isFocused ? '#3f51b5' : '#ccc',
                                                            boxShadow: state.isFocused ? '0 0 0 1px #3f51b5' : 'none',
                                                            '&:hover': {
                                                                borderColor: state.isFocused ? '#3f51b5' : '#999'
                                                            }
                                                        }),
                                                        singleValue: (base) => ({
                                                            ...base,
                                                            color: '#1976d2',
                                                            fontWeight: 500
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            zIndex: 9999
                                                        }),
                                                        option: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: state.isSelected ? '#3f51b5' : state.isFocused ? '#f5f5f5' : 'white',
                                                            color: state.isSelected ? 'white' : 'inherit'
                                                        })
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No attributes available for selected categories
                                </Typography>
                            )}
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 4, borderBottomWidth: '4px' }} />
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Right Column (3 units): Image and Upload Guidelines */}
                    {/* <Grid item xs={12} md={3}>
                        <Paper elevation={1} sx={{ p: 3, height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ pb: 3 }}>
                                <b>Note :</b> Please Add Your Product Images And First Image Will Be Your Cover Image Later You Can Change Your Cover Image
                            </Typography>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    border: '1px dashed #ccc',
                                    borderRadius: 2,
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'top',
                                    minHeight: '150px',
                                    mb: 3,
                                    flexDirection: 'column'
                                }}
                            >
                                <FileUploaderMultiple
                                    initialFiles={(formData.images || []).map(img => ({
                                        url: img,
                                        name: img ? img.split('/').pop() : '',
                                        uploaded: true
                                    }))}
                                    onFileSelect={(files) => {
                                        const newImages = files.map(file => file.uploaded ? file.url : file);
                                        setFormData(prev => ({ ...prev, images: newImages }));
                                    }}
                                    error_text={!formData.images?.length ? 'At least one image is required' : ''}
                                    maxFiles={5}
                                    acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                                />
                            </Box>
                            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                                <Typography className='py-2' variant="subtitle1" sx={{ mb: 1 }}>
                                    Image Upload Guidelines
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography className='py-2' variant="body1">• Upload clear, high-resolution images</Typography>
                                        <Typography className='py-2' variant="body1">• Only JPG, PNG, or WEBP formats allowed</Typography>
                                        <Typography className='py-2' variant="body1">• Minimum resolution: 800x600 pixels</Typography>
                                        <Typography className='py-2' variant="body1">• Maximum 5 images allowed</Typography>
                                        <Typography className='py-2' variant="body1">• Avoid watermarks or logos</Typography>
                                        <Typography className='py-2' variant="body1">• Keep file size below 2MB per image</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid> */}
                </Grid>
            )}

            <Box className="flex justify-between mt-6">
                <Button
                    variant="outlined"
                    onClick={() => setTab((prev) => Math.max(0, prev - 1))}
                    disabled={tab === 0}
                >
                    Back
                </Button>
                {tab === 1 ? (
                    <Button type="submit" variant="contained">
                        {initialProductData ? 'Update Product' : 'Add Product'}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (!formData.categoryId) return toast.error("Please select a category")
                            setTab(1)
                        }}
                    >
                        Next
                    </Button>
                )}
            </Box>
        </form>
    )
}

export default AddEditProductForm
