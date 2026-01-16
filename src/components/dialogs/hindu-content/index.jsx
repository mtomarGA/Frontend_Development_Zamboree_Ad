import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import { Divider } from '@mui/material'

const HinduContentModal = ({ open, data, handleClose, title }) => {
  if (!data) return null; // Ensure data is available before rendering
  if (!open) return null; // Ensure modal only renders when open
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      // sx={{
      //   '& .MuiDialog-paper': {
      //     borderRadius: 3,
      //     p: 3,
      //     overflow: 'visible',
      //     bgcolor: 'background.paper',
      //   },
      // }}
    >
      <DialogTitle sx={{ pb: 1, position: 'relative', pr: 5 }}>
        <Typography variant="h6" fontWeight={600} component="div" color="text.primary">
          Content Details
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
          aria-label="close"
        >
          <CloseIcon onClick={handleClose} />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ my: 2 }} />

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        {/* Images row with highlight */}
        <Box
          display="flex"
          gap={3}
          justifyContent="center"
          mb={3}
          flexWrap="nowrap"
          overflow="auto"
          className={'flex-col sm:flex-row'}
        >
          {data.mobile_image && (
            <Box
              sx={{
                textAlign: 'center',
                border: '2px solid',
                borderRadius: 2,
                p: 1,
                boxShadow: 3,
                flexShrink: 0,
                minWidth: 160,
              }}
            >
              <Typography variant="caption" color="primary" sx={{ mb: 0.5, display: 'block' }}>
                Mobile Image
              </Typography>
              <Box
                component="img"
                src={data.mobile_image}
                alt="Mobile"
                sx={{
                  maxWidth: '150px',
                  maxHeight: '100px',
                  borderRadius: 1,
                  objectFit: 'cover',
                  display: 'block',
                  mx: 'auto',
                }}
              />
            </Box>
          )}

          {data.web_image && (
            <Box
              sx={{
                textAlign: 'center',
                border: '2px solid',
                // borderColor: 'secondary.main',
                borderRadius: 2,
                p: 1,
                boxShadow: 3,
                flexShrink: 0,
                minWidth: 160,
              }}
            >
              <Typography variant="caption" color="secondary" sx={{ mb: 0.5, display: 'block' }}>
                Web Image
              </Typography>
              <Box
                component="img"
                src={data.web_image}
                alt="Web"
                sx={{
                  maxWidth: '150px',
                  maxHeight: '100px',
                  borderRadius: 1,
                  objectFit: 'cover',
                  display: 'block',
                  mx: 'auto',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Key: Value pairs */}
        <Box>
          <Box mb={2} display="flex" flexDirection="row" gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Title:
            </Typography>
            <Typography  variant="body2" color="text.primary">
              {data.title}
            </Typography>
          </Box>
            <Box mb={2} display="flex" flexDirection="row" gap={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Category:
              </Typography>
              <Typography  variant="body2" color="text.primary">
                {data.category.charAt(0).toUpperCase() + data.category.slice(1).replace(/_/g, ' ')}
              </Typography>
            </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Description:
            </Typography>
            <Box
              sx={{
                typography: 'body2',
                color: 'text.primary',
                '& p': { mb: 1 },
                '& ul': { pl: 3 },
                '& li': { mb: 0.5 },
              }}
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default HinduContentModal
