'use client'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'

const ViewMeetingDialog = ({ open, onClose, meeting }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  if (!meeting) return null

  const invited = meeting?.members || []
 

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Invited Members
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.black
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {invited.length === 0 ? (
          <Typography>No employees invited.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell sx={{ fontWeight: 'bold' }}>Employee ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                    </>
                  )}
                
                </TableRow>
              </TableHead>
              <TableBody>
                {invited.map(emp => (
                  <TableRow key={emp._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      
                        <Typography variant='body2'>
                          {emp.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>
                          <Typography variant='body2'>
                            {emp.employee_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {emp.department?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {emp.designation?.name}
                          </Typography>
                        </TableCell>
                      </>
                    )}
                    {isMobile && (
                      <TableCell>
                        <Typography variant='body2'>
                          ID: {emp.employee_id}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {emp.department?.name} | {emp.designation?.name}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewMeetingDialog
