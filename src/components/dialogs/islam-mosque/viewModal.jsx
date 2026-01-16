'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  useTheme
} from '@mui/material'
import DialogCloseButton from '../DialogCloseButton'
import { useMemo } from 'react'

const statusColors = {
  ACTIVE: 'error',
  INACTIVE: 'success'
}

const RowItem = ({ label, value, isLast = false }) => {
  const theme = useTheme()

  return (
    <>
      <Grid container spacing={2} alignItems='flex-start' sx={{ py: 1.5, px: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography
            variant='subtitle2'
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <Typography
              variant='body2'
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-line'
              }}
            >
              {value || (
                <Typography
                  component='span'
                  sx={{ color: theme.palette.text.disabled }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          ) : (
            value
          )}
        </Grid>
      </Grid>
      {!isLast && <Divider />}
    </>
  )
}

const IslamMosqueViewModal = ({ open, setOpen, data }) => {
  const theme = useTheme()
  const handleClose = () => setOpen(false)

  // const formattedData = useMemo(() => ({
  //   ...data,
  //   arabic_dua: data?.arabic_dua?.replace(/\n/g, '<br/>'),
  //   english_dua: data?.english_dua?.replace(/\n/g, '<br/>')
  // }), [data])

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      scroll='body'
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          overflow: 'visible',
          boxShadow: theme.shadows[12]
        }
      }}
    >
      <DialogCloseButton
        onClick={handleClose}
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '1.5rem',
          px: 6,
          pt: 5,
          pb: 3,
        }}
      >
        Mosque Details
      </DialogTitle>

      <DialogContent sx={{ px: 0, pb: 4 }}>
        <Box
          sx={{
            borderRadius: 1.5,
            overflow: 'hidden',

          }}
        >
          <RowItem label='Mosque ID' value={data?.mosque_id || 'N/A'} />
          <RowItem label='Mosque Name' value={data?.name || 'N/A'} />
          <RowItem label='Area' value={data?.area || 'N/A'} />
          <RowItem label='City' value={data?.city.name || 'N/A'} />
          <RowItem label='State' value={data?.state.name || 'N/A'} />
          <RowItem label='Country' value={data?.country.name || 'N/A'} />
          <RowItem label='Address' value={data?.address || 'N/A'} />
          <RowItem label='Coordinates' value={`Latitude: ${data?.coordinates.latitude || 'N/A'}, Longitude: ${data?.coordinates.longitude || 'N/A'}`} />

          <Divider sx={{ my: 0 }} />


          <RowItem
            label='Status'
            value={data?.status || 'N/A'}
          />
          <RowItem
            label='Created At'
            value={data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}
          />
          <RowItem
            label='Updated At'
            value={data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}
          />
          <RowItem
            label='Created By'
            // value={data?.createdBy?.email || data?.createdBy}
            value={data?.createdBy?.userType === "ADMIN" ? 'ADMIN' : data?.createdBy?.userId?.employee_id || "N/A"}
          />
          <RowItem
            label='Updated By'
            value={data?.updatedBy?.userType === "ADMIN" ? 'ADMIN' : data?.updatedBy?.userId?.employee_id || "N/A"}
            isLast={true}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IslamMosqueViewModal
