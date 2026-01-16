'use client'

import React, { useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import FastForwardRounded from '@mui/icons-material/FastForwardRounded'
import FastRewindRounded from '@mui/icons-material/FastRewindRounded'
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded'
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded'

const Widget = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 16,
  borderRadius: 16,
  width: '100%',
  maxWidth: 800,
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  [theme.palette.mode === 'dark' ? '&' : '']: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
}))

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: 0.2,
})

export default function MusicPlayerSlider({ audioUrl }) {
  const audioRef = useRef(null)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [paused, setPaused] = useState(true)
  const [volume, setVolume] = useState(0.3)

  const formatDuration = (value) => {
    const minute = Math.floor(value / 60)
    const second = Math.floor(value % 60)
    return `${minute}:${second < 10 ? `0${second}` : second}`
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (paused) {
      audio.play()
    } else {
      audio.pause()
    }
    setPaused(!paused)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPosition(audioRef.current.currentTime)
    }
  }

  const handleVolumeChange = (_, newValue) => {
    const newVol = typeof newValue === 'number' ? newValue : newValue[0]
    setVolume(newVol / 100)
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100
    }
  }

  const handleSliderChange = (_, value ) => {
    const newTime = typeof value === 'number' ? value : value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    setPosition(newTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative', p: { xs: 2, md: 4 } }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <Widget>
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          {/* Play Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton aria-label="rewind" onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
              }
            }}>
              <FastRewindRounded color='primary' fontSize="large" />
            </IconButton>

            <IconButton onClick={togglePlayPause}>
              {paused ? (
                <PlayArrowRounded color='primary' sx={{ fontSize: '3rem' }} />
              ) : (
                <PauseRounded color='primary' sx={{ fontSize: '3rem' }} />
              )}
            </IconButton>

            <IconButton aria-label="forward" onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
              }
            }}>
              <FastForwardRounded color='primary' fontSize="large" />
            </IconButton>
          </Box>

          {/* Slider */}
          <Box sx={{ flex: 1, px: { xs: 0, md: 2 }, width: '100%' }}>
            <Slider
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={handleSliderChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
              <TinyText >{formatDuration(position)}</TinyText>
              <TinyText>-{formatDuration(duration - position)}</TinyText>
            </Box>
          </Box>

          {/* Volume */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', md: 200 } }}>
            <VolumeDownRounded />
            <Slider value={volume * 100} onChange={handleVolumeChange} />
            <VolumeUpRounded />
          </Stack>
        </Stack>
      </Widget>
    </Box>
  )
}
