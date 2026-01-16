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
import LeaveTypeTable from '../LeaveTypeTable'
import LeaveNameTable from '../LeaveNameTable'
import FixedLeaveTable from '../FixedLeaveTable'




const LeaveTypeMaster = () => {
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
            label='Fixed Leave Name'
            sx={tabSx}
          />
          <Tab
            value='2'
            label='Other Leave Name'
            sx={tabSx}
          />
          
        </CustomTabList>
        <TabPanel value='1' sx={{ width: '95%' }}>
          <FixedLeaveTable />
        </TabPanel>
        <TabPanel value='2' sx={{ width: '95%' }}>
          <LeaveNameTable />
        </TabPanel>
        {/* <TabPanel value='3' sx={{ width: '95%' }}>
           <LeaveNameTable />
        </TabPanel> */}

      </div>
    </TabContext>
  )
}

export default LeaveTypeMaster
