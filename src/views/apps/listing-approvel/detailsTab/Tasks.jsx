'use client'

import { useState } from 'react'
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Box,
    InputLabel,
    Select,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Card,
    CardContent,
    Avatar,
    Divider
} from '@mui/material'
import { X } from 'lucide-react'

// Static data for the note card
const noteData = {
    noteAddedBy: {
        image: '/images/avatar1.jpg',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        employee_id: 'EMP-001'
    },
    note: 'This is a sample note about the task. Please make sure to review all the requirements and coordinate with the team before starting the implementation.',
    createdAt: '2024-01-15T10:30:00Z'
}

// Static data for form fields
const formStaticData = {
    priorityOptions: [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' }
    ],
    relatedToOptions: [
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Project', label: 'Project' },
        { value: 'Client', label: 'Client' }
    ],
    assigneeOptions: [
        { value: 'Giles Hermiston', label: 'Giles Hermiston' },
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Jane Smith', label: 'Jane Smith' }
    ],
    followersOptions: [
        { value: '', label: 'None' },
        { value: 'Alex Murphy', label: 'Alex Murphy' },
        { value: 'Sarah Lin', label: 'Sarah Lin' }
    ],
    defaultInvoice: 'INV-000012',
    defaultPriority: 'Medium',
    defaultRelatedTo: 'Invoice'
}

export default function TaskModal() {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        hourlyRate: 0,
        startDate: '',
        dueDate: '',
        priority: formStaticData.defaultPriority,
        relatedTo: formStaticData.defaultRelatedTo,
        invoice: formStaticData.defaultInvoice,
        assignee: '',
        followers: '',
        tags: '',
        description: ''
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        console.log('Form Data:', formData)
        setOpen(false)
    }

    return (
        <>
            {/* Main page container */}
            <Box className="relative min-h-[90vh] flex flex-col">
                {/* Page content area */}
                <Box className="flex-1 p-4">
                    <Typography variant="h5" className="font-semibold mb-4">
                        Tasks
                    </Typography>
                    
                    {/* Display the note card on the main page */}
                    <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                        <CardContent className="flex items-start gap-4">
                            <Avatar
                                src={noteData.noteAddedBy?.image}
                                alt="profile"
                                sx={{ width: 45, height: 45 }}
                            />
                            <Box className="flex flex-col flex-grow">
                                {/* Header: Name + Employee ID/Admin */}
                                <Box className="flex justify-between items-start">
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {noteData.noteAddedBy?.firstName} {noteData.noteAddedBy?.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {noteData.noteAddedBy?.email}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {noteData.noteAddedBy?.employee_id || "Admin"}
                                    </Typography>
                                </Box>

                                <Divider className="my-2" />

                                <Box className="px-3 py-2 rounded-lg">
                                    <Typography variant="body1" color="text.primary">
                                        {noteData.note}
                                    </Typography>
                                </Box>

                                {noteData.createdAt && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        className="mt-2 self-end"
                                    >
                                        {new Date(noteData.createdAt).toLocaleString()}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box className="fixed bottom-8 right-8">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpen(true)}
                        className="rounded-full px-6 py-2 shadow-lg"
                    >
                        + Add Task
                    </Button>
                </Box>
            </Box>

            {/* Task creation modal */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    className: 'rounded-xl'
                }}
            >
                <DialogTitle className="flex justify-between items-center">
                    <Typography variant="h6" className="font-semibold">
                        Create Task
                    </Typography>
                    <IconButton 
                        onClick={() => setOpen(false)}
                        size="small"
                    >
                        <X size={20} />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} className="p-2">
                        <Grid container spacing={2}>
                            {/* Subject */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Hourly Rate */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Hourly Rate"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Start Date */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Start Date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Due Date */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Due Date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Priority */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        label="Priority"
                                    >
                                        {formStaticData.priorityOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Related To */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Related To</InputLabel>
                                    <Select
                                        name="relatedTo"
                                        value={formData.relatedTo}
                                        onChange={handleChange}
                                        label="Related To"
                                    >
                                        {formStaticData.relatedToOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Invoice */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Invoice"
                                    name="invoice"
                                    value={formData.invoice}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Assignee */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Assignee</InputLabel>
                                    <Select
                                        name="assignee"
                                        value={formData.assignee}
                                        onChange={handleChange}
                                        label="Assignee"
                                    >
                                        {formStaticData.assigneeOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Followers */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Followers</InputLabel>
                                    <Select
                                        name="followers"
                                        value={formData.followers}
                                        onChange={handleChange}
                                        label="Followers"
                                    >
                                        {formStaticData.followersOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Tags */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tags"
                                    name="tags"
                                    placeholder="Add tags separated by commas"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Task Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions className="flex justify-end p-4">
                    <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
