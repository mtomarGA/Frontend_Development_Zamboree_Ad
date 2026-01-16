'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Button, Card, Checkbox, Divider, MenuItem, Tab, Tabs,
    TextField, Typography, FormControlLabel, IconButton, Paper
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { DragHandle, Delete } from '@mui/icons-material'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'

import attributeService from '@/services/attribute/attribute.service'
import productCategoryService from '@/services/product/productCategory'
import { toast } from 'react-toastify'

const AttributeForm = ({ mode, id = null }) => {
    const [tab, setTab] = useState(0)
    const [attributeSet, setAttributeSet] = useState('')
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([]) // now array
    const [categoryTree, setCategoryTree] = useState([])
    const [attriSetList, setAttriSetList] = useState([])
    const [filterable, setFilterable] = useState(true)
    const [mandatory, setMandatory] = useState(false)
    const [values, setValues] = useState([{ id: Date.now().toString(), text: '' }])
    const [status, setStatus] = useState('INACTIVE')

    const router = useRouter()

   useEffect(() => {
    if (mode === 'edit' && id) {
        attributeService.getSingleAttribute(id).then(res => {
            const data = res.data
            console.log(data,"datadatadata");

            setAttributeSet(data.attributeSet?._id || '')
            setName(data.name || '')
            setCategories(data.categories ? data.categories.map(cat => cat._id) : [])
            setFilterable(data.filterable ?? true)
            setMandatory(data.mandatory ?? false)
            setStatus(data.status ?? 'ACTIVE')
            setValues(
                data.values?.map((val, index) => ({
                    id: `${Date.now()}-${index}`,
                    text: val.text || ''
                })) || [{ id: Date.now().toString(), text: '' }]
            )
        })
    }
}, [mode, id])


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await productCategoryService.getAllProductCategory()
                const fetched = res.data || []
                setCategoryTree(fetched)
            } catch (err) {
                console.error("Error fetching categories:", err)
                toast.error('Failed to load categories')
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchAttributeSet = async () => {
            try {
                const res = await attributeService.getAttributeSet()
                const fetched = res.data || []
                setAttriSetList(fetched)
            } catch (err) {
                console.error("Error fetching attribute sets:", err)
                toast.error('Failed to load attribute sets')
            }
        }
        fetchAttributeSet()
    }, [])

    const flattenCategories = (nodes) => {
        return nodes.flatMap(node => [
            node,
            ...(node.children ? flattenCategories(node.children) : [])
        ])
    }

    const renderCategoryOptions = (nodes, level = 0) => {
        return nodes.flatMap(node => {
            const indentation = '\u00A0\u00A0'.repeat(level)
            const items = [
                <MenuItem key={node._id} value={node._id}>
                    <Checkbox checked={categories.includes(node._id)} />
                    <span style={{ marginLeft: 4 }}>{indentation + node.name}</span>
                </MenuItem>
            ]
            if (node.children && node.children.length > 0) {
                items.push(...renderCategoryOptions(node.children, level + 1))
            }
            return items
        })
    }

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error('Attribute name is required')
        if (values.filter(v => v.text.trim()).length === 0) return toast.error('At least one value is required')

        const payload = {
            attributeSet,
            name,
            status,
            categories,
            filterable,
            mandatory,
            values: values.filter(v => v.text.trim()).map(v => ({ text: v.text })),
        }

        try {
            if (mode === 'create') {
                await attributeService.addAttribute(payload)
                toast.success('Attribute created')
            } else {
                await attributeService.updateAttribute(id, payload)
                toast.success('Attribute updated')
            }
            router.push('/en/apps/product1/attribute')
        } catch (err) {
            console.error(err)
            toast.error('Failed to save attribute')
        }
    }

    const handleAddValue = () => setValues([...values, { id: Date.now().toString(), text: '' }])
    const handleRemoveValue = (id) => values.length > 1 && setValues(values.filter(value => value.id !== id))
    const handleDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(values)
        const [movedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, movedItem)
        setValues(items)
    }
    const handleValueChange = (id, text) => setValues(values.map(value => value.id === id ? { ...value, text } : value))

    return (
        <Card className="p-6">
            <Typography variant="h5" className="mb-4">
                {mode === 'create' ? 'Create Attribute' : 'Edit Attribute'}
            </Typography>

            <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)}>
                <Tab label="General" />
                <Tab label="Values" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {tab === 0 && (
                <div className="space-y-4">
                    <TextField
                        select
                        label="Attribute Set"
                        size="small"
                        value={attributeSet}
                        onChange={e => setAttributeSet(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Select</MenuItem>
                        {attriSetList.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Name"
                        size="small"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Category"
                        value={categories}
                        onChange={e => setCategories(e.target.value)}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => {
                                const selectedNames = flattenCategories(categoryTree)
                                    .filter(cat => selected.includes(cat._id))
                                    .map(cat => cat.name)
                                return selectedNames.join(', ')
                            }
                        }}
                        MenuProps={{ PaperProps: { style: { maxHeight: 250, overflowY: 'auto' } } }}
                    >
                        {renderCategoryOptions(categoryTree)}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    </TextField>

                    <FormControlLabel
                        control={<Checkbox checked={filterable} onChange={e => setFilterable(e.target.checked)} />}
                        label="Use this attribute for filtering products"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={mandatory} onChange={e => setMandatory(e.target.checked)} />}
                        label="Is it mandatory?"
                    />

                    <Button variant="contained" onClick={() => setTab(1)}>Next</Button>
                </div>
            )}

            {tab === 1 && (
                <div className="space-y-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="values">
                            {(provided) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {values.map((value, index) => (
                                        <Draggable key={value.id} draggableId={value.id} index={index}>
                                            {(provided, snapshot) => (
                                                <Paper
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 1,
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                                                        transition: 'background-color 0.2s ease',
                                                        ...provided.draggableProps.style
                                                    }}
                                                >
                                                    <IconButton {...provided.dragHandleProps} size="small">
                                                        <DragHandle />
                                                    </IconButton>

                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={value.text}
                                                        onChange={(e) => handleValueChange(value.id, e.target.value)}
                                                        placeholder={`Value ${index + 1}`}
                                                    />

                                                    <IconButton
                                                        onClick={() => handleRemoveValue(value.id)}
                                                        size="small"
                                                        color="error"
                                                        disabled={values.length <= 1}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Paper>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Button variant="outlined" onClick={handleAddValue}>Add New Value</Button>

                    <div className="flex gap-4 mt-4">
                        <Button variant="outlined" onClick={() => setTab(0)}>Back</Button>
                        <Button variant="contained" onClick={handleSubmit}>Save</Button>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default AttributeForm
