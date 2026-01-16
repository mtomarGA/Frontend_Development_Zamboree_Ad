// React Imports
import { useState, useRef } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Typography, Grid, Card, CardContent } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'

const EmployeeDataModal = ({ setOpen, open, data }) => {
    const [scroll, setScroll] = useState('paper')

    // Refs
    const descriptionElementRef = useRef(null)

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm')) // true if screen size is 'sm' or smaller

    const handleClickOpen = (scrollType) => () => {
        setOpen(true)
        setScroll(scrollType)
    }

    const handleClose = () => setOpen(false)

    if (!data) return null

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            closeAfterTransition={false}
            fullScreen={fullScreen} // Full screen on small devices
            PaperProps={{
                sx: {
                    width: { xs: '90%', sm: '80%', md: '70%' }, // Responsive widths
                    maxWidth: 'none', // Allow custom width
                    m: 0, // No margin (for mobile)
                },
            }}
        >
            <DialogTitle id="scroll-dialog-title">Employee Details</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <Grid container spacing={3}>
                    {/* Employee Details */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Basic Details</Typography>
                                <Typography><strong>Name:</strong> {data.name}</Typography>
                                <Typography><strong>Email:</strong> {data.email}</Typography>
                                <Typography><strong>Phone:</strong> {data.phone}</Typography>
                                <Typography><strong>Date of Birth:</strong> {new Date(data.dob).toLocaleDateString()}</Typography>
                                <Typography><strong>Gender:</strong> {data.gender?.name}</Typography>
                                <Typography><strong>Marital Status:</strong> {data.maritalStatus?.name}</Typography>
                                <Typography><strong>Role:</strong> {data.role}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mt: 2 }}>Address</Typography>
                                <Typography><strong>Street:</strong> {data.address?.street}</Typography>
                                <Typography><strong>City:</strong> {data.address?.city?.name}</Typography>
                                <Typography><strong>State:</strong> {data.address?.state?.name}</Typography>
                                <Typography><strong>Country:</strong> {data.address?.country?.name}</Typography>
                                <Typography><strong>Pincode:</strong> {data.address?.pincode}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bank Details */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mt: 2 }}>Bank Details</Typography>
                                <Typography><strong>Bank Name:</strong> {data.bankDetails?.bankName}</Typography>
                                <Typography><strong>Branch Name:</strong> {data.bankDetails?.branchName}</Typography>
                                <Typography><strong>Account Number:</strong> {data.bankDetails?.accountNumber}</Typography>
                                <Typography><strong>IFSC Code:</strong> {data.bankDetails?.ifscCode}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Job Details */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mt: 2 }}>Job Details</Typography>
                                <Typography><strong>Designation:</strong> {data.designation?.name}</Typography>
                                <Typography><strong>Department:</strong> {data.department?.name}</Typography>
                                <Typography><strong>Branch:</strong> {data.branch?.name}</Typography>
                                <Typography><strong>Joining Date:</strong> {new Date(data.joiningDate).toLocaleDateString()}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Documents */}
                    <Grid item xs={12} sm={6} >
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mt: 2 }}>Documents</Typography>
                                {data.documents?.map((doc, index) => (
                                    <div key={index}>
                                        <Typography><strong>Type:</strong> {doc.documentType?.name}</Typography>
                                        <Typography><strong>File URL:</strong> {doc.fileURL}</Typography>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions className={classnames('dialog-actions-dense', { '!pt-3': scroll === 'paper' })}>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )
}

export default EmployeeDataModal
