'use client'
// React Imports

import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import { useMediaQuery, useTheme } from '@mui/material'
import ServiceName from './tabs/ServiceName/ServiceName'
import MeetingLabel from './tabs/MeetingLabel/MeetingLabel'
import CallLabel from './tabs/CallLabel/CallLabel'
import CallStatus from './tabs/CallStatus/CallStatus'
import MeetingStatus from './tabs/MeetingStatus/MeetingStatus'

const FollowUpMaster = () => {
  // States
  const [value, setValue] = useState('2')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Common styles for tabs
  const tabSx = {
    minWidth: 160,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    padding: '6px 16px',
    justifyContent: 'flex-start'
  }

  // ** Hooks
  const theme = useTheme()
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <TabContext value={value}>
      <div className={isBelowLg ? '' : 'flex'}>
        <CustomTabList
          pill='true'
          orientation={isBelowLg ? 'horizontal' : 'vertical'}
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='customized tabs example'
          // sx={{ borderBottom: isBelowLg ? 1 : 0, borderRight: isBelowLg ? 0 : 1, borderColor: 'divider' }}
        >
          {/* <Tab value='1' label='Service Name' sx={tabSx} /> */}
          <Tab value='2' label='Meeting Label' sx={tabSx} />
          {/* <Tab value='3' label='Call Label' sx={tabSx} /> */}
          {/* <Tab value='4' label='Call Status' sx={tabSx} /> */}
          {/* <Tab value='5' label='Meeting Status' sx={tabSx} /> */}
        </CustomTabList>
        <TabPanel value='1' sx={{ width: '100%' }}>
          <ServiceName />
        </TabPanel>
        <TabPanel value='2' sx={{ width: '100%' }}>
          <MeetingLabel />
        </TabPanel>
        <TabPanel value='3' sx={{ width: '100%' }}>
          <CallLabel />
        </TabPanel>
        <TabPanel value='4' sx={{ width: '100%' }}>
          <CallStatus />
        </TabPanel>
        <TabPanel value='5' sx={{ width: '100%' }}>
          <MeetingStatus />
        </TabPanel>
      </div>
    </TabContext>
  )
}

export default FollowUpMaster
