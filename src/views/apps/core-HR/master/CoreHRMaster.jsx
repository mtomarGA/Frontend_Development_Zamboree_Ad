'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { useMediaQuery, useTheme } from '@mui/material'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'


// Icon Imports
import StoreIcon from '@mui/icons-material/Store'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import BadgeIcon from '@mui/icons-material/Badge'
import ApartmentIcon from '@mui/icons-material/Apartment'
import AwardTypeTable from './awardType/AwardTypeTable'
import ComplaintTypeTable from './complainType/ComplainTypeTable'
import WarningTypeTable from './warningType/WarningTypeTable'

const CoreHRMaster = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabSx = {
    minWidth: 160,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    padding: '6px 16px',
    justifyContent: 'flex-start'
  }

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
        >
          <Tab
            value='1'
            label='Award Type'
            icon={<EmojiEventsIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
          <Tab
            value='2'
            label='Complain Type'
            icon={<BadgeIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
          <Tab
            value='3'
            label='Warning Type'
            icon={<WarningIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
        </CustomTabList>
        <TabPanel value='1' sx={{ width: '95%' }}>
          <AwardTypeTable />
        </TabPanel>
        <TabPanel value='2' sx={{ width: '95%' }}>
          <ComplaintTypeTable />
        </TabPanel>
        <TabPanel value='3' sx={{ width: '95%' }}>
          <WarningTypeTable />
        </TabPanel>

      </div>
    </TabContext>
  )
}

export default CoreHRMaster
