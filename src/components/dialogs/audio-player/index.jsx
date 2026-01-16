'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// IMPORT APIS
import countryService from '@/services/location/country.services'
import Image from '@/services/imageService'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import MusicPlayerSlider from '@/views/apps/spritual/components/MusicPlayer'


const ModalMusicPlayer = ({ open, setOpen, audioUrl }) => {

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => setOpen(false)}
      // maxWidth='md'
      // scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' , margin:'0px' , padding:'0px' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogContent>

        <MusicPlayerSlider audioUrl={audioUrl} />

      </DialogContent>
    </Dialog>
  )
}

export default ModalMusicPlayer
