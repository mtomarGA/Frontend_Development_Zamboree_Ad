'use client'

import { useState, useRef } from 'react'
import { Box, Button, Card, CardContent, FormHelperText, TextField, Typography, Alert, Chip } from '@mui/material'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'
import manageBusinessService from '@/services/business/manageBusiness.service'
import { toast } from 'react-toastify'

const PersonalizedUrlForm = ({ nextHandle }) => {
  const {
    urlFormData,
    urlErrors,
    handleUrlChange,
    validateUrl,
  } = useAddListingFormContext()

  const [urlAvailable, setUrlAvailable] = useState(false)
  const [urlSaved, setUrlSaved] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)
  const typingTimeoutRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateUrl()
    if (!isValid) return
    nextHandle()
  }

  // Enable input when Edit is clicked and show suggestions
  const handleEditClick = () => {
    setIsDisabled(false)
    if (urlFormData.url?.trim()) {
      handleCheckAvailability(false, urlFormData.url)
    }
  }

  // Check availability and get suggestions
  const handleCheckAvailability = async (suggestionCheck = false, suggestionURL = "") => {
    const urlToCheck = suggestionCheck ? suggestionURL?.trim() : urlFormData.url?.trim()
    if (!urlToCheck || isChecking) return
    try {
      setIsChecking(true)
      setSuggestions([])
      const response = await manageBusinessService.checkUrlAvailability(urlToCheck)

      if (response.available) {
        setSuggestions(response.suggestions || [])
        setUrlAvailable(true)
        setShowWarning(false)
      } else {
        setUrlAvailable(false)
        setShowWarning(response?.message)
        setSuggestions(response.suggestions || [])
        toast.error("URL Is Already Taken")
      }
    } catch (err) {
      console.error('Error checking URL availability:', err)
      toast.error('Failed to check URL availability')
    } finally {
      setIsChecking(false)
    }
  }

  const handleUrlInputChange = (e) => {
    handleUrlChange('url')(e)
    setUrlAvailable(false)
    setShowWarning(false)

    // clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    // check availability after small delay to get suggestions
    typingTimeoutRef.current = setTimeout(() => {
      setIsDisabled(true) // disable input automatically after 2 seconds
    }, 2000)

    handleCheckAvailability(false, e.target.value)
  }

  const handleSuggestionSelect = (suggestion) => {
    handleUrlChange('url')({ target: { value: suggestion } })
    setUrlAvailable(false)
    setShowWarning(false)
    setSuggestions([])
    setIsDisabled(true)
  }

  return (
    <Card>
      <CardContent component="form" onSubmit={handleSubmit}>
        <Typography variant='h6' mb={2}>Personalized URL</Typography>

        <Typography variant='body2' mb={1}>
          Your Current FREE Catalog URL is: <strong>https://www.happiningads.com/company/6987354</strong>
        </Typography>

        <Box display='flex' gap={2} alignItems='center' mb={2}>
          <Typography>https://www.happiningads.com/</Typography>
          <TextField
            size='small'
            placeholder='Ex: /peter-parker'
            value={urlFormData.url}
            onChange={handleUrlInputChange}
            disabled={isDisabled || urlSaved}
            error={!!urlErrors.url}
            helperText={urlErrors.url}
          />
          <Button
            type='button'
            variant='contained'
            color='primary'
            onClick={handleEditClick}
            disabled={isChecking || urlSaved}
          >
            {isChecking ? 'Checking...' : 'Edit'}
          </Button>
        </Box>

        <FormHelperText sx={{ color: 'error.main', mb: 2 }}>
          Note: You will not be able to edit or transfer this personalized URL once you set it.
        </FormHelperText>

        {showWarning && (
          <Alert severity='warning' sx={{ mb: 3 }}>
            This URL is Already Taken, Please Check With Another Url.
          </Alert>
        )}

        {suggestions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant='body2' sx={{ mb: 1, fontWeight: 'bold' }}>
              💡 Suggested alternatives:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.map((s, i) => (
                <Chip
                  key={i}
                  label={s}
                  onClick={() => handleSuggestionSelect(s)}
                  variant="outlined"
                  color="primary"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PersonalizedUrlForm
