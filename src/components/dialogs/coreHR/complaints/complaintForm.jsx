'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
    Button,
    Grid,
    DialogContent,
    DialogActions,
    MenuItem,
    Paper,
    List,
    ListItem,
    Typography
} from '@mui/material'


import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'


// Form Imports
import { useForm, Controller, useWatch } from 'react-hook-form'

// Services
import EmployeeService from '@/services/employee/EmployeeService'


// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import complainTypeServices from '@/services/core-hr/Master/ComplainTypeServices'
import complaintServices from '@/services/core-hr/complaintService'



const ComplaintForm = ({ setModalOpen, getAllComplain, complaintData }) => {
    const [complainType, setComplaintType] = useState([])
    const [employees, setEmployees] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)



    const {
        control,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            complaintAgainst: '',
            complainType: '',
            complaintTitle: '',
            description: '',
        }
    })


    // Autofill details 
    useEffect(() => {
        if (complaintData) {
            reset({
                complaintAgainst: complaintData?.complaintAgainst?._id,
                complainType: complaintData.complainType?._id || '',
                complaintTitle: complaintData?.complaintTitle || '',
                description: complaintData.description || '',

            })

            if (complaintData.complaintAgainst) {
                setInputValue(complaintData.complaintAgainst.name);
            }
        }
    }, [complaintData, reset])


    const getAllComplainType = async () => {
        try {
            const res = await complainTypeServices.getAllComplainType()
            setComplaintType(res.data)
        } catch (error) {
            toast.error('Failed to load leave types.')
        }
    }

    useEffect(() => {
        getAllComplainType()
    }, [])


    const handleEmployeeSearch = async (value) => {
        setInputValue(value)
        if (value.length > 2) {
            try {
                const res = await EmployeeService.getEmployeeDetailsByMobile(value)
                setEmployees(res.data)
                setShowDropdown(true)
            } catch (error) {
                console.error('Failed to fetch employee data:', error)
                setEmployees([])
                setShowDropdown(false)
            }
        } else {
            setEmployees([])
            setShowDropdown(false)
        }
    }



    const handleSelectEmployee = (employee) => {
        setValue('complaintAgainst', employee._id);
        setInputValue(employee.name);
        setShowDropdown(false);
    };




    const onSubmit = async (data) => {
        // console.log(user)
        const formData = {
            complaintAgainst: data.complaintAgainst,
            complainType: data.complainType,
            complaintTitle: data.complaintTitle,
            description: data.description,
        };


        try {
            if (complaintData?._id) {
                const id = complaintData._id
                await complaintServices.updateComplaint(id, formData)

            } else {
                const result = await complaintServices.createComplaint(formData)
            }

            getAllComplain()

            reset()
            setModalOpen(false)
        } catch (error) {
            toast.error('Something went wrong.')
        }
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={5}>
                        {/* Complaint Against (Employee Search) */}
                        <Grid item xs={12} sx={{ position: 'relative' }}>
                            <Controller
                                name="complaintAgainst"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Complaint Against"
                                        placeholder="Search Employee Name"
                                        error={!!errors.complaintAgainst}
                                        helperText={errors.complaintAgainst && "This field is required."}
                                        value={inputValue}
                                        onChange={(e) => handleEmployeeSearch(e.target.value)}
                                        onBlur={() => setShowDropdown(false)} // removed timeout
                                        onFocus={() => {
                                            if (employees.length > 0) setShowDropdown(true)
                                        }}
                                        inputProps={{
                                            role: 'combobox',
                                            'aria-expanded': showDropdown,
                                            'aria-haspopup': 'listbox',
                                            'aria-controls': 'employee-listbox'
                                        }}
                                    />
                                )}
                            />

                            {showDropdown && employees.length > 0 && (
                                <Paper
                                    elevation={4}
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        zIndex: 2,
                                        left: 0,
                                        width: '100%',
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                        mt: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <List id="employee-listbox" dense role="listbox">
                                        {employees.map((employee) => (
                                            <ListItem
                                                key={employee._id}
                                                role="option"
                                                onMouseDown={() => handleSelectEmployee(employee)}
                                            >
                                                <span className='text-sm cursor-pointer'>{employee.name}</span>
                                                <span className='text-sm cursor-pointer'>{employee.employee_id}</span>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Grid>

                        {/* Complaint Type */}
                        <Grid item xs={12}>
                            <Controller
                                name="complainType"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Complaint Type"
                                        error={!!errors.complainType}
                                        helperText={errors.complainType && "This field is required."}
                                        InputProps={{
                                            sx: { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value="" disabled hidden>
                                            Select Complaint Type
                                        </MenuItem>
                                        {complainType.map((type) => (
                                            <MenuItem key={type._id} value={type._id}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
                                )}
                            />
                        </Grid>

                        {/* Complaint Title */}
                        <Grid item xs={12}>
                            <Controller
                                name="complaintTitle"
                                control={control}
                                rules={{
                                    required: "Complaint title is required",
                                    maxLength: {
                                        value: 100, 
                                        message: "Title cannot exceed 100 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Complaint Title"
                                        placeholder="Enter complaint title"
                                        error={!!errors.complaintTitle}
                                        helperText={errors.complaintTitle?.message} 
                                    />
                                )}
                            />

                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Description"
                                        placeholder="Enter complaint details"
                                        error={!!errors.description}
                                        helperText={errors.description && "This field is required."}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" variant="contained">
                        Save
                    </Button>
                    <Button onClick={() => setModalOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </form>

        </LocalizationProvider>
    )
}

export default ComplaintForm
