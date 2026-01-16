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
import awardTypeServices from '@/services/core-hr/Master/AwardTypeServices'
import awardServices from '@/services/core-hr/awardServices'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'



const AwardForm = ({ setModalOpen, getAllAward, award }) => {
    const [awardType, setAwardType] = useState([])
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
            employee: "",
            awardType: '',
            giftItem: '',
            date: null,
        }
    })


    // Autofill details 
    useEffect(() => {
        if (award) {
            reset({
                employee: award.employee?._id,
                awardType: award.awardType?._id || '',
                giftItem: award.giftItem || '',
                date: award?.date
                    ? dayjs(award?.date).format("YYYY-MM-DD")
                    : '',

            })

            if (award.employee) {
                setInputValue(award.employee.name);
            }
        }
    }, [award, reset])


    const getAllAwardType = async () => {
        try {
            const res = await awardTypeServices.getAllAwardType()
            setAwardType(res.data)
        } catch (error) {
            console.error('Failed to fetch leave types:', error)
            toast.error('Failed to load leave types.')
        }
    }

    useEffect(() => {
        getAllAwardType()
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
        setValue('employee', employee._id)
        setInputValue(employee.name)
        setShowDropdown(false)

    }



    const onSubmit = async (data) => {
        const formData = {
            employee: data.employee,
            awardType: data.awardType,
            giftItem: data.giftItem,
            date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : null,

        }


    

        try {
            if (award?._id) {
                const id = award._id
                await awardServices.updateAward(id, formData)
                
            } else {
                await awardServices.createAward(formData)
            }

            getAllAward()
            reset()
            setModalOpen(false)
        } catch (error) {
            toast.error('Something went wrong.')
        }
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <Typography variant="h4" className="mb-4" gutterBottom>
                    {award.employee?._id ? "Edit Leave" : ""}
                </Typography> */}
                <DialogContent>
                    <Grid container spacing={5}>
                        {/* Employee Name Search */}
                        <Grid item xs={12} sx={{ position: 'relative' }}>
                            <Controller
                                name="employee"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Employee Name"
                                        placeholder="Search Employee Name"
                                        error={!!errors.employee}
                                        helperText={errors.employee && 'This field is required.'}
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

                        {/* Award Type */}
                        <Grid item xs={12}>
                            <Controller
                                name='awardType'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        fullWidth
                                        label='Award Type'
                                        error={!!errors.awardType}
                                        helperText={errors.awardType && 'This field is required.'}
                                        InputProps={{
                                            sx: { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value='' disabled hidden>
                                            Select Award Type
                                        </MenuItem>
                                        {Array.isArray(awardType) &&
                                            awardType.map((award) => (
                                                <MenuItem key={award._id} value={award._id} className='text-start'>
                                                    {award.name}
                                                </MenuItem>
                                            ))}
                                    </CustomTextField>
                                )}
                            />
                        </Grid>


                        {/* Gift */}
                        <Grid item xs={12}>
                            <Controller
                                name="giftItem"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Gift Item"
                                        placeholder="Gift Item"
                                        error={!!errors.giftItem}
                                        helperText={errors.giftItem && 'This field is required.'}
                                    />
                                )}
                            />
                        </Grid>


                        {/*  Date */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: ' Date is required' }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        type="date"
                                        fullWidth
                                        label="Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.date}
                                        helperText={errors.date?.message}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button type='submit' variant='contained'>
                        Save
                    </Button>
                    <Button onClick={() => setModalOpen(false)} variant='outlined'>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </LocalizationProvider>
    )
}

export default AwardForm
