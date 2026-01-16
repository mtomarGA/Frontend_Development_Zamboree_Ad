"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  Box,
  Grid,
  Typography,
  Button,
  Checkbox,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import CustomTextField from "@/@core/components/mui/TextField"
import { useEmployeeFormContext } from "@/contexts/EmployeeFormContext"
import leaveSetupService from "@/services/leave-management/leaveSetup"

const AllowLeaveType = ({ nextHandle, handleCancel }) => {
  const { setLeaveFormData, leaveFormData, resetForm } = useEmployeeFormContext()
  console.log(leaveFormData, "leaveFormDataleaveFormDataleaveFormData");

  const [leaveTypes, setLeaveTypes] = useState([])
  console.log(leaveTypes, "leaveTypes22")


  const getLeaveTypes = async () => {
    try {
      const res = await leaveSetupService.getAllLeaveSetups()
      setLeaveTypes(res.data || [])
    } catch (err) {
      console.error("Error fetching leave types:", err)
    }
  }

  useEffect(() => {
    getLeaveTypes()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    nextHandle()
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Allow Leave Setup
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={leaveTypes}
              getOptionLabel={(option) => option.name || ""}
              value={leaveTypes.find((l) => l._id === leaveFormData) || null}
              onChange={(event, newValue) =>
                setLeaveFormData(newValue ? newValue._id : null)
              }
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Allow Leave Setup"
                  placeholder="Select Leave Setup"
                  required
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
          <Button
            className="m-2"
            onClick={() => {
              handleCancel()
              resetForm()
            }}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>

        </Box>
      </Box>
    </Card>
  )
}

export default AllowLeaveType
