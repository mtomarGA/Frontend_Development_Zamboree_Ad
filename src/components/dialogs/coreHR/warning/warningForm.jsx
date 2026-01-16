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
import warningTypeServices from '@/services/core-hr/Master/WarningTypeServices'
import warningServices from '@/services/core-hr/warningServices'



const WarningForm = ({ setModalOpen, getAllWarnings, warningData }) => {
    const [warningType, setWarningType] = useState([])
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
            warningTo: '',
            warningType: '',
            subject: '',
            description: '',
            status : "UNSOLVED"
        }
    })


    // Autofill details 
    useEffect(() => {
        if (warningData) {
            reset({
                warningTo: warningData?.warningTo?._id,
                warningType: warningData.warningType?._id || '',
                subject: warningData?.subject || '',
                description: warningData.description || '',
                status : warningData?.status || "UNSOLVED"

            })

            if (warningData.warningTo) {
                setInputValue(warningData.warningTo.name);
            }
        }
    }, [warningData, reset])


    const getAllWarningType = async () => {
        try {
            const res = await warningTypeServices.getAllWarningType()
            setWarningType(res.data)
        } catch (error) {
            toast.error('Failed to load leave types.')
        }
    }

    useEffect(() => {
        getAllWarningType()
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
        setValue('warningTo', employee._id);
        setInputValue(employee.name);
        setShowDropdown(false);
    };




    const onSubmit = async (data) => {
        // console.log(user)
        const formData = {
            warningTo: data.warningTo,
            warningType: data.warningType,
            subject: data.subject,
            description: data.description,
            status : data.status
        };


        try {
            if (warningData?._id) {
                const id = warningData._id
                await warningServices.updateWarning(id, formData)

            } else {
                await warningServices.createWarning(formData)
            }

            getAllWarnings()

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
                                name="warningTo"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Warning To"
                                        placeholder="Search Employee Name"
                                        error={!!errors.warningTo}
                                        helperText={errors.warningTo && "This field is required."}
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

                        {/* Warning Type */}
                        <Grid item xs={12}>
                            <Controller
                                name="warningType"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Warning Type"
                                        error={!!errors.warningType}
                                        helperText={errors.warningType && "This field is required."}
                                        InputProps={{
                                            sx: { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value="" disabled hidden>
                                            Select Warning Type
                                        </MenuItem>
                                        {warningType.map((type) => (
                                            <MenuItem key={type._id} value={type._id}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
                                )}
                            />
                        </Grid>

                        {/* Warning Subject */}
                        <Grid item xs={12}>
                            <Controller
                                name="subject"
                                control={control}
                                rules={{ required : true}}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Warning Subject"
                                        placeholder="Enter warning subject"
                                        error={!!errors.subject}
                                        helperText={errors.subject && "This field is required."}
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
                                        placeholder="Enter warning description"
                                        error={!!errors.description}
                                        helperText={errors.description && "This field is required."}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                                      <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                          <CustomTextField
                                            {...field}
                                            select
                                            fullWidth
                                            label="Status"
                                            error={!!errors.status}
                                            helperText={errors.status && 'This field is required.'}
                                            InputProps={{
                                              sx: { textAlign: 'left' },
                                            }}
                                          >
                                            <MenuItem value="" disabled>Select Status</MenuItem>
                                            <MenuItem value="SOLVED">Solved</MenuItem>
                                            <MenuItem value="UNSOLVED">Unsolved</MenuItem>
                                          </CustomTextField>
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

export default WarningForm
