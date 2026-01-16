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

const IslamAllahViewModal = ({ open, setOpen, data }) => {
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
        Allah Name Details
      </DialogTitle>

      <DialogContent sx={{ px: 0, pb: 4 }}>
        <Box
          sx={{
            borderRadius: 1.5,
            overflow: 'hidden',

          }}
        >
          <RowItem label='Allah Name (English)' value={data?.name_english} />
          <RowItem label='Allah Name (Arabic)' value={data?.name_arabic} />
          {/* <RowItem label='Allah Name (Arabic)' value={<div
            dangerouslySetInnerHTML={{ __html: formattedData.name_arabic }}
            style={{ direction: 'rtl', textAlign: 'right', lineHeight: '2' }}
          />} /> */}

          <RowItem
            label='Meaning'
            value={data?.meaning || 'N/A'}
          />


          <RowItem label='Benefits' value={data?.benefits || 'N/A'} />

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
            value={data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}
          />
          <RowItem
            label='Updated At'
            value={data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}
          />
          <RowItem
            label='Created By'
            value={data?.createdBy?.email || data?.createdBy}
          />
          <RowItem
            label='Updated By'
            value={data?.updatedBy?.email || data?.updatedBy}
            isLast={true}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IslamAllahViewModal
