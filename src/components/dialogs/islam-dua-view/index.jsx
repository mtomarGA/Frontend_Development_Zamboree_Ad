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

const IslamViewModal = ({ open, setOpen, data }) => {
  const theme = useTheme()
  const handleClose = () => setOpen(false)

  const formattedData = useMemo(() => ({
    ...data,
    arabic_dua: data?.arabic_dua?.replace(/\n/g, '<br/>'),
    english_dua: data?.english_dua?.replace(/\n/g, '<br/>')
  }), [data])

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
        Dua Details
      </DialogTitle>

      <DialogContent sx={{ px: 0, pb: 4 }}>
        <Box
          sx={{
            borderRadius: 1.5,
            overflow: 'hidden',

          }}
        >
          <RowItem label='Category (Arabic)'
            value={<div
              dangerouslySetInnerHTML={{ __html: formattedData.category_id?.arabic_category_name }}
              style={{ direction: 'rtl', textAlign: 'right', lineHeight: '2' }}
            />} />
          <RowItem label='Category (English)' value={data?.category_id?.english_category_name} />
          <RowItem label='Title (English)' value={data?.dua_title_english} />
          <RowItem label='Title (Arabic)' value={data?.dua_title_arabic} />

          <RowItem
            label='Dua (Arabic)'
            value={
              <div
                dangerouslySetInnerHTML={{ __html: formattedData.arabic_dua }}
                style={{ direction: 'rtl', textAlign: 'right', lineHeight: '2' }}
              />
            }
          />

          <RowItem
            label='Dua (English)'
            value={
              <div
                dangerouslySetInnerHTML={{ __html: formattedData.english_dua }}
                style={{ lineHeight: '1.8' }}
              />
            }
          />

          <RowItem label='Reference Book' value={data?.reference_book} />

          {/* Status Row */}
          <Grid container spacing={2} alignItems='center' sx={{ py: 2, px: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant='subtitle2'
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500
                }}
              >
                Sorting No
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Chip
                label={data?.sorting_no || 'N/A'}
                color={statusColors[data?.status] || 'default'}
                variant='filled'
                size='small'
                sx={{
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  px: 1
                }}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 0 }} />


          <RowItem
            label='Created At'
            value={data?.createdAt ? new Date(data.createdAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Kolkata',
              hour12: true,
            }) : 'N/A'}
          />
          <RowItem
            label='Updated At'
            value={data?.updatedAt ? new Date(data.updatedAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Kolkata',
              hour12: true,
            }) : 'N/A'}
          />
          {/* <RowItem
            label='Created By'
            value={data.createdBy?.userType === "ADMIN" ? 'ADMIN' : data.createdBy?.userId?.employee_id || "N/A"}
          />
          <RowItem
            label='Updated By'
            value={data?.updatedBy?.userType === "ADMIN" ? 'ADMIN' : data?.updatedBy?.userId?.employee_id || "N/A"}
            isLast={true}
          /> */}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IslamViewModal
