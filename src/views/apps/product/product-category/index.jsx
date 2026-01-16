'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Material-UI Components
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Box, CardContent, IconButton, TextField, List, ListItem, ListItemText, Collapse, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

// Services and Components
import productCategoryService from '@/services/product/productCategory'
import AddProductCategory from '@/components/dialogs/product-category/index'

// Icons
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteConfirmationDialog from '../../deleteConfirmation'

// Styled ListItem for consistent row height and spacing
const StyledListItem = styled(ListItem)(({ theme, level }) => ({
    minHeight: '64px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    '&:last-child': {
        borderBottom: 'none',
    },
    backgroundColor: level % 2 === 0 ? theme.palette.action.hover : theme.palette.background.paper,
    paddingLeft: theme.spacing(2 + level * 2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
}))

const CategoryTreeItem = ({
    category,
    level = 0,
    onEditCategory,
    globalFilter,
    onAddSubcategory
}) => {
    const [open, setOpen] = useState(false)

    const matchesFilter = useMemo(() => {
        if (!globalFilter) return true
        const lowerCaseFilter = globalFilter.toLowerCase()

        const checkMatch = (node) => {
            if (node.name.toLowerCase().includes(lowerCaseFilter)) return true
            if (node.children) {
                for (const child of node.children) {
                    if (checkMatch(child)) return true
                }
            }
            return false
        }
        return checkMatch(category)
    }, [category, globalFilter])

    useEffect(() => {
        if (globalFilter) {
            if (matchesFilter && category.children && category.children.length > 0) {
                setOpen(true)
            } else if (!matchesFilter) {
                setOpen(false)
            }
        }
    }, [matchesFilter, category.children, globalFilter])

    const handleToggle = useCallback(() => {
        setOpen(prevOpen => !prevOpen)
    }, [])

    const highlightMatch = useCallback((text, filter) => {
        if (!filter) return text
        const parts = text.split(new RegExp(`(${filter})`, 'gi'))
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === filter.toLowerCase() ? (
                        <mark key={i} style={{ backgroundColor: 'yellow', padding: '2px 0', borderRadius: '2px' }}>
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        )
    }, [])

    const handleDelete = async (id) => {
        const data = await productCategoryService.deleteProductCategory(id)
        toast.success('Category Deleted Successfully')
        fetchCategories()
    }

    if (globalFilter && !matchesFilter) {
        return null
    }

    return (
        <>
            <StyledListItem
                level={level}
                secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => onAddSubcategory(category)}
                            title="Add subcategory"
                            sx={{ color: 'success.main' }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onEditCategory(category)}
                            title="Edit category"
                        >
                            <i className='tabler-edit text-blue-500' />
                        </IconButton>
                        <DeleteConfirmationDialog
                            itemName="category"
                            onConfirm={() => handleDelete(category._id)}
                            icon={<i className='tabler-trash text-red-500' />}
                        />
                    </Box>
                }
            >
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.children && category.children.length > 0 && (
                                <IconButton
                                    size="small"
                                    onClick={handleToggle}
                                    sx={{ p: 0, mr: 0.5, mt: 3 }}
                                >
                                    {open ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
                                </IconButton>
                            )}
                            <FiberManualRecordOutlinedIcon sx={{
                                fontSize: '0.7rem',
                                mr: 1,
                                mt: 3,
                                ml: category.children && category.children.length > 0 ? 0 : 2
                            }} />
                            <Typography variant="body1" component="span" sx={{ mt: 3 }}>
                                {highlightMatch(category.name, globalFilter)}
                            </Typography>
                        </Box>
                    }
                    secondary={
                        <Typography variant="caption" color="text.secondary" sx={{
                            ml: category.children && category.children.length > 0 ? 3.5 : 5.5
                        }}>
                            {category.status && ` | Status: ${category.status}`}
                            {category.image && (
                                <span style={{ marginLeft: '10px' }}>
                                    <a href={category.image} target="_blank" rel="noopener noreferrer">
                                        View Image
                                    </a>
                                </span>
                            )}
                        </Typography>
                    }
                />
            </StyledListItem>
            {category.children && category.children.length > 0 && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children.map(child => (
                            <CategoryTreeItem
                                key={child._id}
                                category={child}
                                level={level + 1}
                                onEditCategory={onEditCategory}
                                globalFilter={globalFilter}
                                onAddSubcategory={onAddSubcategory}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    )
}

const ProductCategoryTable = () => {
    const router = useRouter()
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false)
    const [editCategoryData, setEditCategoryData] = useState(null)
    const [categoryData, setCategoryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [globalFilter, setGlobalFilter] = useState('')
    const [parentCategoryForAdd, setParentCategoryForAdd] = useState(null)

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        try {
            const res = await productCategoryService.getAllProductCategory()
            setCategoryData(res.data || [])
        } catch (err) {
            console.error("Error fetching categories:", err)
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleAddCategoryClick = useCallback(() => {
        setEditCategoryData(null)
        setParentCategoryForAdd(null)
        setOpenAddEditDialog(true)
    }, [])

    const handleAddSubcategory = useCallback((parentCategory) => {
        setEditCategoryData(null)
        setParentCategoryForAdd(parentCategory)
        setOpenAddEditDialog(true)
    }, [])

    const handleEditCategory = useCallback((category) => {
        setEditCategoryData(category)
        setParentCategoryForAdd(null)
        setOpenAddEditDialog(true)
    }, [])

    const handleDialogSuccess = useCallback(() => {
        fetchCategories()
        setOpenAddEditDialog(false)
        setEditCategoryData(null)
        setParentCategoryForAdd(null)
    }, [fetchCategories])

    const handleCloseDialog = useCallback(() => {
        setOpenAddEditDialog(false)
        setEditCategoryData(null)
        setParentCategoryForAdd(null)
    }, [])

    const filterTreeNodes = useCallback((nodes, filter) => {
        if (!filter) {
            return nodes
        }

        const lowerCaseFilter = filter.toLowerCase()
        let filtered = []

        for (const node of nodes) {
            const matchesSelf = node.name.toLowerCase().includes(lowerCaseFilter)
            const filteredChildren = node.children ? filterTreeNodes(node.children, filter) : []

            if (matchesSelf || filteredChildren.length > 0) {
                filtered.push({
                    ...node,
                    children: filteredChildren
                })
            }
        }
        return filtered
    }, [])

    const topLevelFilteredCategories = useMemo(() => {
        return filterTreeNodes(categoryData, globalFilter)
    }, [categoryData, globalFilter, filterTreeNodes])

    return (
        <>
            <Card sx={{ mx: { xs: 2, sm: 4, md: 6 }, my: 4 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" justifyContent='space-between'>
                        <Grid item xs={12} md={6}>
                            <Typography variant='h4' gutterBottom>
                                Product Categories sdsdsds
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <TextField
                                fullWidth
                                label='Search Categories'
                                value={globalFilter}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder='Search by category name...'
                                size="small"
                                sx={{ maxWidth: '300px' }}
                            />
                            <Button variant='contained' onClick={handleAddCategoryClick}>
                                Add Category
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>

                <Box sx={{ overflowX: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List component="nav" aria-labelledby="nested-list-subheader" sx={{ p: 0 }}>
                            {topLevelFilteredCategories.length === 0 && globalFilter ? (
                                <ListItem>
                                    <ListItemText primary="No matching categories found." />
                                </ListItem>
                            ) : topLevelFilteredCategories.length === 0 && !globalFilter ? (
                                <ListItem>
                                    <ListItemText primary="No categories added yet. Click 'Add Category' to get started." />
                                </ListItem>
                            ) : (
                                topLevelFilteredCategories.map(category => (
                                    <CategoryTreeItem
                                        key={category._id}
                                        category={category}
                                        onEditCategory={handleEditCategory}
                                        globalFilter={globalFilter}
                                        onAddSubcategory={handleAddSubcategory}
                                    />
                                ))
                            )}
                        </List>
                    )}
                </Box>
            </Card>

            <AddProductCategory
                open={openAddEditDialog}
                setOpen={setOpenAddEditDialog}
                data={editCategoryData}
                parentCategory={parentCategoryForAdd}
                onSuccess={handleDialogSuccess}
                onClose={handleCloseDialog}
            />
        </>
    )
}

export default ProductCategoryTable
