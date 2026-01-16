// React Imports
import { useEffect, useState, useRef } from 'react'
// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import Report from "@/services/posts/report.service"
import CustomTextField from '@core/components/mui/TextField'


const AddReportType = ({ EditSelectedReport, onSuccess, setEditModalOpen }) => {




    const [formData, setFormData] = useState({
        reportType: '',
    })

    // Error state
    const [errors, setErrors] = useState({
        reportType: '',
    })


    useEffect(() => {
        if (EditSelectedReport) {
            setFormData((prev) => ({
                ...prev,
                reportType: EditSelectedReport.message || "",
            }));
        }
    }, [EditSelectedReport]);


    const validateForm = () => {
        const newErrors = {}
        const { reportType } = formData
        if (!reportType) newErrors.reportType = 'Report Type is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            if (!EditSelectedReport || !EditSelectedReport.message) {
                // Add Report
                const result = await Report.AddReportType(formData);
                toast.success(result.message);
            } else {
                const _id=EditSelectedReport?._id
                // Edit Report
                const result = await Report.editReportType(formData,_id)
                toast.success(result.message);
            }

            onSuccess();
            setEditModalOpen(false);
        }
    };


    return (
        <Card className='shadow-none'>
            <CardContent>
                <Typography variant='h4' sx={{ mb: 4 }}>
                    Create Report Type
                </Typography>

                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Add Report Type"
                            placeholder="Enter  Report Type"
                            value={formData.reportType}
                            rows={4}
                            onChange={e => setFormData({ ...formData, reportType: e.target.value })}
                            error={!!errors.reportType}
                            helperText={errors.reportType}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 4 }}>
                        <Button
                            variant='contained'
                            size='large'
                            fullWidth
                            onClick={handleSubmit}
                        >
                            {EditSelectedReport ? "Update Report Type" : "Create Report Type"}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default AddReportType
