import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useEffect, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import AuthService from '@/services/authService'
import { CircularProgress } from '@mui/material'

const AdminEmailUpdate = ({ open, handleClose }) => {
  const { user, fetchUser } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    email: user?.email ,
    firstName: user?.firstName ,
    lastName: user?.lastName,
    email_configuration: {
      smtp_email: user?.email_configuration?.smtp_email,
      smtp_host: user?.email_configuration?.smtp_host ,
      smtp_port: user?.email_configuration?.smtp_port ,
      smtp_password: user?.email_configuration?.smtp_password ,
      imap_host: user?.email_configuration?.imap_host,
      imap_port: user?.email_configuration?.imap_port
    }
  })


  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      email: user?.email ,
      firstName: user?.firstName ,
      lastName: user?.lastName,
      email_configuration: {
        smtp_email: user?.email_configuration?.smtp_email,
        smtp_host: user?.email_configuration?.smtp_host ,
        smtp_port: user?.email_configuration?.smtp_port ,
        smtp_password: user?.email_configuration?.smtp_password ,
        imap_host: user?.email_configuration?.imap_host,
        imap_port: user?.email_configuration?.imap_port
      }
    }))
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name in data.email_configuration) {
      setData((prevData) => ({
        ...prevData,
        email_configuration: {
          ...prevData.email_configuration,
          [name]: value
        }
      }))
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    console.log('Updated data:', data)
    await AuthService.updateProfile(data)
    await fetchUser() // Refresh user data after update
    setLoading(false)
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant="h4" className="text-left px-4 pt-6 sm:px-6">
        Admin Configuration
      </DialogTitle>

      <DialogContent className="overflow-visible px-4 pt-0 sm:px-6">
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Row 1 - First/Last Name */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <CustomTextField
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              fullWidth
            />
            <CustomTextField
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Row 2 - Email */}
          <CustomTextField
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            fullWidth
          />

          {/* Row 3 - SMTP Email */}
          <CustomTextField
            label="SMTP Email"
            name="smtp_email"
            value={data.email_configuration.smtp_email}
            onChange={handleChange}
            fullWidth
          />

          {/* Row 4 - SMTP Host & Port */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <CustomTextField
              label="SMTP Host"
              name="smtp_host"
              value={data.email_configuration.smtp_host}
              onChange={handleChange}
              fullWidth
            />
            <CustomTextField
              label="SMTP Port"
              name="smtp_port"
              value={data.email_configuration.smtp_port}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Row 5 - SMTP Password with Eye Toggle */}
          <CustomTextField
            label="SMTP Password"
            name="smtp_password"
            type={showPassword ? 'text' : 'password'}
            value={data.email_configuration.smtp_password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Row 6 - IMAP Host & Port */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <CustomTextField
              label="IMAP Host"
              name="imap_host"
              value={data.email_configuration.imap_host}
              onChange={handleChange}
              fullWidth
            />
            <CustomTextField
              label="IMAP Port"
              name="imap_port"
              value={data.email_configuration.imap_port}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AdminEmailUpdate
