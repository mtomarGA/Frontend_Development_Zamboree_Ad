'use client'

import { useState, useEffect } from 'react'
import { Box, Button, TextField, Typography, Stack, InputAdornment } from '@mui/material'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

import manageBusinessService from '@/services/business/manageBusiness.service'
import { toast } from 'react-toastify'
import { useRouter, useParams } from 'next/navigation'

// Import Material-UI Icons
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import PinterestIcon from '@mui/icons-material/Pinterest'

const BASE_URL_MAP = {
  facebook: 'https://facebook.com/',
  twitter: 'https://x.com/',
  instagram: 'https://instagram.com/',
  linkedIn: 'https://linkedin.com/in/', // Changed to /in/ for LinkedIn profiles
  youTube: 'https://youtube.com/channel/', // Typically channel or user, using channel as a common base
  pinterest: 'https://pinterest.com/',
};

export default function SocialLinksForm() {
  const params = useParams()
  const businessId = params?.id
  const [isUpdating, setIsUpdating] = useState(!!businessId)

  const {
    socialLinksData,
    handleSocialLinkChange,
  } = useAddListingFormContext()
  const router = useRouter()

  return (
    <Box p={2} border='1px solid #ccc' borderRadius={2}>
      <Typography variant='h6' mb={2}>
        Social Links
      </Typography>

      <Stack spacing={2}>
        {/* Facebook */}
        <TextField
          // label="Facebook"
          placeholder="your_user_name"
          value={socialLinksData.facebook || ''}
          onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FacebookIcon color="primary" /> {BASE_URL_MAP.facebook}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />

        {/* Twitter (X) */}
        <TextField
          // label="X (Twitter)"
          placeholder="your_user_name"
          value={socialLinksData.twitter || ''}
          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TwitterIcon color="primary" /> {BASE_URL_MAP.twitter}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />

        {/* Instagram */}
        <TextField
          // label="Instagram"
          placeholder="your_user_name"
          value={socialLinksData.instagram || ''}
          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InstagramIcon color="primary" /> {BASE_URL_MAP.instagram}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />

        {/* LinkedIn */}
        <TextField
          // label="LinkedIn"
          placeholder="your_user_name"
          value={socialLinksData.linkedIn || ''}
          onChange={(e) => handleSocialLinkChange('linkedIn', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkedInIcon color="primary" /> {BASE_URL_MAP.linkedIn}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />

        {/* YouTube */}
        <TextField
          // label="YouTube"
          placeholder="your_channel_id_or_username"
          value={socialLinksData.youTube || ''}
          onChange={(e) => handleSocialLinkChange('youTube', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <YouTubeIcon color="error" /> {BASE_URL_MAP.youTube}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />

        {/* Pinterest */}
        <TextField
          // label="Pinterest"
          placeholder="your_user_name"
          value={socialLinksData.pinterest || ''}
          onChange={(e) => handleSocialLinkChange('pinterest', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PinterestIcon color="error" /> {BASE_URL_MAP.pinterest}
              </InputAdornment>
            ),
          }}
          fullWidth
          size='small'
        />
      </Stack>

      {/* <Box mt={5}>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          {isUpdating ? 'Update Listing' : 'Save Listing'}
        </Button>
      </Box> */}
    </Box>
  );
}



