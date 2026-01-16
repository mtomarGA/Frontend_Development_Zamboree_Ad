"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"

import CustomTextField from "@/@core/components/mui/TextField"
import ColorOptionPicker from "../ColorOptionPicker"
import ImageOptionUploader from "../fileUploadSingle"
import FileUploaderMultiple from "../fileUploaderMultiple"
import { Grid } from "@mui/system"
import { useproductContext } from "@/contexts/productContext"

const VariationsTab = () => {
  const { handleFormChange, formData } = useproductContext()

  const [editVariantDialog, setEditVariantDialog] = useState({
    open: false,
    variant: null,
    index: -1
  })

  const [bulkEditState, setBulkEditState] = useState({
    selectedVariation: "",
    selectedOptions: [],
    bulkUpdateField: "", // New field to track which field to update
    bulkUpdateValue: "" // New field to track the value to set
  })

  // --- Variation Handlers ---
  const handleAddVariation = () => {
    const newVariation = {
      id: Date.now(),
      name: "",
      type: "text",
      options: [{ id: Date.now() + 1, label: "", value: "" }]
    }
    handleFormChange("productVariations", [
      ...(formData.productVariations || []),
      newVariation
    ])
  }

  const handleRemoveVariation = id => {
    handleFormChange(
      "productVariations",
      formData.productVariations.filter(v => v.id !== id)
    )
  }

  const handleVariationChange = (variationId, field, value) => {
    handleFormChange(
      "productVariations",
      formData.productVariations.map(v =>
        v.id === variationId ? { ...v, [field]: value } : v
      )
    )
  }

  const handleAddOption = variationId => {
    handleFormChange(
      "productVariations",
      formData.productVariations.map(v =>
        v.id === variationId
          ? {
            ...v,
            options: [...v.options, { id: Date.now(), label: "", value: "" }]
          }
          : v
      )
    )
  }

  const handleRemoveOption = (variationId, optionId) => {
    handleFormChange(
      "productVariations",
      formData.productVariations.map(v =>
        v.id === variationId
          ? { ...v, options: v.options.filter(o => o.id !== optionId) }
          : v
      )
    )
  }

  const handleOptionChange = (variationId, optionId, field, value) => {
    handleFormChange(
      "productVariations",
      formData.productVariations.map(v =>
        v.id === variationId
          ? {
            ...v,
            options: v.options.map(o =>
              o.id === optionId ? { ...o, [field]: value } : o
            )
          }
          : v
      )
    )
  }

  const generateVariants = () => {
    const variations = formData.productVariations
    if (!variations.length) return

    const cartesian = (a, b) =>
      [].concat(...a.map(d => b.map(e => [].concat(d, e))))

    const optionSets = variations.map(v =>
      v.options.map(o => ({
        name: `${v.name}: ${o.label}`,
        value: o.value,
        type: v.type
      }))
    )

    let combos = optionSets.reduce((a, b) => cartesian(a, b), [[]])

    const newVariants = combos.map((combo, index) => {
      const name = combo.map(c => c.name).join(" / ")
      const imageOption = combo.find(c => c.type === "image" && c.value)

      return {
        id: Date.now() + index,
        name,
        price: "",
        happeningPrice: "",
        sku: "",
        isDefault: index === 0, // Set first variant as default
        quantity: "",
        thumbnail: imageOption ? imageOption.value : "",
        images: []
      }
    })

    handleFormChange("variants", newVariants)
  }

  const handleRemoveVariant = id => {
    handleFormChange(
      "variants",
      formData.variants.filter(v => v.id !== id)
    )
  }

  const handleEditVariant = (variant, index) => {
    setEditVariantDialog({ open: true, variant: { ...variant }, index })
  }

  const handleSaveVariant = () => {
    const { variant, index } = editVariantDialog
    handleFormChange(
      "variants",
      formData.variants.map((v, i) => (i === index ? variant : v))
    )
    setEditVariantDialog({ open: false, variant: null, index: -1 })
  }

  // Handle default variant change
 const handleDefaultVariantChange = (variantId) => {
  const updatedVariants = formData.variants.map(variant => {
    // console.log(variant, "variant");
    return {
      ...variant,
      isDefault: variant.id||variant?._id === variantId
    };
  });

  handleFormChange("variants", updatedVariants);
};

  // Get selected variation object
  const getSelectedVariation = () => {
    return formData.productVariations?.find(v => v.name === bulkEditState.selectedVariation)
  }

  // Handle bulk edit variation change
  const handleBulkEditVariationChange = (variationName) => {
    setBulkEditState({
      selectedVariation: variationName,
      selectedOptions: [],
      bulkUpdateField: "",
      bulkUpdateValue: ""
    })
  }

  // Handle bulk edit option toggle
  const handleBulkEditOptionToggle = (optionLabel) => {
    setBulkEditState(prev => {
      const newSelectedOptions = prev.selectedOptions.includes(optionLabel)
        ? prev.selectedOptions.filter(opt => opt !== optionLabel)
        : [...prev.selectedOptions, optionLabel]

      return {
        ...prev,
        selectedOptions: newSelectedOptions
      }
    })
  }

  // Handle select all options for bulk edit
  const handleSelectAllOptions = () => {
    const variation = getSelectedVariation()
    if (variation) {
      const allOptionLabels = variation.options.map(opt => opt.label)
      setBulkEditState(prev => ({
        ...prev,
        selectedOptions: prev.selectedOptions.length === allOptionLabels.length ? [] : allOptionLabels
      }))
    }
  }

  // Handle bulk update field change
  const handleBulkUpdateFieldChange = (field) => {
    setBulkEditState(prev => ({
      ...prev,
      bulkUpdateField: field,
      bulkUpdateValue: ""
    }))
  }

  // Handle bulk update value change
  const handleBulkUpdateValueChange = (value) => {
    setBulkEditState(prev => ({
      ...prev,
      bulkUpdateValue: value
    }))
  }

  // Apply bulk update to selected variants
  const handleApplyBulkUpdate = () => {
    if (!bulkEditState.bulkUpdateField || bulkEditState.bulkUpdateValue === "") {
      return
    }

    const updatedVariants = formData.variants.map(variant => {
      // Check if this variant should be updated
      const shouldUpdate = bulkEditState.selectedVariation === "all" ||
        bulkEditState.selectedOptions.some(option =>
          variant.name.includes(`${bulkEditState.selectedVariation}: ${option}`)
        )

      if (shouldUpdate) {
        return {
          ...variant,
          [bulkEditState.bulkUpdateField]: bulkEditState.bulkUpdateValue
        }
      }
      return variant
    })



    handleFormChange("variants", updatedVariants)

    // Reset bulk update fields
    setBulkEditState(prev => ({
      ...prev,
      bulkUpdateField: "",
      bulkUpdateValue: ""
    }))
  }

  // Get default variant
  const getDefaultVariant = () => {
    return formData.variants?.find(v => v.isDefault === true) || formData.variants?.[0]
  }

  useEffect(() => {
    // Ensure at least one variant is set as default
    if (formData.variants?.length > 0 && !formData.variants.some(v => v.isDefault === true)) {
      handleFormChange(
        "variants",
        formData.variants.map((v, index) => ({
          ...v,
          isDefault: index === 0
        }))
      )
    }
  }, [formData.variants])

  const selectedVariation = getSelectedVariation()
  const defaultVariant = getDefaultVariant()

  return (
    <Card>
      <CardHeader
        className="bg-yellow-200"
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              sx={{
                mr: 2,
                color: "purple",
                "&.Mui-checked": { color: "red" }
              }}
              checked={formData.hasVariants}
              onChange={e => {
                const checked = e.target.checked
                handleFormChange("hasVariants", checked)
                if (!checked) {
                  handleFormChange("productVariations", [])
                  handleFormChange("variants", [])
                  setBulkEditState({
                    selectedVariation: "",
                    selectedOptions: [],
                    bulkUpdateField: "",
                    bulkUpdateValue: ""
                  })
                }
              }}
            />
            <Typography className="text-yellow-900">
              This product has Variations
            </Typography>
          </Box>
        }
      />

      {formData.hasVariants && (
        <CardContent>
          {/* =========================
              Default Variant + Bulk Edit
          ========================== */}
          {/* {formData.variants?.length > 0 && (
            
          )} */}

          {/* Variations Builder */}
          {(formData.productVariations || []).map(variation => (
            <Paper
              key={`var_${variation.id}`}
              sx={{ p: 3, mt: 4, position: "relative" }}
            >
              <IconButton
                aria-label="remove variation"
                onClick={() => handleRemoveVariation(variation.id)}
                sx={{ position: "absolute", top: 0, right: 8 }}
              >
                <i className="tabler-x" />
              </IconButton>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    fullWidth
                    label="Name*"
                    value={variation.name}
                    onChange={e =>
                      handleVariationChange(variation.id, "name", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label="Type*"
                    value={variation.type}
                    onChange={e =>
                      handleVariationChange(variation.id, "type", e.target.value)
                    }
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="color">Color</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                  </CustomTextField>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                Options
              </Typography>

              {(variation.options || []).map((option, optIndex) => (
                <Grid
                  container
                  spacing={2}
                  key={`opt_${option.id}`}
                  sx={{ mb: 1 }}
                >
                  <Grid size={{ xs: 12, md: 4 }}>
                    <CustomTextField
                      fullWidth
                      label="Label*"
                      value={option.label}
                      onChange={e =>
                        handleOptionChange(
                          variation.id,
                          option.id,
                          "label",
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  {variation.type === "color" && (
                    <Grid size={{ xs: 12, md: 4 }}>
                      <ColorOptionPicker
                        initialColor={option.value}
                        onChange={color =>
                          handleOptionChange(
                            variation.id,
                            option.id,
                            "value",
                            color
                          )
                        }
                        label={`Option ${optIndex + 1} Color`}
                      />
                    </Grid>
                  )}

                  {variation.type === "image" && (
                    <Grid item xs={12} md={4}>
                      <ImageOptionUploader
                        initialImageUrl={option.value}
                        onChange={url =>
                          handleOptionChange(
                            variation.id,
                            option.id,
                            "value",
                            url
                          )
                        }
                        label={`Option ${optIndex + 1} Image`}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      className="mt-5"
                      color="error"
                      onClick={() =>
                        handleRemoveOption(variation.id, option.id)
                      }
                      disabled={variation.options.length <= 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Button onClick={() => handleAddOption(variation.id)} sx={{ mt: 2 }}>
                Add Row
              </Button>
            </Paper>
          ))}

          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleAddVariation}>
              Add Variation
            </Button>
            <Button
              variant="outlined"
              onClick={generateVariants}
              disabled={!formData.productVariations.length}
            >
              Generate Variants
            </Button>
          </Box>

          {/* Variants Table */}
          {formData.variants.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Product Variants</Typography>
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Default Variant */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Default Variant
                    </Typography>
                    <CustomTextField
                      select
                      fullWidth
                      value={defaultVariant?.id || ""}
                      onChange={e => handleDefaultVariantChange(e.target.value)}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {formData.variants.map(v => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.name}
                          {v.isDefault && " (Default)"}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  {/* Bulk Edit */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Bulk Edit
                    </Typography>
                    <CustomTextField
                      select
                      fullWidth
                      value={bulkEditState.selectedVariation}
                      onChange={e => handleBulkEditVariationChange(e.target.value)}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      <MenuItem value="all">All Variants</MenuItem>
                      {formData.productVariations?.map(v => (
                        <MenuItem key={v.id} value={v.name}>
                          {v.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  {/* Bulk Update Field Selection - Shows when bulk edit is selected */}
                  {(bulkEditState.selectedVariation === "all" ||
                    (selectedVariation && bulkEditState.selectedOptions.length > 0)) && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, border: "1px solid #e0e0e0", mt: 2 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Bulk Update
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                              <CustomTextField
                                select
                                fullWidth
                                label="Field Type"
                                value={bulkEditState.bulkUpdateField}
                                onChange={e => handleBulkUpdateFieldChange(e.target.value)}
                              >
                                <MenuItem value="">Please Select</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                                <MenuItem value="happeningPrice">Special Price</MenuItem>
                                <MenuItem value="sku">SKU</MenuItem>
                                <MenuItem value="quantity">Stock Availability</MenuItem>
                              </CustomTextField>
                            </Grid>

                            {/* Dynamic input field based on selected field type */}
                            {bulkEditState.bulkUpdateField && (
                              <Grid size={{ xs: 12, md: 6 }}>
                                <CustomTextField
                                  fullWidth
                                  label={`Update ${bulkEditState.bulkUpdateField}`}
                                  value={bulkEditState.bulkUpdateValue}
                                  onChange={e => handleBulkUpdateValueChange(e.target.value)}
                                  type={bulkEditState.bulkUpdateField.includes("price") ||
                                    bulkEditState.bulkUpdateField === "quantity" ? "number" : "text"}
                                />
                              </Grid>
                            )}

                            {bulkEditState.bulkUpdateField && bulkEditState.bulkUpdateValue !== "" && (
                              <Grid item xs={12} md={4}>
                                <Button
                                  variant="contained"
                                  onClick={handleApplyBulkUpdate}
                                  fullWidth
                                >
                                  Apply Update
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      </Grid>
                    )}

                  {/* Bulk Edit - Options Selection */}
                  {selectedVariation && bulkEditState.selectedVariation !== "all" && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 3, border: "1px solid #e0e0e0" }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Select Options for {selectedVariation.name}
                        </Typography>

                        {/* Select All Option */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Checkbox
                            checked={
                              selectedVariation.options.length > 0 &&
                              bulkEditState.selectedOptions.length === selectedVariation.options.length
                            }
                            indeterminate={
                              bulkEditState.selectedOptions.length > 0 &&
                              bulkEditState.selectedOptions.length < selectedVariation.options.length
                            }
                            onChange={handleSelectAllOptions}
                          />
                          <Typography variant="body2">
                            Select All {selectedVariation.name} Options
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Individual Options */}
                        <Grid container spacing={2}>
                          {selectedVariation.options.map((option, index) => (
                            <Grid item xs={12} sm={6} md={4} key={option.id}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Checkbox
                                  checked={bulkEditState.selectedOptions.includes(option.label)}
                                  onChange={() => handleBulkEditOptionToggle(option.label)}
                                />
                                <Typography variant="body2">
                                  {option.label}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>


                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Zamboree Price</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Default</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData?.variants?.map((variant, index) => {
                      // console.log(variant, "asasasa");

                      return (
                        <TableRow key={variant.id}>
                          <TableCell>{variant.name}</TableCell>
                          <TableCell>{variant.price}</TableCell>
                          <TableCell>{variant.happeningPrice}</TableCell>
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>{variant.quantity}</TableCell>

                          <TableCell>
                            <Switch
                              checked={variant.isDefault === true}
                              onChange={() => handleDefaultVariantChange(variant.id||variant?._id)}
                              color="primary"
                            />
                          </TableCell>

                          <TableCell>
                            <IconButton onClick={() => handleEditVariant(variant, index)}>
                              <i className="tabler-edit" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveVariant(variant.id)}>
                              <i className="tabler-trash" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Edit Variant Dialog */}
          <Dialog
            open={editVariantDialog.open}
            onClose={() =>
              setEditVariantDialog({ open: false, variant: null, index: -1 })
            }
            maxWidth="md"
            fullWidth
          >

            <DialogTitle>Variant Details</DialogTitle>
            <DialogContent>
              {editVariantDialog.variant && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6">
                      {editVariantDialog.variant.name}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      fullWidth
                      label="Original MRP"
                      value={editVariantDialog.variant.price}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, "")
                        setEditVariantDialog(prev => ({
                          ...prev,
                          variant: { ...prev.variant, price: value }
                        }))
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      fullWidth
                      label="Zamboree Price"
                      value={editVariantDialog.variant.happeningPrice}
                      onChange={e => {
                        let value = e.target.value.replace(/\D/g, "")
                        const originalPrice = Number(
                          editVariantDialog.variant.price || 0
                        )
                        if (Number(value) > originalPrice) {
                          value = originalPrice.toString()
                        }
                        setEditVariantDialog(prev => ({
                          ...prev,
                          variant: { ...prev.variant, happeningPrice: value }
                        }))
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      fullWidth
                      label="SKU"
                      value={editVariantDialog.variant.sku}
                      onChange={e =>
                        setEditVariantDialog(prev => ({
                          ...prev,
                          variant: { ...prev.variant, sku: e.target.value }
                        }))
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      fullWidth
                      label="Available Stock"
                      value={editVariantDialog.variant.quantity}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, "")
                        setEditVariantDialog(prev => ({
                          ...prev,
                          variant: { ...prev.variant, quantity: value }
                        }))
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 12 }}>
                    <Box
                      sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 2 }}
                    >

                      <FileUploaderMultiple
                        maxFiles={6}
                        acceptedFormats={[
                          "image/jpeg",
                          "image/png",
                          "image/webp"
                        ]}
                        onFileSelect={urls =>
                          setEditVariantDialog(prev => ({
                            ...prev,
                            variant: { ...prev.variant, images: urls }
                          }))
                        }
                        initialImages={
                          editVariantDialog.variant?.images || []
                        }
                        thumbnailImage={editVariantDialog.variant.thumbnail || editVariantDialog.thumbnail}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() =>
                  setEditVariantDialog({
                    open: false,
                    variant: null,
                    index: -1
                  })
                }
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveVariant}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      )}
    </Card>
  )
}

export default VariationsTab
