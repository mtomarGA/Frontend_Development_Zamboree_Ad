import React, { useEffect, useState } from 'react'
import { Button, Card, Box, Typography, Grid, MenuItem, CircularProgress, TextField, Autocomplete, ListItemText, Paper, Checkbox } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
import officePolicyService from '@/services/attendance/officePolicy.service'
import ServiceCategory from "@/services/business/service/serviceCategory.service"

const BasicEmployeeForm = ({ nextHandle, handleCancel }) => {

    const [data, setDate] = useState([])
    const {
        formData,
        errors,
        handleChange,
        countryList,
        stateList,
        cityList,
        maritalStatusList,
        genderList,
        designationList,
        departmentList,
        branchList,
        getStatesbyId,
        getCityByStateId,
        validate,
        categories,
        setCategories,
        roleList,
        isEditMode,
        resetForm,
        reportingToList,
        setTabManagement,
        workingShiftList,
        officePolicy,
        setSearchQuery,
        loadingCategories
    } = useEmployeeFormContext();




    const officePolicys = async () => {
        const res = await officePolicyService.policysGet()
        console.log(res.data, 'ressssssssssssssssss');
        setDate(res.data)
    }
    useEffect(() => {
        officePolicys()
    }, [])












    const handleNextButtonClick = (e) => {

        e.preventDefault()
        if (!validate()) return
        console.log('Form submitted:', formData);
        setTabManagement(prev => ({
            ...prev,
            General: {
                ...prev.General,
                security: true,
            }
        }))
        nextHandle()
    }





    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleNextButtonClick} noValidate >
                <Typography variant="h5" sx={{ mb: 4 }}>
                    {isEditMode ? "Edit Employee Data" : "Add New Employee"}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="First Name"
                            name="firstName"
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            onChange={handleChange('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Last Name"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={formData.lastName}
                            onChange={handleChange('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Employee ID"
                            name="employeeid"
                            value={formData.employee_id}
                            disabled
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Phone"
                            name="phone"
                            type="number"
                            inputProps={{ maxLength: 10 }}
                            placeholder="Enter Phone"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Address"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleChange('address')}
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            fullWidth
                            required
                            label="Country"
                            value={formData.country}
                            onChange={e => { handleChange('country')(e); getStatesbyId(e.target.value); }}
                            error={!!errors.country}
                            helperText={errors.country}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Country</p>
                                        }
                                        const selectedItem = countryList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(countryList) &&
                                countryList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            fullWidth
                            required
                            label="State"
                            value={formData.state}
                            onChange={e => { handleChange('state')(e); getCityByStateId(e.target.value); }}
                            error={!!errors.state}
                            helperText={errors.state}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select State</p>
                                        }
                                        const selectedItem = stateList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(stateList) &&
                                stateList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            fullWidth
                            required
                            label="City"
                            value={formData.city}
                            onChange={e => handleChange('city')(e)}
                            error={!!errors.city}
                            helperText={errors.city}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select City</p>
                                        }
                                        const selectedItem = cityList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(cityList) &&
                                cityList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Pin Code"
                            name="pinCode"
                            type="number"
                            placeholder="Enter Pin Code"
                            value={formData.pincode}
                            onChange={handleChange('pincode')}
                            error={!!errors.pincode}
                            helperText={errors.pincode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            placeholder="Enter Date of Birth"
                            value={formData.dob}
                            onChange={handleChange('dob')}
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Gender"
                            value={formData.gender}
                            onChange={e => { handleChange('gender')(e) }}
                            error={!!errors.gender}
                            helperText={errors.gender}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Gender</p>
                                        }
                                        const selectedItem = genderList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(genderList) &&
                                genderList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Marital Status"
                            value={formData.maritalStatus}
                            onChange={e => { handleChange('maritalStatus')(e) }}
                            error={!!errors.maritalStatus}
                            helperText={errors.maritalStatus}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Marital Status</p>
                                        }
                                        const selectedItem = maritalStatusList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {/* <MenuItem value='' disabled>Select Marital Status</MenuItem> */}
                            {Array.isArray(maritalStatusList) &&
                                maritalStatusList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Branch"
                            value={formData.branch}
                            onChange={e => { handleChange('branch')(e) }}
                            error={!!errors.branch}
                            helperText={errors.branch}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Branch</p>
                                        }
                                        const selectedItem = branchList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(branchList) &&
                                branchList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Department"
                            value={formData.department}
                            onChange={e => { handleChange('department')(e) }}
                            error={!!errors.department}
                            helperText={errors.department}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Department</p>
                                        }
                                        const selectedItem = departmentList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(departmentList) &&
                                departmentList.map((item) => (
                                    <MenuItem key={item._id} value={String(item._id)}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Designation"
                            value={formData.designation}
                            onChange={e => { handleChange('designation')(e) }}
                            error={!!errors.designation}
                            helperText={errors.designation}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Designation</p>
                                        }
                                        const selectedItem = designationList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(designationList) &&
                                designationList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Role"
                            value={formData.role}
                            onChange={e => { handleChange('role')(e) }}
                            error={!!errors.role}
                            helperText={errors.role}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Role</p>
                                        }
                                        const selectedItem = roleList.find(item => item._id === selected)
                                        return selectedItem ? selectedItem.name : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(roleList) &&
                                roleList.map((item) => (
                                    <MenuItem key={item._id} value={String(item._id)}>{item.name}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Reporting To"
                            value={formData.reportingto}
                            onChange={e => { handleChange('reportingto')(e) }}
                            error={!!errors.reportingto}
                            helperText={errors.reportingto}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Reporting To</p>
                                        }
                                        const selectedItem = reportingToList.find(item => item._id === selected)
                                        return selectedItem ? `${selectedItem.name} | ${selectedItem.employee_id}` : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(reportingToList) &&
                                reportingToList.map((item) => (
                                    <MenuItem key={item._id} value={String(item._id)}>{item.name} | {item.employee_id}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Working Shift"
                            value={formData.working_shift}
                            onChange={e => { handleChange('working_shift')(e) }}
                            error={!!errors.working_shift}
                            helperText={errors.working_shift}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: selected => {
                                        if (selected === '') {
                                            return <p>Select Working Shift</p>
                                        }
                                        const selectedItem = workingShiftList.find(item => item._id === selected)
                                        return selectedItem ? `${selectedItem.shiftName}` : ''
                                    }
                                }
                            }}
                        >
                            {Array.isArray(workingShiftList) &&
                                workingShiftList.map((item) => (
                                    <MenuItem key={item._id} value={String(item._id)}>{item.shiftName}</MenuItem>
                                ))}
                        </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            select
                            required
                            fullWidth
                            label="Office Policy"
                            value={formData.officePolicy || ''}
                            onChange={e => handleChange('officePolicy')(e)}
                            error={!!errors.officePolicy}
                            helperText={errors.officePolicy}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: (selected) => {
                                        if (!selected) return <p>Select Office Policy</p>

                                        const selectedItem = data?.find(item => item._id === selected)
                                        if (!selectedItem) return <p>Select Office Policy</p>

                                        // 👇 Show nicely formatted selected text only
                                        return (
                                            <span>
                                                {selectedItem.group}
                                                {selectedItem.description ? ` — ${selectedItem.description}` : ''}
                                            </span>
                                        )
                                    },
                                },
                            }}
                        >
                            {/* 👇 simple dropdown list */}
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map(item => (
                                    <MenuItem key={item._id} value={String(item._id)}>
                                        {item.group}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No office policies found</MenuItem>
                            )}
                        </CustomTextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <CustomTextField
                            fullWidth
                            required
                            label="Date of Joining"
                            name="joiningDate"
                            type="date"
                            placeholder="Enter Date of Joining"
                            value={formData.joiningDate}
                            onChange={handleChange('joiningDate')}
                            error={!!errors.joiningDate}
                            helperText={errors.joiningDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            multiple
                            options={categories}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.name || ''}
                            value={categories.filter(cat => formData.categories?.includes(cat._id))}
                            onChange={(event, newValues) => {
                                handleChange('categories')({
                                    target: { value: newValues.map(val => val._id) }
                                });
                            }}
                            onInputChange={(event, newInputValue) => {
                                setSearchQuery(newInputValue);
                            }}
                            isOptionEqualToValue={(option, value) => option._id === value._id}  // <--- ADD THIS
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    margin="dense"
                                    label="Search Categories"
                                    fullWidth
                                    placeholder="Type to search categories..."
                                    error={!!errors.categories}
                                    helperText={errors.categories}
                                    sx={{ mt: 2 }}
                                />
                            )}
                            renderOption={(props, option, { selected }) => (
                                <MenuItem {...props}>
                                    <Checkbox
                                        checked={selected}
                                        style={{ marginRight: 8 }}
                                    />
                                    <ListItemText primary={option.name} />
                                </MenuItem>
                            )}
                            PaperComponent={({ children }) => <Paper>{children}</Paper>}
                        />
                        {/* <Autocomplete
                            multiple
                            freeSolo
                            disableCloseOnSelect
                            options={categories}
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") return option;
                                return option.name || "";
                            }}
                            value={(formData.categories || []).map((catIdOrName) => {
                                const found = categories.find((c) => c._id === catIdOrName);
                                return found || catIdOrName;
                            })}
                            onChange={(event, newValues) => {
                                handleChange("categories")({
                                    target: {
                                        value: newValues.map((val) =>
                                            typeof val === "string" ? val : val._id
                                        ),
                                    },
                                });
                            }}
                            onInputChange={(event, newInputValue) => {
                                setSearchQuery(newInputValue);
                                if (newInputValue.trim() !== "") setOpen(true); // 👈 force dropdown open when typing
                            }}
                            isOptionEqualToValue={(option, value) =>
                                option._id === value._id ||
                                option.name === value ||
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    margin="dense"
                                    label="Search or Add Categories"
                                    fullWidth
                                    placeholder="Type to search or add..."
                                    error={!!errors.categories}
                                    helperText={errors.categories}
                                    sx={{ mt: 2 }}
                                />
                            )}
                            renderOption={(props, option, { selected }) => (
                                <MenuItem {...props}>
                                    <Checkbox checked={selected} style={{ marginRight: 8 }} />
                                    <ListItemText primary={option.name || option} />
                                </MenuItem>
                            )}
                            PaperComponent={({ children }) => <Paper>{children}</Paper>}
                        /> */}

                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                    <Button className='m-2' onClick={() => { handleCancel(); resetForm() }} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button className='m-2' type="submit" variant="contained" color="primary">
                        Next
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}

export default BasicEmployeeForm
